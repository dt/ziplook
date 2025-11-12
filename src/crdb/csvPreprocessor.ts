import { protoDecoder, ProtoDecoder } from "./protoDecoder";
import { prettyKey } from "./prettyKey";
import { findProtoType } from "./protoRegistry";


// Utility function to try replacing a value with its pretty key representation
function tryReplaceWithPrettyKey(value: string): string {
  if (!value || typeof value !== "string") {
    return value;
  }

  // Handle hex keys (start with \x)
  if (value === "\\x" || value.startsWith("\\x")) {
    try {
      const decoded = prettyKey(value);
      return decoded.pretty;
    } catch {
      return value;
    }
  }

  // Handle base64-encoded keys
  if (/^[A-Za-z0-9+/]*(=|==)?$/.test(value) && value.length % 4 === 0) {
    try {
      // Browser-compatible base64 decoding
      const binaryString = atob(value);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const hexStr = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // For base64-decoded keys, try to format even short values
      if (
        hexStr.length >= 2 &&
        hexStr.length % 2 === 0 &&
        /^[0-9a-fA-F]+$/.test(hexStr)
      ) {
        // Single byte values are likely table IDs
        if (hexStr.length === 2) {
          const tableId = parseInt(hexStr, 16);
          return `/Table/${tableId}`;
        }

        // For longer values, try prettyKey
        try {
          const decoded = prettyKey(hexStr);
          if (decoded.pretty !== hexStr) {
            return decoded.pretty;
          }
        } catch {
          // Ignore prettyKey failures
        }
      }
    } catch {
      // Ignore base64 decode failures
    }
  }

  return value;
}

// Recursively process an object/array to replace key fields
function processObjectForKeys(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => processObjectForKeys(item));
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes("key") && typeof value === "string") {
        result[key] = tryReplaceWithPrettyKey(value);
      } else {
        result[key] = processObjectForKeys(value);
      }
    }
    return result;
  }

  return obj;
}

export interface PreprocessOptions {
  tableName: string;
  delimiter?: string;
  decodeProtos?: boolean;
  decodeKeys?: boolean;
  protoDecoder?: ProtoDecoder;
}

// Parse CSV/TSV content and return header and rows
function parseDelimited(
  content: string,
  delimiter: string = "\t",
): { headers: string[]; rows: string[][] } {
  const lines = content.trim().split("\n");
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(delimiter);
  const rows = lines.slice(1).map((line) => line.split(delimiter));

  return { headers, rows };
}

// Convert hex string to Uint8Array
// Decompress gzipped data using browser's native DecompressionStream
async function decompressGzip(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Response(bytes).body;
  if (!stream) throw new Error("Failed to create stream from bytes");

  const decompressedStream = stream.pipeThrough(new DecompressionStream("gzip"));
  const response = new Response(decompressedStream);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

// Check if data is gzipped (starts with gzip magic number 0x1f8b)
function isGzipped(bytes: Uint8Array): boolean {
  return bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
}

function hexToBytes(hex: string): Uint8Array {
  // Remove \x prefix if present
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

// Check if bytes are valid UTF-8 and return appropriate JSON value
function createFallbackJson(hexValue: string): string {
  try {
    const bytes = hexToBytes(hexValue);

    // Try to decode as UTF-8
    const decoder = new TextDecoder("utf-8", { fatal: true });
    const utf8String = decoder.decode(bytes);

    // If successful, return JSON with the string value
    return JSON.stringify({ value: utf8String });
  } catch {
    // If UTF-8 decoding fails, use base64
    try {
      const bytes = hexToBytes(hexValue);
      const base64String = btoa(String.fromCharCode(...bytes));
      return JSON.stringify({ value: base64String });
    } catch {
      // If all else fails, return the original hex as string
      return JSON.stringify({ value: hexValue });
    }
  }
}

// Main preprocessing function - transforms keys in place
export async function preprocessCSV(
  content: string,
  options: PreprocessOptions,
): Promise<string> {
  const delimiter = options.delimiter || "\t";
  const decoder = options.protoDecoder || protoDecoder; // Use provided decoder or fallback to global
  const { headers, rows } = parseDelimited(content, delimiter);

  if (headers.length === 0) {
    return content;
  }

  // Find columns that need special processing and their mappings
  const keyColumns = new Set<number>();
  const protoColumns = new Map<number, string | null>(); // Map column index to proto type (or null if no mapping)
  let infoKeyColumnIndex = -1; // For dynamic proto resolution in job_info table

  headers.forEach((header, index) => {
    const columnName = header.toLowerCase();

    // Check for key columns
    if (options.decodeKeys) {
      if (
        columnName.includes("key") ||
        columnName === "start" ||
        columnName === "end" ||
        columnName.includes("start_key") ||
        columnName.includes("end_key")
      ) {
        keyColumns.add(index);
      }
    }

    // Track info_key column for job_info tables
    if (
      columnName === "info_key" &&
      options.tableName.toLowerCase().includes("job_info")
    ) {
      infoKeyColumnIndex = index;
    }

    // Check for proto columns
    if (options.decodeProtos) {
      const mapping = findProtoType(options.tableName, header);
      if (mapping) {
        protoColumns.set(index, mapping.protoType);
        console.log(`📋 Proto mapping: ${options.tableName}.${header} -> ${mapping.protoType}`);
      }
    }
  });

  // If no columns need processing and we're not doing JSON key processing, return original content
  if (keyColumns.size === 0 && protoColumns.size === 0 && !options.decodeKeys) {
    return content;
  }

  // Process rows - transform values in place

  const processedRows = await Promise.all(rows.map(async (row, rowIndex) => {
    return Promise.all(row.map(async (value, colIndex) => {
      // Transform key columns
      if (keyColumns.has(colIndex)) {
        // Handle null/empty differently from \x (which is a valid empty key)
        if (value === "\\N" || value === "NULL") {
          return value;
        }
        return tryReplaceWithPrettyKey(value);
      }

      // Transform proto columns
      let protoType = protoColumns.get(colIndex);
      if (protoType !== undefined && options.decodeProtos) {
        // Handle dynamic proto type resolution for job_info table
        if (protoType === "dynamic:job_info" && infoKeyColumnIndex >= 0) {
          const infoKey = row[infoKeyColumnIndex]?.trim();
          if (infoKey === "legacy_payload") {
            protoType = "cockroach.sql.jobs.jobspb.Payload";
          } else if (infoKey === "legacy_progress") {
            protoType = "cockroach.sql.jobs.jobspb.Progress";
          } else if (infoKey?.includes("cockroach.sql.jobs.jobspb.TraceData")) {
            // Handle all TraceData entries, including those with #_final suffix
            protoType = "cockroach.sql.jobs.jobspb.TraceData";
          } else if (
            infoKey?.startsWith("~dsp-diag-url-") ||
            infoKey?.startsWith("~node-processor-progress-")
          ) {
            // These info_key types contain string values, not protobuf
            // If hex-encoded, decode and wrap in JSON
            if (value && value !== "\\N" && value !== "NULL") {
              if (value.startsWith("\\x")) {
                return createFallbackJson(value);
              }
              // If it's already a plain string, wrap it in JSON for consistency
              return JSON.stringify({ value: value });
            }
            return value;
          } else {
            // Unknown info_key type
            if (value && value !== "\\N" && value !== "NULL") {
              // Only warn and use fallback for hex-encoded values
              if (value.startsWith("\\x")) {
                const rowData = headers.map((h, i) => `${h}=${row[i]?.substring(0, 50)}${row[i]?.length > 50 ? '...' : ''}`).join(', ');
                console.warn(
                  `⚠️ Unknown job_info.info_key type "${infoKey}" with hex value:\n` +
                  `   Row ${rowIndex + 1}: {${rowData}}`
                );
                return createFallbackJson(value);
              }
              // If it's not hex, it's probably already a string - return as-is
              return value;
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
            const currentColumnName = headers[colIndex];
            const isTraceData = protoType === "cockroach.sql.jobs.jobspb.TraceData";
            try {
              let bytes = hexToBytes(value);

              // Check if TraceData is gzipped and decompress if needed
              if (isTraceData && isGzipped(bytes)) {
                bytes = await decompressGzip(bytes);
              }

              const decoded = await decoder.decodeAsync(bytes, protoType);

              // Don't use fallback for job_info - if the specific proto fails, leave as hex
              // The fallback was incorrectly decoding Progress data as SpanConfig

              if (decoded.decoded && !decoded.error) {
                // Return as compact JSON string
                const jsonStr = JSON.stringify(decoded.decoded);

                return jsonStr;
              } else {
                // Decoding failed - use fallback
                const hexSample = value.substring(0, 100) + (value.length > 100 ? '...' : '');
                const rowData = headers.map((h, i) => `${h}=${row[i]?.substring(0, 50)}${row[i]?.length > 50 ? '...' : ''}`).join(', ');

                if (!isTraceData) {
                  // Show more details for debugging for other proto types
                  console.warn(
                    `❌ Proto decode failed for ${currentColumnName} (${protoType}):\n` +
                    `   Row ${rowIndex + 1}: {${rowData}}\n` +
                    `   Hex (first 100 chars): ${hexSample}\n` +
                    `   Error details:\n${decoded.error}`
                  );
                }
                // Return hex-wrapped JSON for all failed decodes
                return createFallbackJson(value);
              }
            } catch (err) {
              // Decode exception - use fallback
              const hexSample = value.substring(0, 100) + (value.length > 100 ? '...' : '');
              const rowData = headers.map((h, i) => `${h}=${row[i]?.substring(0, 50)}${row[i]?.length > 50 ? '...' : ''}`).join(', ');
              const errorDetails = err instanceof Error
                ? `${err.name}: ${err.message}\n${err.stack}`
                : String(err);

              if (!isTraceData) {
                console.warn(
                  `❌ Proto decode exception for ${currentColumnName} (${protoType}):\n` +
                  `   Row ${rowIndex + 1}: {${rowData}}\n` +
                  `   Hex (first 100 chars): ${hexSample}\n` +
                  `   Error details:\n${errorDetails}`
                );
              }
              // Return hex-wrapped JSON for all exceptions
              return createFallbackJson(value);
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
            const processedObj = processObjectForKeys(jsonObj);
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
    }));
  }));

  // Reconstruct the CSV with transformed values
  const processedLines = [
    headers.join(delimiter),
    ...processedRows.map((row) => row.join(delimiter)),
  ];

  return processedLines.join("\n");
}

// Check if preprocessing would be beneficial for this table
export function shouldPreprocess(tableName: string, content: string): boolean {
  const normalizedName = tableName.toLowerCase();

  // Check for known CRDB system tables with proto/hex data
  // Use full table names
  const knownTables = [
    "system.span_configurations",
    "system.span_configs",
    "system.span_config",
    "system.zones",
    "system.descriptor",
    "system.jobs",
    "system.job_info",
    "system.lease",
    "system.rangelog",
    "system.replication_stats",
    // Also check for _by_node versions
    "system.jobs_by_node",
    "system.job_info_by_node",
  ];

  const isKnownTable = knownTables.some((t) => normalizedName === t);
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
