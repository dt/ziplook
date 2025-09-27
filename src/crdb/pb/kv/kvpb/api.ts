// @ts-nocheck

import { SpanConfigConformanceResponse } from "../../roachpb/span_config";
import { SpanConfigConformanceRequest } from "../../roachpb/span_config";
import { UpdateSpanConfigsResponse } from "../../roachpb/span_config";
import { UpdateSpanConfigsRequest } from "../../roachpb/span_config";
import { GetAllSystemSpanConfigsThatApplyResponse } from "../../roachpb/span_config";
import { GetAllSystemSpanConfigsThatApplyRequest } from "../../roachpb/span_config";
import { GetSpanConfigsResponse } from "../../roachpb/span_config";
import { GetSpanConfigsRequest } from "../../roachpb/span_config";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { EncodedValue } from "../../settings/encoding";
import { TenantCapabilities } from "../../multitenant/tenantcapabilitiespb/capabilities";
import { EncodedError } from "../../errorspb/errors";
import { TenantID } from "../../roachpb/data";
import { RecordedSpan } from "../../util/tracing/tracingpb/recorded_span";
import { Error } from "./errors";
import { ConnectionClass } from "../../rpc/rpcpb/rpc";
import { IndexFetchSpec } from "../../sql/catalog/fetchpb/index_fetch";
import { TraceInfo } from "../../util/tracing/tracingpb/tracing";
import { ClientRangeInfo } from "../../roachpb/data";
import { Duration } from "../../google/protobuf/duration";
import { WaitPolicy } from "../kvserver/concurrency/lock/locking";
import { Version } from "../../roachpb/metadata";
import { ReadSummary } from "../kvserver/readsummary/rspb/summary";
import { MVCCStats } from "../../storage/enginepb/mvcc";
import { RangeInfo } from "../../roachpb/data";
import { ReplicaDescriptor } from "../../roachpb/metadata";
import { Lease } from "../../roachpb/data";
import { ObservedTimestamp } from "../../roachpb/data";
import { TransactionStatus } from "../../roachpb/data";
import { LockStateInfo } from "../../roachpb/data";
import { IgnoredSeqNumRange } from "../../storage/enginepb/mvcc3";
import { TxnMeta } from "../../storage/enginepb/mvcc3";
import { RangeDescriptor } from "../../roachpb/metadata";
import { ReplicationTarget } from "../../roachpb/metadata";
import { ReplicaChangeType } from "../../roachpb/data";
import { SequencedWrite } from "../../roachpb/data";
import { InternalCommitTrigger } from "../../roachpb/data";
import { MVCCStatsDelta } from "../../storage/enginepb/mvcc3";
import { KeyValue } from "../../roachpb/data";
import { Value } from "../../roachpb/data";
import { Timestamp } from "../../util/hlc/timestamp";
import { Durability } from "../kvserver/concurrency/lock/locking";
import { Strength } from "../kvserver/concurrency/lock/locking";
import { Span } from "../../roachpb/data";
import { Transaction } from "../../roachpb/data";

export interface RequestHeader {

    kvnemesisSeq?: RequestHeader_Empty;

    key: Uint8Array;

    endKey: Uint8Array;

    sequence: number;
}

export interface RequestHeader_Empty {
}

export interface ResponseHeader {

    txn?: Transaction;

    resumeSpan?: Span;

    resumeReason: ResumeReason;

    resumeNextBytes: bigint;

    numKeys: bigint;

    numBytes: bigint;
}

export interface GetRequest {

    header?: RequestHeader;

    keyLockingStrength: Strength;

    keyLockingDurability: Durability;

    returnRawMvccValues: boolean;

    lockNonExisting: boolean;

    expectExclusionSince?: Timestamp;
}

export interface GetResponse {

    header?: ResponseHeader;

    value?: Value;

    intentValue?: Value;
}

export interface ProbeRequest {

    header?: RequestHeader;
}

export interface ProbeResponse {

    header?: ResponseHeader;
}

export interface IsSpanEmptyRequest {

    header?: RequestHeader;
}

export interface IsSpanEmptyResponse {

    header?: ResponseHeader;
}

export interface PutRequest {

    header?: RequestHeader;

    value?: Value;

    inline: boolean;

    blind: boolean;

    mustAcquireExclusiveLock: boolean;

    expectExclusionSince?: Timestamp;
}

export interface PutResponse {

    header?: ResponseHeader;
}

export interface ConditionalPutRequest {

    header?: RequestHeader;

    value?: Value;

    expBytes: Uint8Array;

    blind: boolean;

    allowIfDoesNotExist: boolean;

    inline: boolean;

    originTimestamp?: Timestamp;
}

export interface ConditionalPutResponse {

    header?: ResponseHeader;
}

export interface IncrementRequest {

    header?: RequestHeader;

    increment: bigint;
}

export interface IncrementResponse {

    header?: ResponseHeader;

    newValue: bigint;
}

export interface DeleteRequest {

    header?: RequestHeader;

    mustAcquireExclusiveLock: boolean;

    expectExclusionSince?: Timestamp;
}

export interface DeleteResponse {

    header?: ResponseHeader;

    foundKey: boolean;
}

export interface DeleteRangeRequest {

    header?: RequestHeader;

    returnKeys: boolean;

    inline: boolean;

    useRangeTombstone: boolean;

    idempotentTombstone: boolean;

    updateRangeDeleteGcHint: boolean;

    predicates?: DeleteRangePredicates;
}

export interface DeleteRangePredicates {

    importEpoch: number;

    startTime?: Timestamp;
}

export interface DeleteRangeResponse {

    header?: ResponseHeader;

    keys: Uint8Array[];
}

export interface ClearRangeRequest {

    header?: RequestHeader;

    deadline?: Timestamp;
}

export interface ClearRangeResponse {

    header?: ResponseHeader;
}

export interface RevertRangeRequest {

    header?: RequestHeader;

    targetTime?: Timestamp;

    ignoreGcThreshold: boolean;
}

export interface RevertRangeResponse {

    header?: ResponseHeader;
}

export interface ColBatches {

    colBatches: Uint8Array[];
}

export interface ScanRequest {

    header?: RequestHeader;

    scanFormat: ScanFormat;

    keyLockingStrength: Strength;

    keyLockingDurability: Durability;

    returnRawMvccValues: boolean;
}

export interface ScanResponse {

    header?: ResponseHeader;

    rows: KeyValue[];

    intentRows: KeyValue[];

    batchResponses: Uint8Array[];

    colBatches?: ColBatches;
}

export interface ExciseRequest {

    header?: RequestHeader;
}

export interface ExciseResponse {

    header?: ResponseHeader;
}

export interface ReverseScanRequest {

    header?: RequestHeader;

    scanFormat: ScanFormat;

    keyLockingStrength: Strength;

    keyLockingDurability: Durability;

    returnRawMvccValues: boolean;
}

export interface ReverseScanResponse {

    header?: ResponseHeader;

    rows: KeyValue[];

    intentRows: KeyValue[];

    batchResponses: Uint8Array[];

    colBatches?: ColBatches;
}

export interface CheckConsistencyRequest {

    header?: RequestHeader;

    mode: ChecksumMode;
}

export interface CheckConsistencyResponse {

    header?: ResponseHeader;

    result: CheckConsistencyResponse_Result[];
}

export interface CheckConsistencyResponse_Result {

    rangeId: bigint;

    startKey: Uint8Array;

    status: CheckConsistencyResponse_Status;

    detail: string;
}

export enum CheckConsistencyResponse_Status {

    RANGE_INDETERMINATE = 0,

    RANGE_INCONSISTENT = 1,

    RANGE_CONSISTENT = 2,

    RANGE_CONSISTENT_STATS_ESTIMATED = 3,

    RANGE_CONSISTENT_STATS_INCORRECT = 4
}

export interface RecomputeStatsRequest {

    header?: RequestHeader;

    dryRun: boolean;
}

export interface RecomputeStatsResponse {

    header?: ResponseHeader;

    addedDelta?: MVCCStatsDelta;
}

export interface EndTxnRequest {

    header?: RequestHeader;

    commit: boolean;

    deadline?: Timestamp;

    internalCommitTrigger?: InternalCommitTrigger;

    lockSpans: Span[];

    inFlightWrites: SequencedWrite[];

    require1Pc: boolean;

    disable1Pc: boolean;

    poison: boolean;

    prepare: boolean;
}

export interface EndTxnResponse {

    header?: ResponseHeader;

    onePhaseCommit: boolean;

    stagingTimestamp?: Timestamp;

    replicatedLocalLocksReleasedOnCommit: Span[];
}

export interface AdminSplitRequest {

    header?: RequestHeader;

    splitKey: Uint8Array;

    expirationTime?: Timestamp;

    predicateKeys: Uint8Array[];
}

export interface AdminSplitResponse {

    header?: ResponseHeader;
}

export interface AdminUnsplitRequest {

    header?: RequestHeader;
}

export interface AdminUnsplitResponse {

    header?: ResponseHeader;
}

export interface AdminMergeRequest {

    header?: RequestHeader;
}

export interface AdminMergeResponse {

    header?: ResponseHeader;
}

export interface AdminTransferLeaseRequest {

    header?: RequestHeader;

    target: number;

    bypassSafetyChecks: boolean;
}

export interface AdminTransferLeaseResponse {

    header?: ResponseHeader;
}

export interface ReplicationChange {

    changeType: ReplicaChangeType;

    target?: ReplicationTarget;
}

export interface AdminChangeReplicasRequest {

    header?: RequestHeader;

    deprecatedChangeType: ReplicaChangeType;

    deprecatedTargets: ReplicationTarget[];

    expDesc?: RangeDescriptor;

    internalChanges: ReplicationChange[];
}

export interface AdminChangeReplicasResponse {

    header?: ResponseHeader;

    desc?: RangeDescriptor;
}

export interface AdminRelocateRangeRequest {

    header?: RequestHeader;

    voterTargets: ReplicationTarget[];

    nonVoterTargets: ReplicationTarget[];

    transferLeaseToFirstVoter: boolean;

    transferLeaseToFirstVoterAccurate: boolean;
}

export interface AdminRelocateRangeResponse {

    header?: ResponseHeader;
}

export interface HeartbeatTxnRequest {

    header?: RequestHeader;

    now?: Timestamp;
}

export interface HeartbeatTxnResponse {

    header?: ResponseHeader;
}

export interface GCRequest {

    header?: RequestHeader;

    keys: GCRequest_GCKey[];

    rangeKeys: GCRequest_GCRangeKey[];

    threshold?: Timestamp;

    clearRange?: GCRequest_GCClearRange;
}

export interface GCRequest_GCKey {

    key: Uint8Array;

    timestamp?: Timestamp;
}

export interface GCRequest_GCRangeKey {

    startKey: Uint8Array;

    endKey: Uint8Array;

    timestamp?: Timestamp;
}

export interface GCRequest_GCClearRange {

    startKey: Uint8Array;

    endKey: Uint8Array;

    startKeyTimestamp?: Timestamp;
}

export interface GCResponse {

    header?: ResponseHeader;
}

export interface PushTxnRequest {

    header?: RequestHeader;

    pusherTxn?: Transaction;

    pusheeTxn?: TxnMeta;

    pushTo?: Timestamp;

    pushType: PushTxnType;

    force: boolean;
}

export interface PushTxnResponse {

    header?: ResponseHeader;

    pusheeTxn?: Transaction;

    ambiguousAbort: boolean;
}

export interface RecoverTxnRequest {

    header?: RequestHeader;

    txn?: TxnMeta;

    implicitlyCommitted: boolean;
}

export interface RecoverTxnResponse {

    header?: ResponseHeader;

    recoveredTxn?: Transaction;
}

export interface QueryTxnRequest {

    header?: RequestHeader;

    txn?: TxnMeta;

    waitForUpdate: boolean;

    knownWaitingTxns: Uint8Array[];
}

export interface QueryTxnResponse {

    header?: ResponseHeader;

    queriedTxn?: Transaction;

    txnRecordExists: boolean;

    waitingTxns: Uint8Array[];
}

export interface QueryIntentRequest {

    header?: RequestHeader;

    txn?: TxnMeta;

    errorIfMissing: boolean;

    strength: Strength;

    ignoredSeqnums: IgnoredSeqNumRange[];
}

export interface QueryIntentResponse {

    header?: ResponseHeader;

    foundUnpushedIntent: boolean;

    foundIntent: boolean;
}

export interface QueryLocksRequest {

    header?: RequestHeader;

    includeUncontended: boolean;
}

export interface QueryLocksResponse {

    header?: ResponseHeader;

    locks: LockStateInfo[];
}

export interface ResolveIntentRequest {

    header?: RequestHeader;

    intentTxn?: TxnMeta;

    status: TransactionStatus;

    poison: boolean;

    ignoredSeqnums: IgnoredSeqNumRange[];

    clockWhilePending?: ObservedTimestamp;
}

export interface ResolveIntentResponse {

    header?: ResponseHeader;

    replicatedLocksReleasedCommitTimestamp?: Timestamp;
}

export interface ResolveIntentRangeRequest {

    header?: RequestHeader;

    intentTxn?: TxnMeta;

    status: TransactionStatus;

    poison: boolean;

    minTimestamp?: Timestamp;

    ignoredSeqnums: IgnoredSeqNumRange[];

    clockWhilePending?: ObservedTimestamp;
}

export interface ResolveIntentRangeResponse {

    header?: ResponseHeader;

    replicatedLocksReleasedCommitTimestamp?: Timestamp;
}

export interface MergeRequest {

    header?: RequestHeader;

    value?: Value;
}

export interface MergeResponse {

    header?: ResponseHeader;
}

export interface TruncateLogRequest {

    header?: RequestHeader;

    index: bigint;

    rangeId: bigint;

    expectedFirstIndex: bigint;
}

export interface TruncateLogResponse {

    header?: ResponseHeader;
}

export interface RequestLeaseRequest {

    header?: RequestHeader;

    lease?: Lease;

    prevLease?: Lease;

    revokePrevAndForwardExpiration: boolean;
}

export interface TransferLeaseRequest {

    header?: RequestHeader;

    lease?: Lease;

    prevLease?: Lease;

    bypassSafetyChecks: boolean;
}

export interface LeaseInfoRequest {

    header?: RequestHeader;
}

export interface LeaseInfoResponse {

    header?: ResponseHeader;

    lease?: Lease;

    currentLease?: Lease;

    evaluatedBy: number;
}

export interface RequestLeaseResponse {

    header?: ResponseHeader;
}

export interface ComputeChecksumRequest {

    header?: RequestHeader;

    version: number;

    mode: ChecksumMode;

    checkpoint: boolean;

    terminate: ReplicaDescriptor[];
}

export interface ComputeChecksumResponse {

    header?: ResponseHeader;

    checksumId: Uint8Array;
}

export interface RetryTracingEvent {

    operation: string;

    attemptNumber: number;

    retryError: string;
}

export interface FileEncryptionOptions {

    key: Uint8Array;
}

export interface ExportRequest {

    header?: RequestHeader;

    resumeKeyTs?: Timestamp;

    mvccFilter: MVCCFilter;

    startTime?: Timestamp;

    splitMidKey: boolean;

    encryption?: FileEncryptionOptions;

    targetFileSize: bigint;

    exportFingerprint: boolean;

    fingerprintOptions?: FingerprintOptions;

    includeMvccValueHeader: boolean;
}

export interface FingerprintOptions {

    stripIndexPrefixAndTimestamp: boolean;
}

export interface BulkOpSummary {

    dataSize: bigint;

    sstDataSize: bigint;

    entryCounts: {
        [key: string]: bigint;
    };
}

export interface ExportResponse {

    header?: ResponseHeader;

    files: ExportResponse_File[];

    startTime?: Timestamp;
}

export interface ExportResponse_File {

    span?: Span;

    endKeyTs?: Timestamp;

    exported?: BulkOpSummary;

    sst: Uint8Array;

    localityKv: string;

    fingerprint: bigint;
}

export interface AdminScatterRequest {

    header?: RequestHeader;

    randomizeLeases: boolean;

    maxSize: bigint;
}

export interface AdminScatterResponse {

    header?: ResponseHeader;

    rangeInfos: RangeInfo[];

    mvccStats?: MVCCStats;

    replicasScatteredBytes: bigint;
}

export interface AdminScatterResponse_Range {

    span?: Span;
}

export interface AddSSTableRequest {

    header?: RequestHeader;

    data: Uint8Array;

    sstTimestampToRequestTimestamp?: Timestamp;

    disallowConflicts: boolean;

    disallowShadowingBelow?: Timestamp;

    mvccStats?: MVCCStats;

    ingestAsWrites: boolean;

    returnFollowingLikelyNonEmptySpanStart: boolean;

    ignoreKeysAboveTimestamp?: Timestamp;

    computeStatsDiff: boolean;
}

export interface AddSSTableResponse {

    header?: ResponseHeader;

    rangeSpan?: Span;

    availableBytes: bigint;

    followingLikelyNonEmptySpanStart: Uint8Array;
}

export interface LinkExternalSSTableRequest {

    header?: RequestHeader;

    externalFile?: LinkExternalSSTableRequest_ExternalFile;
}

export interface LinkExternalSSTableRequest_ExternalFile {

    locator: string;

    path: string;

    backingFileSize: bigint;

    approximatePhysicalSize: bigint;

    syntheticPrefix: Uint8Array;

    useSyntheticSuffix: boolean;

    mvccStats?: MVCCStats;
}

export interface LinkExternalSSTableResponse {

    header?: ResponseHeader;
}

export interface RefreshRequest {

    header?: RequestHeader;

    refreshFrom?: Timestamp;
}

export interface RefreshResponse {

    header?: ResponseHeader;
}

export interface RefreshRangeRequest {

    header?: RequestHeader;

    refreshFrom?: Timestamp;
}

export interface RefreshRangeResponse {

    header?: ResponseHeader;
}

export interface SubsumeRequest {

    header?: RequestHeader;

    leftDesc?: RangeDescriptor;

    rightDesc?: RangeDescriptor;

    preserveUnreplicatedLocks: boolean;
}

export interface SubsumeResponse {

    header?: ResponseHeader;

    mvccStats?: MVCCStats;

    rangeIdLocalMvccStats?: MVCCStats;

    leaseAppliedIndex: bigint;

    freezeStart?: Timestamp;

    closedTimestamp?: Timestamp;

    readSummary?: ReadSummary;
}

export interface RangeStatsRequest {

    header?: RequestHeader;
}

export interface RangeStatsResponse {

    header?: ResponseHeader;

    mvccStats?: MVCCStats;

    maxQueriesPerSecond: number;

    maxQueriesPerSecondSet: boolean;

    maxCpuPerSecond: number;

    rangeInfo?: RangeInfo;
}

export interface MigrateRequest {

    header?: RequestHeader;

    version?: Version;
}

export interface MigrateResponse {

    header?: ResponseHeader;
}

export interface QueryResolvedTimestampRequest {

    header?: RequestHeader;
}

export interface QueryResolvedTimestampResponse {

    header?: ResponseHeader;

    resolvedTs?: Timestamp;
}

export interface BarrierRequest {

    header?: RequestHeader;

    withLeaseAppliedIndex: boolean;
}

export interface BarrierResponse {

    header?: ResponseHeader;

    timestamp?: Timestamp;

    leaseAppliedIndex: bigint;

    rangeDesc?: RangeDescriptor;
}

export interface FlushLockTableRequest {

    header?: RequestHeader;
}

export interface FlushLockTableResponse {

    header?: ResponseHeader;

    locksWritten: bigint;
}

export interface RequestUnion {

    value: {
        oneofKind: "get";

        get: GetRequest;
    } | {
        oneofKind: "put";

        put: PutRequest;
    } | {
        oneofKind: "conditionalPut";

        conditionalPut: ConditionalPutRequest;
    } | {
        oneofKind: "increment";

        increment: IncrementRequest;
    } | {
        oneofKind: "delete";

        delete: DeleteRequest;
    } | {
        oneofKind: "deleteRange";

        deleteRange: DeleteRangeRequest;
    } | {
        oneofKind: "clearRange";

        clearRange: ClearRangeRequest;
    } | {
        oneofKind: "revertRange";

        revertRange: RevertRangeRequest;
    } | {
        oneofKind: "scan";

        scan: ScanRequest;
    } | {
        oneofKind: "endTxn";

        endTxn: EndTxnRequest;
    } | {
        oneofKind: "adminSplit";

        adminSplit: AdminSplitRequest;
    } | {
        oneofKind: "adminUnsplit";

        adminUnsplit: AdminUnsplitRequest;
    } | {
        oneofKind: "adminMerge";

        adminMerge: AdminMergeRequest;
    } | {
        oneofKind: "adminTransferLease";

        adminTransferLease: AdminTransferLeaseRequest;
    } | {
        oneofKind: "adminChangeReplicas";

        adminChangeReplicas: AdminChangeReplicasRequest;
    } | {
        oneofKind: "adminRelocateRange";

        adminRelocateRange: AdminRelocateRangeRequest;
    } | {
        oneofKind: "heartbeatTxn";

        heartbeatTxn: HeartbeatTxnRequest;
    } | {
        oneofKind: "gc";

        gc: GCRequest;
    } | {
        oneofKind: "pushTxn";

        pushTxn: PushTxnRequest;
    } | {
        oneofKind: "recoverTxn";

        recoverTxn: RecoverTxnRequest;
    } | {
        oneofKind: "resolveIntent";

        resolveIntent: ResolveIntentRequest;
    } | {
        oneofKind: "resolveIntentRange";

        resolveIntentRange: ResolveIntentRangeRequest;
    } | {
        oneofKind: "merge";

        merge: MergeRequest;
    } | {
        oneofKind: "truncateLog";

        truncateLog: TruncateLogRequest;
    } | {
        oneofKind: "requestLease";

        requestLease: RequestLeaseRequest;
    } | {
        oneofKind: "reverseScan";

        reverseScan: ReverseScanRequest;
    } | {
        oneofKind: "computeChecksum";

        computeChecksum: ComputeChecksumRequest;
    } | {
        oneofKind: "checkConsistency";

        checkConsistency: CheckConsistencyRequest;
    } | {
        oneofKind: "transferLease";

        transferLease: TransferLeaseRequest;
    } | {
        oneofKind: "leaseInfo";

        leaseInfo: LeaseInfoRequest;
    } | {
        oneofKind: "export";

        export: ExportRequest;
    } | {
        oneofKind: "queryTxn";

        queryTxn: QueryTxnRequest;
    } | {
        oneofKind: "queryIntent";

        queryIntent: QueryIntentRequest;
    } | {
        oneofKind: "queryLocks";

        queryLocks: QueryLocksRequest;
    } | {
        oneofKind: "adminScatter";

        adminScatter: AdminScatterRequest;
    } | {
        oneofKind: "addSstable";

        addSstable: AddSSTableRequest;
    } | {
        oneofKind: "recomputeStats";

        recomputeStats: RecomputeStatsRequest;
    } | {
        oneofKind: "refresh";

        refresh: RefreshRequest;
    } | {
        oneofKind: "refreshRange";

        refreshRange: RefreshRangeRequest;
    } | {
        oneofKind: "subsume";

        subsume: SubsumeRequest;
    } | {
        oneofKind: "rangeStats";

        rangeStats: RangeStatsRequest;
    } | {
        oneofKind: "migrate";

        migrate: MigrateRequest;
    } | {
        oneofKind: "queryResolvedTimestamp";

        queryResolvedTimestamp: QueryResolvedTimestampRequest;
    } | {
        oneofKind: "barrier";

        barrier: BarrierRequest;
    } | {
        oneofKind: "probe";

        probe: ProbeRequest;
    } | {
        oneofKind: "isSpanEmpty";

        isSpanEmpty: IsSpanEmptyRequest;
    } | {
        oneofKind: "linkExternalSstable";

        linkExternalSstable: LinkExternalSSTableRequest;
    } | {
        oneofKind: "excise";

        excise: ExciseRequest;
    } | {
        oneofKind: "flushLockTable";

        flushLockTable: FlushLockTableRequest;
    } | {
        oneofKind: undefined;
    };
}

export interface ResponseUnion {

    value: {
        oneofKind: "get";

        get: GetResponse;
    } | {
        oneofKind: "put";

        put: PutResponse;
    } | {
        oneofKind: "conditionalPut";

        conditionalPut: ConditionalPutResponse;
    } | {
        oneofKind: "increment";

        increment: IncrementResponse;
    } | {
        oneofKind: "delete";

        delete: DeleteResponse;
    } | {
        oneofKind: "deleteRange";

        deleteRange: DeleteRangeResponse;
    } | {
        oneofKind: "clearRange";

        clearRange: ClearRangeResponse;
    } | {
        oneofKind: "revertRange";

        revertRange: RevertRangeResponse;
    } | {
        oneofKind: "scan";

        scan: ScanResponse;
    } | {
        oneofKind: "endTxn";

        endTxn: EndTxnResponse;
    } | {
        oneofKind: "adminSplit";

        adminSplit: AdminSplitResponse;
    } | {
        oneofKind: "adminUnsplit";

        adminUnsplit: AdminUnsplitResponse;
    } | {
        oneofKind: "adminMerge";

        adminMerge: AdminMergeResponse;
    } | {
        oneofKind: "adminTransferLease";

        adminTransferLease: AdminTransferLeaseResponse;
    } | {
        oneofKind: "adminChangeReplicas";

        adminChangeReplicas: AdminChangeReplicasResponse;
    } | {
        oneofKind: "adminRelocateRange";

        adminRelocateRange: AdminRelocateRangeResponse;
    } | {
        oneofKind: "heartbeatTxn";

        heartbeatTxn: HeartbeatTxnResponse;
    } | {
        oneofKind: "gc";

        gc: GCResponse;
    } | {
        oneofKind: "pushTxn";

        pushTxn: PushTxnResponse;
    } | {
        oneofKind: "recoverTxn";

        recoverTxn: RecoverTxnResponse;
    } | {
        oneofKind: "resolveIntent";

        resolveIntent: ResolveIntentResponse;
    } | {
        oneofKind: "resolveIntentRange";

        resolveIntentRange: ResolveIntentRangeResponse;
    } | {
        oneofKind: "merge";

        merge: MergeResponse;
    } | {
        oneofKind: "truncateLog";

        truncateLog: TruncateLogResponse;
    } | {
        oneofKind: "requestLease";

        requestLease: RequestLeaseResponse;
    } | {
        oneofKind: "reverseScan";

        reverseScan: ReverseScanResponse;
    } | {
        oneofKind: "computeChecksum";

        computeChecksum: ComputeChecksumResponse;
    } | {
        oneofKind: "checkConsistency";

        checkConsistency: CheckConsistencyResponse;
    } | {
        oneofKind: "leaseInfo";

        leaseInfo: LeaseInfoResponse;
    } | {
        oneofKind: "export";

        export: ExportResponse;
    } | {
        oneofKind: "queryTxn";

        queryTxn: QueryTxnResponse;
    } | {
        oneofKind: "queryIntent";

        queryIntent: QueryIntentResponse;
    } | {
        oneofKind: "queryLocks";

        queryLocks: QueryLocksResponse;
    } | {
        oneofKind: "adminScatter";

        adminScatter: AdminScatterResponse;
    } | {
        oneofKind: "addSstable";

        addSstable: AddSSTableResponse;
    } | {
        oneofKind: "recomputeStats";

        recomputeStats: RecomputeStatsResponse;
    } | {
        oneofKind: "refresh";

        refresh: RefreshResponse;
    } | {
        oneofKind: "refreshRange";

        refreshRange: RefreshRangeResponse;
    } | {
        oneofKind: "subsume";

        subsume: SubsumeResponse;
    } | {
        oneofKind: "rangeStats";

        rangeStats: RangeStatsResponse;
    } | {
        oneofKind: "migrate";

        migrate: MigrateResponse;
    } | {
        oneofKind: "queryResolvedTimestamp";

        queryResolvedTimestamp: QueryResolvedTimestampResponse;
    } | {
        oneofKind: "barrier";

        barrier: BarrierResponse;
    } | {
        oneofKind: "probe";

        probe: ProbeResponse;
    } | {
        oneofKind: "isSpanEmpty";

        isSpanEmpty: IsSpanEmptyResponse;
    } | {
        oneofKind: "linkExternalSstable";

        linkExternalSstable: LinkExternalSSTableResponse;
    } | {
        oneofKind: "excise";

        excise: ExciseResponse;
    } | {
        oneofKind: "flushLockTable";

        flushLockTable: FlushLockTableResponse;
    } | {
        oneofKind: undefined;
    };
}

export interface Header {

    timestamp?: Timestamp;

    timestampFromServerClock?: Timestamp;

    now?: Timestamp;

    replica?: ReplicaDescriptor;

    rangeId: bigint;

    userPriority: number;

    txn?: Transaction;

    readConsistency: ReadConsistencyType;

    routingPolicy: RoutingPolicy;

    waitPolicy: WaitPolicy;

    lockTimeout?: Duration;

    maxSpanRequestKeys: bigint;

    targetBytes: bigint;

    wholeRowsOfSize: number;

    allowEmpty: boolean;

    distinctSpans: boolean;

    asyncConsensus: boolean;

    canForwardReadTimestamp: boolean;

    gatewayNodeId: number;

    clientRangeInfo?: ClientRangeInfo;

    boundedStaleness?: BoundedStalenessHeader;

    traceInfo?: TraceInfo;

    indexFetchSpec?: IndexFetchSpec;

    returnElasticCpuResumeSpans: boolean;

    profileLabels: string[];

    ambiguousReplayProtection: boolean;

    connectionClass: ConnectionClass;

    proxyRangeInfo?: RangeInfo;

    writeOptions?: WriteOptions;

    deadlockTimeout?: Duration;

    hasBufferedAllPrecedingWrites: boolean;

    isReverse: boolean;
}

export interface WriteOptions {

    originId: number;

    originTimestamp?: Timestamp;
}

export interface BoundedStalenessHeader {

    minTimestampBound?: Timestamp;

    minTimestampBoundStrict: boolean;

    maxTimestampBound?: Timestamp;
}

export interface AdmissionHeader {

    priority: number;

    createTime: bigint;

    source: AdmissionHeader_Source;

    sourceLocation: AdmissionHeader_SourceLocation;

    noMemoryReservedAtSource: boolean;
}

export enum AdmissionHeader_Source {

    OTHER = 0,

    FROM_SQL = 1,

    ROOT_KV = 2
}

export enum AdmissionHeader_SourceLocation {

    REMOTE = 0,

    LOCAL = 1
}

export interface BatchRequest {

    header?: Header;

    requests: RequestUnion[];

    admissionHeader?: AdmissionHeader;
}

export interface BatchResponse {

    header?: BatchResponse_Header;

    responses: ResponseUnion[];
}

export interface BatchResponse_Header {

    error?: Error;

    timestamp?: Timestamp;

    txn?: Transaction;

    now?: Timestamp;

    collectedSpans: RecordedSpan[];

    rangeInfos: RangeInfo[];
}

export interface RangeLookupRequest {

    key: Uint8Array;

    readConsistency: ReadConsistencyType;

    prefetchNum: bigint;

    prefetchReverse: boolean;
}

export interface RangeLookupResponse {

    descriptors: RangeDescriptor[];

    prefetchedDescriptors: RangeDescriptor[];

    error?: Error;
}

export interface RangeFeedRequest {

    header?: Header;

    span?: Span;

    withDiff: boolean;

    admissionHeader?: AdmissionHeader;

    streamId: bigint;

    closeStream: boolean;

    withFiltering: boolean;

    withMatchingOriginIds: number[];

    consumerId: bigint;

    withBulkDelivery: boolean;
}

export interface RangeFeedValue {

    key: Uint8Array;

    value?: Value;

    prevValue?: Value;
}

export interface RangeFeedBulkEvents {

    events: RangeFeedEvent[];
}

export interface RangeFeedCheckpoint {

    span?: Span;

    resolvedTs?: Timestamp;
}

export interface RangeFeedError {

    error?: Error;
}

export interface RangeFeedSSTable {

    data: Uint8Array;

    span?: Span;

    writeTs?: Timestamp;
}

export interface RangeFeedDeleteRange {

    span?: Span;

    timestamp?: Timestamp;
}

export interface RangeFeedMetadata {

    span?: Span;

    fromManualSplit: boolean;

    parentStartKey: Uint8Array;
}

export interface RangeFeedEvent {

    val?: RangeFeedValue;

    checkpoint?: RangeFeedCheckpoint;

    error?: RangeFeedError;

    sst?: RangeFeedSSTable;

    deleteRange?: RangeFeedDeleteRange;

    metadata?: RangeFeedMetadata;

    bulkEvents?: RangeFeedBulkEvents;
}

export interface MuxRangeFeedEvent {

    event?: RangeFeedEvent;

    rangeId: number;

    streamId: bigint;
}

export interface ResetQuorumRequest {

    rangeId: number;
}

export interface ResetQuorumResponse {
}

export interface GossipSubscriptionRequest {

    patterns: string[];
}

export interface GossipSubscriptionEvent {

    key: string;

    content?: Value;

    patternMatched: string;

    error?: Error;
}

export interface TenantSettingsRequest {

    tenantId?: TenantID;
}

export interface TenantSettingsEvent {

    eventType: TenantSettingsEvent_EventType;

    error?: EncodedError;

    precedence: TenantSettingsEvent_Precedence;

    incremental: boolean;

    overrides: TenantSetting[];

    name: string;

    capabilities?: TenantCapabilities;

    dataState: number;

    serviceMode: number;

    clusterInitGracePeriodEndTS: bigint;
}

export enum TenantSettingsEvent_EventType {

    SETTING_EVENT = 0,

    METADATA_EVENT = 1
}

export enum TenantSettingsEvent_Precedence {

    INVALID = 0,

    TENANT_SPECIFIC_OVERRIDES = 1,

    ALL_TENANTS_OVERRIDES = 2
}

export interface TenantSetting {

    internalKey: string;

    value?: EncodedValue;
}

export interface TenantConsumption {

    rU: number;

    kvRU: number;

    readBatches: bigint;

    readRequests: bigint;

    readBytes: bigint;

    writeBatches: bigint;

    writeRequests: bigint;

    writeBytes: bigint;

    sqlPodsCpuSeconds: number;

    pgwireEgressBytes: bigint;

    externalIoIngressBytes: bigint;

    externalIoEgressBytes: bigint;

    crossRegionNetworkRU: number;

    estimatedCpuSeconds: number;
}

export interface TenantConsumptionRates {

    writeBatchRate: number;

    estimatedCpuRate: number;
}

export interface TokenBucketRequest {

    consumptionSinceLastRequest?: TenantConsumption;

    consumptionPeriod?: Duration;

    tenantId: bigint;

    instanceId: number;

    nextLiveInstanceId: number;

    instanceLease: Uint8Array;

    seqNum: bigint;

    requestedTokens: number;

    targetRequestPeriod?: Duration;
}

export interface TokenBucketResponse {

    error?: EncodedError;

    grantedTokens: number;

    trickleDuration?: Duration;

    fallbackRate: number;

    consumptionRates?: TenantConsumptionRates;
}

export interface JoinNodeRequest {

    binaryVersion?: Version;
}

export interface JoinNodeResponse {

    clusterId: Uint8Array;

    nodeId: number;

    storeId: number;

    activeVersion?: Version;
}

export interface GetRangeDescriptorsRequest {

    span?: Span;

    batchSize: bigint;
}

export interface GetRangeDescriptorsResponse {

    rangeDescriptors: RangeDescriptor[];
}

export interface ContentionEvent {

    key: Uint8Array;

    txnMeta?: TxnMeta;

    duration?: Duration;

    isLatch: boolean;
}

export interface ScanStats {

    numInterfaceSeeks: bigint;

    numInternalSeeks: bigint;

    numInterfaceSteps: bigint;

    numInternalSteps: bigint;

    blockBytes: bigint;

    blockBytesInCache: bigint;

    keyBytes: bigint;

    valueBytes: bigint;

    pointCount: bigint;

    pointsCoveredByRangeTombstones: bigint;

    rangeKeyCount: bigint;

    rangeKeyContainedPoints: bigint;

    rangeKeySkippedPoints: bigint;

    separatedPointCount: bigint;

    separatedPointValueBytes: bigint;

    separatedPointValueBytesFetched: bigint;

    separatedPointValueCountFetched: bigint;

    separatedPointValueReaderCacheMisses: bigint;

    blockReadDuration?: Duration;

    numGets: bigint;

    numScans: bigint;

    numReverseScans: bigint;

    nodeId: number;

    region: string;
}

export interface UsedFollowerRead {
}

export enum ReadConsistencyType {

    CONSISTENT = 0,

    READ_UNCOMMITTED = 1,

    INCONSISTENT = 2
}

export enum RoutingPolicy {

    LEASEHOLDER = 0,

    NEAREST = 1
}

export enum ResumeReason {

    RESUME_UNKNOWN = 0,

    RESUME_KEY_LIMIT = 1,

    RESUME_BYTE_LIMIT = 2,

    RESUME_INTENT_LIMIT = 3,

    RESUME_ELASTIC_CPU_LIMIT = 5
}

export enum ScanFormat {

    KEY_VALUES = 0,

    BATCH_RESPONSE = 1,

    COL_BATCH_RESPONSE = 2
}

export enum ChecksumMode {

    CHECK_VIA_QUEUE = 0,

    CHECK_FULL = 1,

    CHECK_STATS = 2
}

export enum PushTxnType {

    PUSH_TIMESTAMP = 0,

    PUSH_ABORT = 1,

    PUSH_TOUCH = 2
}

export enum MVCCFilter {

    Latest = 0,

    All = 1
}

class RequestHeader$Type extends MessageType<RequestHeader> {
    constructor() {
        super("cockroach.roachpb.RequestHeader", [
            { no: 6, name: "kvnemesis_seq", kind: "message", T: () => RequestHeader_Empty },
            { no: 3, name: "key", kind: "scalar", T: 12  },
            { no: 4, name: "end_key", kind: "scalar", T: 12  },
            { no: 5, name: "sequence", kind: "scalar", T: 5  }
        ]);
    }
    create(value?: PartialMessage<RequestHeader>): RequestHeader {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.endKey = new Uint8Array(0);
        message.sequence = 0;
        if (value !== undefined)
            reflectionMergePartial<RequestHeader>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RequestHeader): RequestHeader {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  6:
                    message.kvnemesisSeq = RequestHeader_Empty.internalBinaryRead(reader, reader.uint32(), options, message.kvnemesisSeq);
                    break;
                case  3:
                    message.key = reader.bytes();
                    break;
                case  4:
                    message.endKey = reader.bytes();
                    break;
                case  5:
                    message.sequence = reader.int32();
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

export const RequestHeader = /*#__PURE__*/ new RequestHeader$Type();

class RequestHeader_Empty$Type extends MessageType<RequestHeader_Empty> {
    constructor() {
        super("cockroach.roachpb.RequestHeader.Empty", []);
    }
    create(value?: PartialMessage<RequestHeader_Empty>): RequestHeader_Empty {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RequestHeader_Empty>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RequestHeader_Empty): RequestHeader_Empty {
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

export const RequestHeader_Empty = /*#__PURE__*/ new RequestHeader_Empty$Type();

class ResponseHeader$Type extends MessageType<ResponseHeader> {
    constructor() {
        super("cockroach.roachpb.ResponseHeader", [
            { no: 3, name: "txn", kind: "message", T: () => Transaction },
            { no: 4, name: "resume_span", kind: "message", T: () => Span },
            { no: 7, name: "resume_reason", kind: "enum", T: () => ["cockroach.roachpb.ResumeReason", ResumeReason] },
            { no: 9, name: "resume_next_bytes", kind: "scalar", T: 3 , L: 0  },
            { no: 5, name: "num_keys", kind: "scalar", T: 3 , L: 0  },
            { no: 8, name: "num_bytes", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<ResponseHeader>): ResponseHeader {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.resumeReason = 0;
        message.resumeNextBytes = 0n;
        message.numKeys = 0n;
        message.numBytes = 0n;
        if (value !== undefined)
            reflectionMergePartial<ResponseHeader>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResponseHeader): ResponseHeader {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  3:
                    message.txn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  4:
                    message.resumeSpan = Span.internalBinaryRead(reader, reader.uint32(), options, message.resumeSpan);
                    break;
                case  7:
                    message.resumeReason = reader.int32();
                    break;
                case  9:
                    message.resumeNextBytes = reader.int64().toBigInt();
                    break;
                case  5:
                    message.numKeys = reader.int64().toBigInt();
                    break;
                case  8:
                    message.numBytes = reader.int64().toBigInt();
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

export const ResponseHeader = /*#__PURE__*/ new ResponseHeader$Type();

class GetRequest$Type extends MessageType<GetRequest> {
    constructor() {
        super("cockroach.roachpb.GetRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "key_locking_strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] },
            { no: 3, name: "key_locking_durability", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Durability", Durability] },
            { no: 4, name: "return_raw_mvcc_values", kind: "scalar", T: 8  },
            { no: 5, name: "lock_non_existing", kind: "scalar", T: 8  },
            { no: 6, name: "expect_exclusion_since", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<GetRequest>): GetRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.keyLockingStrength = 0;
        message.keyLockingDurability = 0;
        message.returnRawMvccValues = false;
        message.lockNonExisting = false;
        if (value !== undefined)
            reflectionMergePartial<GetRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetRequest): GetRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.keyLockingStrength = reader.int32();
                    break;
                case  3:
                    message.keyLockingDurability = reader.int32();
                    break;
                case  4:
                    message.returnRawMvccValues = reader.bool();
                    break;
                case  5:
                    message.lockNonExisting = reader.bool();
                    break;
                case  6:
                    message.expectExclusionSince = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.expectExclusionSince);
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

export const GetRequest = /*#__PURE__*/ new GetRequest$Type();

class GetResponse$Type extends MessageType<GetResponse> {
    constructor() {
        super("cockroach.roachpb.GetResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "value", kind: "message", T: () => Value },
            { no: 3, name: "intent_value", kind: "message", T: () => Value }
        ]);
    }
    create(value?: PartialMessage<GetResponse>): GetResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<GetResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetResponse): GetResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.value = Value.internalBinaryRead(reader, reader.uint32(), options, message.value);
                    break;
                case  3:
                    message.intentValue = Value.internalBinaryRead(reader, reader.uint32(), options, message.intentValue);
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

export const GetResponse = /*#__PURE__*/ new GetResponse$Type();

class ProbeRequest$Type extends MessageType<ProbeRequest> {
    constructor() {
        super("cockroach.roachpb.ProbeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader }
        ]);
    }
    create(value?: PartialMessage<ProbeRequest>): ProbeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ProbeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ProbeRequest): ProbeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const ProbeRequest = /*#__PURE__*/ new ProbeRequest$Type();

class ProbeResponse$Type extends MessageType<ProbeResponse> {
    constructor() {
        super("cockroach.roachpb.ProbeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<ProbeResponse>): ProbeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ProbeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ProbeResponse): ProbeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const ProbeResponse = /*#__PURE__*/ new ProbeResponse$Type();

class IsSpanEmptyRequest$Type extends MessageType<IsSpanEmptyRequest> {
    constructor() {
        super("cockroach.roachpb.IsSpanEmptyRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader }
        ]);
    }
    create(value?: PartialMessage<IsSpanEmptyRequest>): IsSpanEmptyRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IsSpanEmptyRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IsSpanEmptyRequest): IsSpanEmptyRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const IsSpanEmptyRequest = /*#__PURE__*/ new IsSpanEmptyRequest$Type();

class IsSpanEmptyResponse$Type extends MessageType<IsSpanEmptyResponse> {
    constructor() {
        super("cockroach.roachpb.IsSpanEmptyResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<IsSpanEmptyResponse>): IsSpanEmptyResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IsSpanEmptyResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IsSpanEmptyResponse): IsSpanEmptyResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const IsSpanEmptyResponse = /*#__PURE__*/ new IsSpanEmptyResponse$Type();

class PutRequest$Type extends MessageType<PutRequest> {
    constructor() {
        super("cockroach.roachpb.PutRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "value", kind: "message", T: () => Value },
            { no: 3, name: "inline", kind: "scalar", T: 8  },
            { no: 4, name: "blind", kind: "scalar", T: 8  },
            { no: 5, name: "must_acquire_exclusive_lock", kind: "scalar", T: 8  },
            { no: 6, name: "expect_exclusion_since", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<PutRequest>): PutRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.inline = false;
        message.blind = false;
        message.mustAcquireExclusiveLock = false;
        if (value !== undefined)
            reflectionMergePartial<PutRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PutRequest): PutRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.value = Value.internalBinaryRead(reader, reader.uint32(), options, message.value);
                    break;
                case  3:
                    message.inline = reader.bool();
                    break;
                case  4:
                    message.blind = reader.bool();
                    break;
                case  5:
                    message.mustAcquireExclusiveLock = reader.bool();
                    break;
                case  6:
                    message.expectExclusionSince = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.expectExclusionSince);
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

export const PutRequest = /*#__PURE__*/ new PutRequest$Type();

class PutResponse$Type extends MessageType<PutResponse> {
    constructor() {
        super("cockroach.roachpb.PutResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<PutResponse>): PutResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PutResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PutResponse): PutResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const PutResponse = /*#__PURE__*/ new PutResponse$Type();

class ConditionalPutRequest$Type extends MessageType<ConditionalPutRequest> {
    constructor() {
        super("cockroach.roachpb.ConditionalPutRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "value", kind: "message", T: () => Value },
            { no: 6, name: "exp_bytes", kind: "scalar", T: 12  },
            { no: 4, name: "blind", kind: "scalar", T: 8  },
            { no: 5, name: "allow_if_does_not_exist", kind: "scalar", T: 8  },
            { no: 7, name: "inline", kind: "scalar", T: 8  },
            { no: 8, name: "origin_timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<ConditionalPutRequest>): ConditionalPutRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.expBytes = new Uint8Array(0);
        message.blind = false;
        message.allowIfDoesNotExist = false;
        message.inline = false;
        if (value !== undefined)
            reflectionMergePartial<ConditionalPutRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConditionalPutRequest): ConditionalPutRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.value = Value.internalBinaryRead(reader, reader.uint32(), options, message.value);
                    break;
                case  6:
                    message.expBytes = reader.bytes();
                    break;
                case  4:
                    message.blind = reader.bool();
                    break;
                case  5:
                    message.allowIfDoesNotExist = reader.bool();
                    break;
                case  7:
                    message.inline = reader.bool();
                    break;
                case  8:
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

export const ConditionalPutRequest = /*#__PURE__*/ new ConditionalPutRequest$Type();

class ConditionalPutResponse$Type extends MessageType<ConditionalPutResponse> {
    constructor() {
        super("cockroach.roachpb.ConditionalPutResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<ConditionalPutResponse>): ConditionalPutResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ConditionalPutResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConditionalPutResponse): ConditionalPutResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const ConditionalPutResponse = /*#__PURE__*/ new ConditionalPutResponse$Type();

class IncrementRequest$Type extends MessageType<IncrementRequest> {
    constructor() {
        super("cockroach.roachpb.IncrementRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "increment", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<IncrementRequest>): IncrementRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.increment = 0n;
        if (value !== undefined)
            reflectionMergePartial<IncrementRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IncrementRequest): IncrementRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.increment = reader.int64().toBigInt();
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

export const IncrementRequest = /*#__PURE__*/ new IncrementRequest$Type();

class IncrementResponse$Type extends MessageType<IncrementResponse> {
    constructor() {
        super("cockroach.roachpb.IncrementResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "new_value", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<IncrementResponse>): IncrementResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.newValue = 0n;
        if (value !== undefined)
            reflectionMergePartial<IncrementResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IncrementResponse): IncrementResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.newValue = reader.int64().toBigInt();
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

export const IncrementResponse = /*#__PURE__*/ new IncrementResponse$Type();

class DeleteRequest$Type extends MessageType<DeleteRequest> {
    constructor() {
        super("cockroach.roachpb.DeleteRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "must_acquire_exclusive_lock", kind: "scalar", T: 8  },
            { no: 3, name: "expect_exclusion_since", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<DeleteRequest>): DeleteRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.mustAcquireExclusiveLock = false;
        if (value !== undefined)
            reflectionMergePartial<DeleteRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteRequest): DeleteRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.mustAcquireExclusiveLock = reader.bool();
                    break;
                case  3:
                    message.expectExclusionSince = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.expectExclusionSince);
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

export const DeleteRequest = /*#__PURE__*/ new DeleteRequest$Type();

class DeleteResponse$Type extends MessageType<DeleteResponse> {
    constructor() {
        super("cockroach.roachpb.DeleteResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "found_key", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<DeleteResponse>): DeleteResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.foundKey = false;
        if (value !== undefined)
            reflectionMergePartial<DeleteResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteResponse): DeleteResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.foundKey = reader.bool();
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

export const DeleteResponse = /*#__PURE__*/ new DeleteResponse$Type();

class DeleteRangeRequest$Type extends MessageType<DeleteRangeRequest> {
    constructor() {
        super("cockroach.roachpb.DeleteRangeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 3, name: "return_keys", kind: "scalar", T: 8  },
            { no: 4, name: "inline", kind: "scalar", T: 8  },
            { no: 5, name: "use_range_tombstone", kind: "scalar", T: 8  },
            { no: 7, name: "idempotent_tombstone", kind: "scalar", T: 8  },
            { no: 8, name: "update_range_delete_gc_hint", kind: "scalar", T: 8  },
            { no: 6, name: "predicates", kind: "message", T: () => DeleteRangePredicates }
        ]);
    }
    create(value?: PartialMessage<DeleteRangeRequest>): DeleteRangeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.returnKeys = false;
        message.inline = false;
        message.useRangeTombstone = false;
        message.idempotentTombstone = false;
        message.updateRangeDeleteGcHint = false;
        if (value !== undefined)
            reflectionMergePartial<DeleteRangeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteRangeRequest): DeleteRangeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  3:
                    message.returnKeys = reader.bool();
                    break;
                case  4:
                    message.inline = reader.bool();
                    break;
                case  5:
                    message.useRangeTombstone = reader.bool();
                    break;
                case  7:
                    message.idempotentTombstone = reader.bool();
                    break;
                case  8:
                    message.updateRangeDeleteGcHint = reader.bool();
                    break;
                case  6:
                    message.predicates = DeleteRangePredicates.internalBinaryRead(reader, reader.uint32(), options, message.predicates);
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

export const DeleteRangeRequest = /*#__PURE__*/ new DeleteRangeRequest$Type();

class DeleteRangePredicates$Type extends MessageType<DeleteRangePredicates> {
    constructor() {
        super("cockroach.roachpb.DeleteRangePredicates", [
            { no: 1, name: "import_epoch", kind: "scalar", T: 13  },
            { no: 6, name: "start_time", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<DeleteRangePredicates>): DeleteRangePredicates {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.importEpoch = 0;
        if (value !== undefined)
            reflectionMergePartial<DeleteRangePredicates>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteRangePredicates): DeleteRangePredicates {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.importEpoch = reader.uint32();
                    break;
                case  6:
                    message.startTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.startTime);
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

export const DeleteRangePredicates = /*#__PURE__*/ new DeleteRangePredicates$Type();

class DeleteRangeResponse$Type extends MessageType<DeleteRangeResponse> {
    constructor() {
        super("cockroach.roachpb.DeleteRangeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "keys", kind: "scalar", repeat: 2 , T: 12  }
        ]);
    }
    create(value?: PartialMessage<DeleteRangeResponse>): DeleteRangeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.keys = [];
        if (value !== undefined)
            reflectionMergePartial<DeleteRangeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteRangeResponse): DeleteRangeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.keys.push(reader.bytes());
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

export const DeleteRangeResponse = /*#__PURE__*/ new DeleteRangeResponse$Type();

class ClearRangeRequest$Type extends MessageType<ClearRangeRequest> {
    constructor() {
        super("cockroach.roachpb.ClearRangeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "deadline", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<ClearRangeRequest>): ClearRangeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ClearRangeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ClearRangeRequest): ClearRangeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.deadline = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.deadline);
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

export const ClearRangeRequest = /*#__PURE__*/ new ClearRangeRequest$Type();

class ClearRangeResponse$Type extends MessageType<ClearRangeResponse> {
    constructor() {
        super("cockroach.roachpb.ClearRangeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<ClearRangeResponse>): ClearRangeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ClearRangeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ClearRangeResponse): ClearRangeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const ClearRangeResponse = /*#__PURE__*/ new ClearRangeResponse$Type();

class RevertRangeRequest$Type extends MessageType<RevertRangeRequest> {
    constructor() {
        super("cockroach.roachpb.RevertRangeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "target_time", kind: "message", T: () => Timestamp },
            { no: 4, name: "ignore_gc_threshold", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<RevertRangeRequest>): RevertRangeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.ignoreGcThreshold = false;
        if (value !== undefined)
            reflectionMergePartial<RevertRangeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RevertRangeRequest): RevertRangeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.targetTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.targetTime);
                    break;
                case  4:
                    message.ignoreGcThreshold = reader.bool();
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

export const RevertRangeRequest = /*#__PURE__*/ new RevertRangeRequest$Type();

class RevertRangeResponse$Type extends MessageType<RevertRangeResponse> {
    constructor() {
        super("cockroach.roachpb.RevertRangeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<RevertRangeResponse>): RevertRangeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RevertRangeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RevertRangeResponse): RevertRangeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const RevertRangeResponse = /*#__PURE__*/ new RevertRangeResponse$Type();

class ColBatches$Type extends MessageType<ColBatches> {
    constructor() {
        super("cockroach.roachpb.ColBatches", [
            { no: 1, name: "col_batches", kind: "scalar", repeat: 2 , T: 12  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": false, "gogoproto.marshaler": false, "gogoproto.unmarshaler": false, "gogoproto.sizer": false });
    }
    create(value?: PartialMessage<ColBatches>): ColBatches {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.colBatches = [];
        if (value !== undefined)
            reflectionMergePartial<ColBatches>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColBatches): ColBatches {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.colBatches.push(reader.bytes());
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

export const ColBatches = /*#__PURE__*/ new ColBatches$Type();

class ScanRequest$Type extends MessageType<ScanRequest> {
    constructor() {
        super("cockroach.roachpb.ScanRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 4, name: "scan_format", kind: "enum", T: () => ["cockroach.roachpb.ScanFormat", ScanFormat] },
            { no: 5, name: "key_locking_strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] },
            { no: 6, name: "key_locking_durability", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Durability", Durability] },
            { no: 7, name: "return_raw_mvcc_values", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<ScanRequest>): ScanRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.scanFormat = 0;
        message.keyLockingStrength = 0;
        message.keyLockingDurability = 0;
        message.returnRawMvccValues = false;
        if (value !== undefined)
            reflectionMergePartial<ScanRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ScanRequest): ScanRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  4:
                    message.scanFormat = reader.int32();
                    break;
                case  5:
                    message.keyLockingStrength = reader.int32();
                    break;
                case  6:
                    message.keyLockingDurability = reader.int32();
                    break;
                case  7:
                    message.returnRawMvccValues = reader.bool();
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

export const ScanRequest = /*#__PURE__*/ new ScanRequest$Type();

class ScanResponse$Type extends MessageType<ScanResponse> {
    constructor() {
        super("cockroach.roachpb.ScanResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "rows", kind: "message", repeat: 2 , T: () => KeyValue },
            { no: 3, name: "intent_rows", kind: "message", repeat: 2 , T: () => KeyValue },
            { no: 4, name: "batch_responses", kind: "scalar", repeat: 2 , T: 12  },
            { no: 5, name: "col_batches", kind: "message", T: () => ColBatches }
        ]);
    }
    create(value?: PartialMessage<ScanResponse>): ScanResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rows = [];
        message.intentRows = [];
        message.batchResponses = [];
        if (value !== undefined)
            reflectionMergePartial<ScanResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ScanResponse): ScanResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.rows.push(KeyValue.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.intentRows.push(KeyValue.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.batchResponses.push(reader.bytes());
                    break;
                case  5:
                    message.colBatches = ColBatches.internalBinaryRead(reader, reader.uint32(), options, message.colBatches);
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

export const ScanResponse = /*#__PURE__*/ new ScanResponse$Type();

class ExciseRequest$Type extends MessageType<ExciseRequest> {
    constructor() {
        super("cockroach.roachpb.ExciseRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader }
        ]);
    }
    create(value?: PartialMessage<ExciseRequest>): ExciseRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ExciseRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExciseRequest): ExciseRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const ExciseRequest = /*#__PURE__*/ new ExciseRequest$Type();

class ExciseResponse$Type extends MessageType<ExciseResponse> {
    constructor() {
        super("cockroach.roachpb.ExciseResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<ExciseResponse>): ExciseResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ExciseResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExciseResponse): ExciseResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const ExciseResponse = /*#__PURE__*/ new ExciseResponse$Type();

class ReverseScanRequest$Type extends MessageType<ReverseScanRequest> {
    constructor() {
        super("cockroach.roachpb.ReverseScanRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 4, name: "scan_format", kind: "enum", T: () => ["cockroach.roachpb.ScanFormat", ScanFormat] },
            { no: 5, name: "key_locking_strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] },
            { no: 6, name: "key_locking_durability", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Durability", Durability] },
            { no: 7, name: "return_raw_mvcc_values", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<ReverseScanRequest>): ReverseScanRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.scanFormat = 0;
        message.keyLockingStrength = 0;
        message.keyLockingDurability = 0;
        message.returnRawMvccValues = false;
        if (value !== undefined)
            reflectionMergePartial<ReverseScanRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReverseScanRequest): ReverseScanRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  4:
                    message.scanFormat = reader.int32();
                    break;
                case  5:
                    message.keyLockingStrength = reader.int32();
                    break;
                case  6:
                    message.keyLockingDurability = reader.int32();
                    break;
                case  7:
                    message.returnRawMvccValues = reader.bool();
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

export const ReverseScanRequest = /*#__PURE__*/ new ReverseScanRequest$Type();

class ReverseScanResponse$Type extends MessageType<ReverseScanResponse> {
    constructor() {
        super("cockroach.roachpb.ReverseScanResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "rows", kind: "message", repeat: 2 , T: () => KeyValue },
            { no: 3, name: "intent_rows", kind: "message", repeat: 2 , T: () => KeyValue },
            { no: 4, name: "batch_responses", kind: "scalar", repeat: 2 , T: 12  },
            { no: 5, name: "col_batches", kind: "message", T: () => ColBatches }
        ]);
    }
    create(value?: PartialMessage<ReverseScanResponse>): ReverseScanResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rows = [];
        message.intentRows = [];
        message.batchResponses = [];
        if (value !== undefined)
            reflectionMergePartial<ReverseScanResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReverseScanResponse): ReverseScanResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.rows.push(KeyValue.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.intentRows.push(KeyValue.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.batchResponses.push(reader.bytes());
                    break;
                case  5:
                    message.colBatches = ColBatches.internalBinaryRead(reader, reader.uint32(), options, message.colBatches);
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

export const ReverseScanResponse = /*#__PURE__*/ new ReverseScanResponse$Type();

class CheckConsistencyRequest$Type extends MessageType<CheckConsistencyRequest> {
    constructor() {
        super("cockroach.roachpb.CheckConsistencyRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 3, name: "mode", kind: "enum", T: () => ["cockroach.roachpb.ChecksumMode", ChecksumMode] }
        ]);
    }
    create(value?: PartialMessage<CheckConsistencyRequest>): CheckConsistencyRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.mode = 0;
        if (value !== undefined)
            reflectionMergePartial<CheckConsistencyRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CheckConsistencyRequest): CheckConsistencyRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  3:
                    message.mode = reader.int32();
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

export const CheckConsistencyRequest = /*#__PURE__*/ new CheckConsistencyRequest$Type();

class CheckConsistencyResponse$Type extends MessageType<CheckConsistencyResponse> {
    constructor() {
        super("cockroach.roachpb.CheckConsistencyResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "result", kind: "message", repeat: 2 , T: () => CheckConsistencyResponse_Result }
        ]);
    }
    create(value?: PartialMessage<CheckConsistencyResponse>): CheckConsistencyResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.result = [];
        if (value !== undefined)
            reflectionMergePartial<CheckConsistencyResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CheckConsistencyResponse): CheckConsistencyResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.result.push(CheckConsistencyResponse_Result.internalBinaryRead(reader, reader.uint32(), options));
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

export const CheckConsistencyResponse = /*#__PURE__*/ new CheckConsistencyResponse$Type();

class CheckConsistencyResponse_Result$Type extends MessageType<CheckConsistencyResponse_Result> {
    constructor() {
        super("cockroach.roachpb.CheckConsistencyResponse.Result", [
            { no: 1, name: "range_id", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "start_key", kind: "scalar", T: 12  },
            { no: 3, name: "status", kind: "enum", T: () => ["cockroach.roachpb.CheckConsistencyResponse.Status", CheckConsistencyResponse_Status] },
            { no: 4, name: "detail", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<CheckConsistencyResponse_Result>): CheckConsistencyResponse_Result {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rangeId = 0n;
        message.startKey = new Uint8Array(0);
        message.status = 0;
        message.detail = "";
        if (value !== undefined)
            reflectionMergePartial<CheckConsistencyResponse_Result>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CheckConsistencyResponse_Result): CheckConsistencyResponse_Result {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rangeId = reader.int64().toBigInt();
                    break;
                case  2:
                    message.startKey = reader.bytes();
                    break;
                case  3:
                    message.status = reader.int32();
                    break;
                case  4:
                    message.detail = reader.string();
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

export const CheckConsistencyResponse_Result = /*#__PURE__*/ new CheckConsistencyResponse_Result$Type();

class RecomputeStatsRequest$Type extends MessageType<RecomputeStatsRequest> {
    constructor() {
        super("cockroach.roachpb.RecomputeStatsRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "dry_run", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<RecomputeStatsRequest>): RecomputeStatsRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.dryRun = false;
        if (value !== undefined)
            reflectionMergePartial<RecomputeStatsRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RecomputeStatsRequest): RecomputeStatsRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.dryRun = reader.bool();
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

export const RecomputeStatsRequest = /*#__PURE__*/ new RecomputeStatsRequest$Type();

class RecomputeStatsResponse$Type extends MessageType<RecomputeStatsResponse> {
    constructor() {
        super("cockroach.roachpb.RecomputeStatsResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "added_delta", kind: "message", T: () => MVCCStatsDelta }
        ]);
    }
    create(value?: PartialMessage<RecomputeStatsResponse>): RecomputeStatsResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RecomputeStatsResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RecomputeStatsResponse): RecomputeStatsResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.addedDelta = MVCCStatsDelta.internalBinaryRead(reader, reader.uint32(), options, message.addedDelta);
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

export const RecomputeStatsResponse = /*#__PURE__*/ new RecomputeStatsResponse$Type();

class EndTxnRequest$Type extends MessageType<EndTxnRequest> {
    constructor() {
        super("cockroach.roachpb.EndTxnRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "commit", kind: "scalar", T: 8  },
            { no: 3, name: "deadline", kind: "message", T: () => Timestamp },
            { no: 4, name: "internal_commit_trigger", kind: "message", T: () => InternalCommitTrigger },
            { no: 5, name: "lock_spans", kind: "message", repeat: 2 , T: () => Span },
            { no: 17, name: "in_flight_writes", kind: "message", repeat: 2 , T: () => SequencedWrite },
            { no: 6, name: "require_1pc", kind: "scalar", jsonName: "require1pc", T: 8  },
            { no: 11, name: "disable_1pc", kind: "scalar", jsonName: "disable1pc", T: 8  },
            { no: 9, name: "poison", kind: "scalar", T: 8  },
            { no: 12, name: "prepare", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<EndTxnRequest>): EndTxnRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.commit = false;
        message.lockSpans = [];
        message.inFlightWrites = [];
        message.require1Pc = false;
        message.disable1Pc = false;
        message.poison = false;
        message.prepare = false;
        if (value !== undefined)
            reflectionMergePartial<EndTxnRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EndTxnRequest): EndTxnRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.commit = reader.bool();
                    break;
                case  3:
                    message.deadline = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.deadline);
                    break;
                case  4:
                    message.internalCommitTrigger = InternalCommitTrigger.internalBinaryRead(reader, reader.uint32(), options, message.internalCommitTrigger);
                    break;
                case  5:
                    message.lockSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  17:
                    message.inFlightWrites.push(SequencedWrite.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.require1Pc = reader.bool();
                    break;
                case  11:
                    message.disable1Pc = reader.bool();
                    break;
                case  9:
                    message.poison = reader.bool();
                    break;
                case  12:
                    message.prepare = reader.bool();
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

export const EndTxnRequest = /*#__PURE__*/ new EndTxnRequest$Type();

class EndTxnResponse$Type extends MessageType<EndTxnResponse> {
    constructor() {
        super("cockroach.roachpb.EndTxnResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 4, name: "one_phase_commit", kind: "scalar", T: 8  },
            { no: 5, name: "staging_timestamp", kind: "message", T: () => Timestamp },
            { no: 6, name: "replicated_local_locks_released_on_commit", kind: "message", repeat: 2 , T: () => Span }
        ]);
    }
    create(value?: PartialMessage<EndTxnResponse>): EndTxnResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.onePhaseCommit = false;
        message.replicatedLocalLocksReleasedOnCommit = [];
        if (value !== undefined)
            reflectionMergePartial<EndTxnResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EndTxnResponse): EndTxnResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  4:
                    message.onePhaseCommit = reader.bool();
                    break;
                case  5:
                    message.stagingTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.stagingTimestamp);
                    break;
                case  6:
                    message.replicatedLocalLocksReleasedOnCommit.push(Span.internalBinaryRead(reader, reader.uint32(), options));
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

export const EndTxnResponse = /*#__PURE__*/ new EndTxnResponse$Type();

class AdminSplitRequest$Type extends MessageType<AdminSplitRequest> {
    constructor() {
        super("cockroach.roachpb.AdminSplitRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "split_key", kind: "scalar", T: 12  },
            { no: 4, name: "expiration_time", kind: "message", T: () => Timestamp },
            { no: 5, name: "predicate_keys", kind: "scalar", repeat: 2 , T: 12  }
        ]);
    }
    create(value?: PartialMessage<AdminSplitRequest>): AdminSplitRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.splitKey = new Uint8Array(0);
        message.predicateKeys = [];
        if (value !== undefined)
            reflectionMergePartial<AdminSplitRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminSplitRequest): AdminSplitRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.splitKey = reader.bytes();
                    break;
                case  4:
                    message.expirationTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.expirationTime);
                    break;
                case  5:
                    message.predicateKeys.push(reader.bytes());
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

export const AdminSplitRequest = /*#__PURE__*/ new AdminSplitRequest$Type();

class AdminSplitResponse$Type extends MessageType<AdminSplitResponse> {
    constructor() {
        super("cockroach.roachpb.AdminSplitResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<AdminSplitResponse>): AdminSplitResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AdminSplitResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminSplitResponse): AdminSplitResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const AdminSplitResponse = /*#__PURE__*/ new AdminSplitResponse$Type();

class AdminUnsplitRequest$Type extends MessageType<AdminUnsplitRequest> {
    constructor() {
        super("cockroach.roachpb.AdminUnsplitRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader }
        ]);
    }
    create(value?: PartialMessage<AdminUnsplitRequest>): AdminUnsplitRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AdminUnsplitRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminUnsplitRequest): AdminUnsplitRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const AdminUnsplitRequest = /*#__PURE__*/ new AdminUnsplitRequest$Type();

class AdminUnsplitResponse$Type extends MessageType<AdminUnsplitResponse> {
    constructor() {
        super("cockroach.roachpb.AdminUnsplitResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<AdminUnsplitResponse>): AdminUnsplitResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AdminUnsplitResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminUnsplitResponse): AdminUnsplitResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const AdminUnsplitResponse = /*#__PURE__*/ new AdminUnsplitResponse$Type();

class AdminMergeRequest$Type extends MessageType<AdminMergeRequest> {
    constructor() {
        super("cockroach.roachpb.AdminMergeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader }
        ]);
    }
    create(value?: PartialMessage<AdminMergeRequest>): AdminMergeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AdminMergeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminMergeRequest): AdminMergeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const AdminMergeRequest = /*#__PURE__*/ new AdminMergeRequest$Type();

class AdminMergeResponse$Type extends MessageType<AdminMergeResponse> {
    constructor() {
        super("cockroach.roachpb.AdminMergeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<AdminMergeResponse>): AdminMergeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AdminMergeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminMergeResponse): AdminMergeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const AdminMergeResponse = /*#__PURE__*/ new AdminMergeResponse$Type();

class AdminTransferLeaseRequest$Type extends MessageType<AdminTransferLeaseRequest> {
    constructor() {
        super("cockroach.roachpb.AdminTransferLeaseRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "target", kind: "scalar", T: 5  },
            { no: 3, name: "bypass_safety_checks", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<AdminTransferLeaseRequest>): AdminTransferLeaseRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.target = 0;
        message.bypassSafetyChecks = false;
        if (value !== undefined)
            reflectionMergePartial<AdminTransferLeaseRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminTransferLeaseRequest): AdminTransferLeaseRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.target = reader.int32();
                    break;
                case  3:
                    message.bypassSafetyChecks = reader.bool();
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

export const AdminTransferLeaseRequest = /*#__PURE__*/ new AdminTransferLeaseRequest$Type();

class AdminTransferLeaseResponse$Type extends MessageType<AdminTransferLeaseResponse> {
    constructor() {
        super("cockroach.roachpb.AdminTransferLeaseResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<AdminTransferLeaseResponse>): AdminTransferLeaseResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AdminTransferLeaseResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminTransferLeaseResponse): AdminTransferLeaseResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const AdminTransferLeaseResponse = /*#__PURE__*/ new AdminTransferLeaseResponse$Type();

class ReplicationChange$Type extends MessageType<ReplicationChange> {
    constructor() {
        super("cockroach.roachpb.ReplicationChange", [
            { no: 1, name: "change_type", kind: "enum", T: () => ["cockroach.roachpb.ReplicaChangeType", ReplicaChangeType] },
            { no: 2, name: "target", kind: "message", T: () => ReplicationTarget }
        ]);
    }
    create(value?: PartialMessage<ReplicationChange>): ReplicationChange {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.changeType = 0;
        if (value !== undefined)
            reflectionMergePartial<ReplicationChange>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReplicationChange): ReplicationChange {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.changeType = reader.int32();
                    break;
                case  2:
                    message.target = ReplicationTarget.internalBinaryRead(reader, reader.uint32(), options, message.target);
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

export const ReplicationChange = /*#__PURE__*/ new ReplicationChange$Type();

class AdminChangeReplicasRequest$Type extends MessageType<AdminChangeReplicasRequest> {
    constructor() {
        super("cockroach.roachpb.AdminChangeReplicasRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "deprecated_change_type", kind: "enum", T: () => ["cockroach.roachpb.ReplicaChangeType", ReplicaChangeType] },
            { no: 3, name: "deprecated_targets", kind: "message", repeat: 2 , T: () => ReplicationTarget },
            { no: 4, name: "exp_desc", kind: "message", T: () => RangeDescriptor },
            { no: 5, name: "internal_changes", kind: "message", repeat: 2 , T: () => ReplicationChange }
        ]);
    }
    create(value?: PartialMessage<AdminChangeReplicasRequest>): AdminChangeReplicasRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.deprecatedChangeType = 0;
        message.deprecatedTargets = [];
        message.internalChanges = [];
        if (value !== undefined)
            reflectionMergePartial<AdminChangeReplicasRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminChangeReplicasRequest): AdminChangeReplicasRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.deprecatedChangeType = reader.int32();
                    break;
                case  3:
                    message.deprecatedTargets.push(ReplicationTarget.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.expDesc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.expDesc);
                    break;
                case  5:
                    message.internalChanges.push(ReplicationChange.internalBinaryRead(reader, reader.uint32(), options));
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

export const AdminChangeReplicasRequest = /*#__PURE__*/ new AdminChangeReplicasRequest$Type();

class AdminChangeReplicasResponse$Type extends MessageType<AdminChangeReplicasResponse> {
    constructor() {
        super("cockroach.roachpb.AdminChangeReplicasResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "desc", kind: "message", T: () => RangeDescriptor }
        ]);
    }
    create(value?: PartialMessage<AdminChangeReplicasResponse>): AdminChangeReplicasResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AdminChangeReplicasResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminChangeReplicasResponse): AdminChangeReplicasResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.desc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.desc);
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

export const AdminChangeReplicasResponse = /*#__PURE__*/ new AdminChangeReplicasResponse$Type();

class AdminRelocateRangeRequest$Type extends MessageType<AdminRelocateRangeRequest> {
    constructor() {
        super("cockroach.roachpb.AdminRelocateRangeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "voter_targets", kind: "message", repeat: 2 , T: () => ReplicationTarget },
            { no: 3, name: "non_voter_targets", kind: "message", repeat: 2 , T: () => ReplicationTarget },
            { no: 4, name: "transfer_lease_to_first_voter", kind: "scalar", T: 8  },
            { no: 5, name: "transfer_lease_to_first_voter_accurate", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<AdminRelocateRangeRequest>): AdminRelocateRangeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.voterTargets = [];
        message.nonVoterTargets = [];
        message.transferLeaseToFirstVoter = false;
        message.transferLeaseToFirstVoterAccurate = false;
        if (value !== undefined)
            reflectionMergePartial<AdminRelocateRangeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminRelocateRangeRequest): AdminRelocateRangeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.voterTargets.push(ReplicationTarget.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.nonVoterTargets.push(ReplicationTarget.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.transferLeaseToFirstVoter = reader.bool();
                    break;
                case  5:
                    message.transferLeaseToFirstVoterAccurate = reader.bool();
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

export const AdminRelocateRangeRequest = /*#__PURE__*/ new AdminRelocateRangeRequest$Type();

class AdminRelocateRangeResponse$Type extends MessageType<AdminRelocateRangeResponse> {
    constructor() {
        super("cockroach.roachpb.AdminRelocateRangeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<AdminRelocateRangeResponse>): AdminRelocateRangeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AdminRelocateRangeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminRelocateRangeResponse): AdminRelocateRangeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const AdminRelocateRangeResponse = /*#__PURE__*/ new AdminRelocateRangeResponse$Type();

class HeartbeatTxnRequest$Type extends MessageType<HeartbeatTxnRequest> {
    constructor() {
        super("cockroach.roachpb.HeartbeatTxnRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "now", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<HeartbeatTxnRequest>): HeartbeatTxnRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<HeartbeatTxnRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: HeartbeatTxnRequest): HeartbeatTxnRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
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

export const HeartbeatTxnRequest = /*#__PURE__*/ new HeartbeatTxnRequest$Type();

class HeartbeatTxnResponse$Type extends MessageType<HeartbeatTxnResponse> {
    constructor() {
        super("cockroach.roachpb.HeartbeatTxnResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<HeartbeatTxnResponse>): HeartbeatTxnResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<HeartbeatTxnResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: HeartbeatTxnResponse): HeartbeatTxnResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const HeartbeatTxnResponse = /*#__PURE__*/ new HeartbeatTxnResponse$Type();

class GCRequest$Type extends MessageType<GCRequest> {
    constructor() {
        super("cockroach.roachpb.GCRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 3, name: "keys", kind: "message", repeat: 2 , T: () => GCRequest_GCKey },
            { no: 6, name: "range_keys", kind: "message", repeat: 2 , T: () => GCRequest_GCRangeKey },
            { no: 4, name: "threshold", kind: "message", T: () => Timestamp },
            { no: 7, name: "clear_range", kind: "message", T: () => GCRequest_GCClearRange }
        ]);
    }
    create(value?: PartialMessage<GCRequest>): GCRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.keys = [];
        message.rangeKeys = [];
        if (value !== undefined)
            reflectionMergePartial<GCRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GCRequest): GCRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  3:
                    message.keys.push(GCRequest_GCKey.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.rangeKeys.push(GCRequest_GCRangeKey.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.threshold = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.threshold);
                    break;
                case  7:
                    message.clearRange = GCRequest_GCClearRange.internalBinaryRead(reader, reader.uint32(), options, message.clearRange);
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

export const GCRequest = /*#__PURE__*/ new GCRequest$Type();

class GCRequest_GCKey$Type extends MessageType<GCRequest_GCKey> {
    constructor() {
        super("cockroach.roachpb.GCRequest.GCKey", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<GCRequest_GCKey>): GCRequest_GCKey {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<GCRequest_GCKey>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GCRequest_GCKey): GCRequest_GCKey {
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

export const GCRequest_GCKey = /*#__PURE__*/ new GCRequest_GCKey$Type();

class GCRequest_GCRangeKey$Type extends MessageType<GCRequest_GCRangeKey> {
    constructor() {
        super("cockroach.roachpb.GCRequest.GCRangeKey", [
            { no: 1, name: "start_key", kind: "scalar", T: 12  },
            { no: 2, name: "end_key", kind: "scalar", T: 12  },
            { no: 3, name: "timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<GCRequest_GCRangeKey>): GCRequest_GCRangeKey {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.startKey = new Uint8Array(0);
        message.endKey = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<GCRequest_GCRangeKey>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GCRequest_GCRangeKey): GCRequest_GCRangeKey {
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

export const GCRequest_GCRangeKey = /*#__PURE__*/ new GCRequest_GCRangeKey$Type();

class GCRequest_GCClearRange$Type extends MessageType<GCRequest_GCClearRange> {
    constructor() {
        super("cockroach.roachpb.GCRequest.GCClearRange", [
            { no: 1, name: "start_key", kind: "scalar", T: 12  },
            { no: 2, name: "end_key", kind: "scalar", T: 12  },
            { no: 3, name: "start_key_timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<GCRequest_GCClearRange>): GCRequest_GCClearRange {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.startKey = new Uint8Array(0);
        message.endKey = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<GCRequest_GCClearRange>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GCRequest_GCClearRange): GCRequest_GCClearRange {
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
                    message.startKeyTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.startKeyTimestamp);
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

export const GCRequest_GCClearRange = /*#__PURE__*/ new GCRequest_GCClearRange$Type();

class GCResponse$Type extends MessageType<GCResponse> {
    constructor() {
        super("cockroach.roachpb.GCResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<GCResponse>): GCResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<GCResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GCResponse): GCResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const GCResponse = /*#__PURE__*/ new GCResponse$Type();

class PushTxnRequest$Type extends MessageType<PushTxnRequest> {
    constructor() {
        super("cockroach.roachpb.PushTxnRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "pusher_txn", kind: "message", T: () => Transaction },
            { no: 3, name: "pushee_txn", kind: "message", T: () => TxnMeta },
            { no: 4, name: "push_to", kind: "message", T: () => Timestamp },
            { no: 6, name: "push_type", kind: "enum", T: () => ["cockroach.roachpb.PushTxnType", PushTxnType] },
            { no: 7, name: "force", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<PushTxnRequest>): PushTxnRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.pushType = 0;
        message.force = false;
        if (value !== undefined)
            reflectionMergePartial<PushTxnRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PushTxnRequest): PushTxnRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.pusherTxn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.pusherTxn);
                    break;
                case  3:
                    message.pusheeTxn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.pusheeTxn);
                    break;
                case  4:
                    message.pushTo = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.pushTo);
                    break;
                case  6:
                    message.pushType = reader.int32();
                    break;
                case  7:
                    message.force = reader.bool();
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

export const PushTxnRequest = /*#__PURE__*/ new PushTxnRequest$Type();

class PushTxnResponse$Type extends MessageType<PushTxnResponse> {
    constructor() {
        super("cockroach.roachpb.PushTxnResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "pushee_txn", kind: "message", T: () => Transaction },
            { no: 3, name: "ambiguous_abort", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<PushTxnResponse>): PushTxnResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.ambiguousAbort = false;
        if (value !== undefined)
            reflectionMergePartial<PushTxnResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PushTxnResponse): PushTxnResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.pusheeTxn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.pusheeTxn);
                    break;
                case  3:
                    message.ambiguousAbort = reader.bool();
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

export const PushTxnResponse = /*#__PURE__*/ new PushTxnResponse$Type();

class RecoverTxnRequest$Type extends MessageType<RecoverTxnRequest> {
    constructor() {
        super("cockroach.roachpb.RecoverTxnRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "txn", kind: "message", T: () => TxnMeta },
            { no: 3, name: "implicitly_committed", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<RecoverTxnRequest>): RecoverTxnRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.implicitlyCommitted = false;
        if (value !== undefined)
            reflectionMergePartial<RecoverTxnRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RecoverTxnRequest): RecoverTxnRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.txn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  3:
                    message.implicitlyCommitted = reader.bool();
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

export const RecoverTxnRequest = /*#__PURE__*/ new RecoverTxnRequest$Type();

class RecoverTxnResponse$Type extends MessageType<RecoverTxnResponse> {
    constructor() {
        super("cockroach.roachpb.RecoverTxnResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "recovered_txn", kind: "message", T: () => Transaction }
        ]);
    }
    create(value?: PartialMessage<RecoverTxnResponse>): RecoverTxnResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RecoverTxnResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RecoverTxnResponse): RecoverTxnResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.recoveredTxn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.recoveredTxn);
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

export const RecoverTxnResponse = /*#__PURE__*/ new RecoverTxnResponse$Type();

class QueryTxnRequest$Type extends MessageType<QueryTxnRequest> {
    constructor() {
        super("cockroach.roachpb.QueryTxnRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "txn", kind: "message", T: () => TxnMeta },
            { no: 3, name: "wait_for_update", kind: "scalar", T: 8  },
            { no: 4, name: "known_waiting_txns", kind: "scalar", repeat: 2 , T: 12  }
        ]);
    }
    create(value?: PartialMessage<QueryTxnRequest>): QueryTxnRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.waitForUpdate = false;
        message.knownWaitingTxns = [];
        if (value !== undefined)
            reflectionMergePartial<QueryTxnRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QueryTxnRequest): QueryTxnRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.txn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  3:
                    message.waitForUpdate = reader.bool();
                    break;
                case  4:
                    message.knownWaitingTxns.push(reader.bytes());
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

export const QueryTxnRequest = /*#__PURE__*/ new QueryTxnRequest$Type();

class QueryTxnResponse$Type extends MessageType<QueryTxnResponse> {
    constructor() {
        super("cockroach.roachpb.QueryTxnResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "queried_txn", kind: "message", T: () => Transaction },
            { no: 4, name: "txn_record_exists", kind: "scalar", T: 8  },
            { no: 3, name: "waiting_txns", kind: "scalar", repeat: 2 , T: 12  }
        ]);
    }
    create(value?: PartialMessage<QueryTxnResponse>): QueryTxnResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.txnRecordExists = false;
        message.waitingTxns = [];
        if (value !== undefined)
            reflectionMergePartial<QueryTxnResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QueryTxnResponse): QueryTxnResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.queriedTxn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.queriedTxn);
                    break;
                case  4:
                    message.txnRecordExists = reader.bool();
                    break;
                case  3:
                    message.waitingTxns.push(reader.bytes());
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

export const QueryTxnResponse = /*#__PURE__*/ new QueryTxnResponse$Type();

class QueryIntentRequest$Type extends MessageType<QueryIntentRequest> {
    constructor() {
        super("cockroach.roachpb.QueryIntentRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "txn", kind: "message", T: () => TxnMeta },
            { no: 3, name: "error_if_missing", kind: "scalar", T: 8  },
            { no: 4, name: "strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] },
            { no: 5, name: "ignored_seqnums", kind: "message", repeat: 2 , T: () => IgnoredSeqNumRange }
        ]);
    }
    create(value?: PartialMessage<QueryIntentRequest>): QueryIntentRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.errorIfMissing = false;
        message.strength = 0;
        message.ignoredSeqnums = [];
        if (value !== undefined)
            reflectionMergePartial<QueryIntentRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QueryIntentRequest): QueryIntentRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.txn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  3:
                    message.errorIfMissing = reader.bool();
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

export const QueryIntentRequest = /*#__PURE__*/ new QueryIntentRequest$Type();

class QueryIntentResponse$Type extends MessageType<QueryIntentResponse> {
    constructor() {
        super("cockroach.roachpb.QueryIntentResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "found_unpushed_intent", kind: "scalar", T: 8  },
            { no: 3, name: "found_intent", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<QueryIntentResponse>): QueryIntentResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.foundUnpushedIntent = false;
        message.foundIntent = false;
        if (value !== undefined)
            reflectionMergePartial<QueryIntentResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QueryIntentResponse): QueryIntentResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.foundUnpushedIntent = reader.bool();
                    break;
                case  3:
                    message.foundIntent = reader.bool();
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

export const QueryIntentResponse = /*#__PURE__*/ new QueryIntentResponse$Type();

class QueryLocksRequest$Type extends MessageType<QueryLocksRequest> {
    constructor() {
        super("cockroach.roachpb.QueryLocksRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "include_uncontended", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<QueryLocksRequest>): QueryLocksRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.includeUncontended = false;
        if (value !== undefined)
            reflectionMergePartial<QueryLocksRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QueryLocksRequest): QueryLocksRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.includeUncontended = reader.bool();
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

export const QueryLocksRequest = /*#__PURE__*/ new QueryLocksRequest$Type();

class QueryLocksResponse$Type extends MessageType<QueryLocksResponse> {
    constructor() {
        super("cockroach.roachpb.QueryLocksResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "locks", kind: "message", repeat: 2 , T: () => LockStateInfo }
        ]);
    }
    create(value?: PartialMessage<QueryLocksResponse>): QueryLocksResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.locks = [];
        if (value !== undefined)
            reflectionMergePartial<QueryLocksResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QueryLocksResponse): QueryLocksResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.locks.push(LockStateInfo.internalBinaryRead(reader, reader.uint32(), options));
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

export const QueryLocksResponse = /*#__PURE__*/ new QueryLocksResponse$Type();

class ResolveIntentRequest$Type extends MessageType<ResolveIntentRequest> {
    constructor() {
        super("cockroach.roachpb.ResolveIntentRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "intent_txn", kind: "message", T: () => TxnMeta },
            { no: 3, name: "status", kind: "enum", T: () => ["cockroach.roachpb.TransactionStatus", TransactionStatus] },
            { no: 4, name: "poison", kind: "scalar", T: 8  },
            { no: 5, name: "ignored_seqnums", kind: "message", repeat: 2 , T: () => IgnoredSeqNumRange },
            { no: 6, name: "clock_while_pending", kind: "message", T: () => ObservedTimestamp }
        ]);
    }
    create(value?: PartialMessage<ResolveIntentRequest>): ResolveIntentRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.status = 0;
        message.poison = false;
        message.ignoredSeqnums = [];
        if (value !== undefined)
            reflectionMergePartial<ResolveIntentRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResolveIntentRequest): ResolveIntentRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.intentTxn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.intentTxn);
                    break;
                case  3:
                    message.status = reader.int32();
                    break;
                case  4:
                    message.poison = reader.bool();
                    break;
                case  5:
                    message.ignoredSeqnums.push(IgnoredSeqNumRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
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

export const ResolveIntentRequest = /*#__PURE__*/ new ResolveIntentRequest$Type();

class ResolveIntentResponse$Type extends MessageType<ResolveIntentResponse> {
    constructor() {
        super("cockroach.roachpb.ResolveIntentResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "replicated_locks_released_commit_timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<ResolveIntentResponse>): ResolveIntentResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ResolveIntentResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResolveIntentResponse): ResolveIntentResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.replicatedLocksReleasedCommitTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.replicatedLocksReleasedCommitTimestamp);
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

export const ResolveIntentResponse = /*#__PURE__*/ new ResolveIntentResponse$Type();

class ResolveIntentRangeRequest$Type extends MessageType<ResolveIntentRangeRequest> {
    constructor() {
        super("cockroach.roachpb.ResolveIntentRangeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "intent_txn", kind: "message", T: () => TxnMeta },
            { no: 3, name: "status", kind: "enum", T: () => ["cockroach.roachpb.TransactionStatus", TransactionStatus] },
            { no: 4, name: "poison", kind: "scalar", T: 8  },
            { no: 5, name: "min_timestamp", kind: "message", T: () => Timestamp },
            { no: 6, name: "ignored_seqnums", kind: "message", repeat: 2 , T: () => IgnoredSeqNumRange },
            { no: 7, name: "clock_while_pending", kind: "message", T: () => ObservedTimestamp }
        ]);
    }
    create(value?: PartialMessage<ResolveIntentRangeRequest>): ResolveIntentRangeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.status = 0;
        message.poison = false;
        message.ignoredSeqnums = [];
        if (value !== undefined)
            reflectionMergePartial<ResolveIntentRangeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResolveIntentRangeRequest): ResolveIntentRangeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.intentTxn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.intentTxn);
                    break;
                case  3:
                    message.status = reader.int32();
                    break;
                case  4:
                    message.poison = reader.bool();
                    break;
                case  5:
                    message.minTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.minTimestamp);
                    break;
                case  6:
                    message.ignoredSeqnums.push(IgnoredSeqNumRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
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

export const ResolveIntentRangeRequest = /*#__PURE__*/ new ResolveIntentRangeRequest$Type();

class ResolveIntentRangeResponse$Type extends MessageType<ResolveIntentRangeResponse> {
    constructor() {
        super("cockroach.roachpb.ResolveIntentRangeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "replicated_locks_released_commit_timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<ResolveIntentRangeResponse>): ResolveIntentRangeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ResolveIntentRangeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResolveIntentRangeResponse): ResolveIntentRangeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.replicatedLocksReleasedCommitTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.replicatedLocksReleasedCommitTimestamp);
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

export const ResolveIntentRangeResponse = /*#__PURE__*/ new ResolveIntentRangeResponse$Type();

class MergeRequest$Type extends MessageType<MergeRequest> {
    constructor() {
        super("cockroach.roachpb.MergeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "value", kind: "message", T: () => Value }
        ]);
    }
    create(value?: PartialMessage<MergeRequest>): MergeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MergeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MergeRequest): MergeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const MergeRequest = /*#__PURE__*/ new MergeRequest$Type();

class MergeResponse$Type extends MessageType<MergeResponse> {
    constructor() {
        super("cockroach.roachpb.MergeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<MergeResponse>): MergeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MergeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MergeResponse): MergeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const MergeResponse = /*#__PURE__*/ new MergeResponse$Type();

class TruncateLogRequest$Type extends MessageType<TruncateLogRequest> {
    constructor() {
        super("cockroach.roachpb.TruncateLogRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "index", kind: "scalar", T: 4 , L: 0  },
            { no: 3, name: "range_id", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "expected_first_index", kind: "scalar", T: 4 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<TruncateLogRequest>): TruncateLogRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.index = 0n;
        message.rangeId = 0n;
        message.expectedFirstIndex = 0n;
        if (value !== undefined)
            reflectionMergePartial<TruncateLogRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TruncateLogRequest): TruncateLogRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.index = reader.uint64().toBigInt();
                    break;
                case  3:
                    message.rangeId = reader.int64().toBigInt();
                    break;
                case  4:
                    message.expectedFirstIndex = reader.uint64().toBigInt();
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

export const TruncateLogRequest = /*#__PURE__*/ new TruncateLogRequest$Type();

class TruncateLogResponse$Type extends MessageType<TruncateLogResponse> {
    constructor() {
        super("cockroach.roachpb.TruncateLogResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<TruncateLogResponse>): TruncateLogResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TruncateLogResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TruncateLogResponse): TruncateLogResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const TruncateLogResponse = /*#__PURE__*/ new TruncateLogResponse$Type();

class RequestLeaseRequest$Type extends MessageType<RequestLeaseRequest> {
    constructor() {
        super("cockroach.roachpb.RequestLeaseRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "lease", kind: "message", T: () => Lease },
            { no: 3, name: "prev_lease", kind: "message", T: () => Lease },
            { no: 5, name: "revoke_prev_and_forward_expiration", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<RequestLeaseRequest>): RequestLeaseRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.revokePrevAndForwardExpiration = false;
        if (value !== undefined)
            reflectionMergePartial<RequestLeaseRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RequestLeaseRequest): RequestLeaseRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.lease = Lease.internalBinaryRead(reader, reader.uint32(), options, message.lease);
                    break;
                case  3:
                    message.prevLease = Lease.internalBinaryRead(reader, reader.uint32(), options, message.prevLease);
                    break;
                case  5:
                    message.revokePrevAndForwardExpiration = reader.bool();
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

export const RequestLeaseRequest = /*#__PURE__*/ new RequestLeaseRequest$Type();

class TransferLeaseRequest$Type extends MessageType<TransferLeaseRequest> {
    constructor() {
        super("cockroach.roachpb.TransferLeaseRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "lease", kind: "message", T: () => Lease },
            { no: 3, name: "prev_lease", kind: "message", T: () => Lease },
            { no: 4, name: "bypass_safety_checks", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<TransferLeaseRequest>): TransferLeaseRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.bypassSafetyChecks = false;
        if (value !== undefined)
            reflectionMergePartial<TransferLeaseRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TransferLeaseRequest): TransferLeaseRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.lease = Lease.internalBinaryRead(reader, reader.uint32(), options, message.lease);
                    break;
                case  3:
                    message.prevLease = Lease.internalBinaryRead(reader, reader.uint32(), options, message.prevLease);
                    break;
                case  4:
                    message.bypassSafetyChecks = reader.bool();
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

export const TransferLeaseRequest = /*#__PURE__*/ new TransferLeaseRequest$Type();

class LeaseInfoRequest$Type extends MessageType<LeaseInfoRequest> {
    constructor() {
        super("cockroach.roachpb.LeaseInfoRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader }
        ]);
    }
    create(value?: PartialMessage<LeaseInfoRequest>): LeaseInfoRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<LeaseInfoRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LeaseInfoRequest): LeaseInfoRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const LeaseInfoRequest = /*#__PURE__*/ new LeaseInfoRequest$Type();

class LeaseInfoResponse$Type extends MessageType<LeaseInfoResponse> {
    constructor() {
        super("cockroach.roachpb.LeaseInfoResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "lease", kind: "message", T: () => Lease },
            { no: 3, name: "current_lease", kind: "message", T: () => Lease },
            { no: 4, name: "evaluated_by", kind: "scalar", T: 5  }
        ]);
    }
    create(value?: PartialMessage<LeaseInfoResponse>): LeaseInfoResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.evaluatedBy = 0;
        if (value !== undefined)
            reflectionMergePartial<LeaseInfoResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LeaseInfoResponse): LeaseInfoResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.lease = Lease.internalBinaryRead(reader, reader.uint32(), options, message.lease);
                    break;
                case  3:
                    message.currentLease = Lease.internalBinaryRead(reader, reader.uint32(), options, message.currentLease);
                    break;
                case  4:
                    message.evaluatedBy = reader.int32();
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

export const LeaseInfoResponse = /*#__PURE__*/ new LeaseInfoResponse$Type();

class RequestLeaseResponse$Type extends MessageType<RequestLeaseResponse> {
    constructor() {
        super("cockroach.roachpb.RequestLeaseResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<RequestLeaseResponse>): RequestLeaseResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RequestLeaseResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RequestLeaseResponse): RequestLeaseResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const RequestLeaseResponse = /*#__PURE__*/ new RequestLeaseResponse$Type();

class ComputeChecksumRequest$Type extends MessageType<ComputeChecksumRequest> {
    constructor() {
        super("cockroach.roachpb.ComputeChecksumRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "version", kind: "scalar", T: 13  },
            { no: 5, name: "mode", kind: "enum", T: () => ["cockroach.roachpb.ChecksumMode", ChecksumMode] },
            { no: 6, name: "checkpoint", kind: "scalar", T: 8  },
            { no: 7, name: "terminate", kind: "message", repeat: 2 , T: () => ReplicaDescriptor }
        ]);
    }
    create(value?: PartialMessage<ComputeChecksumRequest>): ComputeChecksumRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.version = 0;
        message.mode = 0;
        message.checkpoint = false;
        message.terminate = [];
        if (value !== undefined)
            reflectionMergePartial<ComputeChecksumRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ComputeChecksumRequest): ComputeChecksumRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.version = reader.uint32();
                    break;
                case  5:
                    message.mode = reader.int32();
                    break;
                case  6:
                    message.checkpoint = reader.bool();
                    break;
                case  7:
                    message.terminate.push(ReplicaDescriptor.internalBinaryRead(reader, reader.uint32(), options));
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

export const ComputeChecksumRequest = /*#__PURE__*/ new ComputeChecksumRequest$Type();

class ComputeChecksumResponse$Type extends MessageType<ComputeChecksumResponse> {
    constructor() {
        super("cockroach.roachpb.ComputeChecksumResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "checksum_id", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<ComputeChecksumResponse>): ComputeChecksumResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.checksumId = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<ComputeChecksumResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ComputeChecksumResponse): ComputeChecksumResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.checksumId = reader.bytes();
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

export const ComputeChecksumResponse = /*#__PURE__*/ new ComputeChecksumResponse$Type();

class RetryTracingEvent$Type extends MessageType<RetryTracingEvent> {
    constructor() {
        super("cockroach.roachpb.RetryTracingEvent", [
            { no: 1, name: "operation", kind: "scalar", T: 9  },
            { no: 2, name: "attempt_number", kind: "scalar", T: 5  },
            { no: 3, name: "retry_error", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<RetryTracingEvent>): RetryTracingEvent {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.operation = "";
        message.attemptNumber = 0;
        message.retryError = "";
        if (value !== undefined)
            reflectionMergePartial<RetryTracingEvent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetryTracingEvent): RetryTracingEvent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.operation = reader.string();
                    break;
                case  2:
                    message.attemptNumber = reader.int32();
                    break;
                case  3:
                    message.retryError = reader.string();
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

export const RetryTracingEvent = /*#__PURE__*/ new RetryTracingEvent$Type();

class FileEncryptionOptions$Type extends MessageType<FileEncryptionOptions> {
    constructor() {
        super("cockroach.roachpb.FileEncryptionOptions", [
            { no: 1, name: "key", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<FileEncryptionOptions>): FileEncryptionOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<FileEncryptionOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FileEncryptionOptions): FileEncryptionOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
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

export const FileEncryptionOptions = /*#__PURE__*/ new FileEncryptionOptions$Type();

class ExportRequest$Type extends MessageType<ExportRequest> {
    constructor() {
        super("cockroach.roachpb.ExportRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 12, name: "resume_key_ts", kind: "message", T: () => Timestamp },
            { no: 4, name: "mvcc_filter", kind: "enum", T: () => ["cockroach.roachpb.MVCCFilter", MVCCFilter] },
            { no: 3, name: "start_time", kind: "message", T: () => Timestamp },
            { no: 13, name: "split_mid_key", kind: "scalar", T: 8  },
            { no: 9, name: "encryption", kind: "message", T: () => FileEncryptionOptions },
            { no: 10, name: "target_file_size", kind: "scalar", T: 3 , L: 0  },
            { no: 14, name: "export_fingerprint", kind: "scalar", T: 8  },
            { no: 15, name: "fingerprint_options", kind: "message", T: () => FingerprintOptions },
            { no: 16, name: "include_mvcc_value_header", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<ExportRequest>): ExportRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.mvccFilter = 0;
        message.splitMidKey = false;
        message.targetFileSize = 0n;
        message.exportFingerprint = false;
        message.includeMvccValueHeader = false;
        if (value !== undefined)
            reflectionMergePartial<ExportRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExportRequest): ExportRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  12:
                    message.resumeKeyTs = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.resumeKeyTs);
                    break;
                case  4:
                    message.mvccFilter = reader.int32();
                    break;
                case  3:
                    message.startTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.startTime);
                    break;
                case  13:
                    message.splitMidKey = reader.bool();
                    break;
                case  9:
                    message.encryption = FileEncryptionOptions.internalBinaryRead(reader, reader.uint32(), options, message.encryption);
                    break;
                case  10:
                    message.targetFileSize = reader.int64().toBigInt();
                    break;
                case  14:
                    message.exportFingerprint = reader.bool();
                    break;
                case  15:
                    message.fingerprintOptions = FingerprintOptions.internalBinaryRead(reader, reader.uint32(), options, message.fingerprintOptions);
                    break;
                case  16:
                    message.includeMvccValueHeader = reader.bool();
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

export const ExportRequest = /*#__PURE__*/ new ExportRequest$Type();

class FingerprintOptions$Type extends MessageType<FingerprintOptions> {
    constructor() {
        super("cockroach.roachpb.FingerprintOptions", [
            { no: 1, name: "strip_index_prefix_and_timestamp", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<FingerprintOptions>): FingerprintOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.stripIndexPrefixAndTimestamp = false;
        if (value !== undefined)
            reflectionMergePartial<FingerprintOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FingerprintOptions): FingerprintOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.stripIndexPrefixAndTimestamp = reader.bool();
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

export const FingerprintOptions = /*#__PURE__*/ new FingerprintOptions$Type();

class BulkOpSummary$Type extends MessageType<BulkOpSummary> {
    constructor() {
        super("cockroach.roachpb.BulkOpSummary", [
            { no: 1, name: "data_size", kind: "scalar", T: 3 , L: 0  },
            { no: 6, name: "sst_data_size", kind: "scalar", T: 3 , L: 0  },
            { no: 5, name: "entry_counts", kind: "map", K: 4 , V: { kind: "scalar", T: 3 , L: 0  } }
        ]);
    }
    create(value?: PartialMessage<BulkOpSummary>): BulkOpSummary {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.dataSize = 0n;
        message.sstDataSize = 0n;
        message.entryCounts = {};
        if (value !== undefined)
            reflectionMergePartial<BulkOpSummary>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BulkOpSummary): BulkOpSummary {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.dataSize = reader.int64().toBigInt();
                    break;
                case  6:
                    message.sstDataSize = reader.int64().toBigInt();
                    break;
                case  5:
                    this.binaryReadMap5(message.entryCounts, reader, options);
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
    private binaryReadMap5(map: BulkOpSummary["entryCounts"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof BulkOpSummary["entryCounts"] | undefined, val: BulkOpSummary["entryCounts"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint64().toString();
                    break;
                case 2:
                    val = reader.int64().toBigInt();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.roachpb.BulkOpSummary.entry_counts");
            }
        }
        map[key ?? "0"] = val ?? 0n;
    }

}

export const BulkOpSummary = /*#__PURE__*/ new BulkOpSummary$Type();

class ExportResponse$Type extends MessageType<ExportResponse> {
    constructor() {
        super("cockroach.roachpb.ExportResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "files", kind: "message", repeat: 2 , T: () => ExportResponse_File },
            { no: 3, name: "start_time", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<ExportResponse>): ExportResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.files = [];
        if (value !== undefined)
            reflectionMergePartial<ExportResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExportResponse): ExportResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.files.push(ExportResponse_File.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.startTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.startTime);
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

export const ExportResponse = /*#__PURE__*/ new ExportResponse$Type();

class ExportResponse_File$Type extends MessageType<ExportResponse_File> {
    constructor() {
        super("cockroach.roachpb.ExportResponse.File", [
            { no: 1, name: "span", kind: "message", T: () => Span },
            { no: 9, name: "end_key_ts", kind: "message", T: () => Timestamp },
            { no: 6, name: "exported", kind: "message", T: () => BulkOpSummary },
            { no: 7, name: "sst", kind: "scalar", T: 12  },
            { no: 8, name: "locality_kv", kind: "scalar", T: 9  },
            { no: 10, name: "fingerprint", kind: "scalar", T: 4 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<ExportResponse_File>): ExportResponse_File {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.sst = new Uint8Array(0);
        message.localityKv = "";
        message.fingerprint = 0n;
        if (value !== undefined)
            reflectionMergePartial<ExportResponse_File>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExportResponse_File): ExportResponse_File {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
                    break;
                case  9:
                    message.endKeyTs = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.endKeyTs);
                    break;
                case  6:
                    message.exported = BulkOpSummary.internalBinaryRead(reader, reader.uint32(), options, message.exported);
                    break;
                case  7:
                    message.sst = reader.bytes();
                    break;
                case  8:
                    message.localityKv = reader.string();
                    break;
                case  10:
                    message.fingerprint = reader.uint64().toBigInt();
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

export const ExportResponse_File = /*#__PURE__*/ new ExportResponse_File$Type();

class AdminScatterRequest$Type extends MessageType<AdminScatterRequest> {
    constructor() {
        super("cockroach.roachpb.AdminScatterRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "randomize_leases", kind: "scalar", T: 8  },
            { no: 3, name: "max_size", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<AdminScatterRequest>): AdminScatterRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.randomizeLeases = false;
        message.maxSize = 0n;
        if (value !== undefined)
            reflectionMergePartial<AdminScatterRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminScatterRequest): AdminScatterRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.randomizeLeases = reader.bool();
                    break;
                case  3:
                    message.maxSize = reader.int64().toBigInt();
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

export const AdminScatterRequest = /*#__PURE__*/ new AdminScatterRequest$Type();

class AdminScatterResponse$Type extends MessageType<AdminScatterResponse> {
    constructor() {
        super("cockroach.roachpb.AdminScatterResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 3, name: "range_infos", kind: "message", repeat: 2 , T: () => RangeInfo },
            { no: 4, name: "mvcc_stats", kind: "message", T: () => MVCCStats },
            { no: 5, name: "replicas_scattered_bytes", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<AdminScatterResponse>): AdminScatterResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rangeInfos = [];
        message.replicasScatteredBytes = 0n;
        if (value !== undefined)
            reflectionMergePartial<AdminScatterResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminScatterResponse): AdminScatterResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  3:
                    message.rangeInfos.push(RangeInfo.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.mvccStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.mvccStats);
                    break;
                case  5:
                    message.replicasScatteredBytes = reader.int64().toBigInt();
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

export const AdminScatterResponse = /*#__PURE__*/ new AdminScatterResponse$Type();

class AdminScatterResponse_Range$Type extends MessageType<AdminScatterResponse_Range> {
    constructor() {
        super("cockroach.roachpb.AdminScatterResponse.Range", [
            { no: 1, name: "span", kind: "message", T: () => Span }
        ]);
    }
    create(value?: PartialMessage<AdminScatterResponse_Range>): AdminScatterResponse_Range {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AdminScatterResponse_Range>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdminScatterResponse_Range): AdminScatterResponse_Range {
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

export const AdminScatterResponse_Range = /*#__PURE__*/ new AdminScatterResponse_Range$Type();

class AddSSTableRequest$Type extends MessageType<AddSSTableRequest> {
    constructor() {
        super("cockroach.roachpb.AddSSTableRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "data", kind: "scalar", T: 12  },
            { no: 6, name: "sst_timestamp_to_request_timestamp", kind: "message", T: () => Timestamp },
            { no: 7, name: "disallow_conflicts", kind: "scalar", T: 8  },
            { no: 8, name: "disallow_shadowing_below", kind: "message", T: () => Timestamp },
            { no: 4, name: "mvcc_stats", kind: "message", T: () => MVCCStats },
            { no: 5, name: "ingest_as_writes", kind: "scalar", T: 8  },
            { no: 9, name: "return_following_likely_non_empty_span_start", kind: "scalar", T: 8  },
            { no: 12, name: "ignore_keys_above_timestamp", kind: "message", T: () => Timestamp },
            { no: 13, name: "compute_stats_diff", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<AddSSTableRequest>): AddSSTableRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.data = new Uint8Array(0);
        message.disallowConflicts = false;
        message.ingestAsWrites = false;
        message.returnFollowingLikelyNonEmptySpanStart = false;
        message.computeStatsDiff = false;
        if (value !== undefined)
            reflectionMergePartial<AddSSTableRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AddSSTableRequest): AddSSTableRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.data = reader.bytes();
                    break;
                case  6:
                    message.sstTimestampToRequestTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.sstTimestampToRequestTimestamp);
                    break;
                case  7:
                    message.disallowConflicts = reader.bool();
                    break;
                case  8:
                    message.disallowShadowingBelow = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.disallowShadowingBelow);
                    break;
                case  4:
                    message.mvccStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.mvccStats);
                    break;
                case  5:
                    message.ingestAsWrites = reader.bool();
                    break;
                case  9:
                    message.returnFollowingLikelyNonEmptySpanStart = reader.bool();
                    break;
                case  12:
                    message.ignoreKeysAboveTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.ignoreKeysAboveTimestamp);
                    break;
                case  13:
                    message.computeStatsDiff = reader.bool();
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

export const AddSSTableRequest = /*#__PURE__*/ new AddSSTableRequest$Type();

class AddSSTableResponse$Type extends MessageType<AddSSTableResponse> {
    constructor() {
        super("cockroach.roachpb.AddSSTableResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "range_span", kind: "message", T: () => Span },
            { no: 3, name: "available_bytes", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "following_likely_non_empty_span_start", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<AddSSTableResponse>): AddSSTableResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.availableBytes = 0n;
        message.followingLikelyNonEmptySpanStart = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<AddSSTableResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AddSSTableResponse): AddSSTableResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.rangeSpan = Span.internalBinaryRead(reader, reader.uint32(), options, message.rangeSpan);
                    break;
                case  3:
                    message.availableBytes = reader.int64().toBigInt();
                    break;
                case  4:
                    message.followingLikelyNonEmptySpanStart = reader.bytes();
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

export const AddSSTableResponse = /*#__PURE__*/ new AddSSTableResponse$Type();

class LinkExternalSSTableRequest$Type extends MessageType<LinkExternalSSTableRequest> {
    constructor() {
        super("cockroach.roachpb.LinkExternalSSTableRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 4, name: "external_file", kind: "message", T: () => LinkExternalSSTableRequest_ExternalFile }
        ]);
    }
    create(value?: PartialMessage<LinkExternalSSTableRequest>): LinkExternalSSTableRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<LinkExternalSSTableRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LinkExternalSSTableRequest): LinkExternalSSTableRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  4:
                    message.externalFile = LinkExternalSSTableRequest_ExternalFile.internalBinaryRead(reader, reader.uint32(), options, message.externalFile);
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

export const LinkExternalSSTableRequest = /*#__PURE__*/ new LinkExternalSSTableRequest$Type();

class LinkExternalSSTableRequest_ExternalFile$Type extends MessageType<LinkExternalSSTableRequest_ExternalFile> {
    constructor() {
        super("cockroach.roachpb.LinkExternalSSTableRequest.ExternalFile", [
            { no: 1, name: "locator", kind: "scalar", T: 9  },
            { no: 2, name: "path", kind: "scalar", T: 9  },
            { no: 3, name: "backing_file_size", kind: "scalar", T: 4 , L: 0  },
            { no: 4, name: "approximate_physical_size", kind: "scalar", T: 4 , L: 0  },
            { no: 5, name: "synthetic_prefix", kind: "scalar", T: 12  },
            { no: 6, name: "use_synthetic_suffix", kind: "scalar", T: 8  },
            { no: 7, name: "mvcc_stats", kind: "message", T: () => MVCCStats }
        ]);
    }
    create(value?: PartialMessage<LinkExternalSSTableRequest_ExternalFile>): LinkExternalSSTableRequest_ExternalFile {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.locator = "";
        message.path = "";
        message.backingFileSize = 0n;
        message.approximatePhysicalSize = 0n;
        message.syntheticPrefix = new Uint8Array(0);
        message.useSyntheticSuffix = false;
        if (value !== undefined)
            reflectionMergePartial<LinkExternalSSTableRequest_ExternalFile>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LinkExternalSSTableRequest_ExternalFile): LinkExternalSSTableRequest_ExternalFile {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.locator = reader.string();
                    break;
                case  2:
                    message.path = reader.string();
                    break;
                case  3:
                    message.backingFileSize = reader.uint64().toBigInt();
                    break;
                case  4:
                    message.approximatePhysicalSize = reader.uint64().toBigInt();
                    break;
                case  5:
                    message.syntheticPrefix = reader.bytes();
                    break;
                case  6:
                    message.useSyntheticSuffix = reader.bool();
                    break;
                case  7:
                    message.mvccStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.mvccStats);
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

export const LinkExternalSSTableRequest_ExternalFile = /*#__PURE__*/ new LinkExternalSSTableRequest_ExternalFile$Type();

class LinkExternalSSTableResponse$Type extends MessageType<LinkExternalSSTableResponse> {
    constructor() {
        super("cockroach.roachpb.LinkExternalSSTableResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<LinkExternalSSTableResponse>): LinkExternalSSTableResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<LinkExternalSSTableResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LinkExternalSSTableResponse): LinkExternalSSTableResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const LinkExternalSSTableResponse = /*#__PURE__*/ new LinkExternalSSTableResponse$Type();

class RefreshRequest$Type extends MessageType<RefreshRequest> {
    constructor() {
        super("cockroach.roachpb.RefreshRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 3, name: "refresh_from", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<RefreshRequest>): RefreshRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RefreshRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RefreshRequest): RefreshRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  3:
                    message.refreshFrom = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.refreshFrom);
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

export const RefreshRequest = /*#__PURE__*/ new RefreshRequest$Type();

class RefreshResponse$Type extends MessageType<RefreshResponse> {
    constructor() {
        super("cockroach.roachpb.RefreshResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<RefreshResponse>): RefreshResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RefreshResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RefreshResponse): RefreshResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const RefreshResponse = /*#__PURE__*/ new RefreshResponse$Type();

class RefreshRangeRequest$Type extends MessageType<RefreshRangeRequest> {
    constructor() {
        super("cockroach.roachpb.RefreshRangeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 3, name: "refresh_from", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<RefreshRangeRequest>): RefreshRangeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RefreshRangeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RefreshRangeRequest): RefreshRangeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  3:
                    message.refreshFrom = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.refreshFrom);
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

export const RefreshRangeRequest = /*#__PURE__*/ new RefreshRangeRequest$Type();

class RefreshRangeResponse$Type extends MessageType<RefreshRangeResponse> {
    constructor() {
        super("cockroach.roachpb.RefreshRangeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<RefreshRangeResponse>): RefreshRangeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RefreshRangeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RefreshRangeResponse): RefreshRangeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const RefreshRangeResponse = /*#__PURE__*/ new RefreshRangeResponse$Type();

class SubsumeRequest$Type extends MessageType<SubsumeRequest> {
    constructor() {
        super("cockroach.roachpb.SubsumeRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "left_desc", kind: "message", T: () => RangeDescriptor },
            { no: 3, name: "right_desc", kind: "message", T: () => RangeDescriptor },
            { no: 4, name: "preserve_unreplicated_locks", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<SubsumeRequest>): SubsumeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.preserveUnreplicatedLocks = false;
        if (value !== undefined)
            reflectionMergePartial<SubsumeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubsumeRequest): SubsumeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.leftDesc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.leftDesc);
                    break;
                case  3:
                    message.rightDesc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.rightDesc);
                    break;
                case  4:
                    message.preserveUnreplicatedLocks = reader.bool();
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

export const SubsumeRequest = /*#__PURE__*/ new SubsumeRequest$Type();

class SubsumeResponse$Type extends MessageType<SubsumeResponse> {
    constructor() {
        super("cockroach.roachpb.SubsumeResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 3, name: "mvcc_stats", kind: "message", T: () => MVCCStats },
            { no: 8, name: "range_id_local_mvcc_stats", kind: "message", T: () => MVCCStats },
            { no: 4, name: "lease_applied_index", kind: "scalar", T: 4 , L: 0  },
            { no: 5, name: "freeze_start", kind: "message", T: () => Timestamp },
            { no: 6, name: "closed_timestamp", kind: "message", T: () => Timestamp },
            { no: 7, name: "read_summary", kind: "message", T: () => ReadSummary }
        ]);
    }
    create(value?: PartialMessage<SubsumeResponse>): SubsumeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.leaseAppliedIndex = 0n;
        if (value !== undefined)
            reflectionMergePartial<SubsumeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubsumeResponse): SubsumeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  3:
                    message.mvccStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.mvccStats);
                    break;
                case  8:
                    message.rangeIdLocalMvccStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.rangeIdLocalMvccStats);
                    break;
                case  4:
                    message.leaseAppliedIndex = reader.uint64().toBigInt();
                    break;
                case  5:
                    message.freezeStart = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.freezeStart);
                    break;
                case  6:
                    message.closedTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.closedTimestamp);
                    break;
                case  7:
                    message.readSummary = ReadSummary.internalBinaryRead(reader, reader.uint32(), options, message.readSummary);
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

export const SubsumeResponse = /*#__PURE__*/ new SubsumeResponse$Type();

class RangeStatsRequest$Type extends MessageType<RangeStatsRequest> {
    constructor() {
        super("cockroach.roachpb.RangeStatsRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader }
        ]);
    }
    create(value?: PartialMessage<RangeStatsRequest>): RangeStatsRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RangeStatsRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeStatsRequest): RangeStatsRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const RangeStatsRequest = /*#__PURE__*/ new RangeStatsRequest$Type();

class RangeStatsResponse$Type extends MessageType<RangeStatsResponse> {
    constructor() {
        super("cockroach.roachpb.RangeStatsResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "mvcc_stats", kind: "message", T: () => MVCCStats },
            { no: 5, name: "max_queries_per_second", kind: "scalar", T: 1  },
            { no: 6, name: "max_queries_per_second_set", kind: "scalar", T: 8  },
            { no: 7, name: "max_cpu_per_second", kind: "scalar", T: 1  },
            { no: 4, name: "range_info", kind: "message", T: () => RangeInfo }
        ]);
    }
    create(value?: PartialMessage<RangeStatsResponse>): RangeStatsResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.maxQueriesPerSecond = 0;
        message.maxQueriesPerSecondSet = false;
        message.maxCpuPerSecond = 0;
        if (value !== undefined)
            reflectionMergePartial<RangeStatsResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeStatsResponse): RangeStatsResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.mvccStats = MVCCStats.internalBinaryRead(reader, reader.uint32(), options, message.mvccStats);
                    break;
                case  5:
                    message.maxQueriesPerSecond = reader.double();
                    break;
                case  6:
                    message.maxQueriesPerSecondSet = reader.bool();
                    break;
                case  7:
                    message.maxCpuPerSecond = reader.double();
                    break;
                case  4:
                    message.rangeInfo = RangeInfo.internalBinaryRead(reader, reader.uint32(), options, message.rangeInfo);
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

export const RangeStatsResponse = /*#__PURE__*/ new RangeStatsResponse$Type();

class MigrateRequest$Type extends MessageType<MigrateRequest> {
    constructor() {
        super("cockroach.roachpb.MigrateRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "version", kind: "message", T: () => Version }
        ]);
    }
    create(value?: PartialMessage<MigrateRequest>): MigrateRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MigrateRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MigrateRequest): MigrateRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.version = Version.internalBinaryRead(reader, reader.uint32(), options, message.version);
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

export const MigrateRequest = /*#__PURE__*/ new MigrateRequest$Type();

class MigrateResponse$Type extends MessageType<MigrateResponse> {
    constructor() {
        super("cockroach.roachpb.MigrateResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader }
        ]);
    }
    create(value?: PartialMessage<MigrateResponse>): MigrateResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MigrateResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MigrateResponse): MigrateResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const MigrateResponse = /*#__PURE__*/ new MigrateResponse$Type();

class QueryResolvedTimestampRequest$Type extends MessageType<QueryResolvedTimestampRequest> {
    constructor() {
        super("cockroach.roachpb.QueryResolvedTimestampRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader }
        ]);
    }
    create(value?: PartialMessage<QueryResolvedTimestampRequest>): QueryResolvedTimestampRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<QueryResolvedTimestampRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QueryResolvedTimestampRequest): QueryResolvedTimestampRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const QueryResolvedTimestampRequest = /*#__PURE__*/ new QueryResolvedTimestampRequest$Type();

class QueryResolvedTimestampResponse$Type extends MessageType<QueryResolvedTimestampResponse> {
    constructor() {
        super("cockroach.roachpb.QueryResolvedTimestampResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "resolved_ts", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<QueryResolvedTimestampResponse>): QueryResolvedTimestampResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<QueryResolvedTimestampResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: QueryResolvedTimestampResponse): QueryResolvedTimestampResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.resolvedTs = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.resolvedTs);
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

export const QueryResolvedTimestampResponse = /*#__PURE__*/ new QueryResolvedTimestampResponse$Type();

class BarrierRequest$Type extends MessageType<BarrierRequest> {
    constructor() {
        super("cockroach.roachpb.BarrierRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader },
            { no: 2, name: "with_lease_applied_index", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<BarrierRequest>): BarrierRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.withLeaseAppliedIndex = false;
        if (value !== undefined)
            reflectionMergePartial<BarrierRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BarrierRequest): BarrierRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.withLeaseAppliedIndex = reader.bool();
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

export const BarrierRequest = /*#__PURE__*/ new BarrierRequest$Type();

class BarrierResponse$Type extends MessageType<BarrierResponse> {
    constructor() {
        super("cockroach.roachpb.BarrierResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 3, name: "lease_applied_index", kind: "scalar", T: 4 , L: 0  },
            { no: 4, name: "range_desc", kind: "message", T: () => RangeDescriptor }
        ]);
    }
    create(value?: PartialMessage<BarrierResponse>): BarrierResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.leaseAppliedIndex = 0n;
        if (value !== undefined)
            reflectionMergePartial<BarrierResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BarrierResponse): BarrierResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  3:
                    message.leaseAppliedIndex = reader.uint64().toBigInt();
                    break;
                case  4:
                    message.rangeDesc = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.rangeDesc);
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

export const BarrierResponse = /*#__PURE__*/ new BarrierResponse$Type();

class FlushLockTableRequest$Type extends MessageType<FlushLockTableRequest> {
    constructor() {
        super("cockroach.roachpb.FlushLockTableRequest", [
            { no: 1, name: "header", kind: "message", T: () => RequestHeader }
        ]);
    }
    create(value?: PartialMessage<FlushLockTableRequest>): FlushLockTableRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FlushLockTableRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FlushLockTableRequest): FlushLockTableRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = RequestHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
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

export const FlushLockTableRequest = /*#__PURE__*/ new FlushLockTableRequest$Type();

class FlushLockTableResponse$Type extends MessageType<FlushLockTableResponse> {
    constructor() {
        super("cockroach.roachpb.FlushLockTableResponse", [
            { no: 1, name: "header", kind: "message", T: () => ResponseHeader },
            { no: 2, name: "locks_written", kind: "scalar", T: 4 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<FlushLockTableResponse>): FlushLockTableResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.locksWritten = 0n;
        if (value !== undefined)
            reflectionMergePartial<FlushLockTableResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FlushLockTableResponse): FlushLockTableResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = ResponseHeader.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.locksWritten = reader.uint64().toBigInt();
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

export const FlushLockTableResponse = /*#__PURE__*/ new FlushLockTableResponse$Type();

class RequestUnion$Type extends MessageType<RequestUnion> {
    constructor() {
        super("cockroach.roachpb.RequestUnion", [
            { no: 1, name: "get", kind: "message", oneof: "value", T: () => GetRequest },
            { no: 2, name: "put", kind: "message", oneof: "value", T: () => PutRequest },
            { no: 3, name: "conditional_put", kind: "message", oneof: "value", T: () => ConditionalPutRequest },
            { no: 4, name: "increment", kind: "message", oneof: "value", T: () => IncrementRequest },
            { no: 5, name: "delete", kind: "message", oneof: "value", T: () => DeleteRequest },
            { no: 6, name: "delete_range", kind: "message", oneof: "value", T: () => DeleteRangeRequest },
            { no: 38, name: "clear_range", kind: "message", oneof: "value", T: () => ClearRangeRequest },
            { no: 48, name: "revert_range", kind: "message", oneof: "value", T: () => RevertRangeRequest },
            { no: 7, name: "scan", kind: "message", oneof: "value", T: () => ScanRequest },
            { no: 9, name: "end_txn", kind: "message", oneof: "value", T: () => EndTxnRequest },
            { no: 10, name: "admin_split", kind: "message", oneof: "value", T: () => AdminSplitRequest },
            { no: 47, name: "admin_unsplit", kind: "message", oneof: "value", T: () => AdminUnsplitRequest },
            { no: 11, name: "admin_merge", kind: "message", oneof: "value", T: () => AdminMergeRequest },
            { no: 29, name: "admin_transfer_lease", kind: "message", oneof: "value", T: () => AdminTransferLeaseRequest },
            { no: 35, name: "admin_change_replicas", kind: "message", oneof: "value", T: () => AdminChangeReplicasRequest },
            { no: 45, name: "admin_relocate_range", kind: "message", oneof: "value", T: () => AdminRelocateRangeRequest },
            { no: 12, name: "heartbeat_txn", kind: "message", oneof: "value", T: () => HeartbeatTxnRequest },
            { no: 13, name: "gc", kind: "message", oneof: "value", T: () => GCRequest },
            { no: 14, name: "push_txn", kind: "message", oneof: "value", T: () => PushTxnRequest },
            { no: 46, name: "recover_txn", kind: "message", oneof: "value", T: () => RecoverTxnRequest },
            { no: 16, name: "resolve_intent", kind: "message", oneof: "value", T: () => ResolveIntentRequest },
            { no: 17, name: "resolve_intent_range", kind: "message", oneof: "value", T: () => ResolveIntentRangeRequest },
            { no: 18, name: "merge", kind: "message", oneof: "value", T: () => MergeRequest },
            { no: 19, name: "truncate_log", kind: "message", oneof: "value", T: () => TruncateLogRequest },
            { no: 20, name: "request_lease", kind: "message", oneof: "value", T: () => RequestLeaseRequest },
            { no: 21, name: "reverse_scan", kind: "message", oneof: "value", T: () => ReverseScanRequest },
            { no: 22, name: "compute_checksum", kind: "message", oneof: "value", T: () => ComputeChecksumRequest },
            { no: 24, name: "check_consistency", kind: "message", oneof: "value", T: () => CheckConsistencyRequest },
            { no: 28, name: "transfer_lease", kind: "message", oneof: "value", T: () => TransferLeaseRequest },
            { no: 30, name: "lease_info", kind: "message", oneof: "value", T: () => LeaseInfoRequest },
            { no: 32, name: "export", kind: "message", oneof: "value", T: () => ExportRequest },
            { no: 33, name: "query_txn", kind: "message", oneof: "value", T: () => QueryTxnRequest },
            { no: 42, name: "query_intent", kind: "message", oneof: "value", T: () => QueryIntentRequest },
            { no: 55, name: "query_locks", kind: "message", oneof: "value", T: () => QueryLocksRequest },
            { no: 36, name: "admin_scatter", kind: "message", oneof: "value", T: () => AdminScatterRequest },
            { no: 37, name: "add_sstable", kind: "message", oneof: "value", T: () => AddSSTableRequest },
            { no: 39, name: "recompute_stats", kind: "message", oneof: "value", T: () => RecomputeStatsRequest },
            { no: 40, name: "refresh", kind: "message", oneof: "value", T: () => RefreshRequest },
            { no: 41, name: "refresh_range", kind: "message", oneof: "value", T: () => RefreshRangeRequest },
            { no: 43, name: "subsume", kind: "message", oneof: "value", T: () => SubsumeRequest },
            { no: 44, name: "range_stats", kind: "message", oneof: "value", T: () => RangeStatsRequest },
            { no: 50, name: "migrate", kind: "message", oneof: "value", T: () => MigrateRequest },
            { no: 51, name: "query_resolved_timestamp", kind: "message", oneof: "value", T: () => QueryResolvedTimestampRequest },
            { no: 53, name: "barrier", kind: "message", oneof: "value", T: () => BarrierRequest },
            { no: 54, name: "probe", kind: "message", oneof: "value", T: () => ProbeRequest },
            { no: 56, name: "is_span_empty", kind: "message", oneof: "value", T: () => IsSpanEmptyRequest },
            { no: 57, name: "link_external_sstable", kind: "message", oneof: "value", T: () => LinkExternalSSTableRequest },
            { no: 58, name: "excise", kind: "message", oneof: "value", T: () => ExciseRequest },
            { no: 59, name: "flush_lock_table", kind: "message", oneof: "value", T: () => FlushLockTableRequest }
        ]);
    }
    create(value?: PartialMessage<RequestUnion>): RequestUnion {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<RequestUnion>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RequestUnion): RequestUnion {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.value = {
                        oneofKind: "get",
                        get: GetRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).get)
                    };
                    break;
                case  2:
                    message.value = {
                        oneofKind: "put",
                        put: PutRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).put)
                    };
                    break;
                case  3:
                    message.value = {
                        oneofKind: "conditionalPut",
                        conditionalPut: ConditionalPutRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).conditionalPut)
                    };
                    break;
                case  4:
                    message.value = {
                        oneofKind: "increment",
                        increment: IncrementRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).increment)
                    };
                    break;
                case  5:
                    message.value = {
                        oneofKind: "delete",
                        delete: DeleteRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).delete)
                    };
                    break;
                case  6:
                    message.value = {
                        oneofKind: "deleteRange",
                        deleteRange: DeleteRangeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).deleteRange)
                    };
                    break;
                case  38:
                    message.value = {
                        oneofKind: "clearRange",
                        clearRange: ClearRangeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).clearRange)
                    };
                    break;
                case  48:
                    message.value = {
                        oneofKind: "revertRange",
                        revertRange: RevertRangeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).revertRange)
                    };
                    break;
                case  7:
                    message.value = {
                        oneofKind: "scan",
                        scan: ScanRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).scan)
                    };
                    break;
                case  9:
                    message.value = {
                        oneofKind: "endTxn",
                        endTxn: EndTxnRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).endTxn)
                    };
                    break;
                case  10:
                    message.value = {
                        oneofKind: "adminSplit",
                        adminSplit: AdminSplitRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminSplit)
                    };
                    break;
                case  47:
                    message.value = {
                        oneofKind: "adminUnsplit",
                        adminUnsplit: AdminUnsplitRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminUnsplit)
                    };
                    break;
                case  11:
                    message.value = {
                        oneofKind: "adminMerge",
                        adminMerge: AdminMergeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminMerge)
                    };
                    break;
                case  29:
                    message.value = {
                        oneofKind: "adminTransferLease",
                        adminTransferLease: AdminTransferLeaseRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminTransferLease)
                    };
                    break;
                case  35:
                    message.value = {
                        oneofKind: "adminChangeReplicas",
                        adminChangeReplicas: AdminChangeReplicasRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminChangeReplicas)
                    };
                    break;
                case  45:
                    message.value = {
                        oneofKind: "adminRelocateRange",
                        adminRelocateRange: AdminRelocateRangeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminRelocateRange)
                    };
                    break;
                case  12:
                    message.value = {
                        oneofKind: "heartbeatTxn",
                        heartbeatTxn: HeartbeatTxnRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).heartbeatTxn)
                    };
                    break;
                case  13:
                    message.value = {
                        oneofKind: "gc",
                        gc: GCRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).gc)
                    };
                    break;
                case  14:
                    message.value = {
                        oneofKind: "pushTxn",
                        pushTxn: PushTxnRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).pushTxn)
                    };
                    break;
                case  46:
                    message.value = {
                        oneofKind: "recoverTxn",
                        recoverTxn: RecoverTxnRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).recoverTxn)
                    };
                    break;
                case  16:
                    message.value = {
                        oneofKind: "resolveIntent",
                        resolveIntent: ResolveIntentRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).resolveIntent)
                    };
                    break;
                case  17:
                    message.value = {
                        oneofKind: "resolveIntentRange",
                        resolveIntentRange: ResolveIntentRangeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).resolveIntentRange)
                    };
                    break;
                case  18:
                    message.value = {
                        oneofKind: "merge",
                        merge: MergeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).merge)
                    };
                    break;
                case  19:
                    message.value = {
                        oneofKind: "truncateLog",
                        truncateLog: TruncateLogRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).truncateLog)
                    };
                    break;
                case  20:
                    message.value = {
                        oneofKind: "requestLease",
                        requestLease: RequestLeaseRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).requestLease)
                    };
                    break;
                case  21:
                    message.value = {
                        oneofKind: "reverseScan",
                        reverseScan: ReverseScanRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).reverseScan)
                    };
                    break;
                case  22:
                    message.value = {
                        oneofKind: "computeChecksum",
                        computeChecksum: ComputeChecksumRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).computeChecksum)
                    };
                    break;
                case  24:
                    message.value = {
                        oneofKind: "checkConsistency",
                        checkConsistency: CheckConsistencyRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).checkConsistency)
                    };
                    break;
                case  28:
                    message.value = {
                        oneofKind: "transferLease",
                        transferLease: TransferLeaseRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).transferLease)
                    };
                    break;
                case  30:
                    message.value = {
                        oneofKind: "leaseInfo",
                        leaseInfo: LeaseInfoRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).leaseInfo)
                    };
                    break;
                case  32:
                    message.value = {
                        oneofKind: "export",
                        export: ExportRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).export)
                    };
                    break;
                case  33:
                    message.value = {
                        oneofKind: "queryTxn",
                        queryTxn: QueryTxnRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).queryTxn)
                    };
                    break;
                case  42:
                    message.value = {
                        oneofKind: "queryIntent",
                        queryIntent: QueryIntentRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).queryIntent)
                    };
                    break;
                case  55:
                    message.value = {
                        oneofKind: "queryLocks",
                        queryLocks: QueryLocksRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).queryLocks)
                    };
                    break;
                case  36:
                    message.value = {
                        oneofKind: "adminScatter",
                        adminScatter: AdminScatterRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminScatter)
                    };
                    break;
                case  37:
                    message.value = {
                        oneofKind: "addSstable",
                        addSstable: AddSSTableRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).addSstable)
                    };
                    break;
                case  39:
                    message.value = {
                        oneofKind: "recomputeStats",
                        recomputeStats: RecomputeStatsRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).recomputeStats)
                    };
                    break;
                case  40:
                    message.value = {
                        oneofKind: "refresh",
                        refresh: RefreshRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).refresh)
                    };
                    break;
                case  41:
                    message.value = {
                        oneofKind: "refreshRange",
                        refreshRange: RefreshRangeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).refreshRange)
                    };
                    break;
                case  43:
                    message.value = {
                        oneofKind: "subsume",
                        subsume: SubsumeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).subsume)
                    };
                    break;
                case  44:
                    message.value = {
                        oneofKind: "rangeStats",
                        rangeStats: RangeStatsRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).rangeStats)
                    };
                    break;
                case  50:
                    message.value = {
                        oneofKind: "migrate",
                        migrate: MigrateRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).migrate)
                    };
                    break;
                case  51:
                    message.value = {
                        oneofKind: "queryResolvedTimestamp",
                        queryResolvedTimestamp: QueryResolvedTimestampRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).queryResolvedTimestamp)
                    };
                    break;
                case  53:
                    message.value = {
                        oneofKind: "barrier",
                        barrier: BarrierRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).barrier)
                    };
                    break;
                case  54:
                    message.value = {
                        oneofKind: "probe",
                        probe: ProbeRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).probe)
                    };
                    break;
                case  56:
                    message.value = {
                        oneofKind: "isSpanEmpty",
                        isSpanEmpty: IsSpanEmptyRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).isSpanEmpty)
                    };
                    break;
                case  57:
                    message.value = {
                        oneofKind: "linkExternalSstable",
                        linkExternalSstable: LinkExternalSSTableRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).linkExternalSstable)
                    };
                    break;
                case  58:
                    message.value = {
                        oneofKind: "excise",
                        excise: ExciseRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).excise)
                    };
                    break;
                case  59:
                    message.value = {
                        oneofKind: "flushLockTable",
                        flushLockTable: FlushLockTableRequest.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).flushLockTable)
                    };
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

export const RequestUnion = /*#__PURE__*/ new RequestUnion$Type();

class ResponseUnion$Type extends MessageType<ResponseUnion> {
    constructor() {
        super("cockroach.roachpb.ResponseUnion", [
            { no: 1, name: "get", kind: "message", oneof: "value", T: () => GetResponse },
            { no: 2, name: "put", kind: "message", oneof: "value", T: () => PutResponse },
            { no: 3, name: "conditional_put", kind: "message", oneof: "value", T: () => ConditionalPutResponse },
            { no: 4, name: "increment", kind: "message", oneof: "value", T: () => IncrementResponse },
            { no: 5, name: "delete", kind: "message", oneof: "value", T: () => DeleteResponse },
            { no: 6, name: "delete_range", kind: "message", oneof: "value", T: () => DeleteRangeResponse },
            { no: 38, name: "clear_range", kind: "message", oneof: "value", T: () => ClearRangeResponse },
            { no: 48, name: "revert_range", kind: "message", oneof: "value", T: () => RevertRangeResponse },
            { no: 7, name: "scan", kind: "message", oneof: "value", T: () => ScanResponse },
            { no: 9, name: "end_txn", kind: "message", oneof: "value", T: () => EndTxnResponse },
            { no: 10, name: "admin_split", kind: "message", oneof: "value", T: () => AdminSplitResponse },
            { no: 47, name: "admin_unsplit", kind: "message", oneof: "value", T: () => AdminUnsplitResponse },
            { no: 11, name: "admin_merge", kind: "message", oneof: "value", T: () => AdminMergeResponse },
            { no: 29, name: "admin_transfer_lease", kind: "message", oneof: "value", T: () => AdminTransferLeaseResponse },
            { no: 35, name: "admin_change_replicas", kind: "message", oneof: "value", T: () => AdminChangeReplicasResponse },
            { no: 45, name: "admin_relocate_range", kind: "message", oneof: "value", T: () => AdminRelocateRangeResponse },
            { no: 12, name: "heartbeat_txn", kind: "message", oneof: "value", T: () => HeartbeatTxnResponse },
            { no: 13, name: "gc", kind: "message", oneof: "value", T: () => GCResponse },
            { no: 14, name: "push_txn", kind: "message", oneof: "value", T: () => PushTxnResponse },
            { no: 46, name: "recover_txn", kind: "message", oneof: "value", T: () => RecoverTxnResponse },
            { no: 16, name: "resolve_intent", kind: "message", oneof: "value", T: () => ResolveIntentResponse },
            { no: 17, name: "resolve_intent_range", kind: "message", oneof: "value", T: () => ResolveIntentRangeResponse },
            { no: 18, name: "merge", kind: "message", oneof: "value", T: () => MergeResponse },
            { no: 19, name: "truncate_log", kind: "message", oneof: "value", T: () => TruncateLogResponse },
            { no: 20, name: "request_lease", kind: "message", oneof: "value", T: () => RequestLeaseResponse },
            { no: 21, name: "reverse_scan", kind: "message", oneof: "value", T: () => ReverseScanResponse },
            { no: 22, name: "compute_checksum", kind: "message", oneof: "value", T: () => ComputeChecksumResponse },
            { no: 24, name: "check_consistency", kind: "message", oneof: "value", T: () => CheckConsistencyResponse },
            { no: 30, name: "lease_info", kind: "message", oneof: "value", T: () => LeaseInfoResponse },
            { no: 32, name: "export", kind: "message", oneof: "value", T: () => ExportResponse },
            { no: 33, name: "query_txn", kind: "message", oneof: "value", T: () => QueryTxnResponse },
            { no: 42, name: "query_intent", kind: "message", oneof: "value", T: () => QueryIntentResponse },
            { no: 55, name: "query_locks", kind: "message", oneof: "value", T: () => QueryLocksResponse },
            { no: 36, name: "admin_scatter", kind: "message", oneof: "value", T: () => AdminScatterResponse },
            { no: 37, name: "add_sstable", kind: "message", oneof: "value", T: () => AddSSTableResponse },
            { no: 39, name: "recompute_stats", kind: "message", oneof: "value", T: () => RecomputeStatsResponse },
            { no: 40, name: "refresh", kind: "message", oneof: "value", T: () => RefreshResponse },
            { no: 41, name: "refresh_range", kind: "message", oneof: "value", T: () => RefreshRangeResponse },
            { no: 43, name: "subsume", kind: "message", oneof: "value", T: () => SubsumeResponse },
            { no: 44, name: "range_stats", kind: "message", oneof: "value", T: () => RangeStatsResponse },
            { no: 50, name: "migrate", kind: "message", oneof: "value", T: () => MigrateResponse },
            { no: 51, name: "query_resolved_timestamp", kind: "message", oneof: "value", T: () => QueryResolvedTimestampResponse },
            { no: 53, name: "barrier", kind: "message", oneof: "value", T: () => BarrierResponse },
            { no: 54, name: "probe", kind: "message", oneof: "value", T: () => ProbeResponse },
            { no: 56, name: "is_span_empty", kind: "message", oneof: "value", T: () => IsSpanEmptyResponse },
            { no: 57, name: "link_external_sstable", kind: "message", oneof: "value", T: () => LinkExternalSSTableResponse },
            { no: 58, name: "excise", kind: "message", oneof: "value", T: () => ExciseResponse },
            { no: 59, name: "flush_lock_table", kind: "message", oneof: "value", T: () => FlushLockTableResponse }
        ]);
    }
    create(value?: PartialMessage<ResponseUnion>): ResponseUnion {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<ResponseUnion>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResponseUnion): ResponseUnion {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.value = {
                        oneofKind: "get",
                        get: GetResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).get)
                    };
                    break;
                case  2:
                    message.value = {
                        oneofKind: "put",
                        put: PutResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).put)
                    };
                    break;
                case  3:
                    message.value = {
                        oneofKind: "conditionalPut",
                        conditionalPut: ConditionalPutResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).conditionalPut)
                    };
                    break;
                case  4:
                    message.value = {
                        oneofKind: "increment",
                        increment: IncrementResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).increment)
                    };
                    break;
                case  5:
                    message.value = {
                        oneofKind: "delete",
                        delete: DeleteResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).delete)
                    };
                    break;
                case  6:
                    message.value = {
                        oneofKind: "deleteRange",
                        deleteRange: DeleteRangeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).deleteRange)
                    };
                    break;
                case  38:
                    message.value = {
                        oneofKind: "clearRange",
                        clearRange: ClearRangeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).clearRange)
                    };
                    break;
                case  48:
                    message.value = {
                        oneofKind: "revertRange",
                        revertRange: RevertRangeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).revertRange)
                    };
                    break;
                case  7:
                    message.value = {
                        oneofKind: "scan",
                        scan: ScanResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).scan)
                    };
                    break;
                case  9:
                    message.value = {
                        oneofKind: "endTxn",
                        endTxn: EndTxnResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).endTxn)
                    };
                    break;
                case  10:
                    message.value = {
                        oneofKind: "adminSplit",
                        adminSplit: AdminSplitResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminSplit)
                    };
                    break;
                case  47:
                    message.value = {
                        oneofKind: "adminUnsplit",
                        adminUnsplit: AdminUnsplitResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminUnsplit)
                    };
                    break;
                case  11:
                    message.value = {
                        oneofKind: "adminMerge",
                        adminMerge: AdminMergeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminMerge)
                    };
                    break;
                case  29:
                    message.value = {
                        oneofKind: "adminTransferLease",
                        adminTransferLease: AdminTransferLeaseResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminTransferLease)
                    };
                    break;
                case  35:
                    message.value = {
                        oneofKind: "adminChangeReplicas",
                        adminChangeReplicas: AdminChangeReplicasResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminChangeReplicas)
                    };
                    break;
                case  45:
                    message.value = {
                        oneofKind: "adminRelocateRange",
                        adminRelocateRange: AdminRelocateRangeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminRelocateRange)
                    };
                    break;
                case  12:
                    message.value = {
                        oneofKind: "heartbeatTxn",
                        heartbeatTxn: HeartbeatTxnResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).heartbeatTxn)
                    };
                    break;
                case  13:
                    message.value = {
                        oneofKind: "gc",
                        gc: GCResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).gc)
                    };
                    break;
                case  14:
                    message.value = {
                        oneofKind: "pushTxn",
                        pushTxn: PushTxnResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).pushTxn)
                    };
                    break;
                case  46:
                    message.value = {
                        oneofKind: "recoverTxn",
                        recoverTxn: RecoverTxnResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).recoverTxn)
                    };
                    break;
                case  16:
                    message.value = {
                        oneofKind: "resolveIntent",
                        resolveIntent: ResolveIntentResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).resolveIntent)
                    };
                    break;
                case  17:
                    message.value = {
                        oneofKind: "resolveIntentRange",
                        resolveIntentRange: ResolveIntentRangeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).resolveIntentRange)
                    };
                    break;
                case  18:
                    message.value = {
                        oneofKind: "merge",
                        merge: MergeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).merge)
                    };
                    break;
                case  19:
                    message.value = {
                        oneofKind: "truncateLog",
                        truncateLog: TruncateLogResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).truncateLog)
                    };
                    break;
                case  20:
                    message.value = {
                        oneofKind: "requestLease",
                        requestLease: RequestLeaseResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).requestLease)
                    };
                    break;
                case  21:
                    message.value = {
                        oneofKind: "reverseScan",
                        reverseScan: ReverseScanResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).reverseScan)
                    };
                    break;
                case  22:
                    message.value = {
                        oneofKind: "computeChecksum",
                        computeChecksum: ComputeChecksumResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).computeChecksum)
                    };
                    break;
                case  24:
                    message.value = {
                        oneofKind: "checkConsistency",
                        checkConsistency: CheckConsistencyResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).checkConsistency)
                    };
                    break;
                case  30:
                    message.value = {
                        oneofKind: "leaseInfo",
                        leaseInfo: LeaseInfoResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).leaseInfo)
                    };
                    break;
                case  32:
                    message.value = {
                        oneofKind: "export",
                        export: ExportResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).export)
                    };
                    break;
                case  33:
                    message.value = {
                        oneofKind: "queryTxn",
                        queryTxn: QueryTxnResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).queryTxn)
                    };
                    break;
                case  42:
                    message.value = {
                        oneofKind: "queryIntent",
                        queryIntent: QueryIntentResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).queryIntent)
                    };
                    break;
                case  55:
                    message.value = {
                        oneofKind: "queryLocks",
                        queryLocks: QueryLocksResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).queryLocks)
                    };
                    break;
                case  36:
                    message.value = {
                        oneofKind: "adminScatter",
                        adminScatter: AdminScatterResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).adminScatter)
                    };
                    break;
                case  37:
                    message.value = {
                        oneofKind: "addSstable",
                        addSstable: AddSSTableResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).addSstable)
                    };
                    break;
                case  39:
                    message.value = {
                        oneofKind: "recomputeStats",
                        recomputeStats: RecomputeStatsResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).recomputeStats)
                    };
                    break;
                case  40:
                    message.value = {
                        oneofKind: "refresh",
                        refresh: RefreshResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).refresh)
                    };
                    break;
                case  41:
                    message.value = {
                        oneofKind: "refreshRange",
                        refreshRange: RefreshRangeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).refreshRange)
                    };
                    break;
                case  43:
                    message.value = {
                        oneofKind: "subsume",
                        subsume: SubsumeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).subsume)
                    };
                    break;
                case  44:
                    message.value = {
                        oneofKind: "rangeStats",
                        rangeStats: RangeStatsResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).rangeStats)
                    };
                    break;
                case  50:
                    message.value = {
                        oneofKind: "migrate",
                        migrate: MigrateResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).migrate)
                    };
                    break;
                case  51:
                    message.value = {
                        oneofKind: "queryResolvedTimestamp",
                        queryResolvedTimestamp: QueryResolvedTimestampResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).queryResolvedTimestamp)
                    };
                    break;
                case  53:
                    message.value = {
                        oneofKind: "barrier",
                        barrier: BarrierResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).barrier)
                    };
                    break;
                case  54:
                    message.value = {
                        oneofKind: "probe",
                        probe: ProbeResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).probe)
                    };
                    break;
                case  56:
                    message.value = {
                        oneofKind: "isSpanEmpty",
                        isSpanEmpty: IsSpanEmptyResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).isSpanEmpty)
                    };
                    break;
                case  57:
                    message.value = {
                        oneofKind: "linkExternalSstable",
                        linkExternalSstable: LinkExternalSSTableResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).linkExternalSstable)
                    };
                    break;
                case  58:
                    message.value = {
                        oneofKind: "excise",
                        excise: ExciseResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).excise)
                    };
                    break;
                case  59:
                    message.value = {
                        oneofKind: "flushLockTable",
                        flushLockTable: FlushLockTableResponse.internalBinaryRead(reader, reader.uint32(), options, (message.value as any).flushLockTable)
                    };
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

export const ResponseUnion = /*#__PURE__*/ new ResponseUnion$Type();

class Header$Type extends MessageType<Header> {
    constructor() {
        super("cockroach.roachpb.Header", [
            { no: 1, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 27, name: "timestamp_from_server_clock", kind: "message", T: () => Timestamp },
            { no: 28, name: "now", kind: "message", T: () => Timestamp },
            { no: 2, name: "replica", kind: "message", T: () => ReplicaDescriptor },
            { no: 3, name: "range_id", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "user_priority", kind: "scalar", T: 1  },
            { no: 5, name: "txn", kind: "message", T: () => Transaction },
            { no: 6, name: "read_consistency", kind: "enum", T: () => ["cockroach.roachpb.ReadConsistencyType", ReadConsistencyType] },
            { no: 19, name: "routing_policy", kind: "enum", T: () => ["cockroach.roachpb.RoutingPolicy", RoutingPolicy] },
            { no: 18, name: "wait_policy", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.WaitPolicy", WaitPolicy] },
            { no: 21, name: "lock_timeout", kind: "message", T: () => Duration },
            { no: 8, name: "max_span_request_keys", kind: "scalar", T: 3 , L: 0  },
            { no: 15, name: "target_bytes", kind: "scalar", T: 3 , L: 0  },
            { no: 26, name: "whole_rows_of_size", kind: "scalar", T: 5  },
            { no: 23, name: "allow_empty", kind: "scalar", T: 8  },
            { no: 9, name: "distinct_spans", kind: "scalar", T: 8  },
            { no: 13, name: "async_consensus", kind: "scalar", T: 8  },
            { no: 16, name: "can_forward_read_timestamp", kind: "scalar", T: 8  },
            { no: 11, name: "gateway_node_id", kind: "scalar", T: 5  },
            { no: 17, name: "client_range_info", kind: "message", T: () => ClientRangeInfo },
            { no: 22, name: "bounded_staleness", kind: "message", T: () => BoundedStalenessHeader },
            { no: 25, name: "trace_info", kind: "message", T: () => TraceInfo },
            { no: 29, name: "index_fetch_spec", kind: "message", T: () => IndexFetchSpec },
            { no: 30, name: "return_elastic_cpu_resume_spans", kind: "scalar", T: 8  },
            { no: 31, name: "profile_labels", kind: "scalar", repeat: 2 , T: 9  },
            { no: 32, name: "ambiguous_replay_protection", kind: "scalar", T: 8  },
            { no: 33, name: "connection_class", kind: "enum", T: () => ["cockroach.rpc.ConnectionClass", ConnectionClass] },
            { no: 34, name: "proxy_range_info", kind: "message", T: () => RangeInfo },
            { no: 35, name: "write_options", kind: "message", T: () => WriteOptions },
            { no: 36, name: "deadlock_timeout", kind: "message", T: () => Duration },
            { no: 37, name: "has_buffered_all_preceding_writes", kind: "scalar", T: 8  },
            { no: 38, name: "is_reverse", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<Header>): Header {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rangeId = 0n;
        message.userPriority = 0;
        message.readConsistency = 0;
        message.routingPolicy = 0;
        message.waitPolicy = 0;
        message.maxSpanRequestKeys = 0n;
        message.targetBytes = 0n;
        message.wholeRowsOfSize = 0;
        message.allowEmpty = false;
        message.distinctSpans = false;
        message.asyncConsensus = false;
        message.canForwardReadTimestamp = false;
        message.gatewayNodeId = 0;
        message.returnElasticCpuResumeSpans = false;
        message.profileLabels = [];
        message.ambiguousReplayProtection = false;
        message.connectionClass = 0;
        message.hasBufferedAllPrecedingWrites = false;
        message.isReverse = false;
        if (value !== undefined)
            reflectionMergePartial<Header>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Header): Header {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  27:
                    message.timestampFromServerClock = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestampFromServerClock);
                    break;
                case  28:
                    message.now = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.now);
                    break;
                case  2:
                    message.replica = ReplicaDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.replica);
                    break;
                case  3:
                    message.rangeId = reader.int64().toBigInt();
                    break;
                case  4:
                    message.userPriority = reader.double();
                    break;
                case  5:
                    message.txn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  6:
                    message.readConsistency = reader.int32();
                    break;
                case  19:
                    message.routingPolicy = reader.int32();
                    break;
                case  18:
                    message.waitPolicy = reader.int32();
                    break;
                case  21:
                    message.lockTimeout = Duration.internalBinaryRead(reader, reader.uint32(), options, message.lockTimeout);
                    break;
                case  8:
                    message.maxSpanRequestKeys = reader.int64().toBigInt();
                    break;
                case  15:
                    message.targetBytes = reader.int64().toBigInt();
                    break;
                case  26:
                    message.wholeRowsOfSize = reader.int32();
                    break;
                case  23:
                    message.allowEmpty = reader.bool();
                    break;
                case  9:
                    message.distinctSpans = reader.bool();
                    break;
                case  13:
                    message.asyncConsensus = reader.bool();
                    break;
                case  16:
                    message.canForwardReadTimestamp = reader.bool();
                    break;
                case  11:
                    message.gatewayNodeId = reader.int32();
                    break;
                case  17:
                    message.clientRangeInfo = ClientRangeInfo.internalBinaryRead(reader, reader.uint32(), options, message.clientRangeInfo);
                    break;
                case  22:
                    message.boundedStaleness = BoundedStalenessHeader.internalBinaryRead(reader, reader.uint32(), options, message.boundedStaleness);
                    break;
                case  25:
                    message.traceInfo = TraceInfo.internalBinaryRead(reader, reader.uint32(), options, message.traceInfo);
                    break;
                case  29:
                    message.indexFetchSpec = IndexFetchSpec.internalBinaryRead(reader, reader.uint32(), options, message.indexFetchSpec);
                    break;
                case  30:
                    message.returnElasticCpuResumeSpans = reader.bool();
                    break;
                case  31:
                    message.profileLabels.push(reader.string());
                    break;
                case  32:
                    message.ambiguousReplayProtection = reader.bool();
                    break;
                case  33:
                    message.connectionClass = reader.int32();
                    break;
                case  34:
                    message.proxyRangeInfo = RangeInfo.internalBinaryRead(reader, reader.uint32(), options, message.proxyRangeInfo);
                    break;
                case  35:
                    message.writeOptions = WriteOptions.internalBinaryRead(reader, reader.uint32(), options, message.writeOptions);
                    break;
                case  36:
                    message.deadlockTimeout = Duration.internalBinaryRead(reader, reader.uint32(), options, message.deadlockTimeout);
                    break;
                case  37:
                    message.hasBufferedAllPrecedingWrites = reader.bool();
                    break;
                case  38:
                    message.isReverse = reader.bool();
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

export const Header = /*#__PURE__*/ new Header$Type();

class WriteOptions$Type extends MessageType<WriteOptions> {
    constructor() {
        super("cockroach.roachpb.WriteOptions", [
            { no: 1, name: "origin_id", kind: "scalar", T: 13  },
            { no: 2, name: "origin_timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<WriteOptions>): WriteOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.originId = 0;
        if (value !== undefined)
            reflectionMergePartial<WriteOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WriteOptions): WriteOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.originId = reader.uint32();
                    break;
                case  2:
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

export const WriteOptions = /*#__PURE__*/ new WriteOptions$Type();

class BoundedStalenessHeader$Type extends MessageType<BoundedStalenessHeader> {
    constructor() {
        super("cockroach.roachpb.BoundedStalenessHeader", [
            { no: 1, name: "min_timestamp_bound", kind: "message", T: () => Timestamp },
            { no: 2, name: "min_timestamp_bound_strict", kind: "scalar", T: 8  },
            { no: 3, name: "max_timestamp_bound", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<BoundedStalenessHeader>): BoundedStalenessHeader {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.minTimestampBoundStrict = false;
        if (value !== undefined)
            reflectionMergePartial<BoundedStalenessHeader>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BoundedStalenessHeader): BoundedStalenessHeader {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.minTimestampBound = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.minTimestampBound);
                    break;
                case  2:
                    message.minTimestampBoundStrict = reader.bool();
                    break;
                case  3:
                    message.maxTimestampBound = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.maxTimestampBound);
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

export const BoundedStalenessHeader = /*#__PURE__*/ new BoundedStalenessHeader$Type();

class AdmissionHeader$Type extends MessageType<AdmissionHeader> {
    constructor() {
        super("cockroach.roachpb.AdmissionHeader", [
            { no: 1, name: "priority", kind: "scalar", T: 5  },
            { no: 2, name: "create_time", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "source", kind: "enum", T: () => ["cockroach.roachpb.AdmissionHeader.Source", AdmissionHeader_Source] },
            { no: 4, name: "source_location", kind: "enum", T: () => ["cockroach.roachpb.AdmissionHeader.SourceLocation", AdmissionHeader_SourceLocation] },
            { no: 5, name: "no_memory_reserved_at_source", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<AdmissionHeader>): AdmissionHeader {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.priority = 0;
        message.createTime = 0n;
        message.source = 0;
        message.sourceLocation = 0;
        message.noMemoryReservedAtSource = false;
        if (value !== undefined)
            reflectionMergePartial<AdmissionHeader>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AdmissionHeader): AdmissionHeader {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.priority = reader.int32();
                    break;
                case  2:
                    message.createTime = reader.int64().toBigInt();
                    break;
                case  3:
                    message.source = reader.int32();
                    break;
                case  4:
                    message.sourceLocation = reader.int32();
                    break;
                case  5:
                    message.noMemoryReservedAtSource = reader.bool();
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

export const AdmissionHeader = /*#__PURE__*/ new AdmissionHeader$Type();

class BatchRequest$Type extends MessageType<BatchRequest> {
    constructor() {
        super("cockroach.roachpb.BatchRequest", [
            { no: 1, name: "header", kind: "message", T: () => Header },
            { no: 2, name: "requests", kind: "message", repeat: 2 , T: () => RequestUnion },
            { no: 3, name: "admission_header", kind: "message", T: () => AdmissionHeader }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<BatchRequest>): BatchRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.requests = [];
        if (value !== undefined)
            reflectionMergePartial<BatchRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BatchRequest): BatchRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = Header.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.requests.push(RequestUnion.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.admissionHeader = AdmissionHeader.internalBinaryRead(reader, reader.uint32(), options, message.admissionHeader);
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

export const BatchRequest = /*#__PURE__*/ new BatchRequest$Type();

class BatchResponse$Type extends MessageType<BatchResponse> {
    constructor() {
        super("cockroach.roachpb.BatchResponse", [
            { no: 1, name: "header", kind: "message", T: () => BatchResponse_Header },
            { no: 2, name: "responses", kind: "message", repeat: 2 , T: () => ResponseUnion }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<BatchResponse>): BatchResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.responses = [];
        if (value !== undefined)
            reflectionMergePartial<BatchResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BatchResponse): BatchResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = BatchResponse_Header.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.responses.push(ResponseUnion.internalBinaryRead(reader, reader.uint32(), options));
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

export const BatchResponse = /*#__PURE__*/ new BatchResponse$Type();

class BatchResponse_Header$Type extends MessageType<BatchResponse_Header> {
    constructor() {
        super("cockroach.roachpb.BatchResponse.Header", [
            { no: 1, name: "error", kind: "message", T: () => Error },
            { no: 2, name: "Timestamp", kind: "message", jsonName: "Timestamp", T: () => Timestamp },
            { no: 3, name: "txn", kind: "message", T: () => Transaction },
            { no: 5, name: "now", kind: "message", T: () => Timestamp },
            { no: 6, name: "collected_spans", kind: "message", repeat: 2 , T: () => RecordedSpan },
            { no: 7, name: "range_infos", kind: "message", repeat: 2 , T: () => RangeInfo }
        ]);
    }
    create(value?: PartialMessage<BatchResponse_Header>): BatchResponse_Header {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.collectedSpans = [];
        message.rangeInfos = [];
        if (value !== undefined)
            reflectionMergePartial<BatchResponse_Header>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BatchResponse_Header): BatchResponse_Header {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.error = Error.internalBinaryRead(reader, reader.uint32(), options, message.error);
                    break;
                case  2:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  3:
                    message.txn = Transaction.internalBinaryRead(reader, reader.uint32(), options, message.txn);
                    break;
                case  5:
                    message.now = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.now);
                    break;
                case  6:
                    message.collectedSpans.push(RecordedSpan.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.rangeInfos.push(RangeInfo.internalBinaryRead(reader, reader.uint32(), options));
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

export const BatchResponse_Header = /*#__PURE__*/ new BatchResponse_Header$Type();

class RangeLookupRequest$Type extends MessageType<RangeLookupRequest> {
    constructor() {
        super("cockroach.roachpb.RangeLookupRequest", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "read_consistency", kind: "enum", T: () => ["cockroach.roachpb.ReadConsistencyType", ReadConsistencyType] },
            { no: 3, name: "prefetch_num", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "prefetch_reverse", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<RangeLookupRequest>): RangeLookupRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.readConsistency = 0;
        message.prefetchNum = 0n;
        message.prefetchReverse = false;
        if (value !== undefined)
            reflectionMergePartial<RangeLookupRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeLookupRequest): RangeLookupRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.readConsistency = reader.int32();
                    break;
                case  3:
                    message.prefetchNum = reader.int64().toBigInt();
                    break;
                case  4:
                    message.prefetchReverse = reader.bool();
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

export const RangeLookupRequest = /*#__PURE__*/ new RangeLookupRequest$Type();

class RangeLookupResponse$Type extends MessageType<RangeLookupResponse> {
    constructor() {
        super("cockroach.roachpb.RangeLookupResponse", [
            { no: 1, name: "descriptors", kind: "message", repeat: 2 , T: () => RangeDescriptor },
            { no: 2, name: "prefetched_descriptors", kind: "message", repeat: 2 , T: () => RangeDescriptor },
            { no: 3, name: "error", kind: "message", T: () => Error }
        ]);
    }
    create(value?: PartialMessage<RangeLookupResponse>): RangeLookupResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.descriptors = [];
        message.prefetchedDescriptors = [];
        if (value !== undefined)
            reflectionMergePartial<RangeLookupResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeLookupResponse): RangeLookupResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.descriptors.push(RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.prefetchedDescriptors.push(RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.error = Error.internalBinaryRead(reader, reader.uint32(), options, message.error);
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

export const RangeLookupResponse = /*#__PURE__*/ new RangeLookupResponse$Type();

class RangeFeedRequest$Type extends MessageType<RangeFeedRequest> {
    constructor() {
        super("cockroach.roachpb.RangeFeedRequest", [
            { no: 1, name: "header", kind: "message", T: () => Header },
            { no: 2, name: "span", kind: "message", T: () => Span },
            { no: 3, name: "with_diff", kind: "scalar", T: 8  },
            { no: 4, name: "admission_header", kind: "message", T: () => AdmissionHeader },
            { no: 5, name: "stream_id", kind: "scalar", T: 3 , L: 0  },
            { no: 6, name: "close_stream", kind: "scalar", T: 8  },
            { no: 7, name: "with_filtering", kind: "scalar", T: 8  },
            { no: 8, name: "with_matching_origin_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 9, name: "consumer_id", kind: "scalar", T: 3 , L: 0  },
            { no: 10, name: "with_bulk_delivery", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<RangeFeedRequest>): RangeFeedRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.withDiff = false;
        message.streamId = 0n;
        message.closeStream = false;
        message.withFiltering = false;
        message.withMatchingOriginIds = [];
        message.consumerId = 0n;
        message.withBulkDelivery = false;
        if (value !== undefined)
            reflectionMergePartial<RangeFeedRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedRequest): RangeFeedRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.header = Header.internalBinaryRead(reader, reader.uint32(), options, message.header);
                    break;
                case  2:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
                    break;
                case  3:
                    message.withDiff = reader.bool();
                    break;
                case  4:
                    message.admissionHeader = AdmissionHeader.internalBinaryRead(reader, reader.uint32(), options, message.admissionHeader);
                    break;
                case  5:
                    message.streamId = reader.int64().toBigInt();
                    break;
                case  6:
                    message.closeStream = reader.bool();
                    break;
                case  7:
                    message.withFiltering = reader.bool();
                    break;
                case  8:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.withMatchingOriginIds.push(reader.uint32());
                    else
                        message.withMatchingOriginIds.push(reader.uint32());
                    break;
                case  9:
                    message.consumerId = reader.int64().toBigInt();
                    break;
                case  10:
                    message.withBulkDelivery = reader.bool();
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

export const RangeFeedRequest = /*#__PURE__*/ new RangeFeedRequest$Type();

class RangeFeedValue$Type extends MessageType<RangeFeedValue> {
    constructor() {
        super("cockroach.roachpb.RangeFeedValue", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "value", kind: "message", T: () => Value },
            { no: 3, name: "prev_value", kind: "message", T: () => Value }
        ]);
    }
    create(value?: PartialMessage<RangeFeedValue>): RangeFeedValue {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<RangeFeedValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedValue): RangeFeedValue {
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
                case  3:
                    message.prevValue = Value.internalBinaryRead(reader, reader.uint32(), options, message.prevValue);
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

export const RangeFeedValue = /*#__PURE__*/ new RangeFeedValue$Type();

class RangeFeedBulkEvents$Type extends MessageType<RangeFeedBulkEvents> {
    constructor() {
        super("cockroach.roachpb.RangeFeedBulkEvents", [
            { no: 1, name: "events", kind: "message", repeat: 2 , T: () => RangeFeedEvent }
        ]);
    }
    create(value?: PartialMessage<RangeFeedBulkEvents>): RangeFeedBulkEvents {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.events = [];
        if (value !== undefined)
            reflectionMergePartial<RangeFeedBulkEvents>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedBulkEvents): RangeFeedBulkEvents {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.events.push(RangeFeedEvent.internalBinaryRead(reader, reader.uint32(), options));
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

export const RangeFeedBulkEvents = /*#__PURE__*/ new RangeFeedBulkEvents$Type();

class RangeFeedCheckpoint$Type extends MessageType<RangeFeedCheckpoint> {
    constructor() {
        super("cockroach.roachpb.RangeFeedCheckpoint", [
            { no: 1, name: "span", kind: "message", T: () => Span },
            { no: 2, name: "resolved_ts", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<RangeFeedCheckpoint>): RangeFeedCheckpoint {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RangeFeedCheckpoint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedCheckpoint): RangeFeedCheckpoint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
                    break;
                case  2:
                    message.resolvedTs = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.resolvedTs);
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

export const RangeFeedCheckpoint = /*#__PURE__*/ new RangeFeedCheckpoint$Type();

class RangeFeedError$Type extends MessageType<RangeFeedError> {
    constructor() {
        super("cockroach.roachpb.RangeFeedError", [
            { no: 1, name: "error", kind: "message", T: () => Error }
        ]);
    }
    create(value?: PartialMessage<RangeFeedError>): RangeFeedError {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RangeFeedError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedError): RangeFeedError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.error = Error.internalBinaryRead(reader, reader.uint32(), options, message.error);
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

export const RangeFeedError = /*#__PURE__*/ new RangeFeedError$Type();

class RangeFeedSSTable$Type extends MessageType<RangeFeedSSTable> {
    constructor() {
        super("cockroach.roachpb.RangeFeedSSTable", [
            { no: 1, name: "data", kind: "scalar", T: 12  },
            { no: 2, name: "span", kind: "message", T: () => Span },
            { no: 3, name: "write_ts", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<RangeFeedSSTable>): RangeFeedSSTable {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.data = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<RangeFeedSSTable>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedSSTable): RangeFeedSSTable {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.data = reader.bytes();
                    break;
                case  2:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
                    break;
                case  3:
                    message.writeTs = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.writeTs);
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

export const RangeFeedSSTable = /*#__PURE__*/ new RangeFeedSSTable$Type();

class RangeFeedDeleteRange$Type extends MessageType<RangeFeedDeleteRange> {
    constructor() {
        super("cockroach.roachpb.RangeFeedDeleteRange", [
            { no: 1, name: "span", kind: "message", T: () => Span },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<RangeFeedDeleteRange>): RangeFeedDeleteRange {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RangeFeedDeleteRange>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedDeleteRange): RangeFeedDeleteRange {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
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

export const RangeFeedDeleteRange = /*#__PURE__*/ new RangeFeedDeleteRange$Type();

class RangeFeedMetadata$Type extends MessageType<RangeFeedMetadata> {
    constructor() {
        super("cockroach.roachpb.RangeFeedMetadata", [
            { no: 1, name: "span", kind: "message", T: () => Span },
            { no: 2, name: "from_manual_split", kind: "scalar", T: 8  },
            { no: 3, name: "parent_start_key", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<RangeFeedMetadata>): RangeFeedMetadata {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.fromManualSplit = false;
        message.parentStartKey = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<RangeFeedMetadata>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedMetadata): RangeFeedMetadata {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
                    break;
                case  2:
                    message.fromManualSplit = reader.bool();
                    break;
                case  3:
                    message.parentStartKey = reader.bytes();
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

export const RangeFeedMetadata = /*#__PURE__*/ new RangeFeedMetadata$Type();

class RangeFeedEvent$Type extends MessageType<RangeFeedEvent> {
    constructor() {
        super("cockroach.roachpb.RangeFeedEvent", [
            { no: 1, name: "val", kind: "message", T: () => RangeFeedValue },
            { no: 2, name: "checkpoint", kind: "message", T: () => RangeFeedCheckpoint },
            { no: 3, name: "error", kind: "message", T: () => RangeFeedError },
            { no: 4, name: "sst", kind: "message", T: () => RangeFeedSSTable },
            { no: 5, name: "delete_range", kind: "message", T: () => RangeFeedDeleteRange },
            { no: 6, name: "metadata", kind: "message", T: () => RangeFeedMetadata },
            { no: 7, name: "bulk_events", kind: "message", T: () => RangeFeedBulkEvents }
        ], { "gogoproto.onlyone": true });
    }
    create(value?: PartialMessage<RangeFeedEvent>): RangeFeedEvent {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RangeFeedEvent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeFeedEvent): RangeFeedEvent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.val = RangeFeedValue.internalBinaryRead(reader, reader.uint32(), options, message.val);
                    break;
                case  2:
                    message.checkpoint = RangeFeedCheckpoint.internalBinaryRead(reader, reader.uint32(), options, message.checkpoint);
                    break;
                case  3:
                    message.error = RangeFeedError.internalBinaryRead(reader, reader.uint32(), options, message.error);
                    break;
                case  4:
                    message.sst = RangeFeedSSTable.internalBinaryRead(reader, reader.uint32(), options, message.sst);
                    break;
                case  5:
                    message.deleteRange = RangeFeedDeleteRange.internalBinaryRead(reader, reader.uint32(), options, message.deleteRange);
                    break;
                case  6:
                    message.metadata = RangeFeedMetadata.internalBinaryRead(reader, reader.uint32(), options, message.metadata);
                    break;
                case  7:
                    message.bulkEvents = RangeFeedBulkEvents.internalBinaryRead(reader, reader.uint32(), options, message.bulkEvents);
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

export const RangeFeedEvent = /*#__PURE__*/ new RangeFeedEvent$Type();

class MuxRangeFeedEvent$Type extends MessageType<MuxRangeFeedEvent> {
    constructor() {
        super("cockroach.roachpb.MuxRangeFeedEvent", [
            { no: 1, name: "event", kind: "message", T: () => RangeFeedEvent },
            { no: 2, name: "range_id", kind: "scalar", T: 5  },
            { no: 3, name: "stream_id", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<MuxRangeFeedEvent>): MuxRangeFeedEvent {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rangeId = 0;
        message.streamId = 0n;
        if (value !== undefined)
            reflectionMergePartial<MuxRangeFeedEvent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MuxRangeFeedEvent): MuxRangeFeedEvent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.event = RangeFeedEvent.internalBinaryRead(reader, reader.uint32(), options, message.event);
                    break;
                case  2:
                    message.rangeId = reader.int32();
                    break;
                case  3:
                    message.streamId = reader.int64().toBigInt();
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

export const MuxRangeFeedEvent = /*#__PURE__*/ new MuxRangeFeedEvent$Type();

class ResetQuorumRequest$Type extends MessageType<ResetQuorumRequest> {
    constructor() {
        super("cockroach.roachpb.ResetQuorumRequest", [
            { no: 1, name: "range_id", kind: "scalar", T: 5  }
        ]);
    }
    create(value?: PartialMessage<ResetQuorumRequest>): ResetQuorumRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rangeId = 0;
        if (value !== undefined)
            reflectionMergePartial<ResetQuorumRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResetQuorumRequest): ResetQuorumRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rangeId = reader.int32();
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

export const ResetQuorumRequest = /*#__PURE__*/ new ResetQuorumRequest$Type();

class ResetQuorumResponse$Type extends MessageType<ResetQuorumResponse> {
    constructor() {
        super("cockroach.roachpb.ResetQuorumResponse", []);
    }
    create(value?: PartialMessage<ResetQuorumResponse>): ResetQuorumResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ResetQuorumResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResetQuorumResponse): ResetQuorumResponse {
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

export const ResetQuorumResponse = /*#__PURE__*/ new ResetQuorumResponse$Type();

class GossipSubscriptionRequest$Type extends MessageType<GossipSubscriptionRequest> {
    constructor() {
        super("cockroach.roachpb.GossipSubscriptionRequest", [
            { no: 1, name: "patterns", kind: "scalar", repeat: 2 , T: 9  }
        ]);
    }
    create(value?: PartialMessage<GossipSubscriptionRequest>): GossipSubscriptionRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.patterns = [];
        if (value !== undefined)
            reflectionMergePartial<GossipSubscriptionRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GossipSubscriptionRequest): GossipSubscriptionRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.patterns.push(reader.string());
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

export const GossipSubscriptionRequest = /*#__PURE__*/ new GossipSubscriptionRequest$Type();

class GossipSubscriptionEvent$Type extends MessageType<GossipSubscriptionEvent> {
    constructor() {
        super("cockroach.roachpb.GossipSubscriptionEvent", [
            { no: 1, name: "key", kind: "scalar", T: 9  },
            { no: 2, name: "content", kind: "message", T: () => Value },
            { no: 3, name: "pattern_matched", kind: "scalar", T: 9  },
            { no: 4, name: "error", kind: "message", T: () => Error }
        ]);
    }
    create(value?: PartialMessage<GossipSubscriptionEvent>): GossipSubscriptionEvent {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = "";
        message.patternMatched = "";
        if (value !== undefined)
            reflectionMergePartial<GossipSubscriptionEvent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GossipSubscriptionEvent): GossipSubscriptionEvent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.string();
                    break;
                case  2:
                    message.content = Value.internalBinaryRead(reader, reader.uint32(), options, message.content);
                    break;
                case  3:
                    message.patternMatched = reader.string();
                    break;
                case  4:
                    message.error = Error.internalBinaryRead(reader, reader.uint32(), options, message.error);
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

export const GossipSubscriptionEvent = /*#__PURE__*/ new GossipSubscriptionEvent$Type();

class TenantSettingsRequest$Type extends MessageType<TenantSettingsRequest> {
    constructor() {
        super("cockroach.roachpb.TenantSettingsRequest", [
            { no: 1, name: "tenant_id", kind: "message", T: () => TenantID }
        ]);
    }
    create(value?: PartialMessage<TenantSettingsRequest>): TenantSettingsRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TenantSettingsRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantSettingsRequest): TenantSettingsRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.tenantId);
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

export const TenantSettingsRequest = /*#__PURE__*/ new TenantSettingsRequest$Type();

class TenantSettingsEvent$Type extends MessageType<TenantSettingsEvent> {
    constructor() {
        super("cockroach.roachpb.TenantSettingsEvent", [
            { no: 5, name: "event_type", kind: "enum", T: () => ["cockroach.roachpb.TenantSettingsEvent.EventType", TenantSettingsEvent_EventType] },
            { no: 4, name: "error", kind: "message", T: () => EncodedError },
            { no: 1, name: "precedence", kind: "enum", T: () => ["cockroach.roachpb.TenantSettingsEvent.Precedence", TenantSettingsEvent_Precedence] },
            { no: 2, name: "incremental", kind: "scalar", T: 8  },
            { no: 3, name: "overrides", kind: "message", repeat: 2 , T: () => TenantSetting },
            { no: 6, name: "name", kind: "scalar", T: 9  },
            { no: 7, name: "capabilities", kind: "message", T: () => TenantCapabilities },
            { no: 8, name: "data_state", kind: "scalar", T: 13  },
            { no: 9, name: "service_mode", kind: "scalar", T: 13  },
            { no: 10, name: "ClusterInitGracePeriodEndTS", kind: "scalar", jsonName: "ClusterInitGracePeriodEndTS", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<TenantSettingsEvent>): TenantSettingsEvent {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.eventType = 0;
        message.precedence = 0;
        message.incremental = false;
        message.overrides = [];
        message.name = "";
        message.dataState = 0;
        message.serviceMode = 0;
        message.clusterInitGracePeriodEndTS = 0n;
        if (value !== undefined)
            reflectionMergePartial<TenantSettingsEvent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantSettingsEvent): TenantSettingsEvent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  5:
                    message.eventType = reader.int32();
                    break;
                case  4:
                    message.error = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.error);
                    break;
                case  1:
                    message.precedence = reader.int32();
                    break;
                case  2:
                    message.incremental = reader.bool();
                    break;
                case  3:
                    message.overrides.push(TenantSetting.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.name = reader.string();
                    break;
                case  7:
                    message.capabilities = TenantCapabilities.internalBinaryRead(reader, reader.uint32(), options, message.capabilities);
                    break;
                case  8:
                    message.dataState = reader.uint32();
                    break;
                case  9:
                    message.serviceMode = reader.uint32();
                    break;
                case  10:
                    message.clusterInitGracePeriodEndTS = reader.int64().toBigInt();
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

export const TenantSettingsEvent = /*#__PURE__*/ new TenantSettingsEvent$Type();

class TenantSetting$Type extends MessageType<TenantSetting> {
    constructor() {
        super("cockroach.roachpb.TenantSetting", [
            { no: 1, name: "internal_key", kind: "scalar", T: 9  },
            { no: 2, name: "value", kind: "message", T: () => EncodedValue }
        ]);
    }
    create(value?: PartialMessage<TenantSetting>): TenantSetting {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.internalKey = "";
        if (value !== undefined)
            reflectionMergePartial<TenantSetting>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantSetting): TenantSetting {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.internalKey = reader.string();
                    break;
                case  2:
                    message.value = EncodedValue.internalBinaryRead(reader, reader.uint32(), options, message.value);
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

export const TenantSetting = /*#__PURE__*/ new TenantSetting$Type();

class TenantConsumption$Type extends MessageType<TenantConsumption> {
    constructor() {
        super("cockroach.roachpb.TenantConsumption", [
            { no: 1, name: "r_u", kind: "scalar", T: 1  },
            { no: 8, name: "kv_r_u", kind: "scalar", T: 1  },
            { no: 11, name: "read_batches", kind: "scalar", T: 4 , L: 0  },
            { no: 2, name: "read_requests", kind: "scalar", T: 4 , L: 0  },
            { no: 3, name: "read_bytes", kind: "scalar", T: 4 , L: 0  },
            { no: 12, name: "write_batches", kind: "scalar", T: 4 , L: 0  },
            { no: 4, name: "write_requests", kind: "scalar", T: 4 , L: 0  },
            { no: 5, name: "write_bytes", kind: "scalar", T: 4 , L: 0  },
            { no: 6, name: "sql_pods_cpu_seconds", kind: "scalar", T: 1  },
            { no: 7, name: "pgwire_egress_bytes", kind: "scalar", T: 4 , L: 0  },
            { no: 9, name: "external_io_ingress_bytes", kind: "scalar", T: 4 , L: 0  },
            { no: 10, name: "external_io_egress_bytes", kind: "scalar", T: 4 , L: 0  },
            { no: 13, name: "cross_region_network_r_u", kind: "scalar", T: 1  },
            { no: 14, name: "estimated_cpu_seconds", kind: "scalar", T: 1  }
        ]);
    }
    create(value?: PartialMessage<TenantConsumption>): TenantConsumption {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rU = 0;
        message.kvRU = 0;
        message.readBatches = 0n;
        message.readRequests = 0n;
        message.readBytes = 0n;
        message.writeBatches = 0n;
        message.writeRequests = 0n;
        message.writeBytes = 0n;
        message.sqlPodsCpuSeconds = 0;
        message.pgwireEgressBytes = 0n;
        message.externalIoIngressBytes = 0n;
        message.externalIoEgressBytes = 0n;
        message.crossRegionNetworkRU = 0;
        message.estimatedCpuSeconds = 0;
        if (value !== undefined)
            reflectionMergePartial<TenantConsumption>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantConsumption): TenantConsumption {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rU = reader.double();
                    break;
                case  8:
                    message.kvRU = reader.double();
                    break;
                case  11:
                    message.readBatches = reader.uint64().toBigInt();
                    break;
                case  2:
                    message.readRequests = reader.uint64().toBigInt();
                    break;
                case  3:
                    message.readBytes = reader.uint64().toBigInt();
                    break;
                case  12:
                    message.writeBatches = reader.uint64().toBigInt();
                    break;
                case  4:
                    message.writeRequests = reader.uint64().toBigInt();
                    break;
                case  5:
                    message.writeBytes = reader.uint64().toBigInt();
                    break;
                case  6:
                    message.sqlPodsCpuSeconds = reader.double();
                    break;
                case  7:
                    message.pgwireEgressBytes = reader.uint64().toBigInt();
                    break;
                case  9:
                    message.externalIoIngressBytes = reader.uint64().toBigInt();
                    break;
                case  10:
                    message.externalIoEgressBytes = reader.uint64().toBigInt();
                    break;
                case  13:
                    message.crossRegionNetworkRU = reader.double();
                    break;
                case  14:
                    message.estimatedCpuSeconds = reader.double();
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

export const TenantConsumption = /*#__PURE__*/ new TenantConsumption$Type();

class TenantConsumptionRates$Type extends MessageType<TenantConsumptionRates> {
    constructor() {
        super("cockroach.roachpb.TenantConsumptionRates", [
            { no: 1, name: "write_batch_rate", kind: "scalar", T: 1  },
            { no: 2, name: "estimated_cpu_rate", kind: "scalar", T: 1  }
        ]);
    }
    create(value?: PartialMessage<TenantConsumptionRates>): TenantConsumptionRates {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.writeBatchRate = 0;
        message.estimatedCpuRate = 0;
        if (value !== undefined)
            reflectionMergePartial<TenantConsumptionRates>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantConsumptionRates): TenantConsumptionRates {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.writeBatchRate = reader.double();
                    break;
                case  2:
                    message.estimatedCpuRate = reader.double();
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

export const TenantConsumptionRates = /*#__PURE__*/ new TenantConsumptionRates$Type();

class TokenBucketRequest$Type extends MessageType<TokenBucketRequest> {
    constructor() {
        super("cockroach.roachpb.TokenBucketRequest", [
            { no: 1, name: "consumption_since_last_request", kind: "message", T: () => TenantConsumption },
            { no: 9, name: "consumption_period", kind: "message", T: () => Duration },
            { no: 2, name: "tenant_id", kind: "scalar", T: 4 , L: 0  },
            { no: 3, name: "instance_id", kind: "scalar", T: 13  },
            { no: 8, name: "next_live_instance_id", kind: "scalar", T: 13  },
            { no: 4, name: "instance_lease", kind: "scalar", T: 12  },
            { no: 7, name: "seq_num", kind: "scalar", T: 3 , L: 0  },
            { no: 5, name: "requested_tokens", kind: "scalar", T: 1  },
            { no: 6, name: "target_request_period", kind: "message", T: () => Duration }
        ]);
    }
    create(value?: PartialMessage<TokenBucketRequest>): TokenBucketRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tenantId = 0n;
        message.instanceId = 0;
        message.nextLiveInstanceId = 0;
        message.instanceLease = new Uint8Array(0);
        message.seqNum = 0n;
        message.requestedTokens = 0;
        if (value !== undefined)
            reflectionMergePartial<TokenBucketRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TokenBucketRequest): TokenBucketRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.consumptionSinceLastRequest = TenantConsumption.internalBinaryRead(reader, reader.uint32(), options, message.consumptionSinceLastRequest);
                    break;
                case  9:
                    message.consumptionPeriod = Duration.internalBinaryRead(reader, reader.uint32(), options, message.consumptionPeriod);
                    break;
                case  2:
                    message.tenantId = reader.uint64().toBigInt();
                    break;
                case  3:
                    message.instanceId = reader.uint32();
                    break;
                case  8:
                    message.nextLiveInstanceId = reader.uint32();
                    break;
                case  4:
                    message.instanceLease = reader.bytes();
                    break;
                case  7:
                    message.seqNum = reader.int64().toBigInt();
                    break;
                case  5:
                    message.requestedTokens = reader.double();
                    break;
                case  6:
                    message.targetRequestPeriod = Duration.internalBinaryRead(reader, reader.uint32(), options, message.targetRequestPeriod);
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

export const TokenBucketRequest = /*#__PURE__*/ new TokenBucketRequest$Type();

class TokenBucketResponse$Type extends MessageType<TokenBucketResponse> {
    constructor() {
        super("cockroach.roachpb.TokenBucketResponse", [
            { no: 1, name: "error", kind: "message", T: () => EncodedError },
            { no: 2, name: "granted_tokens", kind: "scalar", T: 1  },
            { no: 3, name: "trickle_duration", kind: "message", T: () => Duration },
            { no: 4, name: "fallback_rate", kind: "scalar", T: 1  },
            { no: 5, name: "consumption_rates", kind: "message", T: () => TenantConsumptionRates }
        ]);
    }
    create(value?: PartialMessage<TokenBucketResponse>): TokenBucketResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.grantedTokens = 0;
        message.fallbackRate = 0;
        if (value !== undefined)
            reflectionMergePartial<TokenBucketResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TokenBucketResponse): TokenBucketResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.error = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.error);
                    break;
                case  2:
                    message.grantedTokens = reader.double();
                    break;
                case  3:
                    message.trickleDuration = Duration.internalBinaryRead(reader, reader.uint32(), options, message.trickleDuration);
                    break;
                case  4:
                    message.fallbackRate = reader.double();
                    break;
                case  5:
                    message.consumptionRates = TenantConsumptionRates.internalBinaryRead(reader, reader.uint32(), options, message.consumptionRates);
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

export const TokenBucketResponse = /*#__PURE__*/ new TokenBucketResponse$Type();

class JoinNodeRequest$Type extends MessageType<JoinNodeRequest> {
    constructor() {
        super("cockroach.roachpb.JoinNodeRequest", [
            { no: 1, name: "binary_version", kind: "message", T: () => Version }
        ]);
    }
    create(value?: PartialMessage<JoinNodeRequest>): JoinNodeRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<JoinNodeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: JoinNodeRequest): JoinNodeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.binaryVersion = Version.internalBinaryRead(reader, reader.uint32(), options, message.binaryVersion);
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

export const JoinNodeRequest = /*#__PURE__*/ new JoinNodeRequest$Type();

class JoinNodeResponse$Type extends MessageType<JoinNodeResponse> {
    constructor() {
        super("cockroach.roachpb.JoinNodeResponse", [
            { no: 1, name: "cluster_id", kind: "scalar", T: 12  },
            { no: 2, name: "node_id", kind: "scalar", T: 5  },
            { no: 3, name: "store_id", kind: "scalar", T: 5  },
            { no: 4, name: "active_version", kind: "message", T: () => Version }
        ]);
    }
    create(value?: PartialMessage<JoinNodeResponse>): JoinNodeResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.clusterId = new Uint8Array(0);
        message.nodeId = 0;
        message.storeId = 0;
        if (value !== undefined)
            reflectionMergePartial<JoinNodeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: JoinNodeResponse): JoinNodeResponse {
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
                case  4:
                    message.activeVersion = Version.internalBinaryRead(reader, reader.uint32(), options, message.activeVersion);
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

export const JoinNodeResponse = /*#__PURE__*/ new JoinNodeResponse$Type();

class GetRangeDescriptorsRequest$Type extends MessageType<GetRangeDescriptorsRequest> {
    constructor() {
        super("cockroach.roachpb.GetRangeDescriptorsRequest", [
            { no: 1, name: "span", kind: "message", T: () => Span },
            { no: 2, name: "batch_size", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<GetRangeDescriptorsRequest>): GetRangeDescriptorsRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.batchSize = 0n;
        if (value !== undefined)
            reflectionMergePartial<GetRangeDescriptorsRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetRangeDescriptorsRequest): GetRangeDescriptorsRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
                    break;
                case  2:
                    message.batchSize = reader.int64().toBigInt();
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

export const GetRangeDescriptorsRequest = /*#__PURE__*/ new GetRangeDescriptorsRequest$Type();

class GetRangeDescriptorsResponse$Type extends MessageType<GetRangeDescriptorsResponse> {
    constructor() {
        super("cockroach.roachpb.GetRangeDescriptorsResponse", [
            { no: 1, name: "range_descriptors", kind: "message", repeat: 2 , T: () => RangeDescriptor }
        ]);
    }
    create(value?: PartialMessage<GetRangeDescriptorsResponse>): GetRangeDescriptorsResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rangeDescriptors = [];
        if (value !== undefined)
            reflectionMergePartial<GetRangeDescriptorsResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetRangeDescriptorsResponse): GetRangeDescriptorsResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rangeDescriptors.push(RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options));
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

export const GetRangeDescriptorsResponse = /*#__PURE__*/ new GetRangeDescriptorsResponse$Type();

class ContentionEvent$Type extends MessageType<ContentionEvent> {
    constructor() {
        super("cockroach.roachpb.ContentionEvent", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "txn_meta", kind: "message", T: () => TxnMeta },
            { no: 3, name: "duration", kind: "message", T: () => Duration },
            { no: 4, name: "is_latch", kind: "scalar", T: 8  }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<ContentionEvent>): ContentionEvent {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.isLatch = false;
        if (value !== undefined)
            reflectionMergePartial<ContentionEvent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ContentionEvent): ContentionEvent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.txnMeta = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.txnMeta);
                    break;
                case  3:
                    message.duration = Duration.internalBinaryRead(reader, reader.uint32(), options, message.duration);
                    break;
                case  4:
                    message.isLatch = reader.bool();
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

export const ContentionEvent = /*#__PURE__*/ new ContentionEvent$Type();

class ScanStats$Type extends MessageType<ScanStats> {
    constructor() {
        super("cockroach.roachpb.ScanStats", [
            { no: 1, name: "num_interface_seeks", kind: "scalar", T: 4 , L: 0  },
            { no: 2, name: "num_internal_seeks", kind: "scalar", T: 4 , L: 0  },
            { no: 3, name: "num_interface_steps", kind: "scalar", T: 4 , L: 0  },
            { no: 4, name: "num_internal_steps", kind: "scalar", T: 4 , L: 0  },
            { no: 5, name: "block_bytes", kind: "scalar", T: 4 , L: 0  },
            { no: 6, name: "block_bytes_in_cache", kind: "scalar", T: 4 , L: 0  },
            { no: 7, name: "key_bytes", kind: "scalar", T: 4 , L: 0  },
            { no: 8, name: "value_bytes", kind: "scalar", T: 4 , L: 0  },
            { no: 9, name: "point_count", kind: "scalar", T: 4 , L: 0  },
            { no: 10, name: "points_covered_by_range_tombstones", kind: "scalar", T: 4 , L: 0  },
            { no: 11, name: "range_key_count", kind: "scalar", T: 4 , L: 0  },
            { no: 12, name: "range_key_contained_points", kind: "scalar", T: 4 , L: 0  },
            { no: 13, name: "range_key_skipped_points", kind: "scalar", T: 4 , L: 0  },
            { no: 14, name: "separated_point_count", kind: "scalar", T: 4 , L: 0  },
            { no: 15, name: "separated_point_value_bytes", kind: "scalar", T: 4 , L: 0  },
            { no: 16, name: "separated_point_value_bytes_fetched", kind: "scalar", T: 4 , L: 0  },
            { no: 23, name: "separated_point_value_count_fetched", kind: "scalar", T: 4 , L: 0  },
            { no: 24, name: "separated_point_value_reader_cache_misses", kind: "scalar", T: 4 , L: 0  },
            { no: 20, name: "block_read_duration", kind: "message", T: () => Duration },
            { no: 17, name: "num_gets", kind: "scalar", T: 4 , L: 0  },
            { no: 18, name: "num_scans", kind: "scalar", T: 4 , L: 0  },
            { no: 19, name: "num_reverse_scans", kind: "scalar", T: 4 , L: 0  },
            { no: 21, name: "node_id", kind: "scalar", T: 5  },
            { no: 22, name: "region", kind: "scalar", T: 9  }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<ScanStats>): ScanStats {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.numInterfaceSeeks = 0n;
        message.numInternalSeeks = 0n;
        message.numInterfaceSteps = 0n;
        message.numInternalSteps = 0n;
        message.blockBytes = 0n;
        message.blockBytesInCache = 0n;
        message.keyBytes = 0n;
        message.valueBytes = 0n;
        message.pointCount = 0n;
        message.pointsCoveredByRangeTombstones = 0n;
        message.rangeKeyCount = 0n;
        message.rangeKeyContainedPoints = 0n;
        message.rangeKeySkippedPoints = 0n;
        message.separatedPointCount = 0n;
        message.separatedPointValueBytes = 0n;
        message.separatedPointValueBytesFetched = 0n;
        message.separatedPointValueCountFetched = 0n;
        message.separatedPointValueReaderCacheMisses = 0n;
        message.numGets = 0n;
        message.numScans = 0n;
        message.numReverseScans = 0n;
        message.nodeId = 0;
        message.region = "";
        if (value !== undefined)
            reflectionMergePartial<ScanStats>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ScanStats): ScanStats {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.numInterfaceSeeks = reader.uint64().toBigInt();
                    break;
                case  2:
                    message.numInternalSeeks = reader.uint64().toBigInt();
                    break;
                case  3:
                    message.numInterfaceSteps = reader.uint64().toBigInt();
                    break;
                case  4:
                    message.numInternalSteps = reader.uint64().toBigInt();
                    break;
                case  5:
                    message.blockBytes = reader.uint64().toBigInt();
                    break;
                case  6:
                    message.blockBytesInCache = reader.uint64().toBigInt();
                    break;
                case  7:
                    message.keyBytes = reader.uint64().toBigInt();
                    break;
                case  8:
                    message.valueBytes = reader.uint64().toBigInt();
                    break;
                case  9:
                    message.pointCount = reader.uint64().toBigInt();
                    break;
                case  10:
                    message.pointsCoveredByRangeTombstones = reader.uint64().toBigInt();
                    break;
                case  11:
                    message.rangeKeyCount = reader.uint64().toBigInt();
                    break;
                case  12:
                    message.rangeKeyContainedPoints = reader.uint64().toBigInt();
                    break;
                case  13:
                    message.rangeKeySkippedPoints = reader.uint64().toBigInt();
                    break;
                case  14:
                    message.separatedPointCount = reader.uint64().toBigInt();
                    break;
                case  15:
                    message.separatedPointValueBytes = reader.uint64().toBigInt();
                    break;
                case  16:
                    message.separatedPointValueBytesFetched = reader.uint64().toBigInt();
                    break;
                case  23:
                    message.separatedPointValueCountFetched = reader.uint64().toBigInt();
                    break;
                case  24:
                    message.separatedPointValueReaderCacheMisses = reader.uint64().toBigInt();
                    break;
                case  20:
                    message.blockReadDuration = Duration.internalBinaryRead(reader, reader.uint32(), options, message.blockReadDuration);
                    break;
                case  17:
                    message.numGets = reader.uint64().toBigInt();
                    break;
                case  18:
                    message.numScans = reader.uint64().toBigInt();
                    break;
                case  19:
                    message.numReverseScans = reader.uint64().toBigInt();
                    break;
                case  21:
                    message.nodeId = reader.int32();
                    break;
                case  22:
                    message.region = reader.string();
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

export const ScanStats = /*#__PURE__*/ new ScanStats$Type();

class UsedFollowerRead$Type extends MessageType<UsedFollowerRead> {
    constructor() {
        super("cockroach.roachpb.UsedFollowerRead", []);
    }
    create(value?: PartialMessage<UsedFollowerRead>): UsedFollowerRead {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<UsedFollowerRead>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UsedFollowerRead): UsedFollowerRead {
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

export const UsedFollowerRead = /*#__PURE__*/ new UsedFollowerRead$Type();

export const KVBatch = new ServiceType("cockroach.roachpb.KVBatch", [
    { name: "Batch", I: BatchRequest, O: BatchResponse },
    { name: "BatchStream", serverStreaming: true, clientStreaming: true, I: BatchRequest, O: BatchResponse }
]);

export const TenantService = new ServiceType("cockroach.roachpb.TenantService", [
    { name: "TenantSettings", serverStreaming: true, I: TenantSettingsRequest, O: TenantSettingsEvent },
    { name: "GossipSubscription", serverStreaming: true, I: GossipSubscriptionRequest, O: GossipSubscriptionEvent },
    { name: "RangeLookup", I: RangeLookupRequest, O: RangeLookupResponse },
    { name: "GetRangeDescriptors", serverStreaming: true, I: GetRangeDescriptorsRequest, O: GetRangeDescriptorsResponse }
]);

export const TenantUsage = new ServiceType("cockroach.roachpb.TenantUsage", [
    { name: "TokenBucket", I: TokenBucketRequest, O: TokenBucketResponse }
]);

export const TenantSpanConfig = new ServiceType("cockroach.roachpb.TenantSpanConfig", [
    { name: "GetSpanConfigs", I: GetSpanConfigsRequest, O: GetSpanConfigsResponse },
    { name: "GetAllSystemSpanConfigsThatApply", I: GetAllSystemSpanConfigsThatApplyRequest, O: GetAllSystemSpanConfigsThatApplyResponse },
    { name: "UpdateSpanConfigs", I: UpdateSpanConfigsRequest, O: UpdateSpanConfigsResponse },
    { name: "SpanConfigConformance", I: SpanConfigConformanceRequest, O: SpanConfigConformanceResponse }
]);

export const Node = new ServiceType("cockroach.roachpb.Node", [
    { name: "Join", I: JoinNodeRequest, O: JoinNodeResponse }
]);

export const RangeFeed = new ServiceType("cockroach.roachpb.RangeFeed", [
    { name: "MuxRangeFeed", serverStreaming: true, clientStreaming: true, I: RangeFeedRequest, O: MuxRangeFeedEvent }
]);

export const QuorumRecovery = new ServiceType("cockroach.roachpb.QuorumRecovery", [
    { name: "ResetQuorum", I: ResetQuorumRequest, O: ResetQuorumResponse }
]);

export const Internal = new ServiceType("cockroach.roachpb.Internal", [
    { name: "Batch", I: BatchRequest, O: BatchResponse },
    { name: "BatchStream", serverStreaming: true, clientStreaming: true, I: BatchRequest, O: BatchResponse },
    { name: "RangeLookup", I: RangeLookupRequest, O: RangeLookupResponse },
    { name: "MuxRangeFeed", serverStreaming: true, clientStreaming: true, I: RangeFeedRequest, O: MuxRangeFeedEvent },
    { name: "GossipSubscription", serverStreaming: true, I: GossipSubscriptionRequest, O: GossipSubscriptionEvent },
    { name: "ResetQuorum", I: ResetQuorumRequest, O: ResetQuorumResponse },
    { name: "TokenBucket", I: TokenBucketRequest, O: TokenBucketResponse },
    { name: "Join", I: JoinNodeRequest, O: JoinNodeResponse },
    { name: "GetSpanConfigs", I: GetSpanConfigsRequest, O: GetSpanConfigsResponse },
    { name: "GetAllSystemSpanConfigsThatApply", I: GetAllSystemSpanConfigsThatApplyRequest, O: GetAllSystemSpanConfigsThatApplyResponse },
    { name: "UpdateSpanConfigs", I: UpdateSpanConfigsRequest, O: UpdateSpanConfigsResponse },
    { name: "SpanConfigConformance", I: SpanConfigConformanceRequest, O: SpanConfigConformanceResponse },
    { name: "TenantSettings", serverStreaming: true, I: TenantSettingsRequest, O: TenantSettingsEvent },
    { name: "GetRangeDescriptors", serverStreaming: true, I: GetRangeDescriptorsRequest, O: GetRangeDescriptorsResponse }
]);
