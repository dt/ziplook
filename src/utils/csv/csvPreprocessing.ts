/**
 * CSV preprocessing utilities extracted from csvPreprocessor.ts
 * These handle the transformation logic that can be tested independently
 */

import { parseDelimited, reconstructCSV, findColumnIndices, transformColumns, type CSVParseResult } from "./csvParser";
import { transformKey, isKeyColumn, processObjectForKeys, createFallbackJson, hexToBytes, type PrettyKeyResult } from "./keyProcessing";

export interface ProtoDecoder {
  decode(bytes: Uint8Array, protoType: string): { decoded?: unknown; error?: string };
  findProtoType?: (tableName: string, columnName: string) => ProtoColumnMapping | null;
}

export interface PreprocessingOptions {
  tableName: string;
  delimiter?: string;
  decodeProtos?: boolean;
  decodeKeys?: boolean;
  protoDecoder?: ProtoDecoder;
  prettyKeyFn?: (key: string) => PrettyKeyResult;
}

export interface ProtoColumnMapping {
  protoType: string | null;
  dynamic?: boolean;
}

/**
 * Check if preprocessing would be beneficial for this table
 */
export function shouldPreprocess(tableName: string, content: string): boolean {
  const normalizedName = tableName.toLowerCase();

  // Check for known CRDB system tables with proto/hex data
  const knownTables = [
    "span_config", // matches span_configurations, span_configs, etc.
    "zones",
    "descriptor",
    "jobs",
    "job_info",
    "lease",
    "rangelog",
    "replication_stats",
  ];

  const isKnownTable = knownTables.some((t) => normalizedName.includes(t));
  if (isKnownTable) {
    return true;
  }

  // Sample first few lines to check for hex data
  const lines = content.split("\n").slice(0, 5);
  for (const line of lines) {
    if (line.includes("\\x")) {
      return true;
    }
  }

  return false;
}

/**
 * Find proto column mappings for a table
 * This is a pure function that can be easily tested
 */
export function findProtoColumns(
  tableName: string,
  headers: string[],
  findProtoTypeFn?: (tableName: string, columnName: string) => ProtoColumnMapping | null
): Map<number, string | null> {
  const protoColumns = new Map<number, string | null>();

  headers.forEach((header, index) => {
    const columnName = header.toLowerCase();

    // Check for proto columns
    if (
      columnName === "config" ||
      columnName === "descriptor" ||
      columnName === "payload" ||
      columnName === "progress" ||
      columnName === "value"
    ) {
      if (findProtoTypeFn) {
        const mapping = findProtoTypeFn(tableName, header);
        protoColumns.set(index, mapping?.protoType || null);
      } else {
        protoColumns.set(index, null);
      }
    }
  });

  return protoColumns;
}

/**
 * Transform a single value based on its type and context
 */
export function transformValue(
  value: string,
  columnIndex: number,
  rowData: string[],
  headers: string[],
  options: {
    isKeyColumn: boolean;
    protoType?: string | null;
    infoKeyColumnIndex?: number;
    prettyKeyFn?: (key: string) => PrettyKeyResult;
    protoDecoder?: ProtoDecoder;
  }
): string {
  // Transform key columns
  if (options.isKeyColumn) {
    // Handle null/empty differently from \x (which is a valid empty key)
    if (value === "\\N" || value === "NULL") {
      return value;
    }
    return transformKey(value, options.prettyKeyFn);
  }

  // Transform proto columns
  if (options.protoType !== undefined && options.protoDecoder) {
    let protoType = options.protoType;

    // Handle dynamic proto type resolution for job_info table
    if (protoType === "dynamic:job_info" && options.infoKeyColumnIndex !== undefined && options.infoKeyColumnIndex >= 0) {
      const infoKey = rowData[options.infoKeyColumnIndex];
      if (infoKey === "legacy_payload") {
        protoType = "cockroach.sql.jobs.jobspb.Payload";
      } else if (infoKey === "legacy_progress") {
        protoType = "cockroach.sql.jobs.jobspb.Progress";
      } else {
        // Unknown info_key type - use fallback JSON wrapper
        if (value && value !== "\\N" && value !== "NULL") {
          return createFallbackJson(value);
        }
        return value;
      }
    }

    if (value && value !== "\\N" && value !== "NULL") {
      // Special case: job_info table might have JSON-like strings that aren't protobuf
      if (value.startsWith("{") && value.endsWith("}")) {
        // This is already JSON or JSON-like, leave it as is
        return value;
      }

      // If we have an explicit proto mapping, decode it
      if (protoType && protoType !== "dynamic:job_info") {
        try {
          const bytes = hexToBytes(value);
          const decoded = options.protoDecoder.decode(bytes, protoType);

          if (decoded.decoded && !decoded.error) {
            // Return as compact JSON string
            return JSON.stringify(decoded.decoded);
          }
        } catch {
          // Don't let protobuf errors stop processing
        }
      }
    }
  }

  // Process JSON columns for key fields (handle both regular and escaped JSON)
  if (value && typeof value === "string") {
    let jsonStr = value.trim();

    // Check for quoted JSON with doubled quotes inside
    if (
      jsonStr.startsWith('"{') &&
      jsonStr.endsWith('}"') &&
      jsonStr.includes('""')
    ) {
      try {
        // Remove outer quotes
        jsonStr = jsonStr.slice(1, -1);
        // Convert doubled quotes to single quotes ("") -> (")
        jsonStr = jsonStr.replace(/""/g, '"');
      } catch {
        // Ignore JSON fix failures
      }
    }

    // Now check if we have JSON (either direct or processed)
    if (jsonStr.startsWith("{") && jsonStr.endsWith("}")) {
      try {
        const jsonObj = JSON.parse(jsonStr);
        const processedObj = processObjectForKeys(jsonObj, options.prettyKeyFn);
        const result = JSON.stringify(processedObj);

        // If it was originally quoted JSON with doubled quotes, restore the format
        if (
          value.startsWith('"{') &&
          value.endsWith('}"') &&
          value.includes('""')
        ) {
          return '"' + result.replace(/"/g, '""') + '"';
        }
        return result;
      } catch {
        // If JSON parsing fails, leave original value
      }
    }
  }

  return value;
}

/**
 * Main preprocessing function - transforms CSV content
 * This is now more testable as it uses pure functions internally
 */
export function preprocessCSV(
  content: string,
  options: PreprocessingOptions
): string {
  const delimiter = options.delimiter || "\t";
  const { headers, rows } = parseDelimited(content, { delimiter, hasHeader: true });

  if (headers.length === 0) {
    return content;
  }

  // Find columns that need special processing
  const keyColumnIndices = options.decodeKeys
    ? findColumnIndices(headers, (header) => isKeyColumn(header))
    : [];

  const protoColumns = options.decodeProtos
    ? findProtoColumns(options.tableName, headers, options.protoDecoder?.findProtoType)
    : new Map<number, string | null>();

  // Find info_key column for dynamic proto resolution
  let infoKeyColumnIndex = -1;
  if (options.tableName.toLowerCase().includes("job_info")) {
    infoKeyColumnIndex = headers.findIndex(h => h.toLowerCase() === "info_key");
  }

  // If no columns need processing, return original content
  if (keyColumnIndices.length === 0 && protoColumns.size === 0 && !options.decodeKeys) {
    return content;
  }

  // Create transformation map
  const transformations = new Map<number, (value: string, rowIndex: number) => string>();

  headers.forEach((header, colIndex) => {
    const isKey = keyColumnIndices.includes(colIndex);
    const protoType = protoColumns.get(colIndex);

    if (isKey || protoType !== undefined) {
      transformations.set(colIndex, (value: string, rowIndex: number) => {
        const rowData = rows[rowIndex] || [];
        return transformValue(value, colIndex, rowData, headers, {
          isKeyColumn: isKey,
          protoType,
          infoKeyColumnIndex,
          prettyKeyFn: options.prettyKeyFn,
          protoDecoder: options.protoDecoder,
        });
      });
    }
  });

  // Transform the data
  const transformed = transformColumns({ headers, rows }, transformations);

  // Reconstruct the CSV
  return reconstructCSV(transformed.headers, transformed.rows, delimiter);
}