// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Timestamp } from "../../../../util/hlc/timestamp";

export interface ReadSummary {

    local?: Segment;

    global?: Segment;
}

export interface Segment {

    lowWater?: Timestamp;

    readSpans: ReadSpan[];
}

export interface ReadSpan {

    key: Uint8Array;

    endKey: Uint8Array;

    timestamp?: Timestamp;

    txnId: Uint8Array;
}

class ReadSummary$Type extends MessageType<ReadSummary> {
    constructor() {
        super("cockroach.kv.kvserver.readsummary.ReadSummary", [
            { no: 1, name: "local", kind: "message", T: () => Segment },
            { no: 2, name: "global", kind: "message", T: () => Segment }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ReadSummary>): ReadSummary {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ReadSummary>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReadSummary): ReadSummary {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.local = Segment.internalBinaryRead(reader, reader.uint32(), options, message.local);
                    break;
                case  2:
                    message.global = Segment.internalBinaryRead(reader, reader.uint32(), options, message.global);
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

export const ReadSummary = /*#__PURE__*/ new ReadSummary$Type();

class Segment$Type extends MessageType<Segment> {
    constructor() {
        super("cockroach.kv.kvserver.readsummary.Segment", [
            { no: 1, name: "low_water", kind: "message", T: () => Timestamp },
            { no: 2, name: "read_spans", kind: "message", repeat: 2 , T: () => ReadSpan }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Segment>): Segment {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.readSpans = [];
        if (value !== undefined)
            reflectionMergePartial<Segment>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Segment): Segment {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.lowWater = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.lowWater);
                    break;
                case  2:
                    message.readSpans.push(ReadSpan.internalBinaryRead(reader, reader.uint32(), options));
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

export const Segment = /*#__PURE__*/ new Segment$Type();

class ReadSpan$Type extends MessageType<ReadSpan> {
    constructor() {
        super("cockroach.kv.kvserver.readsummary.ReadSpan", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "end_key", kind: "scalar", T: 12  },
            { no: 3, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 4, name: "txn_id", kind: "scalar", T: 12  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ReadSpan>): ReadSpan {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.endKey = new Uint8Array(0);
        message.txnId = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<ReadSpan>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReadSpan): ReadSpan {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.endKey = reader.bytes();
                    break;
                case  3:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  4:
                    message.txnId = reader.bytes();
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

export const ReadSpan = /*#__PURE__*/ new ReadSpan$Type();
