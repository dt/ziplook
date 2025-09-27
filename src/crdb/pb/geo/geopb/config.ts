// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface Config {

    s2Geography?: S2GeographyConfig;

    s2Geometry?: S2GeometryConfig;
}

export interface S2Config {

    minLevel: number;

    maxLevel: number;

    levelMod: number;

    maxCells: number;
}

export interface S2GeographyConfig {

    s2Config?: S2Config;
}

export interface S2GeometryConfig {

    minX: number;

    maxX: number;

    minY: number;

    maxY: number;

    s2Config?: S2Config;
}

class Config$Type extends MessageType<Config> {
    constructor() {
        super("cockroach.geo.geoindex.Config", [
            { no: 1, name: "s2_geography", kind: "message", T: () => S2GeographyConfig },
            { no: 2, name: "s2_geometry", kind: "message", T: () => S2GeometryConfig }
        ], { "gogoproto.onlyone": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Config>): Config {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Config>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Config): Config {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.s2Geography = S2GeographyConfig.internalBinaryRead(reader, reader.uint32(), options, message.s2Geography);
                    break;
                case  2:
                    message.s2Geometry = S2GeometryConfig.internalBinaryRead(reader, reader.uint32(), options, message.s2Geometry);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Config = /*#__PURE__*/ new Config$Type();

class S2Config$Type extends MessageType<S2Config> {
    constructor() {
        super("cockroach.geo.geoindex.S2Config", [
            { no: 1, name: "min_level", kind: "scalar", T: 5  },
            { no: 2, name: "max_level", kind: "scalar", T: 5  },
            { no: 3, name: "level_mod", kind: "scalar", T: 5  },
            { no: 4, name: "max_cells", kind: "scalar", T: 5  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<S2Config>): S2Config {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.minLevel = 0;
        message.maxLevel = 0;
        message.levelMod = 0;
        message.maxCells = 0;
        if (value !== undefined)
            reflectionMergePartial<S2Config>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: S2Config): S2Config {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.minLevel = reader.int32();
                    break;
                case  2:
                    message.maxLevel = reader.int32();
                    break;
                case  3:
                    message.levelMod = reader.int32();
                    break;
                case  4:
                    message.maxCells = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const S2Config = /*#__PURE__*/ new S2Config$Type();

class S2GeographyConfig$Type extends MessageType<S2GeographyConfig> {
    constructor() {
        super("cockroach.geo.geoindex.S2GeographyConfig", [
            { no: 1, name: "s2_config", kind: "message", T: () => S2Config }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<S2GeographyConfig>): S2GeographyConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<S2GeographyConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: S2GeographyConfig): S2GeographyConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.s2Config = S2Config.internalBinaryRead(reader, reader.uint32(), options, message.s2Config);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const S2GeographyConfig = /*#__PURE__*/ new S2GeographyConfig$Type();

class S2GeometryConfig$Type extends MessageType<S2GeometryConfig> {
    constructor() {
        super("cockroach.geo.geoindex.S2GeometryConfig", [
            { no: 1, name: "min_x", kind: "scalar", T: 1  },
            { no: 2, name: "max_x", kind: "scalar", T: 1  },
            { no: 3, name: "min_y", kind: "scalar", T: 1  },
            { no: 4, name: "max_y", kind: "scalar", T: 1  },
            { no: 5, name: "s2_config", kind: "message", T: () => S2Config }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<S2GeometryConfig>): S2GeometryConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.minX = 0;
        message.maxX = 0;
        message.minY = 0;
        message.maxY = 0;
        if (value !== undefined)
            reflectionMergePartial<S2GeometryConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: S2GeometryConfig): S2GeometryConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.minX = reader.double();
                    break;
                case  2:
                    message.maxX = reader.double();
                    break;
                case  3:
                    message.minY = reader.double();
                    break;
                case  4:
                    message.maxY = reader.double();
                    break;
                case  5:
                    message.s2Config = S2Config.internalBinaryRead(reader, reader.uint32(), options, message.s2Config);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const S2GeometryConfig = /*#__PURE__*/ new S2GeometryConfig$Type();
