// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Timestamp } from "../../util/hlc/timestamp";
import { Level } from "../../kv/kvserver/concurrency/isolation/levels";

export interface TxnMeta {

    id: Uint8Array;

    key: Uint8Array;

    isoLevel: Level;

    epoch: number;

    writeTimestamp?: Timestamp;

    minTimestamp?: Timestamp;

    priority: number;

    sequence: number;

    coordinatorNodeId: number;
}

export interface IgnoredSeqNumRange {

    start: number;

    end: number;
}

export interface MVCCValueHeader {

    kvnemesisSeq?: MVCCValueHeader_Empty;

    localTimestamp?: Timestamp;

    omitInRangefeeds: boolean;

    importEpoch: number;

    originId: number;

    originTimestamp?: Timestamp;
}

export interface MVCCValueHeader_Empty {
}

export interface MVCCStatsDelta {

    containsEstimates: bigint;

    lastUpdateNanos: bigint;

    lockAge: bigint;

    gcBytesAge: bigint;

    liveBytes: bigint;

    liveCount: bigint;

    keyBytes: bigint;

    keyCount: bigint;

    valBytes: bigint;

    valCount: bigint;

    intentBytes: bigint;

    intentCount: bigint;

    lockBytes: bigint;

    lockCount: bigint;

    rangeKeyCount: bigint;

    rangeKeyBytes: bigint;

    rangeValCount: bigint;

    rangeValBytes: bigint;

    sysBytes: bigint;

    sysCount: bigint;

    abortSpanBytes: bigint;
}

export interface MVCCWriteValueOp {

    key: Uint8Array;

    timestamp?: Timestamp;

    value: Uint8Array;

    prevValue: Uint8Array;

    omitInRangefeeds: boolean;

    originId: number;
}

export interface MVCCWriteIntentOp {

    txnId: Uint8Array;

    txnKey: Uint8Array;

    txnIsoLevel: Level;

    txnMinTimestamp?: Timestamp;

    timestamp?: Timestamp;
}

export interface MVCCUpdateIntentOp {

    txnId: Uint8Array;

    timestamp?: Timestamp;
}

export interface MVCCCommitIntentOp {

    txnId: Uint8Array;

    key: Uint8Array;

    timestamp?: Timestamp;

    value: Uint8Array;

    prevValue: Uint8Array;

    omitInRangefeeds: boolean;

    originId: number;
}

export interface MVCCAbortIntentOp {

    txnId: Uint8Array;
}

export interface MVCCAbortTxnOp {

    txnId: Uint8Array;
}

export interface MVCCDeleteRangeOp {

    startKey: Uint8Array;

    endKey: Uint8Array;

    timestamp?: Timestamp;
}

export interface MVCCLogicalOp {

    writeValue?: MVCCWriteValueOp;

    writeIntent?: MVCCWriteIntentOp;

    updateIntent?: MVCCUpdateIntentOp;

    commitIntent?: MVCCCommitIntentOp;

    abortIntent?: MVCCAbortIntentOp;

    abortTxn?: MVCCAbortTxnOp;

    deleteRange?: MVCCDeleteRangeOp;
}

class TxnMeta$Type extends MessageType<TxnMeta> {
    constructor() {
        super("cockroach.storage.enginepb.TxnMeta", [
            { no: 1, name: "id", kind: "scalar", T: 12  },
            { no: 3, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "iso_level", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.isolation.Level", Level] },
            { no: 4, name: "epoch", kind: "scalar", T: 5  },
            { no: 5, name: "write_timestamp", kind: "message", T: () => Timestamp },
            { no: 9, name: "min_timestamp", kind: "message", T: () => Timestamp },
            { no: 6, name: "priority", kind: "scalar", T: 5  },
            { no: 7, name: "sequence", kind: "scalar", T: 5  },
            { no: 10, name: "coordinator_node_id", kind: "scalar", T: 5  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true });
    }
    create(value?: PartialMessage<TxnMeta>): TxnMeta {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = new Uint8Array(0);
        message.key = new Uint8Array(0);
        message.isoLevel = 0;
        message.epoch = 0;
        message.priority = 0;
        message.sequence = 0;
        message.coordinatorNodeId = 0;
        if (value !== undefined)
            reflectionMergePartial<TxnMeta>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TxnMeta): TxnMeta {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.bytes();
                    break;
                case  3:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.isoLevel = reader.int32();
                    break;
                case  4:
                    message.epoch = reader.int32();
                    break;
                case  5:
                    message.writeTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.writeTimestamp);
                    break;
                case  9:
                    message.minTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.minTimestamp);
                    break;
                case  6:
                    message.priority = reader.int32();
                    break;
                case  7:
                    message.sequence = reader.int32();
                    break;
                case  10:
                    message.coordinatorNodeId = reader.int32();
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

export const TxnMeta = /*#__PURE__*/ new TxnMeta$Type();

class IgnoredSeqNumRange$Type extends MessageType<IgnoredSeqNumRange> {
    constructor() {
        super("cockroach.storage.enginepb.IgnoredSeqNumRange", [
            { no: 1, name: "start", kind: "scalar", T: 5  },
            { no: 2, name: "end", kind: "scalar", T: 5  }
        ], { "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<IgnoredSeqNumRange>): IgnoredSeqNumRange {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.start = 0;
        message.end = 0;
        if (value !== undefined)
            reflectionMergePartial<IgnoredSeqNumRange>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IgnoredSeqNumRange): IgnoredSeqNumRange {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.start = reader.int32();
                    break;
                case  2:
                    message.end = reader.int32();
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

export const IgnoredSeqNumRange = /*#__PURE__*/ new IgnoredSeqNumRange$Type();

class MVCCValueHeader$Type extends MessageType<MVCCValueHeader> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCValueHeader", [
            { no: 2, name: "kvnemesis_seq", kind: "message", T: () => MVCCValueHeader_Empty },
            { no: 1, name: "local_timestamp", kind: "message", T: () => Timestamp },
            { no: 3, name: "omit_in_rangefeeds", kind: "scalar", T: 8  },
            { no: 4, name: "import_epoch", kind: "scalar", T: 13  },
            { no: 5, name: "origin_id", kind: "scalar", T: 13  },
            { no: 6, name: "origin_timestamp", kind: "message", T: () => Timestamp }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<MVCCValueHeader>): MVCCValueHeader {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.omitInRangefeeds = false;
        message.importEpoch = 0;
        message.originId = 0;
        if (value !== undefined)
            reflectionMergePartial<MVCCValueHeader>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCValueHeader): MVCCValueHeader {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.kvnemesisSeq = MVCCValueHeader_Empty.internalBinaryRead(reader, reader.uint32(), options, message.kvnemesisSeq);
                    break;
                case  1:
                    message.localTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.localTimestamp);
                    break;
                case  3:
                    message.omitInRangefeeds = reader.bool();
                    break;
                case  4:
                    message.importEpoch = reader.uint32();
                    break;
                case  5:
                    message.originId = reader.uint32();
                    break;
                case  6:
                    message.originTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.originTimestamp);
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

export const MVCCValueHeader = /*#__PURE__*/ new MVCCValueHeader$Type();

class MVCCValueHeader_Empty$Type extends MessageType<MVCCValueHeader_Empty> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCValueHeader.Empty", []);
    }
    create(value?: PartialMessage<MVCCValueHeader_Empty>): MVCCValueHeader_Empty {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MVCCValueHeader_Empty>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCValueHeader_Empty): MVCCValueHeader_Empty {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
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

export const MVCCValueHeader_Empty = /*#__PURE__*/ new MVCCValueHeader_Empty$Type();

class MVCCStatsDelta$Type extends MessageType<MVCCStatsDelta> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCStatsDelta", [
            { no: 14, name: "contains_estimates", kind: "scalar", T: 3 , L: 0  },
            { no: 1, name: "last_update_nanos", kind: "scalar", T: 16 , L: 0  },
            { no: 2, name: "lock_age", kind: "scalar", T: 16 , L: 0  },
            { no: 3, name: "gc_bytes_age", kind: "scalar", T: 16 , L: 0  },
            { no: 4, name: "live_bytes", kind: "scalar", T: 18 , L: 0  },
            { no: 5, name: "live_count", kind: "scalar", T: 18 , L: 0  },
            { no: 6, name: "key_bytes", kind: "scalar", T: 18 , L: 0  },
            { no: 7, name: "key_count", kind: "scalar", T: 18 , L: 0  },
            { no: 8, name: "val_bytes", kind: "scalar", T: 18 , L: 0  },
            { no: 9, name: "val_count", kind: "scalar", T: 18 , L: 0  },
            { no: 10, name: "intent_bytes", kind: "scalar", T: 18 , L: 0  },
            { no: 11, name: "intent_count", kind: "scalar", T: 18 , L: 0  },
            { no: 21, name: "lock_bytes", kind: "scalar", T: 18 , L: 0  },
            { no: 16, name: "lock_count", kind: "scalar", T: 18 , L: 0  },
            { no: 17, name: "range_key_count", kind: "scalar", T: 18 , L: 0  },
            { no: 18, name: "range_key_bytes", kind: "scalar", T: 18 , L: 0  },
            { no: 19, name: "range_val_count", kind: "scalar", T: 18 , L: 0  },
            { no: 20, name: "range_val_bytes", kind: "scalar", T: 18 , L: 0  },
            { no: 12, name: "sys_bytes", kind: "scalar", T: 18 , L: 0  },
            { no: 13, name: "sys_count", kind: "scalar", T: 18 , L: 0  },
            { no: 15, name: "abort_span_bytes", kind: "scalar", T: 18 , L: 0  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<MVCCStatsDelta>): MVCCStatsDelta {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.containsEstimates = 0n;
        message.lastUpdateNanos = 0n;
        message.lockAge = 0n;
        message.gcBytesAge = 0n;
        message.liveBytes = 0n;
        message.liveCount = 0n;
        message.keyBytes = 0n;
        message.keyCount = 0n;
        message.valBytes = 0n;
        message.valCount = 0n;
        message.intentBytes = 0n;
        message.intentCount = 0n;
        message.lockBytes = 0n;
        message.lockCount = 0n;
        message.rangeKeyCount = 0n;
        message.rangeKeyBytes = 0n;
        message.rangeValCount = 0n;
        message.rangeValBytes = 0n;
        message.sysBytes = 0n;
        message.sysCount = 0n;
        message.abortSpanBytes = 0n;
        if (value !== undefined)
            reflectionMergePartial<MVCCStatsDelta>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCStatsDelta): MVCCStatsDelta {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  14:
                    message.containsEstimates = reader.int64().toBigInt();
                    break;
                case  1:
                    message.lastUpdateNanos = reader.sfixed64().toBigInt();
                    break;
                case  2:
                    message.lockAge = reader.sfixed64().toBigInt();
                    break;
                case  3:
                    message.gcBytesAge = reader.sfixed64().toBigInt();
                    break;
                case  4:
                    message.liveBytes = reader.sint64().toBigInt();
                    break;
                case  5:
                    message.liveCount = reader.sint64().toBigInt();
                    break;
                case  6:
                    message.keyBytes = reader.sint64().toBigInt();
                    break;
                case  7:
                    message.keyCount = reader.sint64().toBigInt();
                    break;
                case  8:
                    message.valBytes = reader.sint64().toBigInt();
                    break;
                case  9:
                    message.valCount = reader.sint64().toBigInt();
                    break;
                case  10:
                    message.intentBytes = reader.sint64().toBigInt();
                    break;
                case  11:
                    message.intentCount = reader.sint64().toBigInt();
                    break;
                case  21:
                    message.lockBytes = reader.sint64().toBigInt();
                    break;
                case  16:
                    message.lockCount = reader.sint64().toBigInt();
                    break;
                case  17:
                    message.rangeKeyCount = reader.sint64().toBigInt();
                    break;
                case  18:
                    message.rangeKeyBytes = reader.sint64().toBigInt();
                    break;
                case  19:
                    message.rangeValCount = reader.sint64().toBigInt();
                    break;
                case  20:
                    message.rangeValBytes = reader.sint64().toBigInt();
                    break;
                case  12:
                    message.sysBytes = reader.sint64().toBigInt();
                    break;
                case  13:
                    message.sysCount = reader.sint64().toBigInt();
                    break;
                case  15:
                    message.abortSpanBytes = reader.sint64().toBigInt();
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

export const MVCCStatsDelta = /*#__PURE__*/ new MVCCStatsDelta$Type();

class MVCCWriteValueOp$Type extends MessageType<MVCCWriteValueOp> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCWriteValueOp", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 3, name: "value", kind: "scalar", T: 12  },
            { no: 4, name: "prev_value", kind: "scalar", T: 12  },
            { no: 6, name: "omit_in_rangefeeds", kind: "scalar", T: 8  },
            { no: 5, name: "origin_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<MVCCWriteValueOp>): MVCCWriteValueOp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.value = new Uint8Array(0);
        message.prevValue = new Uint8Array(0);
        message.omitInRangefeeds = false;
        message.originId = 0;
        if (value !== undefined)
            reflectionMergePartial<MVCCWriteValueOp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCWriteValueOp): MVCCWriteValueOp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  3:
                    message.value = reader.bytes();
                    break;
                case  4:
                    message.prevValue = reader.bytes();
                    break;
                case  6:
                    message.omitInRangefeeds = reader.bool();
                    break;
                case  5:
                    message.originId = reader.uint32();
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

export const MVCCWriteValueOp = /*#__PURE__*/ new MVCCWriteValueOp$Type();

class MVCCWriteIntentOp$Type extends MessageType<MVCCWriteIntentOp> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCWriteIntentOp", [
            { no: 1, name: "txn_id", kind: "scalar", T: 12  },
            { no: 2, name: "txn_key", kind: "scalar", T: 12  },
            { no: 5, name: "txn_iso_level", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.isolation.Level", Level] },
            { no: 4, name: "txn_min_timestamp", kind: "message", T: () => Timestamp },
            { no: 3, name: "timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<MVCCWriteIntentOp>): MVCCWriteIntentOp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.txnId = new Uint8Array(0);
        message.txnKey = new Uint8Array(0);
        message.txnIsoLevel = 0;
        if (value !== undefined)
            reflectionMergePartial<MVCCWriteIntentOp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCWriteIntentOp): MVCCWriteIntentOp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.txnId = reader.bytes();
                    break;
                case  2:
                    message.txnKey = reader.bytes();
                    break;
                case  5:
                    message.txnIsoLevel = reader.int32();
                    break;
                case  4:
                    message.txnMinTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.txnMinTimestamp);
                    break;
                case  3:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
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

export const MVCCWriteIntentOp = /*#__PURE__*/ new MVCCWriteIntentOp$Type();

class MVCCUpdateIntentOp$Type extends MessageType<MVCCUpdateIntentOp> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCUpdateIntentOp", [
            { no: 1, name: "txn_id", kind: "scalar", T: 12  },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<MVCCUpdateIntentOp>): MVCCUpdateIntentOp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.txnId = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<MVCCUpdateIntentOp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCUpdateIntentOp): MVCCUpdateIntentOp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.txnId = reader.bytes();
                    break;
                case  2:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
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

export const MVCCUpdateIntentOp = /*#__PURE__*/ new MVCCUpdateIntentOp$Type();

class MVCCCommitIntentOp$Type extends MessageType<MVCCCommitIntentOp> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCCommitIntentOp", [
            { no: 1, name: "txn_id", kind: "scalar", T: 12  },
            { no: 2, name: "key", kind: "scalar", T: 12  },
            { no: 3, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 4, name: "value", kind: "scalar", T: 12  },
            { no: 5, name: "prev_value", kind: "scalar", T: 12  },
            { no: 6, name: "omit_in_rangefeeds", kind: "scalar", T: 8  },
            { no: 7, name: "origin_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<MVCCCommitIntentOp>): MVCCCommitIntentOp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.txnId = new Uint8Array(0);
        message.key = new Uint8Array(0);
        message.value = new Uint8Array(0);
        message.prevValue = new Uint8Array(0);
        message.omitInRangefeeds = false;
        message.originId = 0;
        if (value !== undefined)
            reflectionMergePartial<MVCCCommitIntentOp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCCommitIntentOp): MVCCCommitIntentOp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.txnId = reader.bytes();
                    break;
                case  2:
                    message.key = reader.bytes();
                    break;
                case  3:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  4:
                    message.value = reader.bytes();
                    break;
                case  5:
                    message.prevValue = reader.bytes();
                    break;
                case  6:
                    message.omitInRangefeeds = reader.bool();
                    break;
                case  7:
                    message.originId = reader.uint32();
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

export const MVCCCommitIntentOp = /*#__PURE__*/ new MVCCCommitIntentOp$Type();

class MVCCAbortIntentOp$Type extends MessageType<MVCCAbortIntentOp> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCAbortIntentOp", [
            { no: 1, name: "txn_id", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<MVCCAbortIntentOp>): MVCCAbortIntentOp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.txnId = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<MVCCAbortIntentOp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCAbortIntentOp): MVCCAbortIntentOp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
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

export const MVCCAbortIntentOp = /*#__PURE__*/ new MVCCAbortIntentOp$Type();

class MVCCAbortTxnOp$Type extends MessageType<MVCCAbortTxnOp> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCAbortTxnOp", [
            { no: 1, name: "txn_id", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<MVCCAbortTxnOp>): MVCCAbortTxnOp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.txnId = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<MVCCAbortTxnOp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCAbortTxnOp): MVCCAbortTxnOp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
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

export const MVCCAbortTxnOp = /*#__PURE__*/ new MVCCAbortTxnOp$Type();

class MVCCDeleteRangeOp$Type extends MessageType<MVCCDeleteRangeOp> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCDeleteRangeOp", [
            { no: 1, name: "start_key", kind: "scalar", T: 12  },
            { no: 2, name: "end_key", kind: "scalar", T: 12  },
            { no: 3, name: "timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<MVCCDeleteRangeOp>): MVCCDeleteRangeOp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.startKey = new Uint8Array(0);
        message.endKey = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<MVCCDeleteRangeOp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCDeleteRangeOp): MVCCDeleteRangeOp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.startKey = reader.bytes();
                    break;
                case  2:
                    message.endKey = reader.bytes();
                    break;
                case  3:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
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

export const MVCCDeleteRangeOp = /*#__PURE__*/ new MVCCDeleteRangeOp$Type();

class MVCCLogicalOp$Type extends MessageType<MVCCLogicalOp> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCLogicalOp", [
            { no: 1, name: "write_value", kind: "message", T: () => MVCCWriteValueOp },
            { no: 2, name: "write_intent", kind: "message", T: () => MVCCWriteIntentOp },
            { no: 3, name: "update_intent", kind: "message", T: () => MVCCUpdateIntentOp },
            { no: 4, name: "commit_intent", kind: "message", T: () => MVCCCommitIntentOp },
            { no: 5, name: "abort_intent", kind: "message", T: () => MVCCAbortIntentOp },
            { no: 6, name: "abort_txn", kind: "message", T: () => MVCCAbortTxnOp },
            { no: 7, name: "delete_range", kind: "message", T: () => MVCCDeleteRangeOp }
        ], { "gogoproto.onlyone": true });
    }
    create(value?: PartialMessage<MVCCLogicalOp>): MVCCLogicalOp {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MVCCLogicalOp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCLogicalOp): MVCCLogicalOp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.writeValue = MVCCWriteValueOp.internalBinaryRead(reader, reader.uint32(), options, message.writeValue);
                    break;
                case  2:
                    message.writeIntent = MVCCWriteIntentOp.internalBinaryRead(reader, reader.uint32(), options, message.writeIntent);
                    break;
                case  3:
                    message.updateIntent = MVCCUpdateIntentOp.internalBinaryRead(reader, reader.uint32(), options, message.updateIntent);
                    break;
                case  4:
                    message.commitIntent = MVCCCommitIntentOp.internalBinaryRead(reader, reader.uint32(), options, message.commitIntent);
                    break;
                case  5:
                    message.abortIntent = MVCCAbortIntentOp.internalBinaryRead(reader, reader.uint32(), options, message.abortIntent);
                    break;
                case  6:
                    message.abortTxn = MVCCAbortTxnOp.internalBinaryRead(reader, reader.uint32(), options, message.abortTxn);
                    break;
                case  7:
                    message.deleteRange = MVCCDeleteRangeOp.internalBinaryRead(reader, reader.uint32(), options, message.deleteRange);
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

export const MVCCLogicalOp = /*#__PURE__*/ new MVCCLogicalOp$Type();
