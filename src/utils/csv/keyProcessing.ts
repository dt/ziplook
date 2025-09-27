/**
 * Pure key transformation utilities extracted from csvPreprocessor.ts
 * These can be tested independently of DuckDB or workers
 */

export interface PrettyKeyResult {
  pretty: string;
  originalHex?: string;
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
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

/**
 * Convert Uint8Array to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Check if a string looks like a base64-encoded value
 */
export function isBase64String(value: string): boolean {
  if (!value || typeof value !== "string") {
    return false;
  }

  return /^[A-Za-z0-9+/]*(=|==)?$/.test(value) && value.length % 4 === 0;
}

/**
 * Decode base64 string to hex
 */
export function base64ToHex(base64: string): string {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytesToHex(bytes);
}

/**
 * Format table ID from single byte hex
 */
export function formatTableId(hexStr: string): string {
  if (hexStr.length === 2) {
    const tableId = parseInt(hexStr, 16);
    return `/Table/${tableId}`;
  }
  return hexStr;
}

/**
 * Create fallback JSON representation for undecodable values
 */
export function createFallbackJson(hexValue: string): string {
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

/**
 * Transform key-like values to more readable format
 * This is a pure function that can be tested independently
 */
export function transformKey(value: string, prettyKeyFn?: (key: string) => PrettyKeyResult): string {
  if (!value || typeof value !== "string") {
    return value;
  }

  // Handle hex keys (start with \x)
  if (value === "\\x" || value.startsWith("\\x")) {
    if (prettyKeyFn) {
      try {
        const decoded = prettyKeyFn(value);
        return decoded.pretty;
      } catch {
        return value;
      }
    } else {
      // Without prettyKey function, just return formatted table ID if applicable
      try {
        const hex = value.replace(/^\\x/i, "");
        return formatTableId(hex);
      } catch {
        return value;
      }
    }
  }

  // Handle base64-encoded keys
  if (isBase64String(value)) {
    try {
      const hexStr = base64ToHex(value);

      // For base64-decoded keys, try to format even short values
      if (hexStr.length >= 2 && hexStr.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(hexStr)) {
        // Single byte values are likely table IDs
        if (hexStr.length === 2) {
          return formatTableId(hexStr);
        }

        // For longer values, try prettyKey if available
        if (prettyKeyFn) {
          try {
            const decoded = prettyKeyFn(hexStr);
            if (decoded.pretty !== hexStr) {
              return decoded.pretty;
            }
          } catch {
            // Ignore prettyKey failures
          }
        }
      }
    } catch {
      // Ignore base64 decode failures
    }
  }

  return value;
}

/**
 * Check if a column name indicates it contains key data
 */
export function isKeyColumn(columnName: string): boolean {
  const normalized = columnName.toLowerCase();
  return (
    normalized.includes("key") ||
    normalized === "start" ||
    normalized === "end" ||
    normalized.includes("start_key") ||
    normalized.includes("end_key")
  );
}

/**
 * Recursively process an object/array to replace key fields
 */
export function processObjectForKeys(
  obj: unknown,
  prettyKeyFn?: (key: string) => PrettyKeyResult
): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => processObjectForKeys(item, prettyKeyFn));
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes("key") && typeof value === "string") {
        result[key] = transformKey(value, prettyKeyFn);
      } else {
        result[key] = processObjectForKeys(value, prettyKeyFn);
      }
    }
    return result;
  }

  return obj;
}