// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { LegacyTimestamp } from "../../util/hlc/legacy_timestamp";
import { TxnMeta } from "./mvcc3";

export interface MVCCMetadata {

    txn?: TxnMeta;

    timestamp?: LegacyTimestamp;

    deleted?: boolean;

    keyBytes?: bigint;

    valBytes?: bigint;

    rawBytes?: Uint8Array;

    intentHistory: MVCCMetadata_SequencedIntent[];

    mergeTimestamp?: LegacyTimestamp;

    txnDidNotUpdateMeta?: boolean;
}

export interface MVCCMetadata_SequencedIntent {

    sequence?: number;

    value?: Uint8Array;
}

export interface MVCCMetadataSubsetForMergeSerialization {

    rawBytes?: Uint8Array;

    mergeTimestamp?: LegacyTimestamp;
}

export interface MVCCStats {

    containsEstimates?: bigint;

    lastUpdateNanos?: bigint;

    lockAge?: bigint;

    gcBytesAge?: bigint;

    liveBytes?: bigint;

    liveCount?: bigint;

    keyBytes?: bigint;

    keyCount?: bigint;

    valBytes?: bigint;

    valCount?: bigint;

    intentBytes?: bigint;

    intentCount?: bigint;

    lockBytes?: bigint;

    lockCount?: bigint;

    rangeKeyCount?: bigint;

    rangeKeyBytes?: bigint;

    rangeValCount?: bigint;

    rangeValBytes?: bigint;

    sysBytes?: bigint;

    sysCount?: bigint;

    abortSpanBytes?: bigint;
}

class MVCCMetadata$Type extends MessageType<MVCCMetadata> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCMetadata", [
            { no: 1, name: "txn", kind: "message", T: () => TxnMeta },
            { no: 2, name: "timestamp", kind: "message", T: () => LegacyTimestamp },
            { no: 3, name: "deleted", kind: "scalar", opt: true, T: 8  },
            { no: 4, name: "key_bytes", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 5, name: "val_bytes", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 6, name: "raw_bytes", kind: "scalar", opt: true, T: 12  },
            { no: 8, name: "intent_history", kind: "message", repeat: 2 , T: () => MVCCMetadata_SequencedIntent },
            { no: 7, name: "merge_timestamp", kind: "message", T: () => LegacyTimestamp },
            { no: 9, name: "txn_did_not_update_meta", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true });
    }
    create(value?: PartialMessage<MVCCMetadata>): MVCCMetadata {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.intentHistory = [];
        if (value !== undefined)
            reflectionMergePartial<MVCCMetadata>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCMetadata): MVCCMetadata {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.txn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  2:
                    message.timestamp = LegacyTimestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  3:
                    message.deleted = reader.bool();
                    break;
                case  4:
                    message.keyBytes = reader.int64().toBigInt();
                    break;
                case  5:
                    message.valBytes = reader.int64().toBigInt();
                    break;
                case  6:
                    message.rawBytes = reader.bytes();
                    break;
                case  8:
                    message.intentHistory.push(MVCCMetadata_SequencedIntent.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.mergeTimestamp = LegacyTimestamp.internalBinaryRead(reader, reader.uint32(), options, message.mergeTimestamp);
                    break;
                case  9:
                    message.txnDidNotUpdateMeta = reader.bool();
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

export const MVCCMetadata = /*#__PURE__*/ new MVCCMetadata$Type();

class MVCCMetadata_SequencedIntent$Type extends MessageType<MVCCMetadata_SequencedIntent> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCMetadata.SequencedIntent", [
            { no: 1, name: "sequence", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "value", kind: "scalar", opt: true, T: 12  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<MVCCMetadata_SequencedIntent>): MVCCMetadata_SequencedIntent {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MVCCMetadata_SequencedIntent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCMetadata_SequencedIntent): MVCCMetadata_SequencedIntent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.sequence = reader.int32();
                    break;
                case  2:
                    message.value = reader.bytes();
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

export const MVCCMetadata_SequencedIntent = /*#__PURE__*/ new MVCCMetadata_SequencedIntent$Type();

class MVCCMetadataSubsetForMergeSerialization$Type extends MessageType<MVCCMetadataSubsetForMergeSerialization> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCMetadataSubsetForMergeSerialization", [
            { no: 6, name: "raw_bytes", kind: "scalar", opt: true, T: 12  },
            { no: 7, name: "merge_timestamp", kind: "message", T: () => LegacyTimestamp }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<MVCCMetadataSubsetForMergeSerialization>): MVCCMetadataSubsetForMergeSerialization {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MVCCMetadataSubsetForMergeSerialization>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCMetadataSubsetForMergeSerialization): MVCCMetadataSubsetForMergeSerialization {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  6:
                    message.rawBytes = reader.bytes();
                    break;
                case  7:
                    message.mergeTimestamp = LegacyTimestamp.internalBinaryRead(reader, reader.uint32(), options, message.mergeTimestamp);
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

export const MVCCMetadataSubsetForMergeSerialization = /*#__PURE__*/ new MVCCMetadataSubsetForMergeSerialization$Type();

class MVCCStats$Type extends MessageType<MVCCStats> {
    constructor() {
        super("cockroach.storage.enginepb.MVCCStats", [
            { no: 14, name: "contains_estimates", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 1, name: "last_update_nanos", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 2, name: "lock_age", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 3, name: "gc_bytes_age", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 4, name: "live_bytes", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 5, name: "live_count", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 6, name: "key_bytes", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 7, name: "key_count", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 8, name: "val_bytes", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 9, name: "val_count", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 10, name: "intent_bytes", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 11, name: "intent_count", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 21, name: "lock_bytes", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 16, name: "lock_count", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 17, name: "range_key_count", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 18, name: "range_key_bytes", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 19, name: "range_val_count", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 20, name: "range_val_bytes", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 12, name: "sys_bytes", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 13, name: "sys_count", kind: "scalar", opt: true, T: 16 , L: 0  },
            { no: 15, name: "abort_span_bytes", kind: "scalar", opt: true, T: 16 , L: 0  }
        ], { "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<MVCCStats>): MVCCStats {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MVCCStats>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCStats): MVCCStats {
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
                    message.liveBytes = reader.sfixed64().toBigInt();
                    break;
                case  5:
                    message.liveCount = reader.sfixed64().toBigInt();
                    break;
                case  6:
                    message.keyBytes = reader.sfixed64().toBigInt();
                    break;
                case  7:
                    message.keyCount = reader.sfixed64().toBigInt();
                    break;
                case  8:
                    message.valBytes = reader.sfixed64().toBigInt();
                    break;
                case  9:
                    message.valCount = reader.sfixed64().toBigInt();
                    break;
                case  10:
                    message.intentBytes = reader.sfixed64().toBigInt();
                    break;
                case  11:
                    message.intentCount = reader.sfixed64().toBigInt();
                    break;
                case  21:
                    message.lockBytes = reader.sfixed64().toBigInt();
                    break;
                case  16:
                    message.lockCount = reader.sfixed64().toBigInt();
                    break;
                case  17:
                    message.rangeKeyCount = reader.sfixed64().toBigInt();
                    break;
                case  18:
                    message.rangeKeyBytes = reader.sfixed64().toBigInt();
                    break;
                case  19:
                    message.rangeValCount = reader.sfixed64().toBigInt();
                    break;
                case  20:
                    message.rangeValBytes = reader.sfixed64().toBigInt();
                    break;
                case  12:
                    message.sysBytes = reader.sfixed64().toBigInt();
                    break;
                case  13:
                    message.sysCount = reader.sfixed64().toBigInt();
                    break;
                case  15:
                    message.abortSpanBytes = reader.sfixed64().toBigInt();
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

export const MVCCStats = /*#__PURE__*/ new MVCCStats$Type();
