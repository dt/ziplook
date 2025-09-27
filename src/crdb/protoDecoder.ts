import { prettyKey } from "./prettyKey";

// Import generated protobuf types
import { ZoneConfig } from "./pb/config/zonepb/zone";
import { SpanConfig } from "./pb/roachpb/span_config";
import { Descriptor } from "./pb/sql/catalog/descpb/structured";
import { Payload, Progress } from "./pb/jobs/jobspb/jobs";
import type { JsonValue } from "@protobuf-ts/runtime";

// TODO: Add other types as we generate them
// import { Lease } from "./pb/roachpb/data";

export interface DecodedProto {
  raw: Uint8Array;
  decoded: unknown;
  typeName?: string;
  error?: string;
}

// Type map for static decoders - mapping from CRDB type names to generated decoders
const DECODERS = {
  "cockroach.config.zonepb.ZoneConfig": ZoneConfig,
  "cockroach.roachpb.SpanConfig": SpanConfig,
  "cockroach.sql.sqlbase.Descriptor": Descriptor,
  "cockroach.sql.jobs.jobspb.Payload": Payload,
  "cockroach.sql.jobs.jobspb.Progress": Progress,
  // TODO: Add remaining types as we generate them:
   // "cockroach.roachpb.Lease": Lease,
   // "cockroach.kv.kvserver.storagepb.RangeLogEvent": RangeLogEvent,
   // "cockroach.roachpb.ReplicationStatsReport": ReplicationStatsReport,
} as const;

// Helper function to convert protobuf message to JSON without defaults
// This handles the union type issue by using generics
function messageToJsonWithoutDefaults<T>(
  decoder: { toJson(message: T, options: { emitDefaultValues: boolean }): JsonValue },
  message: T
): unknown {
  try {
    return decoder.toJson(message, { emitDefaultValues: false });
  } catch {
    return message;
  }
}

export class ProtoDecoder {
  parseProtoValue(hexValue: string, typeName?: string): DecodedProto | null {
    try {
      // Remove the \\x prefix if present
      let hex = hexValue;
      if (hex.startsWith("\\\\x")) {
        hex = hex.substring(3);
      }

      // Convert hex string to bytes
      const bytes = new Uint8Array(
        hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [],
      );

      if (bytes.length === 0) {
        return null;
      }

      return this.decode(bytes, typeName);
    } catch {
      return null;
    }
  }

  decode(data: Uint8Array, typeName?: string): DecodedProto {
    if (!typeName) {
      return {
        raw: data,
        decoded: null,
        error: "No type specified for decoding",
      };
    }

    const decoder = DECODERS[typeName as keyof typeof DECODERS];
    if (!decoder) {
      return {
        raw: data,
        decoded: null,
        error: `No decoder available for type: ${typeName}`,
      };
    }

    try {
      // Use the generated decoder with protobuf-ts API
      const message = decoder.fromBinary(data);

      // Convert to JSON without default values, then transform
      const jsonWithoutDefaults = messageToJsonWithoutDefaults(decoder, message);
      const transformed = this.transformMessage(jsonWithoutDefaults);

      return {
        raw: data,
        decoded: transformed,
        typeName,
      };
    } catch (error) {
      return {
        raw: data,
        decoded: null,
        error: `Failed to decode as ${typeName}: ${error}`,
      };
    }
  }

  private transformMessage(obj: unknown): unknown {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformMessage(item));
    }

    if (typeof obj === "object" && obj !== null) {
      // Special handling for Descriptor protos with union field
      if ("union" in obj && typeof obj === "object") {
        const objRecord = obj as Record<string, unknown>;
        if (
          objRecord.union &&
          typeof objRecord.union === "string" &&
          objRecord.union in objRecord
        ) {
          const unionType = objRecord.union;
          const content = this.transformMessage(objRecord[unionType]);
          return {
            [unionType]: content,
          };
        }
      }

      const transformed: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(obj)) {
        // Convert snake_case to camelCase for consistency with CRDB output
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        transformed[camelKey] = this.transformValue(key, value);
      }

      return transformed;
    }

    return this.transformValue("", obj);
  }

  private transformValue(key: string, value: unknown): unknown {
    // Handle BigInt values - convert to string to make them JSON serializable
    if (typeof value === "bigint") {
      return value.toString();
    }
    // Handle base64 encoded bytes fields
    if (typeof value === "string") {
      // Handle key fields - try to replace with pretty key representation
      if (key.toLowerCase().includes("key")) {
        // Handle hex keys (start with \x)
        if (value === "\\x" || value.startsWith("\\x")) {
          try {
            const decoded = prettyKey(value);
            return decoded.pretty;
          } catch {
            // If prettyKey fails, return original value
          }
        }
        // Handle base64-encoded keys
        else if (
          /^[A-Za-z0-9+/]*(=|==)?$/.test(value) &&
          value.length % 4 === 0
        ) {
          try {
            // Convert base64 to hex using browser APIs
            const binaryString = atob(value);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const hexStr = Array.from(bytes)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");
            const decoded = prettyKey(hexStr);
            if (decoded.pretty !== hexStr) {
              return decoded.pretty;
            }
          } catch {
            // Ignore prettyKey failures
          }
        }
      }

      // Convert base64 cluster ID to UUID format
      if (key.includes("cluster_id")) {
        try {
          // Convert base64 to bytes using browser APIs
          const binaryString = atob(value);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          if (bytes.length === 16) {
            const hex = Array.from(bytes)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");
            const uuid = [
              hex.substring(0, 8),
              hex.substring(8, 12),
              hex.substring(12, 16),
              hex.substring(16, 20),
              hex.substring(20, 32),
            ].join("-");
            return uuid;
          }
        } catch {
          // Ignore UUID conversion failures
        }
      }
    }

    // Handle byte arrays from protobuf (like cluster IDs)
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Type assertion for object with string keys
      const objValue = value as Record<string, unknown>;
      // Check if this looks like a byte array object (has numeric keys 0, 1, 2...)
      const keys = Object.keys(objValue);
      const isAllNumericKeys = keys.every(k => /^\d+$/.test(k));

      if (isAllNumericKeys && keys.length > 0) {
        // Convert byte array object to Uint8Array
        const maxIndex = Math.max(...keys.map(Number));
        if (maxIndex === keys.length - 1) { // Consecutive indices starting from 0
          const bytes = new Uint8Array(keys.length);
          for (let i = 0; i < keys.length; i++) {
            bytes[i] = objValue[i.toString()] as number;
          }

          // Handle cluster_id conversion to UUID
          if (key.includes("id") && bytes.length === 16) {
            const hex = Array.from(bytes)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");
            const uuid = [
              hex.substring(0, 8),
              hex.substring(8, 12),
              hex.substring(12, 16),
              hex.substring(16, 20),
              hex.substring(20, 32),
            ].join("-");
            return uuid;
          }

          // For other byte arrays, convert to hex string
          if (key.toLowerCase().includes("key") || bytes.length > 8) {
            const hexStr = Array.from(bytes)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");
            return hexStr;
          }
        }
      }
    }

    // Handle roachpb.Span objects with startKey and endKey
    if (typeof value === "object" && value !== null) {
      // Check if this looks like a Span (has startKey and/or endKey)
      if (
        "startKey" in value ||
        "endKey" in value ||
        "start_key" in value ||
        "end_key" in value
      ) {
        const transformed: Record<string, unknown> = {};

        for (const [k, v] of Object.entries(value)) {
          // Convert snake_case to camelCase
          const camelKey = k.replace(/_([a-z])/g, (_, letter) =>
            letter.toUpperCase(),
          );
          // Recursively transform, ensuring key fields are pretty-printed
          transformed[camelKey] = this.transformValue(k, v);
        }

        return transformed;
      }

      // Handle arrays of spans
      if (Array.isArray(value)) {
        return value.map((item, index) =>
          this.transformValue(`${key}[${index}]`, item),
        );
      }

      return this.transformMessage(value);
    }

    return value;
  }

  getAvailableTypes(): string[] {
    return Object.keys(DECODERS);
  }
}

export const protoDecoder = new ProtoDecoder();