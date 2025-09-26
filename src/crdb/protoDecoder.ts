import * as protobuf from "protobufjs";
import { prettyKey } from "./prettyKey";

export interface ProtoDescriptor {
  name: string;
  root: protobuf.Root;
}

export interface DecodedProto {
  raw: Uint8Array;
  decoded: unknown;
  typeName?: string;
  error?: string;
}

export class ProtoDecoder {
  private root: protobuf.Root | null = null;
  private loaded = false;

  constructor() {
    // No fallback initialization - only real descriptors
  }

  // Removed - no fallback types allowed

  // Removed - not needed with real descriptors

  async loadCRDBDescriptors(): Promise<void> {
    if (this.loaded) return;

    try {
      // Import the JSON directly - no more fetching from public directory
      const crdbDescriptors = await import("../crdb.json");
      // Cast to any to handle TypeScript type incompatibility
      this.root = protobuf.Root.fromJSON(crdbDescriptors.default as Record<string, unknown>);
      this.loaded = true;
    } catch (error) {
      console.error("Failed to load CRDB descriptors:", error);
      throw error;
    }
  }

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

    if (!this.loaded || !this.root) {
      return {
        raw: data,
        decoded: null,
        error: "Proto descriptors not loaded",
      };
    }

    try {
      const type = this.root.lookupType(typeName);

      const message = type.decode(data);

      // Use toObject with proper options for CRDB compatibility
      const decoded = type.toObject(message, {
        longs: String,
        bytes: String,
        defaults: false,
        arrays: true,
        objects: true,
        oneofs: true,
      });

      // Transform the decoded message to handle special fields
      const transformed = this.transformMessage(decoded);

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
      // CRDB outputs these as {"database": {...}} or {"table": {...}}
      if ("union" in obj && typeof obj === "object") {
        const objRecord = obj as Record<string, unknown>;
        if (objRecord.union && typeof objRecord.union === "string" && objRecord.union in objRecord) {
          const unionType = objRecord.union;
          const content = this.transformMessage(objRecord[unionType]);
          // Return in CRDB format with union type as top-level key
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
    if (!this.loaded || !this.root) {
      return [];
    }

    const types: string[] = [];

    function collectTypes(obj: unknown, prefix = ""): void {
      if (obj && typeof obj === 'object' && obj !== null && 'nested' in obj) {
        const nestedObj = obj as Record<string, unknown>;
        if (nestedObj.nested && typeof nestedObj.nested === 'object') {
          for (const [key, value] of Object.entries(nestedObj.nested)) {
            const fullName = prefix ? `${prefix}.${key}` : key;
            if (value && typeof value === 'object' && value !== null && 'fields' in value) {
              types.push(fullName);
            }
            if (value && typeof value === 'object' && value !== null && 'nested' in value) {
              collectTypes(value, fullName);
            }
          }
        }
      }
    }

    collectTypes(this.root.toJSON());
    return types.sort();
  }
}

export const protoDecoder = new ProtoDecoder();

// Initialize CRDB descriptors on module load (browser environment only)
if (typeof window !== "undefined") {
  protoDecoder.loadCRDBDescriptors().catch((err) => {
    console.warn("Failed to load CRDB descriptors on init:", err);
  });
}
