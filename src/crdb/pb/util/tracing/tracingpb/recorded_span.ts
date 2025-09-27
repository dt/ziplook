// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { RecordingMode } from "./tracing";
import { Duration } from "../../../google/protobuf/duration";
import { Any } from "../../../google/protobuf/any";
import { Timestamp } from "../../../google/protobuf/timestamp";

export interface LogRecord {

    time?: Timestamp;

    message: string;
}

export interface LogRecord_Field {

    key: string;

    value: string;
}

export interface StructuredRecord {

    time?: Timestamp;

    payload?: Any;
}

export interface OperationMetadata {

    duration: bigint;

    count: bigint;

    containsUnfinished: boolean;
}

export interface RecordedSpan {

    traceId: bigint;

    spanId: bigint;

    parentSpanId: bigint;

    operation: string;

    tagGroups: TagGroup[];

    startTime?: Timestamp;

    duration?: Duration;

    logs: LogRecord[];

    verbose: boolean;

    recordingMode: RecordingMode;

    goroutineId: bigint;

    finished: boolean;

    structuredRecords: StructuredRecord[];

    structuredRecordsSizeBytes: bigint;

    childrenMetadata: {
        [key: string]: OperationMetadata;
    };
}

export interface TagGroup {

    name: string;

    tags: Tag[];
}

export interface Tag {

    key: string;

    value: string;
}

export interface NormalizedSpan {

    operation: string;

    tags: {
        [key: string]: string;
    };

    tagGroups: TagGroup[];

    startTime?: Timestamp;

    duration?: Duration;

    logs: LogRecord[];

    structuredRecords: StructuredRecord[];

    childrenMetadata: {
        [key: string]: OperationMetadata;
    };

    children: NormalizedSpan[];
}

export interface CapturedStack {

    stack: string;

    sharedSuffix: number;

    sharedLines: number;

    age: bigint;
}

class LogRecord$Type extends MessageType<LogRecord> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.LogRecord", [
            { no: 1, name: "time", kind: "message", T: () => Timestamp },
            { no: 3, name: "message", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<LogRecord>): LogRecord {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.message = "";
        if (value !== undefined)
            reflectionMergePartial<LogRecord>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LogRecord): LogRecord {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.time = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.time);
                    break;
                case  3:
                    message.message = reader.string();
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

export const LogRecord = /*#__PURE__*/ new LogRecord$Type();

class LogRecord_Field$Type extends MessageType<LogRecord_Field> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.LogRecord.Field", [
            { no: 1, name: "key", kind: "scalar", T: 9  },
            { no: 2, name: "value", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<LogRecord_Field>): LogRecord_Field {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = "";
        message.value = "";
        if (value !== undefined)
            reflectionMergePartial<LogRecord_Field>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LogRecord_Field): LogRecord_Field {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.string();
                    break;
                case  2:
                    message.value = reader.string();
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

export const LogRecord_Field = /*#__PURE__*/ new LogRecord_Field$Type();

class StructuredRecord$Type extends MessageType<StructuredRecord> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.StructuredRecord", [
            { no: 1, name: "time", kind: "message", T: () => Timestamp },
            { no: 2, name: "payload", kind: "message", T: () => Any }
        ]);
    }
    create(value?: PartialMessage<StructuredRecord>): StructuredRecord {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<StructuredRecord>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StructuredRecord): StructuredRecord {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.time = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.time);
                    break;
                case  2:
                    message.payload = Any.internalBinaryRead(reader, reader.uint32(), options, message.payload);
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

export const StructuredRecord = /*#__PURE__*/ new StructuredRecord$Type();

class OperationMetadata$Type extends MessageType<OperationMetadata> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.OperationMetadata", [
            { no: 1, name: "duration", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "count", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "contains_unfinished", kind: "scalar", T: 8  }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<OperationMetadata>): OperationMetadata {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.duration = 0n;
        message.count = 0n;
        message.containsUnfinished = false;
        if (value !== undefined)
            reflectionMergePartial<OperationMetadata>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OperationMetadata): OperationMetadata {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.duration = reader.int64().toBigInt();
                    break;
                case  2:
                    message.count = reader.int64().toBigInt();
                    break;
                case  3:
                    message.containsUnfinished = reader.bool();
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

export const OperationMetadata = /*#__PURE__*/ new OperationMetadata$Type();

class RecordedSpan$Type extends MessageType<RecordedSpan> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.RecordedSpan", [
            { no: 1, name: "trace_id", kind: "scalar", T: 4 , L: 0  },
            { no: 2, name: "span_id", kind: "scalar", T: 4 , L: 0  },
            { no: 3, name: "parent_span_id", kind: "scalar", T: 4 , L: 0  },
            { no: 4, name: "operation", kind: "scalar", T: 9  },
            { no: 18, name: "tag_groups", kind: "message", repeat: 2 , T: () => TagGroup },
            { no: 7, name: "start_time", kind: "message", T: () => Timestamp },
            { no: 8, name: "duration", kind: "message", T: () => Duration },
            { no: 9, name: "logs", kind: "message", repeat: 2 , T: () => LogRecord },
            { no: 16, name: "verbose", kind: "scalar", T: 8  },
            { no: 17, name: "recording_mode", kind: "enum", T: () => ["cockroach.util.tracing.tracingpb.RecordingMode", RecordingMode] },
            { no: 12, name: "goroutine_id", kind: "scalar", T: 4 , L: 0  },
            { no: 13, name: "finished", kind: "scalar", T: 8  },
            { no: 14, name: "structured_records", kind: "message", repeat: 2 , T: () => StructuredRecord },
            { no: 20, name: "structured_records_size_bytes", kind: "scalar", T: 3 , L: 0  },
            { no: 19, name: "children_metadata", kind: "map", K: 9 , V: { kind: "message", T: () => OperationMetadata } }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<RecordedSpan>): RecordedSpan {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.traceId = 0n;
        message.spanId = 0n;
        message.parentSpanId = 0n;
        message.operation = "";
        message.tagGroups = [];
        message.logs = [];
        message.verbose = false;
        message.recordingMode = 0;
        message.goroutineId = 0n;
        message.finished = false;
        message.structuredRecords = [];
        message.structuredRecordsSizeBytes = 0n;
        message.childrenMetadata = {};
        if (value !== undefined)
            reflectionMergePartial<RecordedSpan>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RecordedSpan): RecordedSpan {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.traceId = reader.uint64().toBigInt();
                    break;
                case  2:
                    message.spanId = reader.uint64().toBigInt();
                    break;
                case  3:
                    message.parentSpanId = reader.uint64().toBigInt();
                    break;
                case  4:
                    message.operation = reader.string();
                    break;
                case  18:
                    message.tagGroups.push(TagGroup.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.startTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.startTime);
                    break;
                case  8:
                    message.duration = Duration.internalBinaryRead(reader, reader.uint32(), options, message.duration);
                    break;
                case  9:
                    message.logs.push(LogRecord.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  16:
                    message.verbose = reader.bool();
                    break;
                case  17:
                    message.recordingMode = reader.int32();
                    break;
                case  12:
                    message.goroutineId = reader.uint64().toBigInt();
                    break;
                case  13:
                    message.finished = reader.bool();
                    break;
                case  14:
                    message.structuredRecords.push(StructuredRecord.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  20:
                    message.structuredRecordsSizeBytes = reader.int64().toBigInt();
                    break;
                case  19:
                    this.binaryReadMap19(message.childrenMetadata, reader, options);
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
    private binaryReadMap19(map: RecordedSpan["childrenMetadata"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof RecordedSpan["childrenMetadata"] | undefined, val: RecordedSpan["childrenMetadata"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = OperationMetadata.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.util.tracing.tracingpb.RecordedSpan.children_metadata");
            }
        }
        map[key ?? ""] = val ?? OperationMetadata.create();
    }

}

export const RecordedSpan = /*#__PURE__*/ new RecordedSpan$Type();

class TagGroup$Type extends MessageType<TagGroup> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.TagGroup", [
            { no: 1, name: "name", kind: "scalar", T: 9  },
            { no: 2, name: "tags", kind: "message", repeat: 2 , T: () => Tag }
        ]);
    }
    create(value?: PartialMessage<TagGroup>): TagGroup {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        message.tags = [];
        if (value !== undefined)
            reflectionMergePartial<TagGroup>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TagGroup): TagGroup {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.tags.push(Tag.internalBinaryRead(reader, reader.uint32(), options));
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

export const TagGroup = /*#__PURE__*/ new TagGroup$Type();

class Tag$Type extends MessageType<Tag> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.Tag", [
            { no: 1, name: "key", kind: "scalar", T: 9  },
            { no: 2, name: "value", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<Tag>): Tag {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = "";
        message.value = "";
        if (value !== undefined)
            reflectionMergePartial<Tag>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Tag): Tag {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.string();
                    break;
                case  2:
                    message.value = reader.string();
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

export const Tag = /*#__PURE__*/ new Tag$Type();

class NormalizedSpan$Type extends MessageType<NormalizedSpan> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.NormalizedSpan", [
            { no: 1, name: "operation", kind: "scalar", T: 9  },
            { no: 2, name: "tags", kind: "map", K: 9 , V: { kind: "scalar", T: 9  } },
            { no: 8, name: "tag_groups", kind: "message", repeat: 2 , T: () => TagGroup },
            { no: 3, name: "start_time", kind: "message", T: () => Timestamp },
            { no: 4, name: "duration", kind: "message", T: () => Duration },
            { no: 5, name: "logs", kind: "message", repeat: 2 , T: () => LogRecord },
            { no: 7, name: "structured_records", kind: "message", repeat: 2 , T: () => StructuredRecord },
            { no: 9, name: "children_metadata", kind: "map", K: 9 , V: { kind: "message", T: () => OperationMetadata } },
            { no: 6, name: "children", kind: "message", repeat: 2 , T: () => NormalizedSpan }
        ]);
    }
    create(value?: PartialMessage<NormalizedSpan>): NormalizedSpan {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.operation = "";
        message.tags = {};
        message.tagGroups = [];
        message.logs = [];
        message.structuredRecords = [];
        message.childrenMetadata = {};
        message.children = [];
        if (value !== undefined)
            reflectionMergePartial<NormalizedSpan>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NormalizedSpan): NormalizedSpan {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.operation = reader.string();
                    break;
                case  2:
                    this.binaryReadMap2(message.tags, reader, options);
                    break;
                case  8:
                    message.tagGroups.push(TagGroup.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.startTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.startTime);
                    break;
                case  4:
                    message.duration = Duration.internalBinaryRead(reader, reader.uint32(), options, message.duration);
                    break;
                case  5:
                    message.logs.push(LogRecord.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.structuredRecords.push(StructuredRecord.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  9:
                    this.binaryReadMap9(message.childrenMetadata, reader, options);
                    break;
                case  6:
                    message.children.push(NormalizedSpan.internalBinaryRead(reader, reader.uint32(), options));
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
    private binaryReadMap2(map: NormalizedSpan["tags"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof NormalizedSpan["tags"] | undefined, val: NormalizedSpan["tags"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.util.tracing.tracingpb.NormalizedSpan.tags");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    private binaryReadMap9(map: NormalizedSpan["childrenMetadata"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof NormalizedSpan["childrenMetadata"] | undefined, val: NormalizedSpan["childrenMetadata"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = OperationMetadata.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.util.tracing.tracingpb.NormalizedSpan.children_metadata");
            }
        }
        map[key ?? ""] = val ?? OperationMetadata.create();
    }

}

export const NormalizedSpan = /*#__PURE__*/ new NormalizedSpan$Type();

class CapturedStack$Type extends MessageType<CapturedStack> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.CapturedStack", [
            { no: 1, name: "stack", kind: "scalar", T: 9  },
            { no: 2, name: "shared_suffix", kind: "scalar", T: 5  },
            { no: 3, name: "shared_lines", kind: "scalar", T: 5  },
            { no: 4, name: "age", kind: "scalar", T: 3 , L: 0  }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<CapturedStack>): CapturedStack {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.stack = "";
        message.sharedSuffix = 0;
        message.sharedLines = 0;
        message.age = 0n;
        if (value !== undefined)
            reflectionMergePartial<CapturedStack>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CapturedStack): CapturedStack {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.stack = reader.string();
                    break;
                case  2:
                    message.sharedSuffix = reader.int32();
                    break;
                case  3:
                    message.sharedLines = reader.int32();
                    break;
                case  4:
                    message.age = reader.int64().toBigInt();
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

export const CapturedStack = /*#__PURE__*/ new CapturedStack$Type();
