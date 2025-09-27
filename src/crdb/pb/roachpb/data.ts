// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Waiter } from "../kv/kvserver/concurrency/lock/lock_waiter";
import { Duration } from "../google/protobuf/duration";
import { Durability } from "../kv/kvserver/concurrency/lock/locking";
import { Strength } from "../kv/kvserver/concurrency/lock/locking";
import { IgnoredSeqNumRange } from "../storage/enginepb/mvcc3";
import { TxnMeta } from "../storage/enginepb/mvcc3";
import { ReplicaDescriptor } from "./metadata";
import { ReadSummary } from "../kv/kvserver/readsummary/rspb/summary";
import { MVCCStats } from "../storage/enginepb/mvcc";
import { RangeDescriptor } from "./metadata";
import { Timestamp } from "../util/hlc/timestamp";

export interface Span {

    key: Uint8Array;

    endKey: Uint8Array;
}

export interface Value {

    rawBytes: Uint8Array;

    timestamp?: Timestamp;
}

export interface KeyValue {

    key: Uint8Array;

    value?: Value;
}

export interface StoreIdent {

    clusterId: Uint8Array;

    nodeId: number;

    storeId: number;
}

export interface SplitTrigger {

    leftDesc?: RangeDescriptor;

    rightDesc?: RangeDescriptor;

    preSplitLeftUserStats?: MVCCStats;

    preSplitStats?: MVCCStats;

    useEstimatesBecauseExternalBytesArePresent: boolean;

    manualSplit: boolean;
}

export interface MergeTrigger {

    leftDesc?: RangeDescriptor;

    rightDesc?: RangeDescriptor;

    rightMvccStats?: MVCCStats;

    rightRangeIdLocalMvccStats?: MVCCStats;

    freezeStart?: Timestamp;

    rightClosedTimestamp?: Timestamp;

    rightReadSummary?: ReadSummary;

    writeGcHint: boolean;
}

export interface ChangeReplicasTrigger {

    desc?: RangeDescriptor;

    internalAddedReplicas: ReplicaDescriptor[];

    internalRemovedReplicas: ReplicaDescriptor[];
}

export interface ModifiedSpanTrigger {

    nodeLivenessSpan?: Span;
}

export interface StickyBitTrigger {

    stickyBit?: Timestamp;
}

export interface InternalCommitTrigger {

    splitTrigger?: SplitTrigger;

    mergeTrigger?: MergeTrigger;

    changeReplicasTrigger?: ChangeReplicasTrigger;

    modifiedSpanTrigger?: ModifiedSpanTrigger;

    stickyBitTrigger?: StickyBitTrigger;
}

export interface ObservedTimestamp {

    nodeId: number;

    timestamp?: Timestamp;
}

export interface Transaction {

    meta?: TxnMeta;

    name: string;

    status: TransactionStatus;

    lastHeartbeat?: Timestamp;

    readTimestamp?: Timestamp;

    readTimestampFixed: boolean;

    globalUncertaintyLimit?: Timestamp;

    observedTimestamps: ObservedTimestamp[];

    lockSpans: Span[];

    inFlightWrites: SequencedWrite[];

    ignoredSeqnums: IgnoredSeqNumRange[];

    admissionPriority: number;

    omitInRangefeeds: boolean;
}

export interface TransactionRecord {

    meta?: TxnMeta;

    status: TransactionStatus;

    lastHeartbeat?: Timestamp;

    lockSpans: Span[];

    inFlightWrites: SequencedWrite[];

    ignoredSeqnums: IgnoredSeqNumRange[];
}

export interface Lock {

    singleKeySpan?: Lock_SingleKeySpan;

    txn?: TxnMeta;

    strength: Strength;
}

export interface Lock_SingleKeySpan {

    key: Uint8Array;
}

export interface LockAcquisition {

    span?: Span;

    txn?: TxnMeta;

    durability: Durability;

    strength: Strength;

    ignoredSeqnums: IgnoredSeqNumRange[];
}

export interface LockUpdate {

    span?: Span;

    txn?: TxnMeta;

    status: TransactionStatus;

    ignoredSeqnums: IgnoredSeqNumRange[];

    clockWhilePending?: ObservedTimestamp;
}

export interface LockStateInfo {

    rangeId: bigint;

    key: Uint8Array;

    lockHolder?: TxnMeta;

    durability: Durability;

    holdDuration?: Duration;

    waiters: Waiter[];

    lockStrength: Strength;
}

export interface SequencedWrite {

    key: Uint8Array;

    sequence: number;

    strength: Strength;
}

export interface Lease {

    start?: Timestamp;

    expiration?: Timestamp;

    replica?: ReplicaDescriptor;

    deprecatedStartStasis?: Timestamp;

    proposedTs?: Timestamp;

    epoch: bigint;

    sequence: bigint;

    acquisitionType: LeaseAcquisitionType;

    minExpiration?: Timestamp;

    term: bigint;
}

export interface AbortSpanEntry {

    key: Uint8Array;

    timestamp?: Timestamp;

    priority: number;
}

export interface BufferedWrite {

    id: bigint;

    key: Uint8Array;

    vals: BufferedWrite_Val[];
}

export interface BufferedWrite_Val {

    val?: Value;

    seq: number;
}

export interface LeafTxnInputState {

    txn?: Transaction;

    refreshInvalid: boolean;

    inFlightWrites: SequencedWrite[];

    steppingModeEnabled: boolean;

    readSeqNum: number;

    bufferedWrites: BufferedWrite[];
}

export interface LeafTxnFinalState {

    txn?: Transaction;

    refreshSpans: Span[];

    refreshInvalid: boolean;
}

export interface ClientRangeInfo {

    descriptorGeneration: bigint;

    leaseSequence: bigint;

    closedTimestampPolicy: RangeClosedTimestampPolicy;

    explicitlyRequested: boolean;
}

export interface RangeInfo {

    desc?: RangeDescriptor;

    lease?: Lease;

    closedTimestampPolicy: RangeClosedTimestampPolicy;
}

export interface TenantID {

    id: bigint;
}

export interface RowCount {

    dataSize: bigint;

    rows: bigint;

    indexEntries: bigint;
}

export enum ValueType {

    UNKNOWN = 0,

    INT = 1,

    FLOAT = 2,

    BYTES = 3,

    TIME = 4,

    DECIMAL = 5,

    DURATION = 6,

    TIMETZ = 12,

    GEO = 13,

    BOX2D = 14,

    TUPLE = 10,

    BITARRAY = 11,

    TIMESERIES = 100,

    MVCC_EXTENDED_ENCODING_SENTINEL = 101
}

export enum ReplicaChangeType {

    ADD_VOTER = 0,

    REMOVE_VOTER = 1,

    ADD_NON_VOTER = 2,

    REMOVE_NON_VOTER = 3
}

export enum TransactionStatus {

    PENDING = 0,

    PREPARED = 4,

    STAGING = 3,

    COMMITTED = 1,

    ABORTED = 2
}

export enum LeaseAcquisitionType {

    Unspecified = 0,

    Transfer = 1,

    Request = 2
}

export enum RangeClosedTimestampPolicy {

    LAG_BY_CLUSTER_SETTING = 0,

    LEAD_FOR_GLOBAL_READS = 1,

    MAX_CLOSED_TIMESTAMP_POLICY = 2
}

class Span$Type extends MessageType<Span> {
    constructor() {
        super("cockroach.roachpb.Span", [
            { no: 3, name: "key", kind: "scalar", T: 12  },
            { no: 4, name: "end_key", kind: "scalar", T: 12  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true });
    }
    create(value?: PartialMessage<Span>): Span {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.endKey = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<Span>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Span): Span {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  3:
                    message.key = reader.bytes();
                    break;
                case  4:
                    message.endKey = reader.bytes();
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

export const Span = /*#__PURE__*/ new Span$Type();

class Value$Type extends MessageType<Value> {
    constructor() {
        super("cockroach.roachpb.Value", [
            { no: 1, name: "raw_bytes", kind: "scalar", T: 12  },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<Value>): Value {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rawBytes = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<Value>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Value): Value {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rawBytes = reader.bytes();
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

export const Value = /*#__PURE__*/ new Value$Type();

class KeyValue$Type extends MessageType<KeyValue> {
    constructor() {
        super("cockroach.roachpb.KeyValue", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "value", kind: "message", T: () => Value }
        ]);
    }
    create(value?: PartialMessage<KeyValue>): KeyValue {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<KeyValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: KeyValue): KeyValue {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.value = Value.internalBinaryRead(reader, reader.uint32(), options, message.value);
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

export const KeyValue = /*#__PURE__*/ new KeyValue$Type();

class StoreIdent$Type extends MessageType<StoreIdent> {
    constructor() {
        super("cockroach.roachpb.StoreIdent", [
            { no: 1, name: "cluster_id", kind: "scalar", T: 12  },
            { no: 2, name: "node_id", kind: "scalar", T: 5  },
            { no: 3, name: "store_id", kind: "scalar", T: 5  }
        ]);
    }
    create(value?: PartialMessage<StoreIdent>): StoreIdent {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.clusterId = new Uint8Array(0);
        message.nodeId = 0;
        message.storeId = 0;
        if (value !== undefined)
            reflectionMergePartial<StoreIdent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StoreIdent): StoreIdent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.clusterId = reader.bytes();
                    break;
                case  2:
                    message.nodeId = reader.int32();
                    break;
                case  3:
                    message.storeId = reader.int32();
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

export const StoreIdent = /*#__PURE__*/ new StoreIdent$Type();

class SplitTrigger$Type extends MessageType<SplitTrigger> {
    constructor() {
        super("cockroach.roachpb.SplitTrigger", [
            { no: 1, name: "left_desc", kind: "message", T: () => RangeDescriptor },
            { no: 2, name: "right_desc", kind: "message", T: () => RangeDescriptor },
            { no: 5, name: "pre_split_left_user_stats", kind: "message", T: () => MVCCStats },
            { no: 6, name: "pre_split_stats", kind: "message", T: () => MVCCStats },
            { no: 7, name: "use_estimates_because_external_bytes_are_present", kind: "scalar", T: 8  },
            { no: 8, name: "manualSplit", kind: "scalar", T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SplitTrigger>): SplitTrigger {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.useEstimatesBecauseExternalBytesArePresent = false;
        message.manualSplit = false;
        if (value !== undefined)
            reflectionMergePartial<SplitTrigger>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SplitTrigger): SplitTrigger {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.leftDesc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.leftDesc);
                    break;
                case  2:
                    message.rightDesc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.rightDesc);
                    break;
                case  5:
                    message.preSplitLeftUserStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.preSplitLeftUserStats);
                    break;
                case  6:
                    message.preSplitStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.preSplitStats);
                    break;
                case  7:
                    message.useEstimatesBecauseExternalBytesArePresent = reader.bool();
                    break;
                case  8:
                    message.manualSplit = reader.bool();
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

export const SplitTrigger = /*#__PURE__*/ new SplitTrigger$Type();

class MergeTrigger$Type extends MessageType<MergeTrigger> {
    constructor() {
        super("cockroach.roachpb.MergeTrigger", [
            { no: 1, name: "left_desc", kind: "message", T: () => RangeDescriptor },
            { no: 2, name: "right_desc", kind: "message", T: () => RangeDescriptor },
            { no: 4, name: "right_mvcc_stats", kind: "message", T: () => MVCCStats },
            { no: 9, name: "right_range_id_local_mvcc_stats", kind: "message", T: () => MVCCStats },
            { no: 5, name: "freeze_start", kind: "message", T: () => Timestamp },
            { no: 6, name: "right_closed_timestamp", kind: "message", T: () => Timestamp },
            { no: 7, name: "right_read_summary", kind: "message", T: () => ReadSummary },
            { no: 8, name: "write_gc_hint", kind: "scalar", T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<MergeTrigger>): MergeTrigger {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.writeGcHint = false;
        if (value !== undefined)
            reflectionMergePartial<MergeTrigger>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MergeTrigger): MergeTrigger {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.leftDesc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.leftDesc);
                    break;
                case  2:
                    message.rightDesc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.rightDesc);
                    break;
                case  4:
                    message.rightMvccStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.rightMvccStats);
                    break;
                case  9:
                    message.rightRangeIdLocalMvccStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.rightRangeIdLocalMvccStats);
                    break;
                case  5:
                    message.freezeStart = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.freezeStart);
                    break;
                case  6:
                    message.rightClosedTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.rightClosedTimestamp);
                    break;
                case  7:
                    message.rightReadSummary = ReadSummary.internalBinaryRead(reader, reader.uint32(), options, message.rightReadSummary);
                    break;
                case  8:
                    message.writeGcHint = reader.bool();
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

export const MergeTrigger = /*#__PURE__*/ new MergeTrigger$Type();

class ChangeReplicasTrigger$Type extends MessageType<ChangeReplicasTrigger> {
    constructor() {
        super("cockroach.roachpb.ChangeReplicasTrigger", [
            { no: 5, name: "desc", kind: "message", T: () => RangeDescriptor },
            { no: 6, name: "internal_added_replicas", kind: "message", repeat: 2 , T: () => ReplicaDescriptor },
            { no: 7, name: "internal_removed_replicas", kind: "message", repeat: 2 , T: () => ReplicaDescriptor }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<ChangeReplicasTrigger>): ChangeReplicasTrigger {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.internalAddedReplicas = [];
        message.internalRemovedReplicas = [];
        if (value !== undefined)
            reflectionMergePartial<ChangeReplicasTrigger>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ChangeReplicasTrigger): ChangeReplicasTrigger {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  5:
                    message.desc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.desc);
                    break;
                case  6:
                    message.internalAddedReplicas.push(ReplicaDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.internalRemovedReplicas.push(ReplicaDescriptor.internalBinaryRead(reader, reader.uint32(), options));
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

export const ChangeReplicasTrigger = /*#__PURE__*/ new ChangeReplicasTrigger$Type();

class ModifiedSpanTrigger$Type extends MessageType<ModifiedSpanTrigger> {
    constructor() {
        super("cockroach.roachpb.ModifiedSpanTrigger", [
            { no: 2, name: "node_liveness_span", kind: "message", T: () => Span }
        ]);
    }
    create(value?: PartialMessage<ModifiedSpanTrigger>): ModifiedSpanTrigger {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ModifiedSpanTrigger>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ModifiedSpanTrigger): ModifiedSpanTrigger {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.nodeLivenessSpan = Span.internalBinaryRead(reader, reader.uint32(), options, message.nodeLivenessSpan);
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

export const ModifiedSpanTrigger = /*#__PURE__*/ new ModifiedSpanTrigger$Type();

class StickyBitTrigger$Type extends MessageType<StickyBitTrigger> {
    constructor() {
        super("cockroach.roachpb.StickyBitTrigger", [
            { no: 1, name: "sticky_bit", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<StickyBitTrigger>): StickyBitTrigger {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<StickyBitTrigger>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StickyBitTrigger): StickyBitTrigger {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.stickyBit = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.stickyBit);
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

export const StickyBitTrigger = /*#__PURE__*/ new StickyBitTrigger$Type();

class InternalCommitTrigger$Type extends MessageType<InternalCommitTrigger> {
    constructor() {
        super("cockroach.roachpb.InternalCommitTrigger", [
            { no: 1, name: "split_trigger", kind: "message", T: () => SplitTrigger },
            { no: 2, name: "merge_trigger", kind: "message", T: () => MergeTrigger },
            { no: 3, name: "change_replicas_trigger", kind: "message", T: () => ChangeReplicasTrigger },
            { no: 4, name: "modified_span_trigger", kind: "message", T: () => ModifiedSpanTrigger },
            { no: 5, name: "sticky_bit_trigger", kind: "message", T: () => StickyBitTrigger }
        ], { "gogoproto.goproto_getters": true });
    }
    create(value?: PartialMessage<InternalCommitTrigger>): InternalCommitTrigger {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<InternalCommitTrigger>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InternalCommitTrigger): InternalCommitTrigger {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.splitTrigger = SplitTrigger.internalBinaryRead(reader, reader.uint32(), options, message.splitTrigger);
                    break;
                case  2:
                    message.mergeTrigger = MergeTrigger.internalBinaryRead(reader, reader.uint32(), options, message.mergeTrigger);
                    break;
                case  3:
                    message.changeReplicasTrigger = ChangeReplicasTrigger.internalBinaryRead(reader, reader.uint32(), options, message.changeReplicasTrigger);
                    break;
                case  4:
                    message.modifiedSpanTrigger = ModifiedSpanTrigger.internalBinaryRead(reader, reader.uint32(), options, message.modifiedSpanTrigger);
                    break;
                case  5:
                    message.stickyBitTrigger = StickyBitTrigger.internalBinaryRead(reader, reader.uint32(), options, message.stickyBitTrigger);
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

export const InternalCommitTrigger = /*#__PURE__*/ new InternalCommitTrigger$Type();

class ObservedTimestamp$Type extends MessageType<ObservedTimestamp> {
    constructor() {
        super("cockroach.roachpb.ObservedTimestamp", [
            { no: 1, name: "node_id", kind: "scalar", T: 5  },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp }
        ], { "gogoproto.populate": true });
    }
    create(value?: PartialMessage<ObservedTimestamp>): ObservedTimestamp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.nodeId = 0;
        if (value !== undefined)
            reflectionMergePartial<ObservedTimestamp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ObservedTimestamp): ObservedTimestamp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.nodeId = reader.int32();
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

export const ObservedTimestamp = /*#__PURE__*/ new ObservedTimestamp$Type();

class Transaction$Type extends MessageType<Transaction> {
    constructor() {
        super("cockroach.roachpb.Transaction", [
            { no: 1, name: "meta", kind: "message", T: () => TxnMeta },
            { no: 2, name: "name", kind: "scalar", T: 9  },
            { no: 4, name: "status", kind: "enum", T: () => ["cockroach.roachpb.TransactionStatus", TransactionStatus] },
            { no: 5, name: "last_heartbeat", kind: "message", T: () => Timestamp },
            { no: 15, name: "read_timestamp", kind: "message", T: () => Timestamp },
            { no: 16, name: "read_timestamp_fixed", kind: "scalar", T: 8  },
            { no: 7, name: "global_uncertainty_limit", kind: "message", T: () => Timestamp },
            { no: 8, name: "observed_timestamps", kind: "message", repeat: 2 , T: () => ObservedTimestamp },
            { no: 11, name: "lock_spans", kind: "message", repeat: 2 , T: () => Span },
            { no: 17, name: "in_flight_writes", kind: "message", repeat: 2 , T: () => SequencedWrite },
            { no: 18, name: "ignored_seqnums", kind: "message", repeat: 2 , T: () => IgnoredSeqNumRange },
            { no: 19, name: "admission_priority", kind: "scalar", T: 17  },
            { no: 20, name: "omit_in_rangefeeds", kind: "scalar", T: 8  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true });
    }
    create(value?: PartialMessage<Transaction>): Transaction {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        message.status = 0;
        message.readTimestampFixed = false;
        message.observedTimestamps = [];
        message.lockSpans = [];
        message.inFlightWrites = [];
        message.ignoredSeqnums = [];
        message.admissionPriority = 0;
        message.omitInRangefeeds = false;
        if (value !== undefined)
            reflectionMergePartial<Transaction>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Transaction): Transaction {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.meta = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.meta);
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  4:
                    message.status = reader.int32();
                    break;
                case  5:
                    message.lastHeartbeat = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.lastHeartbeat);
                    break;
                case  15:
                    message.readTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.readTimestamp);
                    break;
                case  16:
                    message.readTimestampFixed = reader.bool();
                    break;
                case  7:
                    message.globalUncertaintyLimit = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.globalUncertaintyLimit);
                    break;
                case  8:
                    message.observedTimestamps.push(ObservedTimestamp.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  11:
                    message.lockSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  17:
                    message.inFlightWrites.push(SequencedWrite.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  18:
                    message.ignoredSeqnums.push(IgnoredSeqNumRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  19:
                    message.admissionPriority = reader.sint32();
                    break;
                case  20:
                    message.omitInRangefeeds = reader.bool();
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

export const Transaction = /*#__PURE__*/ new Transaction$Type();

class TransactionRecord$Type extends MessageType<TransactionRecord> {
    constructor() {
        super("cockroach.roachpb.TransactionRecord", [
            { no: 1, name: "meta", kind: "message", T: () => TxnMeta },
            { no: 4, name: "status", kind: "enum", T: () => ["cockroach.roachpb.TransactionStatus", TransactionStatus] },
            { no: 5, name: "last_heartbeat", kind: "message", T: () => Timestamp },
            { no: 11, name: "lock_spans", kind: "message", repeat: 2 , T: () => Span },
            { no: 17, name: "in_flight_writes", kind: "message", repeat: 2 , T: () => SequencedWrite },
            { no: 18, name: "ignored_seqnums", kind: "message", repeat: 2 , T: () => IgnoredSeqNumRange }
        ], { "gogoproto.populate": true });
    }
    create(value?: PartialMessage<TransactionRecord>): TransactionRecord {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.status = 0;
        message.lockSpans = [];
        message.inFlightWrites = [];
        message.ignoredSeqnums = [];
        if (value !== undefined)
            reflectionMergePartial<TransactionRecord>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransactionRecord): TransactionRecord {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.meta = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.meta);
                    break;
                case  4:
                    message.status = reader.int32();
                    break;
                case  5:
                    message.lastHeartbeat = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.lastHeartbeat);
                    break;
                case  11:
                    message.lockSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  17:
                    message.inFlightWrites.push(SequencedWrite.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  18:
                    message.ignoredSeqnums.push(IgnoredSeqNumRange.internalBinaryRead(reader, reader.uint32(), options));
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

export const TransactionRecord = /*#__PURE__*/ new TransactionRecord$Type();

class Lock$Type extends MessageType<Lock> {
    constructor() {
        super("cockroach.roachpb.Lock", [
            { no: 1, name: "single_key_span", kind: "message", T: () => Lock_SingleKeySpan },
            { no: 2, name: "txn", kind: "message", T: () => TxnMeta },
            { no: 3, name: "strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] }
        ]);
    }
    create(value?: PartialMessage<Lock>): Lock {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.strength = 0;
        if (value !== undefined)
            reflectionMergePartial<Lock>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Lock): Lock {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.singleKeySpan = Lock_SingleKeySpan.internalBinaryRead(reader, reader.uint32(), options, message.singleKeySpan);
                    break;
                case  2:
                    message.txn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  3:
                    message.strength = reader.int32();
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

export const Lock = /*#__PURE__*/ new Lock$Type();

class Lock_SingleKeySpan$Type extends MessageType<Lock_SingleKeySpan> {
    constructor() {
        super("cockroach.roachpb.Lock.SingleKeySpan", [
            { no: 3, name: "key", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<Lock_SingleKeySpan>): Lock_SingleKeySpan {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<Lock_SingleKeySpan>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Lock_SingleKeySpan): Lock_SingleKeySpan {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  3:
                    message.key = reader.bytes();
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

export const Lock_SingleKeySpan = /*#__PURE__*/ new Lock_SingleKeySpan$Type();

class LockAcquisition$Type extends MessageType<LockAcquisition> {
    constructor() {
        super("cockroach.roachpb.LockAcquisition", [
            { no: 1, name: "span", kind: "message", T: () => Span },
            { no: 2, name: "txn", kind: "message", T: () => TxnMeta },
            { no: 3, name: "durability", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Durability", Durability] },
            { no: 4, name: "strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] },
            { no: 5, name: "ignored_seqnums", kind: "message", repeat: 2 , T: () => IgnoredSeqNumRange }
        ]);
    }
    create(value?: PartialMessage<LockAcquisition>): LockAcquisition {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.durability = 0;
        message.strength = 0;
        message.ignoredSeqnums = [];
        if (value !== undefined)
            reflectionMergePartial<LockAcquisition>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LockAcquisition): LockAcquisition {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
                    break;
                case  2:
                    message.txn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  3:
                    message.durability = reader.int32();
                    break;
                case  4:
                    message.strength = reader.int32();
                    break;
                case  5:
                    message.ignoredSeqnums.push(IgnoredSeqNumRange.internalBinaryRead(reader, reader.uint32(), options));
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

export const LockAcquisition = /*#__PURE__*/ new LockAcquisition$Type();

class LockUpdate$Type extends MessageType<LockUpdate> {
    constructor() {
        super("cockroach.roachpb.LockUpdate", [
            { no: 1, name: "span", kind: "message", T: () => Span },
            { no: 2, name: "txn", kind: "message", T: () => TxnMeta },
            { no: 3, name: "status", kind: "enum", T: () => ["cockroach.roachpb.TransactionStatus", TransactionStatus] },
            { no: 4, name: "ignored_seqnums", kind: "message", repeat: 2 , T: () => IgnoredSeqNumRange },
            { no: 5, name: "clock_while_pending", kind: "message", T: () => ObservedTimestamp }
        ]);
    }
    create(value?: PartialMessage<LockUpdate>): LockUpdate {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.status = 0;
        message.ignoredSeqnums = [];
        if (value !== undefined)
            reflectionMergePartial<LockUpdate>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LockUpdate): LockUpdate {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
                    break;
                case  2:
                    message.txn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  3:
                    message.status = reader.int32();
                    break;
                case  4:
                    message.ignoredSeqnums.push(IgnoredSeqNumRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    message.clockWhilePending = ObservedTimestamp.internalBinaryRead(reader, reader.uint32(), options, message.clockWhilePending);
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

export const LockUpdate = /*#__PURE__*/ new LockUpdate$Type();

class LockStateInfo$Type extends MessageType<LockStateInfo> {
    constructor() {
        super("cockroach.roachpb.LockStateInfo", [
            { no: 1, name: "range_id", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "key", kind: "scalar", T: 12  },
            { no: 3, name: "lock_holder", kind: "message", T: () => TxnMeta },
            { no: 4, name: "durability", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Durability", Durability] },
            { no: 5, name: "hold_duration", kind: "message", T: () => Duration },
            { no: 6, name: "waiters", kind: "message", repeat: 2 , T: () => Waiter },
            { no: 7, name: "lock_strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<LockStateInfo>): LockStateInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rangeId = 0n;
        message.key = new Uint8Array(0);
        message.durability = 0;
        message.waiters = [];
        message.lockStrength = 0;
        if (value !== undefined)
            reflectionMergePartial<LockStateInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LockStateInfo): LockStateInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rangeId = reader.int64().toBigInt();
                    break;
                case  2:
                    message.key = reader.bytes();
                    break;
                case  3:
                    message.lockHolder = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.lockHolder);
                    break;
                case  4:
                    message.durability = reader.int32();
                    break;
                case  5:
                    message.holdDuration = Duration.internalBinaryRead(reader, reader.uint32(), options, message.holdDuration);
                    break;
                case  6:
                    message.waiters.push(Waiter.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.lockStrength = reader.int32();
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

export const LockStateInfo = /*#__PURE__*/ new LockStateInfo$Type();

class SequencedWrite$Type extends MessageType<SequencedWrite> {
    constructor() {
        super("cockroach.roachpb.SequencedWrite", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "sequence", kind: "scalar", T: 5  },
            { no: 3, name: "strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] }
        ], { "gogoproto.populate": true });
    }
    create(value?: PartialMessage<SequencedWrite>): SequencedWrite {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.sequence = 0;
        message.strength = 0;
        if (value !== undefined)
            reflectionMergePartial<SequencedWrite>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SequencedWrite): SequencedWrite {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.sequence = reader.int32();
                    break;
                case  3:
                    message.strength = reader.int32();
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

export const SequencedWrite = /*#__PURE__*/ new SequencedWrite$Type();

class Lease$Type extends MessageType<Lease> {
    constructor() {
        super("cockroach.roachpb.Lease", [
            { no: 1, name: "start", kind: "message", T: () => Timestamp },
            { no: 2, name: "expiration", kind: "message", T: () => Timestamp },
            { no: 3, name: "replica", kind: "message", T: () => ReplicaDescriptor },
            { no: 4, name: "deprecated_start_stasis", kind: "message", T: () => Timestamp },
            { no: 5, name: "proposed_ts", kind: "message", T: () => Timestamp },
            { no: 6, name: "epoch", kind: "scalar", T: 3 , L: 0  },
            { no: 7, name: "sequence", kind: "scalar", T: 4 , L: 0  },
            { no: 8, name: "acquisition_type", kind: "enum", T: () => ["cockroach.roachpb.LeaseAcquisitionType", LeaseAcquisitionType] },
            { no: 9, name: "min_expiration", kind: "message", T: () => Timestamp },
            { no: 10, name: "term", kind: "scalar", T: 4 , L: 0  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true });
    }
    create(value?: PartialMessage<Lease>): Lease {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.epoch = 0n;
        message.sequence = 0n;
        message.acquisitionType = 0;
        message.term = 0n;
        if (value !== undefined)
            reflectionMergePartial<Lease>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Lease): Lease {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.start = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.start);
                    break;
                case  2:
                    message.expiration = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.expiration);
                    break;
                case  3:
                    message.replica = ReplicaDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.replica);
                    break;
                case  4:
                    message.deprecatedStartStasis = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.deprecatedStartStasis);
                    break;
                case  5:
                    message.proposedTs = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.proposedTs);
                    break;
                case  6:
                    message.epoch = reader.int64().toBigInt();
                    break;
                case  7:
                    message.sequence = reader.uint64().toBigInt();
                    break;
                case  8:
                    message.acquisitionType = reader.int32();
                    break;
                case  9:
                    message.minExpiration = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.minExpiration);
                    break;
                case  10:
                    message.term = reader.uint64().toBigInt();
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

export const Lease = /*#__PURE__*/ new Lease$Type();

class AbortSpanEntry$Type extends MessageType<AbortSpanEntry> {
    constructor() {
        super("cockroach.roachpb.AbortSpanEntry", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 3, name: "priority", kind: "scalar", T: 5  }
        ], { "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<AbortSpanEntry>): AbortSpanEntry {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.priority = 0;
        if (value !== undefined)
            reflectionMergePartial<AbortSpanEntry>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AbortSpanEntry): AbortSpanEntry {
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
                    message.priority = reader.int32();
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

export const AbortSpanEntry = /*#__PURE__*/ new AbortSpanEntry$Type();

class BufferedWrite$Type extends MessageType<BufferedWrite> {
    constructor() {
        super("cockroach.roachpb.BufferedWrite", [
            { no: 1, name: "id", kind: "scalar", T: 4 , L: 0  },
            { no: 2, name: "key", kind: "scalar", T: 12  },
            { no: 3, name: "vals", kind: "message", repeat: 2 , T: () => BufferedWrite_Val }
        ]);
    }
    create(value?: PartialMessage<BufferedWrite>): BufferedWrite {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0n;
        message.key = new Uint8Array(0);
        message.vals = [];
        if (value !== undefined)
            reflectionMergePartial<BufferedWrite>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BufferedWrite): BufferedWrite {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint64().toBigInt();
                    break;
                case  2:
                    message.key = reader.bytes();
                    break;
                case  3:
                    message.vals.push(BufferedWrite_Val.internalBinaryRead(reader, reader.uint32(), options));
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

export const BufferedWrite = /*#__PURE__*/ new BufferedWrite$Type();

class BufferedWrite_Val$Type extends MessageType<BufferedWrite_Val> {
    constructor() {
        super("cockroach.roachpb.BufferedWrite.Val", [
            { no: 1, name: "val", kind: "message", T: () => Value },
            { no: 2, name: "seq", kind: "scalar", T: 5  }
        ]);
    }
    create(value?: PartialMessage<BufferedWrite_Val>): BufferedWrite_Val {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.seq = 0;
        if (value !== undefined)
            reflectionMergePartial<BufferedWrite_Val>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BufferedWrite_Val): BufferedWrite_Val {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.val = Value.internalBinaryRead(reader, reader.uint32(), options, message.val);
                    break;
                case  2:
                    message.seq = reader.int32();
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

export const BufferedWrite_Val = /*#__PURE__*/ new BufferedWrite_Val$Type();

class LeafTxnInputState$Type extends MessageType<LeafTxnInputState> {
    constructor() {
        super("cockroach.roachpb.LeafTxnInputState", [
            { no: 1, name: "txn", kind: "message", T: () => Transaction },
            { no: 7, name: "refresh_invalid", kind: "scalar", T: 8  },
            { no: 8, name: "in_flight_writes", kind: "message", repeat: 2 , T: () => SequencedWrite },
            { no: 9, name: "stepping_mode_enabled", kind: "scalar", T: 8  },
            { no: 10, name: "read_seq_num", kind: "scalar", T: 5  },
            { no: 11, name: "buffered_writes", kind: "message", repeat: 2 , T: () => BufferedWrite }
        ]);
    }
    create(value?: PartialMessage<LeafTxnInputState>): LeafTxnInputState {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.refreshInvalid = false;
        message.inFlightWrites = [];
        message.steppingModeEnabled = false;
        message.readSeqNum = 0;
        message.bufferedWrites = [];
        if (value !== undefined)
            reflectionMergePartial<LeafTxnInputState>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LeafTxnInputState): LeafTxnInputState {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.txn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  7:
                    message.refreshInvalid = reader.bool();
                    break;
                case  8:
                    message.inFlightWrites.push(SequencedWrite.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  9:
                    message.steppingModeEnabled = reader.bool();
                    break;
                case  10:
                    message.readSeqNum = reader.int32();
                    break;
                case  11:
                    message.bufferedWrites.push(BufferedWrite.internalBinaryRead(reader, reader.uint32(), options));
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

export const LeafTxnInputState = /*#__PURE__*/ new LeafTxnInputState$Type();

class LeafTxnFinalState$Type extends MessageType<LeafTxnFinalState> {
    constructor() {
        super("cockroach.roachpb.LeafTxnFinalState", [
            { no: 1, name: "txn", kind: "message", T: () => Transaction },
            { no: 4, name: "refresh_spans", kind: "message", repeat: 2 , T: () => Span },
            { no: 7, name: "refresh_invalid", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<LeafTxnFinalState>): LeafTxnFinalState {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.refreshSpans = [];
        message.refreshInvalid = false;
        if (value !== undefined)
            reflectionMergePartial<LeafTxnFinalState>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LeafTxnFinalState): LeafTxnFinalState {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.txn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  4:
                    message.refreshSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.refreshInvalid = reader.bool();
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

export const LeafTxnFinalState = /*#__PURE__*/ new LeafTxnFinalState$Type();

class ClientRangeInfo$Type extends MessageType<ClientRangeInfo> {
    constructor() {
        super("cockroach.roachpb.ClientRangeInfo", [
            { no: 1, name: "descriptor_generation", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "lease_sequence", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "closed_timestamp_policy", kind: "enum", T: () => ["cockroach.roachpb.RangeClosedTimestampPolicy", RangeClosedTimestampPolicy] },
            { no: 4, name: "explicitly_requested", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<ClientRangeInfo>): ClientRangeInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.descriptorGeneration = 0n;
        message.leaseSequence = 0n;
        message.closedTimestampPolicy = 0;
        message.explicitlyRequested = false;
        if (value !== undefined)
            reflectionMergePartial<ClientRangeInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ClientRangeInfo): ClientRangeInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.descriptorGeneration = reader.int64().toBigInt();
                    break;
                case  2:
                    message.leaseSequence = reader.int64().toBigInt();
                    break;
                case  3:
                    message.closedTimestampPolicy = reader.int32();
                    break;
                case  4:
                    message.explicitlyRequested = reader.bool();
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

export const ClientRangeInfo = /*#__PURE__*/ new ClientRangeInfo$Type();

class RangeInfo$Type extends MessageType<RangeInfo> {
    constructor() {
        super("cockroach.roachpb.RangeInfo", [
            { no: 1, name: "desc", kind: "message", T: () => RangeDescriptor },
            { no: 2, name: "lease", kind: "message", T: () => Lease },
            { no: 3, name: "closed_timestamp_policy", kind: "enum", T: () => ["cockroach.roachpb.RangeClosedTimestampPolicy", RangeClosedTimestampPolicy] }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<RangeInfo>): RangeInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.closedTimestampPolicy = 0;
        if (value !== undefined)
            reflectionMergePartial<RangeInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeInfo): RangeInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.desc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.desc);
                    break;
                case  2:
                    message.lease = Lease.internalBinaryRead(reader, reader.uint32(), options, message.lease);
                    break;
                case  3:
                    message.closedTimestampPolicy = reader.int32();
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

export const RangeInfo = /*#__PURE__*/ new RangeInfo$Type();

class TenantID$Type extends MessageType<TenantID> {
    constructor() {
        super("cockroach.roachpb.TenantID", [
            { no: 1, name: "id", kind: "scalar", T: 4 , L: 0  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TenantID>): TenantID {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0n;
        if (value !== undefined)
            reflectionMergePartial<TenantID>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantID): TenantID {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint64().toBigInt();
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

export const TenantID = /*#__PURE__*/ new TenantID$Type();

class RowCount$Type extends MessageType<RowCount> {
    constructor() {
        super("cockroach.roachpb.RowCount", [
            { no: 1, name: "data_size", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "rows", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "index_entries", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<RowCount>): RowCount {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.dataSize = 0n;
        message.rows = 0n;
        message.indexEntries = 0n;
        if (value !== undefined)
            reflectionMergePartial<RowCount>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RowCount): RowCount {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.dataSize = reader.int64().toBigInt();
                    break;
                case  2:
                    message.rows = reader.int64().toBigInt();
                    break;
                case  3:
                    message.indexEntries = reader.int64().toBigInt();
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

export const RowCount = /*#__PURE__*/ new RowCount$Type();
