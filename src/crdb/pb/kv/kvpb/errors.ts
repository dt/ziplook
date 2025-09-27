// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Span } from "../../roachpb/data";
import { EncodedError } from "../../errorspb/errors";
import { Value } from "../../roachpb/data";
import { Lock } from "../../roachpb/data";
import { TxnMeta } from "../../storage/enginepb/mvcc3";
import { Transaction } from "../../roachpb/data";
import { ObservedTimestamp } from "../../roachpb/data";
import { Timestamp } from "../../util/hlc/timestamp";
import { RangeInfo } from "../../roachpb/data";
import { RangeDescriptor } from "../../roachpb/metadata";
import { Lease } from "../../roachpb/data";
import { ReplicaDescriptor } from "../../roachpb/metadata";

export interface NotLeaseHolderError {

    replica?: ReplicaDescriptor;

    lease?: Lease;

    rangeId?: bigint;

    rangeDesc?: RangeDescriptor;

    customMsg?: string;
}

export interface NodeUnavailableError {
}

export interface NodeDecommissionedError {
}

export interface UnsupportedRequestError {
}

export interface RangeNotFoundError {

    rangeId?: bigint;

    storeId?: bigint;
}

export interface RangeKeyMismatchError {

    requestStartKey?: Uint8Array;

    requestEndKey?: Uint8Array;

    ranges: RangeInfo[];
}

export interface ReadWithinUncertaintyIntervalError {

    readTimestamp?: Timestamp;

    localUncertaintyLimit?: Timestamp;

    globalUncertaintyLimit?: Timestamp;

    observedTimestamps: ObservedTimestamp[];

    valueTimestamp?: Timestamp;

    localTimestamp?: Timestamp;
}

export interface TransactionAbortedError {

    reason?: TransactionAbortedReason;
}

export interface TransactionPushError {

    pusheeTxn?: Transaction;
}

export interface TransactionRetryError {

    reason?: TransactionRetryReason;

    extraMsg?: string;

    extraMsgRedactable?: string;

    conflictingTxn?: TxnMeta;
}

export interface TransactionStatusError {

    msg?: string;

    reason?: TransactionStatusError_Reason;

    msgRedactable?: string;
}

export enum TransactionStatusError_Reason {

    UNKNOWN = 0,

    TXN_COMMITTED = 2
}

export interface LockConflictError {

    locks: Lock[];

    leaseSequence?: bigint;
}

export interface WriteIntentError {

    locks: Lock[];

    reason?: WriteIntentError_Reason;
}

export enum WriteIntentError_Reason {

    UNSPECIFIED = 0,

    WAIT_POLICY = 1,

    LOCK_TIMEOUT = 2,

    LOCK_WAIT_QUEUE_MAX_LENGTH_EXCEEDED = 3
}

export interface WriteTooOldError {

    timestamp?: Timestamp;

    actualTimestamp?: Timestamp;

    key?: Uint8Array;
}

export interface OpRequiresTxnError {
}

export interface ConditionFailedError {

    actualValue?: Value;

    hadNewerOriginTimestamp?: boolean;

    originTimestampOlderThan?: Timestamp;
}

export interface LeaseRejectedError {

    message?: string;

    requested?: Lease;

    existing?: Lease;
}

export interface AmbiguousResultError {

    encodedError?: EncodedError;
}

export interface ProxyFailedError {

    cause?: EncodedError;
}

export interface ReplicaUnavailableError {

    desc?: RangeDescriptor;

    replica?: ReplicaDescriptor;

    cause?: EncodedError;
}

export interface RaftGroupDeletedError {
}

export interface ReplicaCorruptionError {

    errorMsg?: string;

    processed?: boolean;
}

export interface ReplicaTooOldError {

    replicaId?: number;
}

export interface StoreNotFoundError {

    storeId?: bigint;
}

export interface UnhandledRetryableError {

    pErr?: Error;
}

export interface TransactionRetryWithProtoRefreshError {

    msg?: string;

    prevTxnId?: Uint8Array;

    prevTxnEpoch?: number;

    nextTransaction?: Transaction;

    msgRedactable?: string;

    conflictingTxn?: TxnMeta;
}

export interface TxnAlreadyEncounteredErrorError {

    prevError?: string;
}

export interface IntegerOverflowError {

    key?: Uint8Array;

    currentValue?: bigint;

    incrementValue?: bigint;
}

export interface BatchTimestampBeforeGCError {

    timestamp?: Timestamp;

    threshold?: Timestamp;

    dataExcludedFromBackup?: boolean;

    rangeId?: bigint;

    startKey?: Uint8Array;

    endKey?: Uint8Array;
}

export interface MVCCHistoryMutationError {

    span?: Span;
}

export interface IntentMissingError {

    wrongIntent?: Lock;

    key?: Uint8Array;
}

export interface MergeInProgressError {
}

export interface RangeFeedRetryError {

    reason?: RangeFeedRetryError_Reason;
}

export enum RangeFeedRetryError_Reason {

    REPLICA_REMOVED = 0,

    RANGE_SPLIT = 1,

    RANGE_MERGED = 2,

    RAFT_SNAPSHOT = 3,

    LOGICAL_OPS_MISSING = 4,

    SLOW_CONSUMER = 5,

    NO_LEASEHOLDER = 6,

    RANGEFEED_CLOSED = 7,

    MANUAL_RANGE_SPLIT = 8
}

export interface IndeterminateCommitError {

    stagingTxn?: Transaction;
}

export interface InvalidLeaseError {
}

export interface OptimisticEvalConflictsError {
}

export interface MinTimestampBoundUnsatisfiableError {

    minTimestampBound?: Timestamp;

    resolvedTimestamp?: Timestamp;
}

export interface RefreshFailedError {

    reason?: RefreshFailedError_Reason;

    key?: Uint8Array;

    timestamp?: Timestamp;

    conflictingTxn?: TxnMeta;
}

export enum RefreshFailedError_Reason {

    COMMITTED_VALUE = 0,

    INTENT = 1
}

export interface ErrPosition {

    index?: number;
}

export interface Error {

    unexposedTxn?: Transaction;

    originNode?: number;

    encodedError?: EncodedError;

    index?: ErrPosition;

    now?: Timestamp;
}

export interface InsufficientSpaceError {

    storeId?: bigint;

    op?: string;

    available?: bigint;

    capacity?: bigint;

    required?: number;
}

export interface PebbleCorruptionError {

    storeId?: bigint;

    path?: string;

    isRemote?: boolean;

    extraMsg?: string;
}

export interface ExclusionViolationError {

    expectedExclusionSinceTimestamp?: Timestamp;

    violationTimestamp?: Timestamp;

    key?: Uint8Array;
}

export enum TransactionAbortedReason {

    ABORT_REASON_UNKNOWN = 0,

    ABORT_REASON_ABORTED_RECORD_FOUND = 1,

    ABORT_REASON_CLIENT_REJECT = 3,

    ABORT_REASON_PUSHER_ABORTED = 4,

    ABORT_REASON_ABORT_SPAN = 5,

    ABORT_REASON_RECORD_ALREADY_WRITTEN_POSSIBLE_REPLAY = 6,

    ABORT_REASON_NEW_LEASE_PREVENTS_TXN = 8,

    ABORT_REASON_TIMESTAMP_CACHE_REJECTED = 7
}

export enum TransactionRetryReason {

    RETRY_REASON_UNKNOWN = 0,

    RETRY_WRITE_TOO_OLD = 1,

    RETRY_SERIALIZABLE = 3,

    RETRY_ASYNC_WRITE_FAILURE = 5,

    RETRY_COMMIT_DEADLINE_EXCEEDED = 6
}

export enum TransactionRestart {

    NONE = 0,

    BACKOFF = 1,

    IMMEDIATE = 2
}

class NotLeaseHolderError$Type extends MessageType<NotLeaseHolderError> {
    constructor() {
        super("cockroach.kv.kvpb.NotLeaseHolderError", [
            { no: 1, name: "replica", kind: "message", T: () => ReplicaDescriptor },
            { no: 4, name: "lease", kind: "message", T: () => Lease },
            { no: 3, name: "range_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 6, name: "range_desc", kind: "message", T: () => RangeDescriptor },
            { no: 5, name: "custom_msg", kind: "scalar", opt: true, T: 9  }
        ]);
    }
    create(value?: PartialMessage<NotLeaseHolderError>): NotLeaseHolderError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<NotLeaseHolderError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NotLeaseHolderError): NotLeaseHolderError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.replica = ReplicaDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.replica);
                    break;
                case  4:
                    message.lease = Lease.internalBinaryRead(reader, reader.uint32(), options, message.lease);
                    break;
                case  3:
                    message.rangeId = reader.int64().toBigInt();
                    break;
                case  6:
                    message.rangeDesc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.rangeDesc);
                    break;
                case  5:
                    message.customMsg = reader.string();
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

export const NotLeaseHolderError = /*#__PURE__*/ new NotLeaseHolderError$Type();

class NodeUnavailableError$Type extends MessageType<NodeUnavailableError> {
    constructor() {
        super("cockroach.kv.kvpb.NodeUnavailableError", []);
    }
    create(value?: PartialMessage<NodeUnavailableError>): NodeUnavailableError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<NodeUnavailableError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NodeUnavailableError): NodeUnavailableError {
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

export const NodeUnavailableError = /*#__PURE__*/ new NodeUnavailableError$Type();

class NodeDecommissionedError$Type extends MessageType<NodeDecommissionedError> {
    constructor() {
        super("cockroach.kv.kvpb.NodeDecommissionedError", []);
    }
    create(value?: PartialMessage<NodeDecommissionedError>): NodeDecommissionedError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<NodeDecommissionedError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NodeDecommissionedError): NodeDecommissionedError {
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

export const NodeDecommissionedError = /*#__PURE__*/ new NodeDecommissionedError$Type();

class UnsupportedRequestError$Type extends MessageType<UnsupportedRequestError> {
    constructor() {
        super("cockroach.kv.kvpb.UnsupportedRequestError", []);
    }
    create(value?: PartialMessage<UnsupportedRequestError>): UnsupportedRequestError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<UnsupportedRequestError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UnsupportedRequestError): UnsupportedRequestError {
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

export const UnsupportedRequestError = /*#__PURE__*/ new UnsupportedRequestError$Type();

class RangeNotFoundError$Type extends MessageType<RangeNotFoundError> {
    constructor() {
        super("cockroach.kv.kvpb.RangeNotFoundError", [
            { no: 1, name: "range_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 2, name: "store_id", kind: "scalar", opt: true, T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<RangeNotFoundError>): RangeNotFoundError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RangeNotFoundError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeNotFoundError): RangeNotFoundError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rangeId = reader.int64().toBigInt();
                    break;
                case  2:
                    message.storeId = reader.int64().toBigInt();
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

export const RangeNotFoundError = /*#__PURE__*/ new RangeNotFoundError$Type();

class RangeKeyMismatchError$Type extends MessageType<RangeKeyMismatchError> {
    constructor() {
        super("cockroach.kv.kvpb.RangeKeyMismatchError", [
            { no: 1, name: "request_start_key", kind: "scalar", opt: true, T: 12  },
            { no: 2, name: "request_end_key", kind: "scalar", opt: true, T: 12  },
            { no: 5, name: "ranges", kind: "message", repeat: 2 , T: () => RangeInfo }
        ]);
    }
    create(value?: PartialMessage<RangeKeyMismatchError>): RangeKeyMismatchError {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.ranges = [];
        if (value !== undefined)
            reflectionMergePartial<RangeKeyMismatchError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeKeyMismatchError): RangeKeyMismatchError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.requestStartKey = reader.bytes();
                    break;
                case  2:
                    message.requestEndKey = reader.bytes();
                    break;
                case  5:
                    message.ranges.push(RangeInfo.internalBinaryRead(reader, reader.uint32(), options));
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

export const RangeKeyMismatchError = /*#__PURE__*/ new RangeKeyMismatchError$Type();

class ReadWithinUncertaintyIntervalError$Type extends MessageType<ReadWithinUncertaintyIntervalError> {
    constructor() {
        super("cockroach.kv.kvpb.ReadWithinUncertaintyIntervalError", [
            { no: 1, name: "read_timestamp", kind: "message", T: () => Timestamp },
            { no: 5, name: "local_uncertainty_limit", kind: "message", T: () => Timestamp },
            { no: 3, name: "global_uncertainty_limit", kind: "message", T: () => Timestamp },
            { no: 4, name: "observed_timestamps", kind: "message", repeat: 2 , T: () => ObservedTimestamp },
            { no: 2, name: "value_timestamp", kind: "message", T: () => Timestamp },
            { no: 6, name: "local_timestamp", kind: "message", T: () => Timestamp }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<ReadWithinUncertaintyIntervalError>): ReadWithinUncertaintyIntervalError {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.observedTimestamps = [];
        if (value !== undefined)
            reflectionMergePartial<ReadWithinUncertaintyIntervalError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReadWithinUncertaintyIntervalError): ReadWithinUncertaintyIntervalError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.readTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.readTimestamp);
                    break;
                case  5:
                    message.localUncertaintyLimit = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.localUncertaintyLimit);
                    break;
                case  3:
                    message.globalUncertaintyLimit = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.globalUncertaintyLimit);
                    break;
                case  4:
                    message.observedTimestamps.push(ObservedTimestamp.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.valueTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.valueTimestamp);
                    break;
                case  6:
                    message.localTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.localTimestamp);
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

export const ReadWithinUncertaintyIntervalError = /*#__PURE__*/ new ReadWithinUncertaintyIntervalError$Type();

class TransactionAbortedError$Type extends MessageType<TransactionAbortedError> {
    constructor() {
        super("cockroach.kv.kvpb.TransactionAbortedError", [
            { no: 1, name: "reason", kind: "enum", opt: true, T: () => ["cockroach.kv.kvpb.TransactionAbortedReason", TransactionAbortedReason] }
        ]);
    }
    create(value?: PartialMessage<TransactionAbortedError>): TransactionAbortedError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TransactionAbortedError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransactionAbortedError): TransactionAbortedError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.reason = reader.int32();
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

export const TransactionAbortedError = /*#__PURE__*/ new TransactionAbortedError$Type();

class TransactionPushError$Type extends MessageType<TransactionPushError> {
    constructor() {
        super("cockroach.kv.kvpb.TransactionPushError", [
            { no: 1, name: "pushee_txn", kind: "message", T: () => Transaction }
        ]);
    }
    create(value?: PartialMessage<TransactionPushError>): TransactionPushError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TransactionPushError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransactionPushError): TransactionPushError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.pusheeTxn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.pusheeTxn);
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

export const TransactionPushError = /*#__PURE__*/ new TransactionPushError$Type();

class TransactionRetryError$Type extends MessageType<TransactionRetryError> {
    constructor() {
        super("cockroach.kv.kvpb.TransactionRetryError", [
            { no: 1, name: "reason", kind: "enum", opt: true, T: () => ["cockroach.kv.kvpb.TransactionRetryReason", TransactionRetryReason] },
            { no: 2, name: "extra_msg", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "extra_msg_redactable", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "conflicting_txn", kind: "message", T: () => TxnMeta }
        ]);
    }
    create(value?: PartialMessage<TransactionRetryError>): TransactionRetryError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TransactionRetryError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransactionRetryError): TransactionRetryError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.reason = reader.int32();
                    break;
                case  2:
                    message.extraMsg = reader.string();
                    break;
                case  3:
                    message.extraMsgRedactable = reader.string();
                    break;
                case  4:
                    message.conflictingTxn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.conflictingTxn);
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

export const TransactionRetryError = /*#__PURE__*/ new TransactionRetryError$Type();

class TransactionStatusError$Type extends MessageType<TransactionStatusError> {
    constructor() {
        super("cockroach.kv.kvpb.TransactionStatusError", [
            { no: 1, name: "msg", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "reason", kind: "enum", opt: true, T: () => ["cockroach.kv.kvpb.TransactionStatusError.Reason", TransactionStatusError_Reason, "REASON_"] },
            { no: 3, name: "msg_redactable", kind: "scalar", opt: true, T: 9  }
        ]);
    }
    create(value?: PartialMessage<TransactionStatusError>): TransactionStatusError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TransactionStatusError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransactionStatusError): TransactionStatusError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.msg = reader.string();
                    break;
                case  2:
                    message.reason = reader.int32();
                    break;
                case  3:
                    message.msgRedactable = reader.string();
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

export const TransactionStatusError = /*#__PURE__*/ new TransactionStatusError$Type();

class LockConflictError$Type extends MessageType<LockConflictError> {
    constructor() {
        super("cockroach.kv.kvpb.LockConflictError", [
            { no: 1, name: "locks", kind: "message", repeat: 2 , T: () => Lock },
            { no: 3, name: "lease_sequence", kind: "scalar", opt: true, T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<LockConflictError>): LockConflictError {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.locks = [];
        if (value !== undefined)
            reflectionMergePartial<LockConflictError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LockConflictError): LockConflictError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.locks.push(Lock.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.leaseSequence = reader.int64().toBigInt();
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

export const LockConflictError = /*#__PURE__*/ new LockConflictError$Type();

class WriteIntentError$Type extends MessageType<WriteIntentError> {
    constructor() {
        super("cockroach.kv.kvpb.WriteIntentError", [
            { no: 1, name: "locks", kind: "message", repeat: 2 , T: () => Lock },
            { no: 4, name: "reason", kind: "enum", opt: true, T: () => ["cockroach.kv.kvpb.WriteIntentError.Reason", WriteIntentError_Reason, "REASON_"] }
        ]);
    }
    create(value?: PartialMessage<WriteIntentError>): WriteIntentError {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.locks = [];
        if (value !== undefined)
            reflectionMergePartial<WriteIntentError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WriteIntentError): WriteIntentError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.locks.push(Lock.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.reason = reader.int32();
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

export const WriteIntentError = /*#__PURE__*/ new WriteIntentError$Type();

class WriteTooOldError$Type extends MessageType<WriteTooOldError> {
    constructor() {
        super("cockroach.kv.kvpb.WriteTooOldError", [
            { no: 1, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 2, name: "actual_timestamp", kind: "message", T: () => Timestamp },
            { no: 3, name: "key", kind: "scalar", opt: true, T: 12  }
        ]);
    }
    create(value?: PartialMessage<WriteTooOldError>): WriteTooOldError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<WriteTooOldError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WriteTooOldError): WriteTooOldError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  2:
                    message.actualTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.actualTimestamp);
                    break;
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

export const WriteTooOldError = /*#__PURE__*/ new WriteTooOldError$Type();

class OpRequiresTxnError$Type extends MessageType<OpRequiresTxnError> {
    constructor() {
        super("cockroach.kv.kvpb.OpRequiresTxnError", []);
    }
    create(value?: PartialMessage<OpRequiresTxnError>): OpRequiresTxnError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<OpRequiresTxnError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OpRequiresTxnError): OpRequiresTxnError {
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

export const OpRequiresTxnError = /*#__PURE__*/ new OpRequiresTxnError$Type();

class ConditionFailedError$Type extends MessageType<ConditionFailedError> {
    constructor() {
        super("cockroach.kv.kvpb.ConditionFailedError", [
            { no: 1, name: "actual_value", kind: "message", T: () => Value },
            { no: 2, name: "had_newer_origin_timestamp", kind: "scalar", opt: true, T: 8  },
            { no: 3, name: "origin_timestamp_older_than", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<ConditionFailedError>): ConditionFailedError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ConditionFailedError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConditionFailedError): ConditionFailedError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.actualValue = Value.internalBinaryRead(reader, reader.uint32(), options, message.actualValue);
                    break;
                case  2:
                    message.hadNewerOriginTimestamp = reader.bool();
                    break;
                case  3:
                    message.originTimestampOlderThan = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.originTimestampOlderThan);
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

export const ConditionFailedError = /*#__PURE__*/ new ConditionFailedError$Type();

class LeaseRejectedError$Type extends MessageType<LeaseRejectedError> {
    constructor() {
        super("cockroach.kv.kvpb.LeaseRejectedError", [
            { no: 1, name: "message", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "requested", kind: "message", T: () => Lease },
            { no: 3, name: "existing", kind: "message", T: () => Lease }
        ]);
    }
    create(value?: PartialMessage<LeaseRejectedError>): LeaseRejectedError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<LeaseRejectedError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LeaseRejectedError): LeaseRejectedError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.message = reader.string();
                    break;
                case  2:
                    message.requested = Lease.internalBinaryRead(reader, reader.uint32(), options, message.requested);
                    break;
                case  3:
                    message.existing = Lease.internalBinaryRead(reader, reader.uint32(), options, message.existing);
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

export const LeaseRejectedError = /*#__PURE__*/ new LeaseRejectedError$Type();

class AmbiguousResultError$Type extends MessageType<AmbiguousResultError> {
    constructor() {
        super("cockroach.kv.kvpb.AmbiguousResultError", [
            { no: 3, name: "encoded_error", kind: "message", T: () => EncodedError }
        ]);
    }
    create(value?: PartialMessage<AmbiguousResultError>): AmbiguousResultError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AmbiguousResultError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AmbiguousResultError): AmbiguousResultError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  3:
                    message.encodedError = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.encodedError);
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

export const AmbiguousResultError = /*#__PURE__*/ new AmbiguousResultError$Type();

class ProxyFailedError$Type extends MessageType<ProxyFailedError> {
    constructor() {
        super("cockroach.kv.kvpb.ProxyFailedError", [
            { no: 1, name: "cause", kind: "message", T: () => EncodedError }
        ]);
    }
    create(value?: PartialMessage<ProxyFailedError>): ProxyFailedError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ProxyFailedError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ProxyFailedError): ProxyFailedError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.cause = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.cause);
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

export const ProxyFailedError = /*#__PURE__*/ new ProxyFailedError$Type();

class ReplicaUnavailableError$Type extends MessageType<ReplicaUnavailableError> {
    constructor() {
        super("cockroach.kv.kvpb.ReplicaUnavailableError", [
            { no: 2, name: "desc", kind: "message", T: () => RangeDescriptor },
            { no: 4, name: "replica", kind: "message", T: () => ReplicaDescriptor },
            { no: 5, name: "cause", kind: "message", T: () => EncodedError }
        ]);
    }
    create(value?: PartialMessage<ReplicaUnavailableError>): ReplicaUnavailableError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ReplicaUnavailableError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReplicaUnavailableError): ReplicaUnavailableError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.desc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.desc);
                    break;
                case  4:
                    message.replica = ReplicaDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.replica);
                    break;
                case  5:
                    message.cause = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.cause);
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

export const ReplicaUnavailableError = /*#__PURE__*/ new ReplicaUnavailableError$Type();

class RaftGroupDeletedError$Type extends MessageType<RaftGroupDeletedError> {
    constructor() {
        super("cockroach.kv.kvpb.RaftGroupDeletedError", []);
    }
    create(value?: PartialMessage<RaftGroupDeletedError>): RaftGroupDeletedError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RaftGroupDeletedError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RaftGroupDeletedError): RaftGroupDeletedError {
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

export const RaftGroupDeletedError = /*#__PURE__*/ new RaftGroupDeletedError$Type();

class ReplicaCorruptionError$Type extends MessageType<ReplicaCorruptionError> {
    constructor() {
        super("cockroach.kv.kvpb.ReplicaCorruptionError", [
            { no: 1, name: "error_msg", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "processed", kind: "scalar", opt: true, T: 8  }
        ]);
    }
    create(value?: PartialMessage<ReplicaCorruptionError>): ReplicaCorruptionError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ReplicaCorruptionError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReplicaCorruptionError): ReplicaCorruptionError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.errorMsg = reader.string();
                    break;
                case  2:
                    message.processed = reader.bool();
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

export const ReplicaCorruptionError = /*#__PURE__*/ new ReplicaCorruptionError$Type();

class ReplicaTooOldError$Type extends MessageType<ReplicaTooOldError> {
    constructor() {
        super("cockroach.kv.kvpb.ReplicaTooOldError", [
            { no: 1, name: "replica_id", kind: "scalar", opt: true, T: 5  }
        ]);
    }
    create(value?: PartialMessage<ReplicaTooOldError>): ReplicaTooOldError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ReplicaTooOldError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReplicaTooOldError): ReplicaTooOldError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.replicaId = reader.int32();
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

export const ReplicaTooOldError = /*#__PURE__*/ new ReplicaTooOldError$Type();

class StoreNotFoundError$Type extends MessageType<StoreNotFoundError> {
    constructor() {
        super("cockroach.kv.kvpb.StoreNotFoundError", [
            { no: 1, name: "store_id", kind: "scalar", opt: true, T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<StoreNotFoundError>): StoreNotFoundError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<StoreNotFoundError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StoreNotFoundError): StoreNotFoundError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.storeId = reader.int64().toBigInt();
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

export const StoreNotFoundError = /*#__PURE__*/ new StoreNotFoundError$Type();

class UnhandledRetryableError$Type extends MessageType<UnhandledRetryableError> {
    constructor() {
        super("cockroach.kv.kvpb.UnhandledRetryableError", [
            { no: 1, name: "pErr", kind: "message", T: () => Error }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<UnhandledRetryableError>): UnhandledRetryableError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<UnhandledRetryableError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UnhandledRetryableError): UnhandledRetryableError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.pErr = Error.internalBinaryRead(reader, reader.uint32(), options, message.pErr);
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

export const UnhandledRetryableError = /*#__PURE__*/ new UnhandledRetryableError$Type();

class TransactionRetryWithProtoRefreshError$Type extends MessageType<TransactionRetryWithProtoRefreshError> {
    constructor() {
        super("cockroach.kv.kvpb.TransactionRetryWithProtoRefreshError", [
            { no: 1, name: "msg", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "prev_txn_id", kind: "scalar", opt: true, T: 12  },
            { no: 5, name: "prev_txn_epoch", kind: "scalar", opt: true, T: 5  },
            { no: 3, name: "next_transaction", kind: "message", T: () => Transaction },
            { no: 4, name: "msg_redactable", kind: "scalar", opt: true, T: 9  },
            { no: 6, name: "conflicting_txn", kind: "message", T: () => TxnMeta }
        ]);
    }
    create(value?: PartialMessage<TransactionRetryWithProtoRefreshError>): TransactionRetryWithProtoRefreshError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TransactionRetryWithProtoRefreshError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransactionRetryWithProtoRefreshError): TransactionRetryWithProtoRefreshError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.msg = reader.string();
                    break;
                case  2:
                    message.prevTxnId = reader.bytes();
                    break;
                case  5:
                    message.prevTxnEpoch = reader.int32();
                    break;
                case  3:
                    message.nextTransaction = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.nextTransaction);
                    break;
                case  4:
                    message.msgRedactable = reader.string();
                    break;
                case  6:
                    message.conflictingTxn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.conflictingTxn);
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

export const TransactionRetryWithProtoRefreshError = /*#__PURE__*/ new TransactionRetryWithProtoRefreshError$Type();

class TxnAlreadyEncounteredErrorError$Type extends MessageType<TxnAlreadyEncounteredErrorError> {
    constructor() {
        super("cockroach.kv.kvpb.TxnAlreadyEncounteredErrorError", [
            { no: 1, name: "prev_error", kind: "scalar", opt: true, T: 9  }
        ]);
    }
    create(value?: PartialMessage<TxnAlreadyEncounteredErrorError>): TxnAlreadyEncounteredErrorError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TxnAlreadyEncounteredErrorError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TxnAlreadyEncounteredErrorError): TxnAlreadyEncounteredErrorError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.prevError = reader.string();
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

export const TxnAlreadyEncounteredErrorError = /*#__PURE__*/ new TxnAlreadyEncounteredErrorError$Type();

class IntegerOverflowError$Type extends MessageType<IntegerOverflowError> {
    constructor() {
        super("cockroach.kv.kvpb.IntegerOverflowError", [
            { no: 1, name: "key", kind: "scalar", opt: true, T: 12  },
            { no: 2, name: "current_value", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 3, name: "increment_value", kind: "scalar", opt: true, T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<IntegerOverflowError>): IntegerOverflowError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IntegerOverflowError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IntegerOverflowError): IntegerOverflowError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.currentValue = reader.int64().toBigInt();
                    break;
                case  3:
                    message.incrementValue = reader.int64().toBigInt();
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

export const IntegerOverflowError = /*#__PURE__*/ new IntegerOverflowError$Type();

class BatchTimestampBeforeGCError$Type extends MessageType<BatchTimestampBeforeGCError> {
    constructor() {
        super("cockroach.kv.kvpb.BatchTimestampBeforeGCError", [
            { no: 1, name: "Timestamp", kind: "message", jsonName: "Timestamp", T: () => Timestamp },
            { no: 2, name: "Threshold", kind: "message", jsonName: "Threshold", T: () => Timestamp },
            { no: 3, name: "data_excluded_from_backup", kind: "scalar", opt: true, T: 8  },
            { no: 4, name: "range_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 5, name: "start_key", kind: "scalar", opt: true, T: 12  },
            { no: 6, name: "end_key", kind: "scalar", opt: true, T: 12  }
        ]);
    }
    create(value?: PartialMessage<BatchTimestampBeforeGCError>): BatchTimestampBeforeGCError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<BatchTimestampBeforeGCError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BatchTimestampBeforeGCError): BatchTimestampBeforeGCError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  2:
                    message.threshold = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.threshold);
                    break;
                case  3:
                    message.dataExcludedFromBackup = reader.bool();
                    break;
                case  4:
                    message.rangeId = reader.int64().toBigInt();
                    break;
                case  5:
                    message.startKey = reader.bytes();
                    break;
                case  6:
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

export const BatchTimestampBeforeGCError = /*#__PURE__*/ new BatchTimestampBeforeGCError$Type();

class MVCCHistoryMutationError$Type extends MessageType<MVCCHistoryMutationError> {
    constructor() {
        super("cockroach.kv.kvpb.MVCCHistoryMutationError", [
            { no: 1, name: "span", kind: "message", T: () => Span }
        ]);
    }
    create(value?: PartialMessage<MVCCHistoryMutationError>): MVCCHistoryMutationError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MVCCHistoryMutationError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCHistoryMutationError): MVCCHistoryMutationError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
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

export const MVCCHistoryMutationError = /*#__PURE__*/ new MVCCHistoryMutationError$Type();

class IntentMissingError$Type extends MessageType<IntentMissingError> {
    constructor() {
        super("cockroach.kv.kvpb.IntentMissingError", [
            { no: 1, name: "wrong_intent", kind: "message", T: () => Lock },
            { no: 2, name: "key", kind: "scalar", opt: true, T: 12  }
        ]);
    }
    create(value?: PartialMessage<IntentMissingError>): IntentMissingError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IntentMissingError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IntentMissingError): IntentMissingError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.wrongIntent = Lock.internalBinaryRead(reader, reader.uint32(), options, message.wrongIntent);
                    break;
                case  2:
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

export const IntentMissingError = /*#__PURE__*/ new IntentMissingError$Type();

class MergeInProgressError$Type extends MessageType<MergeInProgressError> {
    constructor() {
        super("cockroach.kv.kvpb.MergeInProgressError", []);
    }
    create(value?: PartialMessage<MergeInProgressError>): MergeInProgressError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MergeInProgressError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MergeInProgressError): MergeInProgressError {
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

export const MergeInProgressError = /*#__PURE__*/ new MergeInProgressError$Type();

class RangeFeedRetryError$Type extends MessageType<RangeFeedRetryError> {
    constructor() {
        super("cockroach.kv.kvpb.RangeFeedRetryError", [
            { no: 1, name: "reason", kind: "enum", opt: true, T: () => ["cockroach.kv.kvpb.RangeFeedRetryError.Reason", RangeFeedRetryError_Reason, "REASON_"] }
        ]);
    }
    create(value?: PartialMessage<RangeFeedRetryError>): RangeFeedRetryError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RangeFeedRetryError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedRetryError): RangeFeedRetryError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.reason = reader.int32();
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

export const RangeFeedRetryError = /*#__PURE__*/ new RangeFeedRetryError$Type();

class IndeterminateCommitError$Type extends MessageType<IndeterminateCommitError> {
    constructor() {
        super("cockroach.kv.kvpb.IndeterminateCommitError", [
            { no: 1, name: "staging_txn", kind: "message", T: () => Transaction }
        ]);
    }
    create(value?: PartialMessage<IndeterminateCommitError>): IndeterminateCommitError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IndeterminateCommitError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndeterminateCommitError): IndeterminateCommitError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.stagingTxn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.stagingTxn);
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

export const IndeterminateCommitError = /*#__PURE__*/ new IndeterminateCommitError$Type();

class InvalidLeaseError$Type extends MessageType<InvalidLeaseError> {
    constructor() {
        super("cockroach.kv.kvpb.InvalidLeaseError", []);
    }
    create(value?: PartialMessage<InvalidLeaseError>): InvalidLeaseError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<InvalidLeaseError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InvalidLeaseError): InvalidLeaseError {
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

export const InvalidLeaseError = /*#__PURE__*/ new InvalidLeaseError$Type();

class OptimisticEvalConflictsError$Type extends MessageType<OptimisticEvalConflictsError> {
    constructor() {
        super("cockroach.kv.kvpb.OptimisticEvalConflictsError", []);
    }
    create(value?: PartialMessage<OptimisticEvalConflictsError>): OptimisticEvalConflictsError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<OptimisticEvalConflictsError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OptimisticEvalConflictsError): OptimisticEvalConflictsError {
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

export const OptimisticEvalConflictsError = /*#__PURE__*/ new OptimisticEvalConflictsError$Type();

class MinTimestampBoundUnsatisfiableError$Type extends MessageType<MinTimestampBoundUnsatisfiableError> {
    constructor() {
        super("cockroach.kv.kvpb.MinTimestampBoundUnsatisfiableError", [
            { no: 1, name: "min_timestamp_bound", kind: "message", T: () => Timestamp },
            { no: 2, name: "resolved_timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<MinTimestampBoundUnsatisfiableError>): MinTimestampBoundUnsatisfiableError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MinTimestampBoundUnsatisfiableError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MinTimestampBoundUnsatisfiableError): MinTimestampBoundUnsatisfiableError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.minTimestampBound = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.minTimestampBound);
                    break;
                case  2:
                    message.resolvedTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.resolvedTimestamp);
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

export const MinTimestampBoundUnsatisfiableError = /*#__PURE__*/ new MinTimestampBoundUnsatisfiableError$Type();

class RefreshFailedError$Type extends MessageType<RefreshFailedError> {
    constructor() {
        super("cockroach.kv.kvpb.RefreshFailedError", [
            { no: 1, name: "reason", kind: "enum", opt: true, T: () => ["cockroach.kv.kvpb.RefreshFailedError.Reason", RefreshFailedError_Reason, "REASON_"] },
            { no: 2, name: "key", kind: "scalar", opt: true, T: 12  },
            { no: 3, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 4, name: "conflicting_txn", kind: "message", T: () => TxnMeta }
        ]);
    }
    create(value?: PartialMessage<RefreshFailedError>): RefreshFailedError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RefreshFailedError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RefreshFailedError): RefreshFailedError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.reason = reader.int32();
                    break;
                case  2:
                    message.key = reader.bytes();
                    break;
                case  3:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  4:
                    message.conflictingTxn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.conflictingTxn);
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

export const RefreshFailedError = /*#__PURE__*/ new RefreshFailedError$Type();

class ErrPosition$Type extends MessageType<ErrPosition> {
    constructor() {
        super("cockroach.kv.kvpb.ErrPosition", [
            { no: 1, name: "index", kind: "scalar", opt: true, T: 5  }
        ]);
    }
    create(value?: PartialMessage<ErrPosition>): ErrPosition {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ErrPosition>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ErrPosition): ErrPosition {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.index = reader.int32();
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

export const ErrPosition = /*#__PURE__*/ new ErrPosition$Type();

class Error$Type extends MessageType<Error> {
    constructor() {
        super("cockroach.kv.kvpb.Error", [
            { no: 4, name: "unexposed_txn", kind: "message", T: () => Transaction },
            { no: 5, name: "origin_node", kind: "scalar", opt: true, T: 5  },
            { no: 9, name: "encoded_error", kind: "message", T: () => EncodedError },
            { no: 7, name: "index", kind: "message", T: () => ErrPosition },
            { no: 8, name: "now", kind: "message", T: () => Timestamp }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<Error>): Error {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Error>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Error): Error {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  4:
                    message.unexposedTxn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.unexposedTxn);
                    break;
                case  5:
                    message.originNode = reader.int32();
                    break;
                case  9:
                    message.encodedError = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.encodedError);
                    break;
                case  7:
                    message.index = ErrPosition.internalBinaryRead(reader, reader.uint32(), options, message.index);
                    break;
                case  8:
                    message.now = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.now);
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

export const Error = /*#__PURE__*/ new Error$Type();

class InsufficientSpaceError$Type extends MessageType<InsufficientSpaceError> {
    constructor() {
        super("cockroach.kv.kvpb.InsufficientSpaceError", [
            { no: 1, name: "store_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 2, name: "op", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "available", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 4, name: "capacity", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 5, name: "required", kind: "scalar", opt: true, T: 1  }
        ]);
    }
    create(value?: PartialMessage<InsufficientSpaceError>): InsufficientSpaceError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<InsufficientSpaceError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InsufficientSpaceError): InsufficientSpaceError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.storeId = reader.int64().toBigInt();
                    break;
                case  2:
                    message.op = reader.string();
                    break;
                case  3:
                    message.available = reader.int64().toBigInt();
                    break;
                case  4:
                    message.capacity = reader.int64().toBigInt();
                    break;
                case  5:
                    message.required = reader.double();
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

export const InsufficientSpaceError = /*#__PURE__*/ new InsufficientSpaceError$Type();

class PebbleCorruptionError$Type extends MessageType<PebbleCorruptionError> {
    constructor() {
        super("cockroach.kv.kvpb.PebbleCorruptionError", [
            { no: 1, name: "store_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 2, name: "path", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "is_remote", kind: "scalar", opt: true, T: 8  },
            { no: 4, name: "extra_msg", kind: "scalar", opt: true, T: 9  }
        ]);
    }
    create(value?: PartialMessage<PebbleCorruptionError>): PebbleCorruptionError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PebbleCorruptionError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PebbleCorruptionError): PebbleCorruptionError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.storeId = reader.int64().toBigInt();
                    break;
                case  2:
                    message.path = reader.string();
                    break;
                case  3:
                    message.isRemote = reader.bool();
                    break;
                case  4:
                    message.extraMsg = reader.string();
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

export const PebbleCorruptionError = /*#__PURE__*/ new PebbleCorruptionError$Type();

class ExclusionViolationError$Type extends MessageType<ExclusionViolationError> {
    constructor() {
        super("cockroach.kv.kvpb.ExclusionViolationError", [
            { no: 1, name: "expected_exclusion_since_timestamp", kind: "message", T: () => Timestamp },
            { no: 2, name: "violation_timestamp", kind: "message", T: () => Timestamp },
            { no: 3, name: "key", kind: "scalar", opt: true, T: 12  }
        ]);
    }
    create(value?: PartialMessage<ExclusionViolationError>): ExclusionViolationError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ExclusionViolationError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExclusionViolationError): ExclusionViolationError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.expectedExclusionSinceTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.expectedExclusionSinceTimestamp);
                    break;
                case  2:
                    message.violationTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.violationTimestamp);
                    break;
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

export const ExclusionViolationError = /*#__PURE__*/ new ExclusionViolationError$Type();
