// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface TraceInfo {

    traceId: bigint;

    parentSpanId: bigint;

    recordingMode: RecordingMode;

    otel?: TraceInfo_OtelInfo;
}

export interface TraceInfo_OtelInfo {

    traceId: Uint8Array;

    spanId: Uint8Array;
}

export enum RecordingMode {

    OFF = 0,

    VERBOSE = 1,

    STRUCTURED = 2
}

class TraceInfo$Type extends MessageType<TraceInfo> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.TraceInfo", [
            { no: 1, name: "trace_id", kind: "scalar", T: 4 , L: 0  },
            { no: 2, name: "parent_span_id", kind: "scalar", T: 4 , L: 0  },
            { no: 3, name: "recording_mode", kind: "enum", T: () => ["cockroach.util.tracing.tracingpb.RecordingMode", RecordingMode] },
            { no: 4, name: "otel", kind: "message", T: () => TraceInfo_OtelInfo }
        ]);
    }
    create(value?: PartialMessage<TraceInfo>): TraceInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.traceId = 0n;
        message.parentSpanId = 0n;
        message.recordingMode = 0;
        if (value !== undefined)
            reflectionMergePartial<TraceInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TraceInfo): TraceInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.traceId = reader.uint64().toBigInt();
                    break;
                case  2:
                    message.parentSpanId = reader.uint64().toBigInt();
                    break;
                case  3:
                    message.recordingMode = reader.int32();
                    break;
                case  4:
                    message.otel = TraceInfo_OtelInfo.internalBinaryRead(reader, reader.uint32(), options, message.otel);
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

export const TraceInfo = /*#__PURE__*/ new TraceInfo$Type();

class TraceInfo_OtelInfo$Type extends MessageType<TraceInfo_OtelInfo> {
    constructor() {
        super("cockroach.util.tracing.tracingpb.TraceInfo.OtelInfo", [
            { no: 1, name: "trace_id", kind: "scalar", T: 12  },
            { no: 2, name: "span_id", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<TraceInfo_OtelInfo>): TraceInfo_OtelInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.traceId = new Uint8Array(0);
        message.spanId = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<TraceInfo_OtelInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TraceInfo_OtelInfo): TraceInfo_OtelInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.traceId = reader.bytes();
                    break;
                case  2:
                    message.spanId = reader.bytes();
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

export const TraceInfo_OtelInfo = /*#__PURE__*/ new TraceInfo_OtelInfo$Type();
