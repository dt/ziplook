/**
 * Batch processor for CSV preprocessing
 * Processes rows incrementally and loads them to DuckDB in chunks to avoid memory issues
 */

import { ProtoDecoder } from "./protoDecoder";
import { prettyKey } from "./prettyKey";
import { findProtoType } from "./protoRegistry";
import * as duckdb from "@duckdb/duckdb-wasm";
import { getTableTypeHints } from "./columnTypeRegistry";
import { generateCsvReadSql } from "./csvUtils";

interface BatchProcessOptions {
  tableName: string;
  delimiter: string;
  decodeKeys: boolean;
  decodeProtos: boolean;
  protoDecoder?: ProtoDecoder;
  conn: duckdb.AsyncDuckDBConnection;
  db: duckdb.AsyncDuckDB;
  sourcePath?: string;
  nodeId?: number;
  forceInsert?: boolean; // Force INSERT mode (table already exists)
}

const BATCH_SIZE_ROWS = 10000; // Max rows per batch
const BATCH_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per batch

// Parse a CSV line handling quoted fields
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped quote inside quoted field
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Don't forget the last field
  result.push(current);
  return result;
}

// Helper functions from csvPreprocessor.ts
function hexToBytes(hex: string): Uint8Array {
  hex = hex.replace(/^\\x/i, "");
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function createFallbackJson(hexValue: string): string {
  try {
    const bytes = hexToBytes(hexValue);
    const decoder = new TextDecoder("utf-8", { fatal: true });
    const utf8String = decoder.decode(bytes);
    return JSON.stringify({ value: utf8String });
  } catch {
    try {
      const bytes = hexToBytes(hexValue);
      const base64String = btoa(String.fromCharCode(...bytes));
      return JSON.stringify({ value: base64String });
    } catch {
      return JSON.stringify({ hex: hexValue });
    }
  }
}

function tryReplaceWithPrettyKey(value: string): string {
  if (!value || typeof value !== "string") {
    return value;
  }

  if (value === "\\x" || value.startsWith("\\x")) {
    try {
      const decoded = prettyKey(value);
      return decoded.pretty;
    } catch {
      return value;
    }
  }

  return value;
}

async function processRow(
  row: string[],
  headers: string[],
  rowIndex: number,
  options: {
    tableName: string;
    keyColumns: Set<number>;
    protoColumns: Map<number, string | null>;
    infoKeyColumnIndex: number;
    decodeKeys: boolean;
    decodeProtos: boolean;
    protoDecoder?: ProtoDecoder;
  }
): Promise<string[]> {
  const processedRow = await Promise.all(
    row.map(async (value, colIndex) => {
      // Transform key columns
      if (options.keyColumns.has(colIndex) && options.decodeKeys) {
        if (value === "\\N" || value === "NULL") {
          return value;
        }
        return tryReplaceWithPrettyKey(value);
      }

      // Transform proto columns
      let protoType = options.protoColumns.get(colIndex);
      if (protoType !== undefined && options.decodeProtos && options.protoDecoder) {
        // Handle dynamic proto type resolution for job_info table
        if (protoType === "dynamic:job_info" && options.infoKeyColumnIndex >= 0) {
          const infoKey = row[options.infoKeyColumnIndex]?.trim();
          if (infoKey === "legacy_payload") {
            protoType = "cockroach.sql.jobs.jobspb.Payload";
          } else if (infoKey === "legacy_progress") {
            protoType = "cockroach.sql.jobs.jobspb.Progress";
          } else {
            // Unknown type - use fallback
            if (value && value !== "\\N" && value !== "NULL") {
              return createFallbackJson(value);
            }
            return value;
          }
        }

        if (value && value !== "\\N" && value !== "NULL") {
          // Check if already JSON
          if (value.startsWith("{") && value.endsWith("}")) {
            return value;
          }

          // Decode proto
          if (protoType && protoType !== "dynamic:job_info") {
            try {
              const bytes = hexToBytes(value);
              const decoded = await options.protoDecoder.decodeAsync(bytes, protoType);

              if (decoded.decoded && !decoded.error) {
                const jsonStr = JSON.stringify(decoded.decoded);

                // Check size and log if large
                if (jsonStr.length > 5_000_000) {
                  console.warn(
                    `⚠️ Large proto decode: ${(jsonStr.length / 1_000_000).toFixed(1)}MB ` +
                    `(${options.tableName}.${headers[colIndex]}, row ${rowIndex + 1})`
                  );
                }

                return jsonStr;
              }
            } catch (e) {
              // Fall back to hex on decode error
              console.warn(`Proto decode error for row ${rowIndex + 1}, column ${headers[colIndex]}:`, e);
            }
          }

          // Fallback to hex wrapper
          return createFallbackJson(value);
        }
      }

      return value;
    })
  );

  return processedRow;
}

export async function preprocessAndLoadInBatches(
  content: string,
  options: BatchProcessOptions
): Promise<number> {
  const { conn, db, tableName, delimiter, sourcePath, nodeId } = options;

  // Process content in a streaming fashion
  let position = 0;
  let lineNumber = 0;
  let totalRowCount = 0;

  // First, extract just the header line
  const firstNewline = content.indexOf('\n');
  if (firstNewline === -1) {
    // No data, just header or empty
    return 0;
  }

  const headerLine = content.substring(0, firstNewline).trim();
  const headers = parseCSVLine(headerLine, delimiter);
  const fileBaseName = (sourcePath || tableName).replace(/[^a-zA-Z0-9_]/g, "_");

  // Move position past the header
  position = firstNewline + 1;

  // Identify columns that need special processing
  const keyColumns = new Set<number>();
  const protoColumns = new Map<number, string | null>();
  let infoKeyColumnIndex = -1;

  headers.forEach((header, index) => {
    const columnName = header.toLowerCase();

    // Check for key columns
    if (options.decodeKeys && (columnName.includes("key") || columnName === "start_key" || columnName === "end_key")) {
      keyColumns.add(index);
    }

    // Check for proto columns
    if (options.decodeProtos && options.protoDecoder) {
      if (columnName === "config" || columnName === "descriptor" ||
          columnName === "payload" || columnName === "progress" || columnName === "value") {
        const protoType = findProtoType(tableName, header);
        protoColumns.set(index, protoType?.protoType || null);
      }
    }

    // Find info_key column for job_info
    if (columnName === "info_key") {
      infoKeyColumnIndex = index;
    }
  });

  // Process in batches - reading line by line
  let batchNumber = 0;
  let currentBatch: string[] = [headers.join(delimiter)]; // Start with headers
  let currentBatchSize = currentBatch[0].length;
  let tableCreated = options.forceInsert || false;  // If forceInsert, table already exists

  // Process content line by line without loading all into memory
  // Need to handle quoted fields that may contain newlines
  while (position < content.length) {
    // Extract a complete CSV line (handling quoted fields with newlines)
    let line = '';
    let inQuotes = false;
    let lineStart = position;

    while (position < content.length) {
      const char = content[position];

      if (char === '"') {
        // Check if this is an escaped quote (doubled "")
        if (position + 1 < content.length && content[position + 1] === '"') {
          position += 2; // Skip both quotes
        } else {
          inQuotes = !inQuotes;
          position++;
        }
      } else if (char === '\n' && !inQuotes) {
        // End of line (not inside quotes)
        line = content.substring(lineStart, position).trim();
        position++; // Skip the newline
        break;
      } else {
        position++;
      }

      // If we hit the end of content
      if (position >= content.length) {
        line = content.substring(lineStart).trim();
        break;
      }
    }

    // Skip empty lines
    if (!line) {
      continue;
    }

    lineNumber++;
    totalRowCount++;

    // Parse the CSV line properly (handling quoted fields)
    const row = parseCSVLine(line, delimiter);

    // Process the row
    const processedRow = await processRow(row, headers, lineNumber, {
      tableName,
      keyColumns,
      protoColumns,
      infoKeyColumnIndex,
      decodeKeys: options.decodeKeys,
      decodeProtos: options.decodeProtos,
      protoDecoder: options.protoDecoder,
    });

    const rowString = processedRow.join(delimiter);
    const rowSize = rowString.length + 1; // +1 for newline

    // Check if adding this row would exceed batch limits
    // Note: currentBatch.length - 1 is the actual data row count (excluding header)
    if (
      currentBatch.length > 1 && // Has at least one data row
      ((currentBatch.length - 1) >= BATCH_SIZE_ROWS || currentBatchSize + rowSize > BATCH_SIZE_BYTES)
    ) {
      // Load current batch
      const batchContent = currentBatch.join("\n");
      const batchFileName = `${fileBaseName}_batch_${batchNumber}`;

      await db.registerFileText(batchFileName, batchContent);

      try {
        // Create or insert based on whether table exists
        const operation = tableCreated ? 'insert' : 'create';
        const typeHints = !tableCreated ? getTableTypeHints(tableName) : undefined;

        const sql = generateCsvReadSql({
          fileName: batchFileName,
          tableName,
          delimiter,
          operation,
          nodeId: tableCreated ? undefined : nodeId, // Only use nodeId on first create
          typeHints,
          headers: !tableCreated ? headers : undefined,
        });

        await conn.query(sql);
        tableCreated = true;
      } finally {
        // Always clean up the batch file, whether load succeeded or failed
        await db.dropFile(batchFileName);
      }

      // Start new batch WITH headers (since we tell DuckDB header=true for all files)
      batchNumber++;
      currentBatch = [headers.join(delimiter)];
      currentBatchSize = currentBatch[0].length + 1;
    }

    // Add row to current batch
    currentBatch.push(rowString);
    currentBatchSize += rowSize;
  }

  // Load final batch if there's anything left (more than just headers)
  if (currentBatch.length > 1 || (!tableCreated && currentBatch.length > 0)) {
    // All batches already include headers now
    const batchContent = currentBatch.join("\n");
    const batchFileName = `${fileBaseName}_batch_${batchNumber}`;

    await db.registerFileText(batchFileName, batchContent);

    try {
      const operation = tableCreated ? 'insert' : 'create';
      const typeHints = !tableCreated ? getTableTypeHints(tableName) : undefined;

      const sql = generateCsvReadSql({
        fileName: batchFileName,
        tableName,
        delimiter,
        operation,
        nodeId: tableCreated ? undefined : nodeId,
        typeHints,
        headers: !tableCreated ? headers : undefined,
      });

      await conn.query(sql);
    } finally {
      // Always clean up the final batch file, whether load succeeded or failed
      await db.dropFile(batchFileName);
    }
  }

  // Return total row count
  return totalRowCount;
}