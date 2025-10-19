export {
  prettyKey,
  isProbablyHexKey,
  type DecodedKey,
  type KeyPart,
} from "./prettyKey";
export {
  ProtoDecoder,
  protoDecoder,
  type DecodedProto,
} from "./protoDecoder";

export function detectAndTransform(value: unknown): unknown {
  if (typeof value === "string") {
    if (value.startsWith("{") && value.endsWith("}")) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
  }

  return value;
}

// Type-specific formatters
function formatInterval(value: unknown): string {
  // INTERVAL values are already converted to strings in the worker
  return String(value);
}

function formatTime(value: unknown): string {
  // TIME values are already converted to HH:MM:SS.ffffff in the worker
  return String(value);
}

function formatTimestamp(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  // Fallback for timestamps that weren't converted
  if (typeof value === "number" || typeof value === "bigint") {
    return new Date(Number(value)).toISOString();
  }
  return String(value);
}

function formatHugeInt(value: unknown): string {
  // Handle DuckDB hugeint/decimal - can be Uint32Array or object with keys "0", "1", "2", "3"
  let parts: { 0: number; 1: number; 2: number; 3: number } | null = null;

  if (value instanceof Uint32Array && value.length === 4) {
    // Convert Uint32Array to plain object structure
    parts = { 0: value[0], 1: value[1], 2: value[2], 3: value[3] };
  } else if (
    typeof value === "object" &&
    value !== null &&
    "0" in value &&
    "1" in value &&
    "2" in value &&
    "3" in value
  ) {
    parts = value as { 0: number; 1: number; 2: number; 3: number };
  }

  if (parts) {
    // The first part (parts[0]) contains the lower 32 bits
    if (parts[1] === 0 && parts[2] === 0 && parts[3] === 0) {
      return String(parts[0]);
    }
    // For very large values, construct a BigInt from the parts
    // DuckDB hugeint/decimal is stored as little-endian 32-bit chunks
    const bigIntValue =
      BigInt(parts[0]) +
      (BigInt(parts[1]) << 32n) +
      (BigInt(parts[2]) << 64n) +
      (BigInt(parts[3]) << 96n);
    return bigIntValue.toString();
  }

  // If it doesn't match the expected structure, just convert to string
  return String(value);
}

function formatJson(value: unknown): string {
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

export function formatValue(value: unknown, columnType?: string): string {
  if (value === null || value === undefined) {
    return "";
  }

  // If no type information provided, log warning and use best-effort formatting
  if (!columnType) {
    console.warn("formatValue called without columnType for value:", value);

    // Minimal fallback: handle Date and basic types
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  // Type-driven dispatch based on DuckDB type
  const typeUpper = columnType.toUpperCase();

  // Handle INTERVAL types
  if (typeUpper.includes("INTERVAL")) {
    return formatInterval(value);
  }

  // Handle TIME types
  if (typeUpper.includes("TIME")) {
    return formatTime(value);
  }

  // Handle TIMESTAMP types
  if (typeUpper.includes("TIMESTAMP") || typeUpper.includes("DATE")) {
    return formatTimestamp(value);
  }

  // Handle HUGEINT (128-bit integers) and DECIMAL types
  if (typeUpper.includes("HUGEINT") || typeUpper.includes("INT128") || typeUpper.includes("DECIMAL")) {
    return formatHugeInt(value);
  }

  // Handle JSON types
  if (typeUpper.includes("JSON") || typeUpper.includes("STRUCT") || typeUpper.includes("MAP")) {
    return formatJson(value);
  }

  // Handle Date objects (might still appear for TIMESTAMP WITH TIME ZONE)
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Handle objects that weren't caught by specific type handlers
  if (typeof value === "object") {
    console.warn(`Unexpected object value for type ${columnType}:`, value);
    return JSON.stringify(value, null, 2);
  }

  // Default: convert to string for primitive types (VARCHAR, INTEGER, DOUBLE, etc.)
  return String(value);
}
