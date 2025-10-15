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

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    // Handle Date objects
    if (value instanceof Date) {
      // Format as ISO 8601
      return value.toISOString();
    }

    // Handle DuckDB hugeint (128-bit integer) - represented as object with keys "0", "1", "2", "3"
    if (
      typeof value === "object" &&
      value !== null &&
      "0" in value &&
      "1" in value &&
      "2" in value &&
      "3" in value
    ) {
      const parts = value as { 0: number; 1: number; 2: number; 3: number };
      // The first part (parts[0]) contains the lower 32 bits, which is usually the only non-zero part for reasonable values
      // For very large numbers, we'd need proper BigInt handling, but for now just show the lower part
      if (parts[1] === 0 && parts[2] === 0 && parts[3] === 0) {
        return String(parts[0]);
      }
      // For very large values, construct a BigInt from the parts
      // DuckDB hugeint is stored as little-endian 32-bit chunks
      const bigIntValue =
        BigInt(parts[0]) +
        (BigInt(parts[1]) << 32n) +
        (BigInt(parts[2]) << 64n) +
        (BigInt(parts[3]) << 96n);
      return bigIntValue.toString();
    }

    return JSON.stringify(value, null, 2);
  }

  return String(value);
}
