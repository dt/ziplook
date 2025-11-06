// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { RecordedSpan } from "../../util/tracing/tracingpb/recorded_span";
import { Version } from "../../roachpb/metadata";
import { EncodedError } from "../../errorspb/errors";
import { ClusterVersion } from "../../clusterversion/cluster_version";
import { SessionData } from "../../sql/sessiondatapb/session_data";
import { BulkOpSummary } from "../../kv/kvpb/api";
import { IOFileFormat } from "../../roachpb/io-formats";
import { DatabaseDescriptor_RegionConfig } from "../../sql/catalog/descpb/structured";
import { AutoStatsSettings } from "../../sql/catalog/catpb/catalog";
import { TenantInfoWithUsage } from "../../multitenant/mtinfopb/info";
import { FunctionDescriptor } from "../../sql/catalog/descpb/structured";
import { SchemaDescriptor } from "../../sql/catalog/descpb/structured";
import { TypeDescriptor } from "../../sql/catalog/descpb/structured";
import { TableDescriptor } from "../../sql/catalog/descpb/structured";
import { DatabaseDescriptor } from "../../sql/catalog/descpb/structured";
import { Locality } from "../../roachpb/metadata";
import { Descriptor } from "../../sql/catalog/descpb/structured";
import { ExternalCatalog } from "../../sql/catalog/externalcatalog/externalpb/external";
import { Timestamp as Timestamp$ } from "../../google/protobuf/timestamp";
import { Timestamp } from "../../util/hlc/timestamp";
import { TenantID } from "../../roachpb/data";
import { Span } from "../../roachpb/data";

export interface BackupEncryptionOptions {

    key: Uint8Array;

    mode: EncryptionMode;

    kmsInfo?: BackupEncryptionOptions_KMSInfo;

    rawPassphrase: string;

    rawKmsUris: string[];
}

export interface BackupEncryptionOptions_KMSInfo {

    uri: string;

    encryptedDataKey: Uint8Array;
}

export interface EncryptionInfo {

    scheme: EncryptionInfo_Scheme;

    salt: Uint8Array;

    encryptedDataKeyByKMSMasterKeyID: {
        [key: string]: Uint8Array;
    };
}

export enum EncryptionInfo_Scheme {

    AES256GCM = 0
}

export interface StreamIngestionDetails {

    sourceClusterConnUri: string;

    streamId: bigint;

    span?: Span;

    destinationTenantId?: TenantID;

    sourceTenantName: string;

    protectedTimestampRecordId: Uint8Array;

    replicationTtlSeconds: number;

    replicationStartTime?: Timestamp;

    sourceTenantId?: TenantID;

    sourceClusterId: Uint8Array;

    readTenantId?: TenantID;
}

export interface StreamIngestionCheckpoint {

    resolvedSpans: ResolvedSpan[];
}

export interface StreamIngestionProgress {

    cutoverTime?: Timestamp;

    replicatedTime?: Timestamp;

    replicationStatus: number;

    checkpoint?: StreamIngestionCheckpoint;

    partitionConnUris: string[];

    remainingCutoverSpans: Span[];

    initialSplitComplete: boolean;

    initialRevertRequired: boolean;

    initialRevertTo?: Timestamp;

    replicatedTimeAtCutover?: Timestamp;
}

export interface HistoryRetentionDetails {

    protectedTimestampRecordId: Uint8Array;

    expirationWindow: bigint;
}

export interface HistoryRetentionProgress {

    lastHeartbeatTime?: Timestamp$;
}

export interface LogicalReplicationDetails {

    sourceClusterConnUri: string;

    tableNames: string[];

    replicationPairs: LogicalReplicationDetails_ReplicationPair[];

    streamId: bigint;

    replicationStartTime?: Timestamp;

    sourceClusterId: Uint8Array;

    defaultConflictResolution?: LogicalReplicationDetails_DefaultConflictResolution;

    mode: LogicalReplicationDetails_ApplyMode;

    metricsLabel: string;

    discard: LogicalReplicationDetails_Discard;

    createTable: boolean;

    ingestedExternalCatalog?: ExternalCatalog;

    reverseStreamCommand: string;

    parentId: bigint;

    command: string;

    skipSchemaCheck: boolean;
}

export interface LogicalReplicationDetails_ReplicationPair {

    srcDescriptorId: number;

    dstDescriptorId: number;

    functionId: number;
}

export interface LogicalReplicationDetails_DefaultConflictResolution {

    conflictResolutionType: LogicalReplicationDetails_DefaultConflictResolution_DefaultConflictResolution;

    functionId: number;
}

export enum LogicalReplicationDetails_DefaultConflictResolution_DefaultConflictResolution {

    LWW = 0,

    DLQ = 1,

    UDF = 2
}

export enum LogicalReplicationDetails_ApplyMode {

    Immediate = 0,

    Validated = 1
}

export enum LogicalReplicationDetails_Discard {

    DiscardNothing = 0,

    DiscardCDCIgnoredTTLDeletes = 1,

    DiscardAllDeletes = 2
}

export interface LogicalReplicationProgress {

    replicatedTime?: Timestamp;

    checkpoint?: StreamIngestionCheckpoint;

    partitionConnUris: string[];

    publishedNewTables: boolean;

    startedReverseStream: boolean;
}

export interface StreamReplicationDetails {

    spans: Span[];

    protectedTimestampRecordId: Uint8Array;

    tenantId?: TenantID;

    expirationWindow: bigint;

    tableIds: number[];
}

export interface StreamReplicationProgress {

    expiration?: Timestamp$;

    streamIngestionStatus: StreamReplicationProgress_StreamIngestionStatus;
}

export enum StreamReplicationProgress_StreamIngestionStatus {

    NOT_FINISHED = 0,

    FINISHED_SUCCESSFULLY = 1,

    FINISHED_UNSUCCESSFULLY = 2
}

export interface SchedulePTSChainingRecord {

    protectedTimestampRecord: Uint8Array;

    action: SchedulePTSChainingRecord_PTSAction;
}

export enum SchedulePTSChainingRecord_PTSAction {

    UPDATE = 0,

    RELEASE = 1
}

export interface BackupDetails {

    startTime?: Timestamp;

    endTime?: Timestamp;

    uri: string;

    destination?: BackupDetails_Destination;

    urisByLocalityKv: {
        [key: string]: string;
    };

    deprecatedBackupManifest: Uint8Array;

    encryptionOptions?: BackupEncryptionOptions;

    encryptionInfo?: EncryptionInfo;

    protectedTimestampRecord: Uint8Array;

    collectionURI: string;

    scheduleId: bigint;

    schedulePtsChainingRecord?: SchedulePTSChainingRecord;

    revisionHistory: boolean;

    fullCluster: boolean;

    specificTenantIds: TenantID[];

    resolvedTargets: Descriptor[];

    resolvedCompleteDbs: number[];

    requestedTargets: Descriptor[];

    detached: boolean;

    asOfInterval: bigint;

    applicationName: string;

    executionLocality?: Locality;

    includeAllSecondaryTenants: boolean;

    updatesClusterMonitoringMetrics: boolean;

    compact: boolean;
}

export interface BackupDetails_Destination {

    to: string[];

    subdir: string;

    incrementalStorage: string[];

    exists: boolean;
}

export interface BackupProgress {
}

export interface DescriptorRewrite {

    id: number;

    parentId: number;

    parentSchemaId: number;

    toExisting: boolean;

    newDbName: string;
}

export interface RestoreDetails {

    endTime?: Timestamp;

    descriptorRewrites: {
        [key: number]: DescriptorRewrite;
    };

    uris: string[];

    backupLocalityInfo: RestoreDetails_BackupLocalityInfo[];

    databaseDescs: DatabaseDescriptor[];

    tableDescs: TableDescriptor[];

    typeDescs: TypeDescriptor[];

    schemaDescs: SchemaDescriptor[];

    functionDescs: FunctionDescriptor[];

    tenants: TenantInfoWithUsage[];

    overrideDb: string;

    prepareCompleted: boolean;

    statsInserted: boolean;

    systemTablesMigrated: {
        [key: string]: boolean;
    };

    descriptorsPublished: boolean;

    descriptorCoverage: number;

    encryption?: BackupEncryptionOptions;

    databaseModifiers: {
        [key: number]: RestoreDetails_DatabaseModifier;
    };

    restoreSystemUsers: boolean;

    preRewriteTenantId?: TenantID;

    schemaOnly: boolean;

    verifyData: boolean;

    protectedTimestampRecord: Uint8Array;

    skipLocalitiesCheck: boolean;

    executionLocality?: Locality;

    experimentalOnline: boolean;

    downloadSpans: Span[];

    removeRegions: boolean;

    unsafeRestoreIncompatibleVersion: boolean;

    postDownloadTableAutoStatsSettings: {
        [key: number]: AutoStatsSettings;
    };

    downloadJob: boolean;

    experimentalCopy: boolean;
}

export interface RestoreDetails_BackupLocalityInfo {

    urisByOriginalLocalityKv: {
        [key: string]: string;
    };
}

export interface RestoreDetails_DatabaseModifier {

    extraTypeDescs: TypeDescriptor[];

    regionConfig?: DatabaseDescriptor_RegionConfig;
}

export interface RestoreProgress {

    highWater: Uint8Array;

    checkpoint: RestoreProgress_FrontierEntry[];

    totalDownloadRequired: bigint;
}

export interface RestoreProgress_FrontierEntry {

    span?: Span;

    timestamp?: Timestamp;
}

export interface ImportDetails {

    tables: ImportDetails_Table[];

    types: ImportDetails_Type[];

    uris: string[];

    format?: IOFileFormat;

    walltime: bigint;

    parentId: number;

    prepareComplete: boolean;

    tablesPublished: boolean;

    databasePrimaryRegion: string;
}

export interface ImportDetails_Table {

    desc?: TableDescriptor;

    name: string;

    seqVal: bigint;

    wasEmpty: boolean;

    targetCols: string[];
}

export interface ImportDetails_Type {

    desc?: TypeDescriptor;
}

export interface SequenceValChunk {

    chunkStartVal: bigint;

    chunkSize: bigint;

    chunkStartRow: bigint;

    nextChunkStartRow: bigint;
}

export interface SequenceDetails {

    seqIdToChunks: {
        [key: number]: SequenceDetails_SequenceChunks;
    };
}

export interface SequenceDetails_SequenceChunks {

    chunks: SequenceValChunk[];
}

export interface ImportProgress {

    samplingProgress: number[];

    readProgress: number[];

    writeProgress: number[];

    spanProgress: Span[];

    resumePos: bigint[];

    sequenceDetails: SequenceDetails[];

    summary?: BulkOpSummary;
}

export interface TypeSchemaChangeDetails {

    typeId: number;

    transitioningMembers: Uint8Array[];
}

export interface TypeSchemaChangeProgress {
}

export interface NewSchemaChangeDetails {

    backfillProgress: BackfillProgress[];

    mergeProgress: MergeProgress[];

    protectedTimestampRecord: Uint8Array;
}

export interface BackfillProgress {

    id: number;

    sourceIndexId: number;

    destIndexIds: number[];

    writeTimestamp?: Timestamp;

    completedSpans: Span[];
}

export interface MergeProgress {

    id: number;

    mergePairs: MergeProgress_MergePair[];
}

export interface MergeProgress_MergePair {

    sourceIndexId: number;

    destIndexId: number;

    completedSpans: Span[];
}

export interface NewSchemaChangeProgress {
}

export interface AutoSpanConfigReconciliationDetails {
}

export interface AutoSpanConfigReconciliationProgress {

    checkpoint?: Timestamp;
}

export interface KeyVisualizerDetails {
}

export interface KeyVisualizerProgress {
}

export interface ResumeSpanList {

    resumeSpans: Span[];
}

export interface DroppedTableDetails {

    name: string;

    iD: number;

    status: Status;
}

export interface SchemaChangeGCDetails {

    indexes: SchemaChangeGCDetails_DroppedIndex[];

    tables: SchemaChangeGCDetails_DroppedID[];

    parentId: bigint;

    tenant?: SchemaChangeGCDetails_DroppedTenant;
}

export interface SchemaChangeGCDetails_DroppedIndex {

    indexId: bigint;

    dropTime: bigint;
}

export interface SchemaChangeGCDetails_DroppedID {

    id: bigint;

    dropTime: bigint;
}

export interface SchemaChangeGCDetails_DroppedTenant {

    id: bigint;

    dropTime: bigint;
}

export interface SchemaChangeDetails {

    resumeSpanList: ResumeSpanList[];

    droppedTables: DroppedTableDetails[];

    droppedTypes: number[];

    droppedSchemas: number[];

    droppedDatabaseId: number;

    droppedFunctions: number[];

    descId: number;

    tableMutationId: number;

    formatVersion: number;

    writeTimestamp?: Timestamp;

    protectedTimestampRecord: Uint8Array;

    sessionData?: SessionData;
}

export interface SchemaChangeProgress {
}

export interface SchemaChangeGCProgress {

    indexes: SchemaChangeGCProgress_IndexProgress[];

    tables: SchemaChangeGCProgress_TableProgress[];

    tenant?: SchemaChangeGCProgress_TenantProgress;

    rangesUnsplitDone: boolean;
}

export interface SchemaChangeGCProgress_IndexProgress {

    indexId: bigint;

    status: SchemaChangeGCProgress_Status;
}

export interface SchemaChangeGCProgress_TableProgress {

    id: bigint;

    status: SchemaChangeGCProgress_Status;
}

export interface SchemaChangeGCProgress_TenantProgress {

    status: SchemaChangeGCProgress_Status;
}

export enum SchemaChangeGCProgress_Status {

    WAITING_FOR_CLEAR = 0,

    CLEARING = 1,

    CLEARED = 2,

    WAITING_FOR_MVCC_GC = 3
}

export interface ChangefeedTargetTable {

    statementTimeName: string;
}

export interface ChangefeedTargetSpecification {

    type: ChangefeedTargetSpecification_TargetType;

    descriptorId: number;

    familyName: string;

    statementTimeName: string;
}

export enum ChangefeedTargetSpecification_TargetType {

    PRIMARY_FAMILY_ONLY = 0,

    EACH_FAMILY = 1,

    COLUMN_FAMILY = 2,

    DATABASE = 3
}

export interface ChangefeedDetails {

    tables: {
        [key: number]: ChangefeedTargetTable;
    };

    sinkUri: string;

    opts: {
        [key: string]: string;
    };

    statementTime?: Timestamp;

    endTime?: Timestamp;

    targetSpecifications: ChangefeedTargetSpecification[];

    select: string;

    sessionData?: SessionData;
}

export interface ResolvedSpan {

    span?: Span;

    timestamp?: Timestamp;

    boundaryType: ResolvedSpan_BoundaryType;
}

export enum ResolvedSpan_BoundaryType {

    NONE = 0,

    BACKFILL = 1,

    EXIT = 2,

    RESTART = 3
}

export interface ResolvedSpans {

    resolvedSpans: ResolvedSpan[];

    stats?: ResolvedSpans_Stats;
}

export interface ResolvedSpans_Stats {

    recentKvCount: bigint;
}

export interface TimestampSpansMap {

    entries: TimestampSpansMap_Entry[];
}

export interface TimestampSpansMap_Entry {

    timestamp?: Timestamp;

    spans: Span[];
}

export interface ChangefeedProgress {

    protectedTimestampRecord: Uint8Array;

    spanLevelCheckpoint?: TimestampSpansMap;
}

export interface CreateStatsDetails {

    name: string;

    table?: TableDescriptor;

    columnStats: CreateStatsDetails_ColStat[];

    statement: string;

    asOf?: Timestamp;

    maxFractionIdle: number;

    fqTableName: string;

    deleteOtherStats: boolean;

    usingExtremes: boolean;

    whereClause: string;

    whereSpans: Span[];

    whereIndexId: bigint;
}

export interface CreateStatsDetails_ColStat {

    columnIds: number[];

    hasHistogram: boolean;

    inverted: boolean;

    histogramMaxBuckets: number;
}

export interface CreateStatsProgress {
}

export interface MigrationDetails {

    clusterVersion?: ClusterVersion;
}

export interface MigrationProgress {

    watermark: Uint8Array;
}

export interface AutoSQLStatsCompactionDetails {
}

export interface AutoSQLStatsCompactionProgress {
}

export interface RowLevelTTLDetails {

    tableId: number;

    cutoff?: Timestamp$;

    tableVersion: bigint;
}

export interface RowLevelTTLProgress {

    jobDeletedRowCount: bigint;

    processorProgresses: RowLevelTTLProcessorProgress[];

    jobTotalSpanCount: bigint;

    jobProcessedSpanCount: bigint;
}

export interface RowLevelTTLProcessorProgress {

    processorId: number;

    sqlInstanceId: number;

    deletedRowCount: bigint;

    totalSpanCount: bigint;

    processedSpanCount: bigint;

    processorConcurrency: bigint;
}

export interface SchemaTelemetryDetails {
}

export interface SchemaTelemetryProgress {
}

export interface PollJobsStatsDetails {
}

export interface PollJobsStatsProgress {
}

export interface AutoConfigRunnerDetails {
}

export interface AutoConfigRunnerProgress {
}

export interface AutoConfigEnvRunnerDetails {
}

export interface AutoConfigEnvRunnerProgress {
}

export interface AutoConfigTaskDetails {
}

export interface AutoConfigTaskProgress {
}

export interface AutoUpdateSQLActivityDetails {
}

export interface AutoUpdateSQLActivityProgress {
}

export interface MVCCStatisticsJobDetails {
}

export interface MVCCStatisticsJobProgress {
}

export interface StandbyReadTSPollerDetails {
}

export interface StandbyReadTSPollerProgress {
}

export interface HotRangesLoggerDetails {
}

export interface InspectDetails {

    checks: InspectDetails_Check[];

    asOf?: Timestamp;
}

export interface InspectDetails_Check {

    type: InspectDetails_Check_InspectCheckType;

    tableId: number;

    indexId: number;
}

export enum InspectDetails_Check_InspectCheckType {

    INSPECT_CHECK_UNSPECIFIED = 0,

    INSPECT_CHECK_INDEX_CONSISTENCY = 1
}

export interface UpdateTableMetadataCacheDetails {
}

export interface UpdateTableMetadataCacheProgress {

    lastStartTime?: Timestamp$;

    lastCompletedTime?: Timestamp$;

    status: UpdateTableMetadataCacheProgress_Status;
}

export enum UpdateTableMetadataCacheProgress_Status {

    NOT_RUNNING = 0,

    RUNNING = 1
}

export interface ImportRollbackDetails {

    tableId: number;
}

export interface SqlActivityFlushDetails {
}

export interface SqlActivityFlushProgress {
}

export interface HotRangesLoggerProgress {
}

export interface InspectProgress {
}

export interface ImportRollbackProgress {
}

export interface Payload {

    description: string;

    statement: string[];

    usernameProto: string;

    startedMicros: bigint;

    finishedMicros: bigint;

    descriptorIds: number[];

    error: string;

    resumeErrors: EncodedError[];

    cleanupErrors: EncodedError[];

    finalResumeError?: EncodedError;

    noncancelable: boolean;

    details: {
        oneofKind: "backup";

        backup: BackupDetails;
    } | {
        oneofKind: "restore";

        restore: RestoreDetails;
    } | {
        oneofKind: "schemaChange";

        schemaChange: SchemaChangeDetails;
    } | {
        oneofKind: "import";

        import: ImportDetails;
    } | {
        oneofKind: "changefeed";

        changefeed: ChangefeedDetails;
    } | {
        oneofKind: "createStats";

        createStats: CreateStatsDetails;
    } | {
        oneofKind: "schemaChangeGC";

        schemaChangeGC: SchemaChangeGCDetails;
    } | {
        oneofKind: "typeSchemaChange";

        typeSchemaChange: TypeSchemaChangeDetails;
    } | {
        oneofKind: "streamIngestion";

        streamIngestion: StreamIngestionDetails;
    } | {
        oneofKind: "newSchemaChange";

        newSchemaChange: NewSchemaChangeDetails;
    } | {
        oneofKind: "migration";

        migration: MigrationDetails;
    } | {
        oneofKind: "autoSpanConfigReconciliation";

        autoSpanConfigReconciliation: AutoSpanConfigReconciliationDetails;
    } | {
        oneofKind: "autoSQLStatsCompaction";

        autoSQLStatsCompaction: AutoSQLStatsCompactionDetails;
    } | {
        oneofKind: "streamReplication";

        streamReplication: StreamReplicationDetails;
    } | {
        oneofKind: "rowLevelTtl";

        rowLevelTtl: RowLevelTTLDetails;
    } | {
        oneofKind: "schemaTelemetry";

        schemaTelemetry: SchemaTelemetryDetails;
    } | {
        oneofKind: "keyVisualizerDetails";

        keyVisualizerDetails: KeyVisualizerDetails;
    } | {
        oneofKind: "pollJobsStats";

        pollJobsStats: PollJobsStatsDetails;
    } | {
        oneofKind: "autoConfigRunner";

        autoConfigRunner: AutoConfigRunnerDetails;
    } | {
        oneofKind: "autoConfigEnvRunner";

        autoConfigEnvRunner: AutoConfigEnvRunnerDetails;
    } | {
        oneofKind: "autoConfigTask";

        autoConfigTask: AutoConfigTaskDetails;
    } | {
        oneofKind: "autoUpdateSqlActivities";

        autoUpdateSqlActivities: AutoUpdateSQLActivityDetails;
    } | {
        oneofKind: "mvccStatisticsDetails";

        mvccStatisticsDetails: MVCCStatisticsJobDetails;
    } | {
        oneofKind: "importRollbackDetails";

        importRollbackDetails: ImportRollbackDetails;
    } | {
        oneofKind: "historyRetentionDetails";

        historyRetentionDetails: HistoryRetentionDetails;
    } | {
        oneofKind: "logicalReplicationDetails";

        logicalReplicationDetails: LogicalReplicationDetails;
    } | {
        oneofKind: "updateTableMetadataCacheDetails";

        updateTableMetadataCacheDetails: UpdateTableMetadataCacheDetails;
    } | {
        oneofKind: "standbyReadTsPollerDetails";

        standbyReadTsPollerDetails: StandbyReadTSPollerDetails;
    } | {
        oneofKind: "sqlActivityFlushDetails";

        sqlActivityFlushDetails: SqlActivityFlushDetails;
    } | {
        oneofKind: "hotRangesLoggerDetails";

        hotRangesLoggerDetails: HotRangesLoggerDetails;
    } | {
        oneofKind: "inspectDetails";

        inspectDetails: InspectDetails;
    } | {
        oneofKind: undefined;
    };

    pauseReason: string;

    creationClusterId: Uint8Array;

    creationClusterVersion?: Version;

    maximumPtsAge: bigint;
}

export interface Progress {

    progress: {
        oneofKind: "fractionCompleted";

        fractionCompleted: number;
    } | {
        oneofKind: "highWater";

        highWater: Timestamp;
    } | {
        oneofKind: undefined;
    };

    modifiedMicros: bigint;

    statusMessage: string;

    details: {
        oneofKind: "backup";

        backup: BackupProgress;
    } | {
        oneofKind: "restore";

        restore: RestoreProgress;
    } | {
        oneofKind: "schemaChange";

        schemaChange: SchemaChangeProgress;
    } | {
        oneofKind: "import";

        import: ImportProgress;
    } | {
        oneofKind: "changefeed";

        changefeed: ChangefeedProgress;
    } | {
        oneofKind: "createStats";

        createStats: CreateStatsProgress;
    } | {
        oneofKind: "schemaChangeGC";

        schemaChangeGC: SchemaChangeGCProgress;
    } | {
        oneofKind: "typeSchemaChange";

        typeSchemaChange: TypeSchemaChangeProgress;
    } | {
        oneofKind: "streamIngest";

        streamIngest: StreamIngestionProgress;
    } | {
        oneofKind: "newSchemaChange";

        newSchemaChange: NewSchemaChangeProgress;
    } | {
        oneofKind: "migration";

        migration: MigrationProgress;
    } | {
        oneofKind: "autoSpanConfigReconciliation";

        autoSpanConfigReconciliation: AutoSpanConfigReconciliationProgress;
    } | {
        oneofKind: "autoSQLStatsCompaction";

        autoSQLStatsCompaction: AutoSQLStatsCompactionProgress;
    } | {
        oneofKind: "streamReplication";

        streamReplication: StreamReplicationProgress;
    } | {
        oneofKind: "rowLevelTtl";

        rowLevelTtl: RowLevelTTLProgress;
    } | {
        oneofKind: "schemaTelemetry";

        schemaTelemetry: SchemaTelemetryProgress;
    } | {
        oneofKind: "keyVisualizerProgress";

        keyVisualizerProgress: KeyVisualizerProgress;
    } | {
        oneofKind: "pollJobsStats";

        pollJobsStats: PollJobsStatsProgress;
    } | {
        oneofKind: "autoConfigRunner";

        autoConfigRunner: AutoConfigRunnerProgress;
    } | {
        oneofKind: "autoConfigEnvRunner";

        autoConfigEnvRunner: AutoConfigEnvRunnerProgress;
    } | {
        oneofKind: "autoConfigTask";

        autoConfigTask: AutoConfigTaskProgress;
    } | {
        oneofKind: "updateSqlActivity";

        updateSqlActivity: AutoUpdateSQLActivityProgress;
    } | {
        oneofKind: "mvccStatisticsProgress";

        mvccStatisticsProgress: MVCCStatisticsJobProgress;
    } | {
        oneofKind: "importRollbackProgress";

        importRollbackProgress: ImportRollbackProgress;
    } | {
        oneofKind: "historyRetentionProgress";

        historyRetentionProgress: HistoryRetentionProgress;
    } | {
        oneofKind: "logicalReplication";

        logicalReplication: LogicalReplicationProgress;
    } | {
        oneofKind: "tableMetadataCache";

        tableMetadataCache: UpdateTableMetadataCacheProgress;
    } | {
        oneofKind: "standbyReadTsPoller";

        standbyReadTsPoller: StandbyReadTSPollerProgress;
    } | {
        oneofKind: "sqlActivityFlush";

        sqlActivityFlush: SqlActivityFlushProgress;
    } | {
        oneofKind: "hotRangesLogger";

        hotRangesLogger: HotRangesLoggerProgress;
    } | {
        oneofKind: "inspect";

        inspect: InspectProgress;
    } | {
        oneofKind: undefined;
    };

    traceId: bigint;
}

export interface Job {

    id: bigint;

    progress?: Progress;

    payload?: Payload;
}

export interface RetriableExecutionFailure {

    status: string;

    executionStartMicros: bigint;

    executionEndMicros: bigint;

    instanceId: number;

    error?: EncodedError;

    truncatedError: string;
}

export interface TraceData {

    collectedSpans: RecordedSpan[];
}

export enum EncryptionMode {

    Passphrase = 0,

    KMS = 1,

    None = 2
}

export enum Status {

    DRAINING_NAMES = 0,

    WAIT_FOR_GC_INTERVAL = 1,

    ROCKSDB_COMPACTION = 2,

    DONE = 10
}

export enum Type {

    UNSPECIFIED = 0,

    BACKUP = 1,

    RESTORE = 2,

    SCHEMA_CHANGE = 3,

    IMPORT = 4,

    CHANGEFEED = 5,

    CREATE_STATS = 6,

    AUTO_CREATE_STATS = 7,

    SCHEMA_CHANGE_GC = 8,

    TYPEDESC_SCHEMA_CHANGE = 9,

    REPLICATION_STREAM_INGESTION = 10,

    NEW_SCHEMA_CHANGE = 11,

    MIGRATION = 12,

    AUTO_SPAN_CONFIG_RECONCILIATION = 13,

    AUTO_SQL_STATS_COMPACTION = 14,

    REPLICATION_STREAM_PRODUCER = 15,

    ROW_LEVEL_TTL = 16,

    AUTO_SCHEMA_TELEMETRY = 17,

    KEY_VISUALIZER = 18,

    POLL_JOBS_STATS = 19,

    AUTO_CONFIG_RUNNER = 20,

    AUTO_CONFIG_ENV_RUNNER = 21,

    AUTO_CONFIG_TASK = 22,

    AUTO_UPDATE_SQL_ACTIVITY = 23,

    MVCC_STATISTICS_UPDATE = 24,

    IMPORT_ROLLBACK = 25,

    HISTORY_RETENTION = 26,

    LOGICAL_REPLICATION = 27,

    AUTO_CREATE_PARTIAL_STATS = 28,

    UPDATE_TABLE_METADATA_CACHE = 29,

    STANDBY_READ_TS_POLLER = 30,

    SQL_ACTIVITY_FLUSH = 31,

    HOT_RANGES_LOGGER = 32,

    INSPECT = 33
}

class BackupEncryptionOptions$Type extends MessageType<BackupEncryptionOptions> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.BackupEncryptionOptions", [
            { no: 1, name: "key", kind: "scalar", T: 12  },
            { no: 2, name: "mode", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.EncryptionMode", EncryptionMode] },
            { no: 3, name: "kms_info", kind: "message", T: () => BackupEncryptionOptions_KMSInfo },
            { no: 4, name: "raw_passphrase", kind: "scalar", T: 9  },
            { no: 5, name: "raw_kms_uris", kind: "scalar", repeat: 2 , T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<BackupEncryptionOptions>): BackupEncryptionOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.mode = 0;
        message.rawPassphrase = "";
        message.rawKmsUris = [];
        if (value !== undefined)
            reflectionMergePartial<BackupEncryptionOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BackupEncryptionOptions): BackupEncryptionOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.mode = reader.int32();
                    break;
                case  3:
                    message.kmsInfo = BackupEncryptionOptions_KMSInfo.internalBinaryRead(reader, reader.uint32(), options, message.kmsInfo);
                    break;
                case  4:
                    message.rawPassphrase = reader.string();
                    break;
                case  5:
                    message.rawKmsUris.push(reader.string());
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

export const BackupEncryptionOptions = /*#__PURE__*/ new BackupEncryptionOptions$Type();

class BackupEncryptionOptions_KMSInfo$Type extends MessageType<BackupEncryptionOptions_KMSInfo> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.BackupEncryptionOptions.KMSInfo", [
            { no: 1, name: "uri", kind: "scalar", T: 9  },
            { no: 2, name: "encrypted_data_key", kind: "scalar", T: 12  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<BackupEncryptionOptions_KMSInfo>): BackupEncryptionOptions_KMSInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uri = "";
        message.encryptedDataKey = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<BackupEncryptionOptions_KMSInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BackupEncryptionOptions_KMSInfo): BackupEncryptionOptions_KMSInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.uri = reader.string();
                    break;
                case  2:
                    message.encryptedDataKey = reader.bytes();
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

export const BackupEncryptionOptions_KMSInfo = /*#__PURE__*/ new BackupEncryptionOptions_KMSInfo$Type();

class EncryptionInfo$Type extends MessageType<EncryptionInfo> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.EncryptionInfo", [
            { no: 1, name: "scheme", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.EncryptionInfo.Scheme", EncryptionInfo_Scheme] },
            { no: 2, name: "salt", kind: "scalar", T: 12  },
            { no: 3, name: "encryptedDataKeyByKMSMasterKeyID", kind: "map", K: 9 , V: { kind: "scalar", T: 12  } }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<EncryptionInfo>): EncryptionInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.scheme = 0;
        message.salt = new Uint8Array(0);
        message.encryptedDataKeyByKMSMasterKeyID = {};
        if (value !== undefined)
            reflectionMergePartial<EncryptionInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EncryptionInfo): EncryptionInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.scheme = reader.int32();
                    break;
                case  2:
                    message.salt = reader.bytes();
                    break;
                case  3:
                    this.binaryReadMap3(message.encryptedDataKeyByKMSMasterKeyID, reader, options);
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
    private binaryReadMap3(map: EncryptionInfo["encryptedDataKeyByKMSMasterKeyID"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof EncryptionInfo["encryptedDataKeyByKMSMasterKeyID"] | undefined, val: EncryptionInfo["encryptedDataKeyByKMSMasterKeyID"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    // Read as bytes first, then try to decode as UTF-8 with replacement chars
                    const keyBytes = reader.bytes();
                    const decoder = new TextDecoder('utf-8', { fatal: false });
                    key = decoder.decode(keyBytes);
                    break;
                case 2:
                    val = reader.bytes();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.EncryptionInfo.encryptedDataKeyByKMSMasterKeyID");
            }
        }
        map[key ?? ""] = val ?? new Uint8Array(0);
    }

}

export const EncryptionInfo = /*#__PURE__*/ new EncryptionInfo$Type();

class StreamIngestionDetails$Type extends MessageType<StreamIngestionDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.StreamIngestionDetails", [
            { no: 1, name: "source_cluster_conn_uri", kind: "scalar", T: 9  },
            { no: 4, name: "stream_id", kind: "scalar", T: 4 , L: 0  },
            { no: 2, name: "span", kind: "message", T: () => Span },
            { no: 7, name: "destination_tenant_id", kind: "message", T: () => TenantID },
            { no: 8, name: "source_tenant_name", kind: "scalar", T: 9  },
            { no: 10, name: "protected_timestamp_record_id", kind: "scalar", T: 12  },
            { no: 11, name: "replication_ttl_seconds", kind: "scalar", T: 5  },
            { no: 12, name: "replication_start_time", kind: "message", T: () => Timestamp },
            { no: 13, name: "source_tenant_id", kind: "message", T: () => TenantID },
            { no: 14, name: "source_cluster_id", kind: "scalar", T: 12  },
            { no: 15, name: "read_tenant_id", kind: "message", T: () => TenantID }
        ]);
    }
    create(value?: PartialMessage<StreamIngestionDetails>): StreamIngestionDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.sourceClusterConnUri = "";
        message.streamId = 0n;
        message.sourceTenantName = "";
        message.protectedTimestampRecordId = new Uint8Array(0);
        message.replicationTtlSeconds = 0;
        message.sourceClusterId = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<StreamIngestionDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StreamIngestionDetails): StreamIngestionDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.sourceClusterConnUri = reader.string();
                    break;
                case  4:
                    message.streamId = reader.uint64().toBigInt();
                    break;
                case  2:
                    message.span = Span.internalBinaryRead(reader, reader.uint32(), options, message.span);
                    break;
                case  7:
                    message.destinationTenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.destinationTenantId);
                    break;
                case  8:
                    message.sourceTenantName = reader.string();
                    break;
                case  10:
                    message.protectedTimestampRecordId = reader.bytes();
                    break;
                case  11:
                    message.replicationTtlSeconds = reader.int32();
                    break;
                case  12:
                    message.replicationStartTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.replicationStartTime);
                    break;
                case  13:
                    message.sourceTenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.sourceTenantId);
                    break;
                case  14:
                    message.sourceClusterId = reader.bytes();
                    break;
                case  15:
                    message.readTenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.readTenantId);
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

export const StreamIngestionDetails = /*#__PURE__*/ new StreamIngestionDetails$Type();

class StreamIngestionCheckpoint$Type extends MessageType<StreamIngestionCheckpoint> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.StreamIngestionCheckpoint", [
            { no: 1, name: "resolved_spans", kind: "message", repeat: 2 , T: () => ResolvedSpan }
        ]);
    }
    create(value?: PartialMessage<StreamIngestionCheckpoint>): StreamIngestionCheckpoint {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.resolvedSpans = [];
        if (value !== undefined)
            reflectionMergePartial<StreamIngestionCheckpoint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StreamIngestionCheckpoint): StreamIngestionCheckpoint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.resolvedSpans.push(ResolvedSpan.internalBinaryRead(reader, reader.uint32(), options));
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

export const StreamIngestionCheckpoint = /*#__PURE__*/ new StreamIngestionCheckpoint$Type();

class StreamIngestionProgress$Type extends MessageType<StreamIngestionProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.StreamIngestionProgress", [
            { no: 1, name: "cutover_time", kind: "message", T: () => Timestamp },
            { no: 7, name: "replicated_time", kind: "message", T: () => Timestamp },
            { no: 6, name: "replication_status", kind: "scalar", T: 13  },
            { no: 4, name: "checkpoint", kind: "message", T: () => StreamIngestionCheckpoint },
            { no: 5, name: "partition_conn_uris", kind: "scalar", repeat: 2 , T: 9  },
            { no: 8, name: "remaining_cutover_spans", kind: "message", repeat: 2 , T: () => Span },
            { no: 9, name: "initial_split_complete", kind: "scalar", T: 8  },
            { no: 10, name: "initial_revert_required", kind: "scalar", T: 8  },
            { no: 11, name: "initial_revert_to", kind: "message", T: () => Timestamp },
            { no: 12, name: "replicated_time_at_cutover", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<StreamIngestionProgress>): StreamIngestionProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.replicationStatus = 0;
        message.partitionConnUris = [];
        message.remainingCutoverSpans = [];
        message.initialSplitComplete = false;
        message.initialRevertRequired = false;
        if (value !== undefined)
            reflectionMergePartial<StreamIngestionProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StreamIngestionProgress): StreamIngestionProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.cutoverTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.cutoverTime);
                    break;
                case  7:
                    message.replicatedTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.replicatedTime);
                    break;
                case  6:
                    message.replicationStatus = reader.uint32();
                    break;
                case  4:
                    message.checkpoint = StreamIngestionCheckpoint.internalBinaryRead(reader, reader.uint32(), options, message.checkpoint);
                    break;
                case  5:
                    message.partitionConnUris.push(reader.string());
                    break;
                case  8:
                    message.remainingCutoverSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  9:
                    message.initialSplitComplete = reader.bool();
                    break;
                case  10:
                    message.initialRevertRequired = reader.bool();
                    break;
                case  11:
                    message.initialRevertTo = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.initialRevertTo);
                    break;
                case  12:
                    message.replicatedTimeAtCutover = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.replicatedTimeAtCutover);
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

export const StreamIngestionProgress = /*#__PURE__*/ new StreamIngestionProgress$Type();

class HistoryRetentionDetails$Type extends MessageType<HistoryRetentionDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.HistoryRetentionDetails", [
            { no: 1, name: "protected_timestamp_record_id", kind: "scalar", T: 12  },
            { no: 4, name: "expiration_window", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<HistoryRetentionDetails>): HistoryRetentionDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.protectedTimestampRecordId = new Uint8Array(0);
        message.expirationWindow = 0n;
        if (value !== undefined)
            reflectionMergePartial<HistoryRetentionDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: HistoryRetentionDetails): HistoryRetentionDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.protectedTimestampRecordId = reader.bytes();
                    break;
                case  4:
                    message.expirationWindow = reader.int64().toBigInt();
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

export const HistoryRetentionDetails = /*#__PURE__*/ new HistoryRetentionDetails$Type();

class HistoryRetentionProgress$Type extends MessageType<HistoryRetentionProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.HistoryRetentionProgress", [
            { no: 1, name: "last_heartbeat_time", kind: "message", T: () => Timestamp$ }
        ]);
    }
    create(value?: PartialMessage<HistoryRetentionProgress>): HistoryRetentionProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<HistoryRetentionProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: HistoryRetentionProgress): HistoryRetentionProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.lastHeartbeatTime = Timestamp$.internalBinaryRead(reader, reader.uint32(), options, message.lastHeartbeatTime);
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

export const HistoryRetentionProgress = /*#__PURE__*/ new HistoryRetentionProgress$Type();

class LogicalReplicationDetails$Type extends MessageType<LogicalReplicationDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.LogicalReplicationDetails", [
            { no: 1, name: "source_cluster_conn_uri", kind: "scalar", T: 9  },
            { no: 2, name: "table_names", kind: "scalar", repeat: 2 , T: 9  },
            { no: 3, name: "replication_pairs", kind: "message", repeat: 2 , T: () => LogicalReplicationDetails_ReplicationPair },
            { no: 4, name: "stream_id", kind: "scalar", T: 4 , L: 0  },
            { no: 5, name: "replication_start_time", kind: "message", T: () => Timestamp },
            { no: 6, name: "source_cluster_id", kind: "scalar", T: 12  },
            { no: 7, name: "default_conflict_resolution", kind: "message", T: () => LogicalReplicationDetails_DefaultConflictResolution },
            { no: 9, name: "mode", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.LogicalReplicationDetails.ApplyMode", LogicalReplicationDetails_ApplyMode] },
            { no: 10, name: "metrics_label", kind: "scalar", T: 9  },
            { no: 11, name: "discard", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.LogicalReplicationDetails.Discard", LogicalReplicationDetails_Discard] },
            { no: 12, name: "create_table", kind: "scalar", T: 8  },
            { no: 13, name: "ingested_external_catalog", kind: "message", T: () => ExternalCatalog },
            { no: 14, name: "reverse_stream_command", kind: "scalar", T: 9  },
            { no: 15, name: "parent_id", kind: "scalar", T: 3 , L: 0  },
            { no: 16, name: "command", kind: "scalar", T: 9  },
            { no: 17, name: "skip_schema_check", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<LogicalReplicationDetails>): LogicalReplicationDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.sourceClusterConnUri = "";
        message.tableNames = [];
        message.replicationPairs = [];
        message.streamId = 0n;
        message.sourceClusterId = new Uint8Array(0);
        message.mode = 0;
        message.metricsLabel = "";
        message.discard = 0;
        message.createTable = false;
        message.reverseStreamCommand = "";
        message.parentId = 0n;
        message.command = "";
        message.skipSchemaCheck = false;
        if (value !== undefined)
            reflectionMergePartial<LogicalReplicationDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LogicalReplicationDetails): LogicalReplicationDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.sourceClusterConnUri = reader.string();
                    break;
                case  2:
                    message.tableNames.push(reader.string());
                    break;
                case  3:
                    message.replicationPairs.push(LogicalReplicationDetails_ReplicationPair.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.streamId = reader.uint64().toBigInt();
                    break;
                case  5:
                    message.replicationStartTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.replicationStartTime);
                    break;
                case  6:
                    message.sourceClusterId = reader.bytes();
                    break;
                case  7:
                    message.defaultConflictResolution = LogicalReplicationDetails_DefaultConflictResolution.internalBinaryRead(reader, reader.uint32(), options, message.defaultConflictResolution);
                    break;
                case  9:
                    message.mode = reader.int32();
                    break;
                case  10:
                    message.metricsLabel = reader.string();
                    break;
                case  11:
                    message.discard = reader.int32();
                    break;
                case  12:
                    message.createTable = reader.bool();
                    break;
                case  13:
                    message.ingestedExternalCatalog = ExternalCatalog.internalBinaryRead(reader, reader.uint32(), options, message.ingestedExternalCatalog);
                    break;
                case  14:
                    message.reverseStreamCommand = reader.string();
                    break;
                case  15:
                    message.parentId = reader.int64().toBigInt();
                    break;
                case  16:
                    message.command = reader.string();
                    break;
                case  17:
                    message.skipSchemaCheck = reader.bool();
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

export const LogicalReplicationDetails = /*#__PURE__*/ new LogicalReplicationDetails$Type();

class LogicalReplicationDetails_ReplicationPair$Type extends MessageType<LogicalReplicationDetails_ReplicationPair> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.LogicalReplicationDetails.ReplicationPair", [
            { no: 1, name: "src_descriptor_id", kind: "scalar", T: 5  },
            { no: 2, name: "dst_descriptor_id", kind: "scalar", T: 5  },
            { no: 3, name: "function_id", kind: "scalar", T: 5  }
        ]);
    }
    create(value?: PartialMessage<LogicalReplicationDetails_ReplicationPair>): LogicalReplicationDetails_ReplicationPair {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.srcDescriptorId = 0;
        message.dstDescriptorId = 0;
        message.functionId = 0;
        if (value !== undefined)
            reflectionMergePartial<LogicalReplicationDetails_ReplicationPair>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LogicalReplicationDetails_ReplicationPair): LogicalReplicationDetails_ReplicationPair {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.srcDescriptorId = reader.int32();
                    break;
                case  2:
                    message.dstDescriptorId = reader.int32();
                    break;
                case  3:
                    message.functionId = reader.int32();
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

export const LogicalReplicationDetails_ReplicationPair = /*#__PURE__*/ new LogicalReplicationDetails_ReplicationPair$Type();

class LogicalReplicationDetails_DefaultConflictResolution$Type extends MessageType<LogicalReplicationDetails_DefaultConflictResolution> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.LogicalReplicationDetails.DefaultConflictResolution", [
            { no: 1, name: "conflict_resolution_type", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.LogicalReplicationDetails.DefaultConflictResolution.DefaultConflictResolution", LogicalReplicationDetails_DefaultConflictResolution_DefaultConflictResolution] },
            { no: 2, name: "function_id", kind: "scalar", T: 5  }
        ]);
    }
    create(value?: PartialMessage<LogicalReplicationDetails_DefaultConflictResolution>): LogicalReplicationDetails_DefaultConflictResolution {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.conflictResolutionType = 0;
        message.functionId = 0;
        if (value !== undefined)
            reflectionMergePartial<LogicalReplicationDetails_DefaultConflictResolution>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LogicalReplicationDetails_DefaultConflictResolution): LogicalReplicationDetails_DefaultConflictResolution {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.conflictResolutionType = reader.int32();
                    break;
                case  2:
                    message.functionId = reader.int32();
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

export const LogicalReplicationDetails_DefaultConflictResolution = /*#__PURE__*/ new LogicalReplicationDetails_DefaultConflictResolution$Type();

class LogicalReplicationProgress$Type extends MessageType<LogicalReplicationProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.LogicalReplicationProgress", [
            { no: 5, name: "replicated_time", kind: "message", T: () => Timestamp },
            { no: 6, name: "checkpoint", kind: "message", T: () => StreamIngestionCheckpoint },
            { no: 8, name: "partition_conn_uris", kind: "scalar", repeat: 2 , T: 9  },
            { no: 9, name: "published_new_tables", kind: "scalar", T: 8  },
            { no: 10, name: "started_reverse_stream", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<LogicalReplicationProgress>): LogicalReplicationProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.partitionConnUris = [];
        message.publishedNewTables = false;
        message.startedReverseStream = false;
        if (value !== undefined)
            reflectionMergePartial<LogicalReplicationProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LogicalReplicationProgress): LogicalReplicationProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  5:
                    message.replicatedTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.replicatedTime);
                    break;
                case  6:
                    message.checkpoint = StreamIngestionCheckpoint.internalBinaryRead(reader, reader.uint32(), options, message.checkpoint);
                    break;
                case  8:
                    message.partitionConnUris.push(reader.string());
                    break;
                case  9:
                    message.publishedNewTables = reader.bool();
                    break;
                case  10:
                    message.startedReverseStream = reader.bool();
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

export const LogicalReplicationProgress = /*#__PURE__*/ new LogicalReplicationProgress$Type();

class StreamReplicationDetails$Type extends MessageType<StreamReplicationDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.StreamReplicationDetails", [
            { no: 1, name: "spans", kind: "message", repeat: 2 , T: () => Span },
            { no: 2, name: "protected_timestamp_record_id", kind: "scalar", T: 12  },
            { no: 3, name: "tenant_id", kind: "message", T: () => TenantID },
            { no: 4, name: "expiration_window", kind: "scalar", T: 3 , L: 0  },
            { no: 5, name: "table_ids", kind: "scalar", repeat: 1 , T: 13  }
        ]);
    }
    create(value?: PartialMessage<StreamReplicationDetails>): StreamReplicationDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.spans = [];
        message.protectedTimestampRecordId = new Uint8Array(0);
        message.expirationWindow = 0n;
        message.tableIds = [];
        if (value !== undefined)
            reflectionMergePartial<StreamReplicationDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StreamReplicationDetails): StreamReplicationDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.spans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.protectedTimestampRecordId = reader.bytes();
                    break;
                case  3:
                    message.tenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.tenantId);
                    break;
                case  4:
                    message.expirationWindow = reader.int64().toBigInt();
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.tableIds.push(reader.uint32());
                    else
                        message.tableIds.push(reader.uint32());
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

export const StreamReplicationDetails = /*#__PURE__*/ new StreamReplicationDetails$Type();

class StreamReplicationProgress$Type extends MessageType<StreamReplicationProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.StreamReplicationProgress", [
            { no: 1, name: "expiration", kind: "message", T: () => Timestamp$ },
            { no: 2, name: "stream_ingestion_status", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.StreamReplicationProgress.StreamIngestionStatus", StreamReplicationProgress_StreamIngestionStatus] }
        ]);
    }
    create(value?: PartialMessage<StreamReplicationProgress>): StreamReplicationProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.streamIngestionStatus = 0;
        if (value !== undefined)
            reflectionMergePartial<StreamReplicationProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StreamReplicationProgress): StreamReplicationProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.expiration = Timestamp$.internalBinaryRead(reader, reader.uint32(), options, message.expiration);
                    break;
                case  2:
                    message.streamIngestionStatus = reader.int32();
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

export const StreamReplicationProgress = /*#__PURE__*/ new StreamReplicationProgress$Type();

class SchedulePTSChainingRecord$Type extends MessageType<SchedulePTSChainingRecord> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchedulePTSChainingRecord", [
            { no: 1, name: "protected_timestamp_record", kind: "scalar", T: 12  },
            { no: 2, name: "action", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.SchedulePTSChainingRecord.PTSAction", SchedulePTSChainingRecord_PTSAction] }
        ]);
    }
    create(value?: PartialMessage<SchedulePTSChainingRecord>): SchedulePTSChainingRecord {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.protectedTimestampRecord = new Uint8Array(0);
        message.action = 0;
        if (value !== undefined)
            reflectionMergePartial<SchedulePTSChainingRecord>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchedulePTSChainingRecord): SchedulePTSChainingRecord {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.protectedTimestampRecord = reader.bytes();
                    break;
                case  2:
                    message.action = reader.int32();
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

export const SchedulePTSChainingRecord = /*#__PURE__*/ new SchedulePTSChainingRecord$Type();

class BackupDetails$Type extends MessageType<BackupDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.BackupDetails", [
            { no: 1, name: "start_time", kind: "message", T: () => Timestamp },
            { no: 2, name: "end_time", kind: "message", T: () => Timestamp },
            { no: 3, name: "uri", kind: "scalar", T: 9  },
            { no: 11, name: "destination", kind: "message", T: () => BackupDetails_Destination },
            { no: 5, name: "uris_by_locality_kv", kind: "map", K: 9 , V: { kind: "scalar", T: 9  } },
            { no: 4, name: "deprecated_backup_manifest", kind: "scalar", T: 12  },
            { no: 6, name: "encryption_options", kind: "message", T: () => BackupEncryptionOptions },
            { no: 9, name: "encryption_info", kind: "message", T: () => EncryptionInfo },
            { no: 7, name: "protected_timestamp_record", kind: "scalar", T: 12  },
            { no: 8, name: "collection_URI", kind: "scalar", T: 9  },
            { no: 12, name: "schedule_id", kind: "scalar", T: 3 , L: 0  },
            { no: 10, name: "schedule_pts_chaining_record", kind: "message", T: () => SchedulePTSChainingRecord },
            { no: 13, name: "revision_history", kind: "scalar", T: 8  },
            { no: 15, name: "full_cluster", kind: "scalar", T: 8  },
            { no: 19, name: "specific_tenant_ids", kind: "message", repeat: 2 , T: () => TenantID },
            { no: 17, name: "resolved_targets", kind: "message", repeat: 2 , T: () => Descriptor },
            { no: 18, name: "resolved_complete_dbs", kind: "scalar", repeat: 1 , T: 13  },
            { no: 20, name: "requested_targets", kind: "message", repeat: 2 , T: () => Descriptor },
            { no: 21, name: "detached", kind: "scalar", T: 8  },
            { no: 22, name: "as_of_interval", kind: "scalar", T: 3 , L: 0  },
            { no: 23, name: "application_name", kind: "scalar", T: 9  },
            { no: 24, name: "execution_locality", kind: "message", T: () => Locality },
            { no: 25, name: "include_all_secondary_tenants", kind: "scalar", T: 8  },
            { no: 26, name: "updates_cluster_monitoring_metrics", kind: "scalar", T: 8  },
            { no: 27, name: "compact", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<BackupDetails>): BackupDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uri = "";
        message.urisByLocalityKv = {};
        message.deprecatedBackupManifest = new Uint8Array(0);
        message.protectedTimestampRecord = new Uint8Array(0);
        message.collectionURI = "";
        message.scheduleId = 0n;
        message.revisionHistory = false;
        message.fullCluster = false;
        message.specificTenantIds = [];
        message.resolvedTargets = [];
        message.resolvedCompleteDbs = [];
        message.requestedTargets = [];
        message.detached = false;
        message.asOfInterval = 0n;
        message.applicationName = "";
        message.includeAllSecondaryTenants = false;
        message.updatesClusterMonitoringMetrics = false;
        message.compact = false;
        if (value !== undefined)
            reflectionMergePartial<BackupDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BackupDetails): BackupDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.startTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.startTime);
                    break;
                case  2:
                    message.endTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.endTime);
                    break;
                case  3:
                    message.uri = reader.string();
                    break;
                case  11:
                    message.destination = BackupDetails_Destination.internalBinaryRead(reader, reader.uint32(), options, message.destination);
                    break;
                case  5:
                    this.binaryReadMap5(message.urisByLocalityKv, reader, options);
                    break;
                case  4:
                    message.deprecatedBackupManifest = reader.bytes();
                    break;
                case  6:
                    message.encryptionOptions = BackupEncryptionOptions.internalBinaryRead(reader, reader.uint32(), options, message.encryptionOptions);
                    break;
                case  9:
                    message.encryptionInfo = EncryptionInfo.internalBinaryRead(reader, reader.uint32(), options, message.encryptionInfo);
                    break;
                case  7:
                    message.protectedTimestampRecord = reader.bytes();
                    break;
                case  8:
                    message.collectionURI = reader.string();
                    break;
                case  12:
                    message.scheduleId = reader.int64().toBigInt();
                    break;
                case  10:
                    message.schedulePtsChainingRecord = SchedulePTSChainingRecord.internalBinaryRead(reader, reader.uint32(), options, message.schedulePtsChainingRecord);
                    break;
                case  13:
                    message.revisionHistory = reader.bool();
                    break;
                case  15:
                    message.fullCluster = reader.bool();
                    break;
                case  19:
                    message.specificTenantIds.push(TenantID.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  17:
                    message.resolvedTargets.push(Descriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  18:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.resolvedCompleteDbs.push(reader.uint32());
                    else
                        message.resolvedCompleteDbs.push(reader.uint32());
                    break;
                case  20:
                    message.requestedTargets.push(Descriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  21:
                    message.detached = reader.bool();
                    break;
                case  22:
                    message.asOfInterval = reader.int64().toBigInt();
                    break;
                case  23:
                    message.applicationName = reader.string();
                    break;
                case  24:
                    message.executionLocality = Locality.internalBinaryRead(reader, reader.uint32(), options, message.executionLocality);
                    break;
                case  25:
                    message.includeAllSecondaryTenants = reader.bool();
                    break;
                case  26:
                    message.updatesClusterMonitoringMetrics = reader.bool();
                    break;
                case  27:
                    message.compact = reader.bool();
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
    private binaryReadMap5(map: BackupDetails["urisByLocalityKv"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof BackupDetails["urisByLocalityKv"] | undefined, val: BackupDetails["urisByLocalityKv"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.BackupDetails.uris_by_locality_kv");
            }
        }
        map[key ?? ""] = val ?? "";
    }

}

export const BackupDetails = /*#__PURE__*/ new BackupDetails$Type();

class BackupDetails_Destination$Type extends MessageType<BackupDetails_Destination> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.BackupDetails.Destination", [
            { no: 1, name: "to", kind: "scalar", repeat: 2 , T: 9  },
            { no: 2, name: "subdir", kind: "scalar", T: 9  },
            { no: 3, name: "incremental_storage", kind: "scalar", repeat: 2 , T: 9  },
            { no: 4, name: "exists", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<BackupDetails_Destination>): BackupDetails_Destination {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.to = [];
        message.subdir = "";
        message.incrementalStorage = [];
        message.exists = false;
        if (value !== undefined)
            reflectionMergePartial<BackupDetails_Destination>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BackupDetails_Destination): BackupDetails_Destination {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.to.push(reader.string());
                    break;
                case  2:
                    message.subdir = reader.string();
                    break;
                case  3:
                    message.incrementalStorage.push(reader.string());
                    break;
                case  4:
                    message.exists = reader.bool();
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

export const BackupDetails_Destination = /*#__PURE__*/ new BackupDetails_Destination$Type();

class BackupProgress$Type extends MessageType<BackupProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.BackupProgress", []);
    }
    create(value?: PartialMessage<BackupProgress>): BackupProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<BackupProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BackupProgress): BackupProgress {
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

export const BackupProgress = /*#__PURE__*/ new BackupProgress$Type();

class DescriptorRewrite$Type extends MessageType<DescriptorRewrite> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.DescriptorRewrite", [
            { no: 1, name: "id", kind: "scalar", T: 13  },
            { no: 2, name: "parent_id", kind: "scalar", T: 13  },
            { no: 5, name: "parent_schema_id", kind: "scalar", T: 13  },
            { no: 3, name: "to_existing", kind: "scalar", T: 8  },
            { no: 4, name: "new_db_name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<DescriptorRewrite>): DescriptorRewrite {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0;
        message.parentId = 0;
        message.parentSchemaId = 0;
        message.toExisting = false;
        message.newDbName = "";
        if (value !== undefined)
            reflectionMergePartial<DescriptorRewrite>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DescriptorRewrite): DescriptorRewrite {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    message.parentId = reader.uint32();
                    break;
                case  5:
                    message.parentSchemaId = reader.uint32();
                    break;
                case  3:
                    message.toExisting = reader.bool();
                    break;
                case  4:
                    message.newDbName = reader.string();
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

export const DescriptorRewrite = /*#__PURE__*/ new DescriptorRewrite$Type();

class RestoreDetails$Type extends MessageType<RestoreDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.RestoreDetails", [
            { no: 4, name: "end_time", kind: "message", T: () => Timestamp },
            { no: 2, name: "descriptor_rewrites", kind: "map", K: 13 , V: { kind: "message", T: () => DescriptorRewrite } },
            { no: 3, name: "uris", kind: "scalar", repeat: 2 , T: 9  },
            { no: 7, name: "backup_locality_info", kind: "message", repeat: 2 , T: () => RestoreDetails_BackupLocalityInfo },
            { no: 16, name: "database_descs", kind: "message", repeat: 2 , T: () => DatabaseDescriptor },
            { no: 5, name: "table_descs", kind: "message", repeat: 2 , T: () => TableDescriptor },
            { no: 14, name: "type_descs", kind: "message", repeat: 2 , T: () => TypeDescriptor },
            { no: 15, name: "schema_descs", kind: "message", repeat: 2 , T: () => SchemaDescriptor },
            { no: 27, name: "function_descs", kind: "message", repeat: 2 , T: () => FunctionDescriptor },
            { no: 21, name: "tenants", kind: "message", repeat: 2 , T: () => TenantInfoWithUsage },
            { no: 6, name: "override_db", kind: "scalar", T: 9  },
            { no: 8, name: "prepare_completed", kind: "scalar", T: 8  },
            { no: 9, name: "stats_inserted", kind: "scalar", T: 8  },
            { no: 17, name: "system_tables_migrated", kind: "map", K: 9 , V: { kind: "scalar", T: 8  } },
            { no: 10, name: "descriptors_published", kind: "scalar", T: 8  },
            { no: 11, name: "descriptor_coverage", kind: "scalar", T: 5  },
            { no: 12, name: "encryption", kind: "message", T: () => BackupEncryptionOptions },
            { no: 19, name: "database_modifiers", kind: "map", K: 13 , V: { kind: "message", T: () => RestoreDetails_DatabaseModifier } },
            { no: 22, name: "restore_system_users", kind: "scalar", T: 8  },
            { no: 23, name: "pre_rewrite_tenant_id", kind: "message", T: () => TenantID },
            { no: 25, name: "schema_only", kind: "scalar", T: 8  },
            { no: 26, name: "VerifyData", kind: "scalar", jsonName: "VerifyData", T: 8  },
            { no: 28, name: "protected_timestamp_record", kind: "scalar", T: 12  },
            { no: 29, name: "SkipLocalitiesCheck", kind: "scalar", jsonName: "SkipLocalitiesCheck", T: 8  },
            { no: 30, name: "execution_locality", kind: "message", T: () => Locality },
            { no: 31, name: "experimental_online", kind: "scalar", T: 8  },
            { no: 32, name: "download_spans", kind: "message", repeat: 2 , T: () => Span },
            { no: 33, name: "RemoveRegions", kind: "scalar", jsonName: "RemoveRegions", T: 8  },
            { no: 34, name: "unsafe_restore_incompatible_version", kind: "scalar", T: 8  },
            { no: 35, name: "post_download_table_auto_stats_settings", kind: "map", K: 13 , V: { kind: "message", T: () => AutoStatsSettings } },
            { no: 36, name: "download_job", kind: "scalar", T: 8  },
            { no: 37, name: "experimental_copy", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<RestoreDetails>): RestoreDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.descriptorRewrites = {};
        message.uris = [];
        message.backupLocalityInfo = [];
        message.databaseDescs = [];
        message.tableDescs = [];
        message.typeDescs = [];
        message.schemaDescs = [];
        message.functionDescs = [];
        message.tenants = [];
        message.overrideDb = "";
        message.prepareCompleted = false;
        message.statsInserted = false;
        message.systemTablesMigrated = {};
        message.descriptorsPublished = false;
        message.descriptorCoverage = 0;
        message.databaseModifiers = {};
        message.restoreSystemUsers = false;
        message.schemaOnly = false;
        message.verifyData = false;
        message.protectedTimestampRecord = new Uint8Array(0);
        message.skipLocalitiesCheck = false;
        message.experimentalOnline = false;
        message.downloadSpans = [];
        message.removeRegions = false;
        message.unsafeRestoreIncompatibleVersion = false;
        message.postDownloadTableAutoStatsSettings = {};
        message.downloadJob = false;
        message.experimentalCopy = false;
        if (value !== undefined)
            reflectionMergePartial<RestoreDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RestoreDetails): RestoreDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  4:
                    message.endTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.endTime);
                    break;
                case  2:
                    this.binaryReadMap2(message.descriptorRewrites, reader, options);
                    break;
                case  3:
                    message.uris.push(reader.string());
                    break;
                case  7:
                    message.backupLocalityInfo.push(RestoreDetails_BackupLocalityInfo.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  16:
                    message.databaseDescs.push(DatabaseDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    message.tableDescs.push(TableDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  14:
                    message.typeDescs.push(TypeDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  15:
                    message.schemaDescs.push(SchemaDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  27:
                    message.functionDescs.push(FunctionDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  21:
                    message.tenants.push(TenantInfoWithUsage.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.overrideDb = reader.string();
                    break;
                case  8:
                    message.prepareCompleted = reader.bool();
                    break;
                case  9:
                    message.statsInserted = reader.bool();
                    break;
                case  17:
                    this.binaryReadMap17(message.systemTablesMigrated, reader, options);
                    break;
                case  10:
                    message.descriptorsPublished = reader.bool();
                    break;
                case  11:
                    message.descriptorCoverage = reader.int32();
                    break;
                case  12:
                    message.encryption = BackupEncryptionOptions.internalBinaryRead(reader, reader.uint32(), options, message.encryption);
                    break;
                case  19:
                    this.binaryReadMap19(message.databaseModifiers, reader, options);
                    break;
                case  22:
                    message.restoreSystemUsers = reader.bool();
                    break;
                case  23:
                    message.preRewriteTenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.preRewriteTenantId);
                    break;
                case  25:
                    message.schemaOnly = reader.bool();
                    break;
                case  26:
                    message.verifyData = reader.bool();
                    break;
                case  28:
                    message.protectedTimestampRecord = reader.bytes();
                    break;
                case  29:
                    message.skipLocalitiesCheck = reader.bool();
                    break;
                case  30:
                    message.executionLocality = Locality.internalBinaryRead(reader, reader.uint32(), options, message.executionLocality);
                    break;
                case  31:
                    message.experimentalOnline = reader.bool();
                    break;
                case  32:
                    message.downloadSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  33:
                    message.removeRegions = reader.bool();
                    break;
                case  34:
                    message.unsafeRestoreIncompatibleVersion = reader.bool();
                    break;
                case  35:
                    this.binaryReadMap35(message.postDownloadTableAutoStatsSettings, reader, options);
                    break;
                case  36:
                    message.downloadJob = reader.bool();
                    break;
                case  37:
                    message.experimentalCopy = reader.bool();
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
    private binaryReadMap2(map: RestoreDetails["descriptorRewrites"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof RestoreDetails["descriptorRewrites"] | undefined, val: RestoreDetails["descriptorRewrites"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint32();
                    break;
                case 2:
                    val = DescriptorRewrite.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.RestoreDetails.descriptor_rewrites");
            }
        }
        map[key ?? 0] = val ?? DescriptorRewrite.create();
    }
    private binaryReadMap17(map: RestoreDetails["systemTablesMigrated"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof RestoreDetails["systemTablesMigrated"] | undefined, val: RestoreDetails["systemTablesMigrated"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.bool();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.RestoreDetails.system_tables_migrated");
            }
        }
        map[key ?? ""] = val ?? false;
    }
    private binaryReadMap19(map: RestoreDetails["databaseModifiers"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof RestoreDetails["databaseModifiers"] | undefined, val: RestoreDetails["databaseModifiers"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint32();
                    break;
                case 2:
                    val = RestoreDetails_DatabaseModifier.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.RestoreDetails.database_modifiers");
            }
        }
        map[key ?? 0] = val ?? RestoreDetails_DatabaseModifier.create();
    }
    private binaryReadMap35(map: RestoreDetails["postDownloadTableAutoStatsSettings"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof RestoreDetails["postDownloadTableAutoStatsSettings"] | undefined, val: RestoreDetails["postDownloadTableAutoStatsSettings"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint32();
                    break;
                case 2:
                    val = AutoStatsSettings.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.RestoreDetails.post_download_table_auto_stats_settings");
            }
        }
        map[key ?? 0] = val ?? AutoStatsSettings.create();
    }

}

export const RestoreDetails = /*#__PURE__*/ new RestoreDetails$Type();

class RestoreDetails_BackupLocalityInfo$Type extends MessageType<RestoreDetails_BackupLocalityInfo> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.RestoreDetails.BackupLocalityInfo", [
            { no: 1, name: "uris_by_original_locality_kv", kind: "map", K: 9 , V: { kind: "scalar", T: 9  } }
        ]);
    }
    create(value?: PartialMessage<RestoreDetails_BackupLocalityInfo>): RestoreDetails_BackupLocalityInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.urisByOriginalLocalityKv = {};
        if (value !== undefined)
            reflectionMergePartial<RestoreDetails_BackupLocalityInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RestoreDetails_BackupLocalityInfo): RestoreDetails_BackupLocalityInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    this.binaryReadMap1(message.urisByOriginalLocalityKv, reader, options);
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
    private binaryReadMap1(map: RestoreDetails_BackupLocalityInfo["urisByOriginalLocalityKv"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof RestoreDetails_BackupLocalityInfo["urisByOriginalLocalityKv"] | undefined, val: RestoreDetails_BackupLocalityInfo["urisByOriginalLocalityKv"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.RestoreDetails.BackupLocalityInfo.uris_by_original_locality_kv");
            }
        }
        map[key ?? ""] = val ?? "";
    }

}

export const RestoreDetails_BackupLocalityInfo = /*#__PURE__*/ new RestoreDetails_BackupLocalityInfo$Type();

class RestoreDetails_DatabaseModifier$Type extends MessageType<RestoreDetails_DatabaseModifier> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.RestoreDetails.DatabaseModifier", [
            { no: 1, name: "extra_type_descs", kind: "message", repeat: 2 , T: () => TypeDescriptor },
            { no: 2, name: "region_config", kind: "message", T: () => DatabaseDescriptor_RegionConfig }
        ]);
    }
    create(value?: PartialMessage<RestoreDetails_DatabaseModifier>): RestoreDetails_DatabaseModifier {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.extraTypeDescs = [];
        if (value !== undefined)
            reflectionMergePartial<RestoreDetails_DatabaseModifier>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RestoreDetails_DatabaseModifier): RestoreDetails_DatabaseModifier {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.extraTypeDescs.push(TypeDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.regionConfig = DatabaseDescriptor_RegionConfig.internalBinaryRead(reader, reader.uint32(), options, message.regionConfig);
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

export const RestoreDetails_DatabaseModifier = /*#__PURE__*/ new RestoreDetails_DatabaseModifier$Type();

class RestoreProgress$Type extends MessageType<RestoreProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.RestoreProgress", [
            { no: 1, name: "high_water", kind: "scalar", T: 12  },
            { no: 2, name: "checkpoint", kind: "message", repeat: 2 , T: () => RestoreProgress_FrontierEntry },
            { no: 3, name: "total_download_required", kind: "scalar", T: 4 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<RestoreProgress>): RestoreProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.highWater = new Uint8Array(0);
        message.checkpoint = [];
        message.totalDownloadRequired = 0n;
        if (value !== undefined)
            reflectionMergePartial<RestoreProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RestoreProgress): RestoreProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.highWater = reader.bytes();
                    break;
                case  2:
                    message.checkpoint.push(RestoreProgress_FrontierEntry.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.totalDownloadRequired = reader.uint64().toBigInt();
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

export const RestoreProgress = /*#__PURE__*/ new RestoreProgress$Type();

class RestoreProgress_FrontierEntry$Type extends MessageType<RestoreProgress_FrontierEntry> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.RestoreProgress.FrontierEntry", [
            { no: 1, name: "span", kind: "message", T: () => Span },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<RestoreProgress_FrontierEntry>): RestoreProgress_FrontierEntry {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RestoreProgress_FrontierEntry>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RestoreProgress_FrontierEntry): RestoreProgress_FrontierEntry {
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

export const RestoreProgress_FrontierEntry = /*#__PURE__*/ new RestoreProgress_FrontierEntry$Type();

class ImportDetails$Type extends MessageType<ImportDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ImportDetails", [
            { no: 1, name: "tables", kind: "message", repeat: 2 , T: () => ImportDetails_Table },
            { no: 26, name: "types", kind: "message", repeat: 2 , T: () => ImportDetails_Type },
            { no: 2, name: "uris", kind: "scalar", repeat: 2 , T: 9  },
            { no: 3, name: "format", kind: "message", T: () => IOFileFormat },
            { no: 5, name: "walltime", kind: "scalar", T: 3 , L: 0  },
            { no: 6, name: "parent_id", kind: "scalar", T: 13  },
            { no: 12, name: "prepare_complete", kind: "scalar", T: 8  },
            { no: 13, name: "tables_published", kind: "scalar", T: 8  },
            { no: 27, name: "database_primary_region", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<ImportDetails>): ImportDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tables = [];
        message.types = [];
        message.uris = [];
        message.walltime = 0n;
        message.parentId = 0;
        message.prepareComplete = false;
        message.tablesPublished = false;
        message.databasePrimaryRegion = "";
        if (value !== undefined)
            reflectionMergePartial<ImportDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ImportDetails): ImportDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tables.push(ImportDetails_Table.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  26:
                    message.types.push(ImportDetails_Type.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.uris.push(reader.string());
                    break;
                case  3:
                    message.format = IOFileFormat.internalBinaryRead(reader, reader.uint32(), options, message.format);
                    break;
                case  5:
                    message.walltime = reader.int64().toBigInt();
                    break;
                case  6:
                    message.parentId = reader.uint32();
                    break;
                case  12:
                    message.prepareComplete = reader.bool();
                    break;
                case  13:
                    message.tablesPublished = reader.bool();
                    break;
                case  27:
                    message.databasePrimaryRegion = reader.string();
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

export const ImportDetails = /*#__PURE__*/ new ImportDetails$Type();

class ImportDetails_Table$Type extends MessageType<ImportDetails_Table> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ImportDetails.Table", [
            { no: 1, name: "desc", kind: "message", T: () => TableDescriptor },
            { no: 18, name: "name", kind: "scalar", T: 9  },
            { no: 19, name: "seq_val", kind: "scalar", T: 3 , L: 0  },
            { no: 22, name: "was_empty", kind: "scalar", T: 8  },
            { no: 21, name: "target_cols", kind: "scalar", repeat: 2 , T: 9  }
        ]);
    }
    create(value?: PartialMessage<ImportDetails_Table>): ImportDetails_Table {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        message.seqVal = 0n;
        message.wasEmpty = false;
        message.targetCols = [];
        if (value !== undefined)
            reflectionMergePartial<ImportDetails_Table>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ImportDetails_Table): ImportDetails_Table {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.desc = TableDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.desc);
                    break;
                case  18:
                    message.name = reader.string();
                    break;
                case  19:
                    message.seqVal = reader.int64().toBigInt();
                    break;
                case  22:
                    message.wasEmpty = reader.bool();
                    break;
                case  21:
                    message.targetCols.push(reader.string());
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

export const ImportDetails_Table = /*#__PURE__*/ new ImportDetails_Table$Type();

class ImportDetails_Type$Type extends MessageType<ImportDetails_Type> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ImportDetails.Type", [
            { no: 1, name: "desc", kind: "message", T: () => TypeDescriptor }
        ]);
    }
    create(value?: PartialMessage<ImportDetails_Type>): ImportDetails_Type {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ImportDetails_Type>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ImportDetails_Type): ImportDetails_Type {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.desc = TypeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.desc);
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

export const ImportDetails_Type = /*#__PURE__*/ new ImportDetails_Type$Type();

class SequenceValChunk$Type extends MessageType<SequenceValChunk> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SequenceValChunk", [
            { no: 1, name: "chunk_start_val", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "chunk_size", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "chunk_start_row", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "next_chunk_start_row", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<SequenceValChunk>): SequenceValChunk {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.chunkStartVal = 0n;
        message.chunkSize = 0n;
        message.chunkStartRow = 0n;
        message.nextChunkStartRow = 0n;
        if (value !== undefined)
            reflectionMergePartial<SequenceValChunk>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SequenceValChunk): SequenceValChunk {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.chunkStartVal = reader.int64().toBigInt();
                    break;
                case  2:
                    message.chunkSize = reader.int64().toBigInt();
                    break;
                case  3:
                    message.chunkStartRow = reader.int64().toBigInt();
                    break;
                case  4:
                    message.nextChunkStartRow = reader.int64().toBigInt();
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

export const SequenceValChunk = /*#__PURE__*/ new SequenceValChunk$Type();

class SequenceDetails$Type extends MessageType<SequenceDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SequenceDetails", [
            { no: 1, name: "seq_id_to_chunks", kind: "map", K: 5 , V: { kind: "message", T: () => SequenceDetails_SequenceChunks } }
        ]);
    }
    create(value?: PartialMessage<SequenceDetails>): SequenceDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.seqIdToChunks = {};
        if (value !== undefined)
            reflectionMergePartial<SequenceDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SequenceDetails): SequenceDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    this.binaryReadMap1(message.seqIdToChunks, reader, options);
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
    private binaryReadMap1(map: SequenceDetails["seqIdToChunks"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof SequenceDetails["seqIdToChunks"] | undefined, val: SequenceDetails["seqIdToChunks"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.int32();
                    break;
                case 2:
                    val = SequenceDetails_SequenceChunks.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.SequenceDetails.seq_id_to_chunks");
            }
        }
        map[key ?? 0] = val ?? SequenceDetails_SequenceChunks.create();
    }

}

export const SequenceDetails = /*#__PURE__*/ new SequenceDetails$Type();

class SequenceDetails_SequenceChunks$Type extends MessageType<SequenceDetails_SequenceChunks> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SequenceDetails.SequenceChunks", [
            { no: 1, name: "chunks", kind: "message", repeat: 2 , T: () => SequenceValChunk }
        ]);
    }
    create(value?: PartialMessage<SequenceDetails_SequenceChunks>): SequenceDetails_SequenceChunks {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.chunks = [];
        if (value !== undefined)
            reflectionMergePartial<SequenceDetails_SequenceChunks>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SequenceDetails_SequenceChunks): SequenceDetails_SequenceChunks {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.chunks.push(SequenceValChunk.internalBinaryRead(reader, reader.uint32(), options));
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

export const SequenceDetails_SequenceChunks = /*#__PURE__*/ new SequenceDetails_SequenceChunks$Type();

class ImportProgress$Type extends MessageType<ImportProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ImportProgress", [
            { no: 1, name: "sampling_progress", kind: "scalar", repeat: 1 , T: 2  },
            { no: 2, name: "read_progress", kind: "scalar", repeat: 1 , T: 2  },
            { no: 3, name: "write_progress", kind: "scalar", repeat: 1 , T: 2  },
            { no: 4, name: "span_progress", kind: "message", repeat: 2 , T: () => Span },
            { no: 5, name: "resume_pos", kind: "scalar", repeat: 1 , T: 3 , L: 0  },
            { no: 6, name: "sequence_details", kind: "message", repeat: 2 , T: () => SequenceDetails },
            { no: 7, name: "summary", kind: "message", T: () => BulkOpSummary }
        ]);
    }
    create(value?: PartialMessage<ImportProgress>): ImportProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.samplingProgress = [];
        message.readProgress = [];
        message.writeProgress = [];
        message.spanProgress = [];
        message.resumePos = [];
        message.sequenceDetails = [];
        if (value !== undefined)
            reflectionMergePartial<ImportProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ImportProgress): ImportProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.samplingProgress.push(reader.float());
                    else
                        message.samplingProgress.push(reader.float());
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.readProgress.push(reader.float());
                    else
                        message.readProgress.push(reader.float());
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.writeProgress.push(reader.float());
                    else
                        message.writeProgress.push(reader.float());
                    break;
                case  4:
                    message.spanProgress.push(Span.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.resumePos.push(reader.int64().toBigInt());
                    else
                        message.resumePos.push(reader.int64().toBigInt());
                    break;
                case  6:
                    message.sequenceDetails.push(SequenceDetails.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.summary = BulkOpSummary.internalBinaryRead(reader, reader.uint32(), options, message.summary);
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

export const ImportProgress = /*#__PURE__*/ new ImportProgress$Type();

class TypeSchemaChangeDetails$Type extends MessageType<TypeSchemaChangeDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.TypeSchemaChangeDetails", [
            { no: 1, name: "type_id", kind: "scalar", T: 13  },
            { no: 2, name: "transitioning_members", kind: "scalar", repeat: 2 , T: 12  }
        ]);
    }
    create(value?: PartialMessage<TypeSchemaChangeDetails>): TypeSchemaChangeDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.typeId = 0;
        message.transitioningMembers = [];
        if (value !== undefined)
            reflectionMergePartial<TypeSchemaChangeDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TypeSchemaChangeDetails): TypeSchemaChangeDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.typeId = reader.uint32();
                    break;
                case  2:
                    message.transitioningMembers.push(reader.bytes());
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

export const TypeSchemaChangeDetails = /*#__PURE__*/ new TypeSchemaChangeDetails$Type();

class TypeSchemaChangeProgress$Type extends MessageType<TypeSchemaChangeProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.TypeSchemaChangeProgress", []);
    }
    create(value?: PartialMessage<TypeSchemaChangeProgress>): TypeSchemaChangeProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TypeSchemaChangeProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TypeSchemaChangeProgress): TypeSchemaChangeProgress {
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

export const TypeSchemaChangeProgress = /*#__PURE__*/ new TypeSchemaChangeProgress$Type();

class NewSchemaChangeDetails$Type extends MessageType<NewSchemaChangeDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.NewSchemaChangeDetails", [
            { no: 4, name: "backfill_progress", kind: "message", repeat: 2 , T: () => BackfillProgress },
            { no: 6, name: "merge_progress", kind: "message", repeat: 2 , T: () => MergeProgress },
            { no: 7, name: "protected_timestamp_record", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<NewSchemaChangeDetails>): NewSchemaChangeDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.backfillProgress = [];
        message.mergeProgress = [];
        message.protectedTimestampRecord = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<NewSchemaChangeDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NewSchemaChangeDetails): NewSchemaChangeDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  4:
                    message.backfillProgress.push(BackfillProgress.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.mergeProgress.push(MergeProgress.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.protectedTimestampRecord = reader.bytes();
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

export const NewSchemaChangeDetails = /*#__PURE__*/ new NewSchemaChangeDetails$Type();

class BackfillProgress$Type extends MessageType<BackfillProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.BackfillProgress", [
            { no: 1, name: "id", kind: "scalar", T: 13  },
            { no: 2, name: "source_index_id", kind: "scalar", T: 13  },
            { no: 3, name: "dest_index_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "write_timestamp", kind: "message", T: () => Timestamp },
            { no: 5, name: "completed_spans", kind: "message", repeat: 2 , T: () => Span }
        ]);
    }
    create(value?: PartialMessage<BackfillProgress>): BackfillProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0;
        message.sourceIndexId = 0;
        message.destIndexIds = [];
        message.completedSpans = [];
        if (value !== undefined)
            reflectionMergePartial<BackfillProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BackfillProgress): BackfillProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    message.sourceIndexId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.destIndexIds.push(reader.uint32());
                    else
                        message.destIndexIds.push(reader.uint32());
                    break;
                case  4:
                    message.writeTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.writeTimestamp);
                    break;
                case  5:
                    message.completedSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
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

export const BackfillProgress = /*#__PURE__*/ new BackfillProgress$Type();

class MergeProgress$Type extends MessageType<MergeProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.MergeProgress", [
            { no: 1, name: "id", kind: "scalar", T: 13  },
            { no: 2, name: "merge_pairs", kind: "message", repeat: 2 , T: () => MergeProgress_MergePair }
        ]);
    }
    create(value?: PartialMessage<MergeProgress>): MergeProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0;
        message.mergePairs = [];
        if (value !== undefined)
            reflectionMergePartial<MergeProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MergeProgress): MergeProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    message.mergePairs.push(MergeProgress_MergePair.internalBinaryRead(reader, reader.uint32(), options));
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

export const MergeProgress = /*#__PURE__*/ new MergeProgress$Type();

class MergeProgress_MergePair$Type extends MessageType<MergeProgress_MergePair> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.MergeProgress.MergePair", [
            { no: 2, name: "source_index_id", kind: "scalar", T: 13  },
            { no: 3, name: "dest_index_id", kind: "scalar", T: 13  },
            { no: 4, name: "completed_spans", kind: "message", repeat: 2 , T: () => Span }
        ]);
    }
    create(value?: PartialMessage<MergeProgress_MergePair>): MergeProgress_MergePair {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.sourceIndexId = 0;
        message.destIndexId = 0;
        message.completedSpans = [];
        if (value !== undefined)
            reflectionMergePartial<MergeProgress_MergePair>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MergeProgress_MergePair): MergeProgress_MergePair {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.sourceIndexId = reader.uint32();
                    break;
                case  3:
                    message.destIndexId = reader.uint32();
                    break;
                case  4:
                    message.completedSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
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

export const MergeProgress_MergePair = /*#__PURE__*/ new MergeProgress_MergePair$Type();

class NewSchemaChangeProgress$Type extends MessageType<NewSchemaChangeProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.NewSchemaChangeProgress", []);
    }
    create(value?: PartialMessage<NewSchemaChangeProgress>): NewSchemaChangeProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<NewSchemaChangeProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NewSchemaChangeProgress): NewSchemaChangeProgress {
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

export const NewSchemaChangeProgress = /*#__PURE__*/ new NewSchemaChangeProgress$Type();

class AutoSpanConfigReconciliationDetails$Type extends MessageType<AutoSpanConfigReconciliationDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoSpanConfigReconciliationDetails", []);
    }
    create(value?: PartialMessage<AutoSpanConfigReconciliationDetails>): AutoSpanConfigReconciliationDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoSpanConfigReconciliationDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoSpanConfigReconciliationDetails): AutoSpanConfigReconciliationDetails {
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

export const AutoSpanConfigReconciliationDetails = /*#__PURE__*/ new AutoSpanConfigReconciliationDetails$Type();

class AutoSpanConfigReconciliationProgress$Type extends MessageType<AutoSpanConfigReconciliationProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoSpanConfigReconciliationProgress", [
            { no: 1, name: "checkpoint", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<AutoSpanConfigReconciliationProgress>): AutoSpanConfigReconciliationProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoSpanConfigReconciliationProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoSpanConfigReconciliationProgress): AutoSpanConfigReconciliationProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.checkpoint = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.checkpoint);
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

export const AutoSpanConfigReconciliationProgress = /*#__PURE__*/ new AutoSpanConfigReconciliationProgress$Type();

class KeyVisualizerDetails$Type extends MessageType<KeyVisualizerDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.KeyVisualizerDetails", []);
    }
    create(value?: PartialMessage<KeyVisualizerDetails>): KeyVisualizerDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<KeyVisualizerDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: KeyVisualizerDetails): KeyVisualizerDetails {
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

export const KeyVisualizerDetails = /*#__PURE__*/ new KeyVisualizerDetails$Type();

class KeyVisualizerProgress$Type extends MessageType<KeyVisualizerProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.KeyVisualizerProgress", []);
    }
    create(value?: PartialMessage<KeyVisualizerProgress>): KeyVisualizerProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<KeyVisualizerProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: KeyVisualizerProgress): KeyVisualizerProgress {
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

export const KeyVisualizerProgress = /*#__PURE__*/ new KeyVisualizerProgress$Type();

class ResumeSpanList$Type extends MessageType<ResumeSpanList> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ResumeSpanList", [
            { no: 1, name: "resume_spans", kind: "message", repeat: 2 , T: () => Span }
        ]);
    }
    create(value?: PartialMessage<ResumeSpanList>): ResumeSpanList {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.resumeSpans = [];
        if (value !== undefined)
            reflectionMergePartial<ResumeSpanList>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResumeSpanList): ResumeSpanList {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.resumeSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
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

export const ResumeSpanList = /*#__PURE__*/ new ResumeSpanList$Type();

class DroppedTableDetails$Type extends MessageType<DroppedTableDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.DroppedTableDetails", [
            { no: 1, name: "name", kind: "scalar", T: 9  },
            { no: 2, name: "ID", kind: "scalar", jsonName: "ID", T: 13  },
            { no: 3, name: "status", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.Status", Status] }
        ]);
    }
    create(value?: PartialMessage<DroppedTableDetails>): DroppedTableDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        message.iD = 0;
        message.status = 0;
        if (value !== undefined)
            reflectionMergePartial<DroppedTableDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DroppedTableDetails): DroppedTableDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.iD = reader.uint32();
                    break;
                case  3:
                    message.status = reader.int32();
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

export const DroppedTableDetails = /*#__PURE__*/ new DroppedTableDetails$Type();

class SchemaChangeGCDetails$Type extends MessageType<SchemaChangeGCDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeGCDetails", [
            { no: 1, name: "indexes", kind: "message", repeat: 2 , T: () => SchemaChangeGCDetails_DroppedIndex },
            { no: 2, name: "tables", kind: "message", repeat: 2 , T: () => SchemaChangeGCDetails_DroppedID },
            { no: 3, name: "parent_id", kind: "scalar", T: 3 , L: 0  },
            { no: 6, name: "tenant", kind: "message", T: () => SchemaChangeGCDetails_DroppedTenant }
        ]);
    }
    create(value?: PartialMessage<SchemaChangeGCDetails>): SchemaChangeGCDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.indexes = [];
        message.tables = [];
        message.parentId = 0n;
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeGCDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeGCDetails): SchemaChangeGCDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.indexes.push(SchemaChangeGCDetails_DroppedIndex.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.tables.push(SchemaChangeGCDetails_DroppedID.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.parentId = reader.int64().toBigInt();
                    break;
                case  6:
                    message.tenant = SchemaChangeGCDetails_DroppedTenant.internalBinaryRead(reader, reader.uint32(), options, message.tenant);
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

export const SchemaChangeGCDetails = /*#__PURE__*/ new SchemaChangeGCDetails$Type();

class SchemaChangeGCDetails_DroppedIndex$Type extends MessageType<SchemaChangeGCDetails_DroppedIndex> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeGCDetails.DroppedIndex", [
            { no: 1, name: "index_id", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "drop_time", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<SchemaChangeGCDetails_DroppedIndex>): SchemaChangeGCDetails_DroppedIndex {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.indexId = 0n;
        message.dropTime = 0n;
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeGCDetails_DroppedIndex>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeGCDetails_DroppedIndex): SchemaChangeGCDetails_DroppedIndex {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.indexId = reader.int64().toBigInt();
                    break;
                case  2:
                    message.dropTime = reader.int64().toBigInt();
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

export const SchemaChangeGCDetails_DroppedIndex = /*#__PURE__*/ new SchemaChangeGCDetails_DroppedIndex$Type();

class SchemaChangeGCDetails_DroppedID$Type extends MessageType<SchemaChangeGCDetails_DroppedID> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeGCDetails.DroppedID", [
            { no: 1, name: "id", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "drop_time", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<SchemaChangeGCDetails_DroppedID>): SchemaChangeGCDetails_DroppedID {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0n;
        message.dropTime = 0n;
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeGCDetails_DroppedID>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeGCDetails_DroppedID): SchemaChangeGCDetails_DroppedID {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.int64().toBigInt();
                    break;
                case  2:
                    message.dropTime = reader.int64().toBigInt();
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

export const SchemaChangeGCDetails_DroppedID = /*#__PURE__*/ new SchemaChangeGCDetails_DroppedID$Type();

class SchemaChangeGCDetails_DroppedTenant$Type extends MessageType<SchemaChangeGCDetails_DroppedTenant> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeGCDetails.DroppedTenant", [
            { no: 1, name: "id", kind: "scalar", T: 4 , L: 0  },
            { no: 2, name: "drop_time", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<SchemaChangeGCDetails_DroppedTenant>): SchemaChangeGCDetails_DroppedTenant {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0n;
        message.dropTime = 0n;
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeGCDetails_DroppedTenant>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeGCDetails_DroppedTenant): SchemaChangeGCDetails_DroppedTenant {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint64().toBigInt();
                    break;
                case  2:
                    message.dropTime = reader.int64().toBigInt();
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

export const SchemaChangeGCDetails_DroppedTenant = /*#__PURE__*/ new SchemaChangeGCDetails_DroppedTenant$Type();

class SchemaChangeDetails$Type extends MessageType<SchemaChangeDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeDetails", [
            { no: 2, name: "resume_span_list", kind: "message", repeat: 2 , T: () => ResumeSpanList },
            { no: 3, name: "dropped_tables", kind: "message", repeat: 2 , T: () => DroppedTableDetails },
            { no: 8, name: "dropped_types", kind: "scalar", repeat: 1 , T: 13  },
            { no: 9, name: "dropped_schemas", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "dropped_database_id", kind: "scalar", T: 13  },
            { no: 12, name: "dropped_functions", kind: "scalar", repeat: 1 , T: 13  },
            { no: 5, name: "desc_id", kind: "scalar", T: 13  },
            { no: 6, name: "table_mutation_id", kind: "scalar", T: 13  },
            { no: 7, name: "format_version", kind: "scalar", T: 13  },
            { no: 10, name: "write_timestamp", kind: "message", T: () => Timestamp },
            { no: 11, name: "protected_timestamp_record", kind: "scalar", T: 12  },
            { no: 13, name: "session_data", kind: "message", T: () => SessionData }
        ]);
    }
    create(value?: PartialMessage<SchemaChangeDetails>): SchemaChangeDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.resumeSpanList = [];
        message.droppedTables = [];
        message.droppedTypes = [];
        message.droppedSchemas = [];
        message.droppedDatabaseId = 0;
        message.droppedFunctions = [];
        message.descId = 0;
        message.tableMutationId = 0;
        message.formatVersion = 0;
        message.protectedTimestampRecord = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeDetails): SchemaChangeDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.resumeSpanList.push(ResumeSpanList.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.droppedTables.push(DroppedTableDetails.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  8:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.droppedTypes.push(reader.uint32());
                    else
                        message.droppedTypes.push(reader.uint32());
                    break;
                case  9:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.droppedSchemas.push(reader.uint32());
                    else
                        message.droppedSchemas.push(reader.uint32());
                    break;
                case  4:
                    message.droppedDatabaseId = reader.uint32();
                    break;
                case  12:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.droppedFunctions.push(reader.uint32());
                    else
                        message.droppedFunctions.push(reader.uint32());
                    break;
                case  5:
                    message.descId = reader.uint32();
                    break;
                case  6:
                    message.tableMutationId = reader.uint32();
                    break;
                case  7:
                    message.formatVersion = reader.uint32();
                    break;
                case  10:
                    message.writeTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.writeTimestamp);
                    break;
                case  11:
                    message.protectedTimestampRecord = reader.bytes();
                    break;
                case  13:
                    message.sessionData = SessionData.internalBinaryRead(reader, reader.uint32(), options, message.sessionData);
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

export const SchemaChangeDetails = /*#__PURE__*/ new SchemaChangeDetails$Type();

class SchemaChangeProgress$Type extends MessageType<SchemaChangeProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeProgress", []);
    }
    create(value?: PartialMessage<SchemaChangeProgress>): SchemaChangeProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeProgress): SchemaChangeProgress {
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

export const SchemaChangeProgress = /*#__PURE__*/ new SchemaChangeProgress$Type();

class SchemaChangeGCProgress$Type extends MessageType<SchemaChangeGCProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeGCProgress", [
            { no: 1, name: "indexes", kind: "message", repeat: 2 , T: () => SchemaChangeGCProgress_IndexProgress },
            { no: 2, name: "tables", kind: "message", repeat: 2 , T: () => SchemaChangeGCProgress_TableProgress },
            { no: 3, name: "tenant", kind: "message", T: () => SchemaChangeGCProgress_TenantProgress },
            { no: 4, name: "ranges_unsplit_done", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<SchemaChangeGCProgress>): SchemaChangeGCProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.indexes = [];
        message.tables = [];
        message.rangesUnsplitDone = false;
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeGCProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeGCProgress): SchemaChangeGCProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.indexes.push(SchemaChangeGCProgress_IndexProgress.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.tables.push(SchemaChangeGCProgress_TableProgress.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.tenant = SchemaChangeGCProgress_TenantProgress.internalBinaryRead(reader, reader.uint32(), options, message.tenant);
                    break;
                case  4:
                    message.rangesUnsplitDone = reader.bool();
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

export const SchemaChangeGCProgress = /*#__PURE__*/ new SchemaChangeGCProgress$Type();

class SchemaChangeGCProgress_IndexProgress$Type extends MessageType<SchemaChangeGCProgress_IndexProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeGCProgress.IndexProgress", [
            { no: 1, name: "index_id", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "status", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.SchemaChangeGCProgress.Status", SchemaChangeGCProgress_Status] }
        ]);
    }
    create(value?: PartialMessage<SchemaChangeGCProgress_IndexProgress>): SchemaChangeGCProgress_IndexProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.indexId = 0n;
        message.status = 0;
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeGCProgress_IndexProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeGCProgress_IndexProgress): SchemaChangeGCProgress_IndexProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.indexId = reader.int64().toBigInt();
                    break;
                case  2:
                    message.status = reader.int32();
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

export const SchemaChangeGCProgress_IndexProgress = /*#__PURE__*/ new SchemaChangeGCProgress_IndexProgress$Type();

class SchemaChangeGCProgress_TableProgress$Type extends MessageType<SchemaChangeGCProgress_TableProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeGCProgress.TableProgress", [
            { no: 1, name: "id", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "status", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.SchemaChangeGCProgress.Status", SchemaChangeGCProgress_Status] }
        ]);
    }
    create(value?: PartialMessage<SchemaChangeGCProgress_TableProgress>): SchemaChangeGCProgress_TableProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0n;
        message.status = 0;
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeGCProgress_TableProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeGCProgress_TableProgress): SchemaChangeGCProgress_TableProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.int64().toBigInt();
                    break;
                case  2:
                    message.status = reader.int32();
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

export const SchemaChangeGCProgress_TableProgress = /*#__PURE__*/ new SchemaChangeGCProgress_TableProgress$Type();

class SchemaChangeGCProgress_TenantProgress$Type extends MessageType<SchemaChangeGCProgress_TenantProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaChangeGCProgress.TenantProgress", [
            { no: 1, name: "status", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.SchemaChangeGCProgress.Status", SchemaChangeGCProgress_Status] }
        ]);
    }
    create(value?: PartialMessage<SchemaChangeGCProgress_TenantProgress>): SchemaChangeGCProgress_TenantProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.status = 0;
        if (value !== undefined)
            reflectionMergePartial<SchemaChangeGCProgress_TenantProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChangeGCProgress_TenantProgress): SchemaChangeGCProgress_TenantProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.status = reader.int32();
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

export const SchemaChangeGCProgress_TenantProgress = /*#__PURE__*/ new SchemaChangeGCProgress_TenantProgress$Type();

class ChangefeedTargetTable$Type extends MessageType<ChangefeedTargetTable> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ChangefeedTargetTable", [
            { no: 1, name: "statement_time_name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<ChangefeedTargetTable>): ChangefeedTargetTable {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.statementTimeName = "";
        if (value !== undefined)
            reflectionMergePartial<ChangefeedTargetTable>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ChangefeedTargetTable): ChangefeedTargetTable {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.statementTimeName = reader.string();
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

export const ChangefeedTargetTable = /*#__PURE__*/ new ChangefeedTargetTable$Type();

class ChangefeedTargetSpecification$Type extends MessageType<ChangefeedTargetSpecification> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ChangefeedTargetSpecification", [
            { no: 1, name: "type", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.ChangefeedTargetSpecification.TargetType", ChangefeedTargetSpecification_TargetType] },
            { no: 2, name: "descriptor_id", kind: "scalar", T: 13  },
            { no: 3, name: "family_name", kind: "scalar", T: 9  },
            { no: 4, name: "statement_time_name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<ChangefeedTargetSpecification>): ChangefeedTargetSpecification {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.type = 0;
        message.descriptorId = 0;
        message.familyName = "";
        message.statementTimeName = "";
        if (value !== undefined)
            reflectionMergePartial<ChangefeedTargetSpecification>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ChangefeedTargetSpecification): ChangefeedTargetSpecification {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.type = reader.int32();
                    break;
                case  2:
                    message.descriptorId = reader.uint32();
                    break;
                case  3:
                    message.familyName = reader.string();
                    break;
                case  4:
                    message.statementTimeName = reader.string();
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

export const ChangefeedTargetSpecification = /*#__PURE__*/ new ChangefeedTargetSpecification$Type();

class ChangefeedDetails$Type extends MessageType<ChangefeedDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ChangefeedDetails", [
            { no: 6, name: "tables", kind: "map", K: 13 , V: { kind: "message", T: () => ChangefeedTargetTable } },
            { no: 3, name: "sink_uri", kind: "scalar", T: 9  },
            { no: 4, name: "opts", kind: "map", K: 9 , V: { kind: "scalar", T: 9  } },
            { no: 7, name: "statement_time", kind: "message", T: () => Timestamp },
            { no: 9, name: "end_time", kind: "message", T: () => Timestamp },
            { no: 8, name: "target_specifications", kind: "message", repeat: 2 , T: () => ChangefeedTargetSpecification },
            { no: 10, name: "select", kind: "scalar", T: 9  },
            { no: 11, name: "session_data", kind: "message", T: () => SessionData }
        ]);
    }
    create(value?: PartialMessage<ChangefeedDetails>): ChangefeedDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tables = {};
        message.sinkUri = "";
        message.opts = {};
        message.targetSpecifications = [];
        message.select = "";
        if (value !== undefined)
            reflectionMergePartial<ChangefeedDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ChangefeedDetails): ChangefeedDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  6:
                    this.binaryReadMap6(message.tables, reader, options);
                    break;
                case  3:
                    message.sinkUri = reader.string();
                    break;
                case  4:
                    this.binaryReadMap4(message.opts, reader, options);
                    break;
                case  7:
                    message.statementTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.statementTime);
                    break;
                case  9:
                    message.endTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.endTime);
                    break;
                case  8:
                    message.targetSpecifications.push(ChangefeedTargetSpecification.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  10:
                    message.select = reader.string();
                    break;
                case  11:
                    message.sessionData = SessionData.internalBinaryRead(reader, reader.uint32(), options, message.sessionData);
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
    private binaryReadMap6(map: ChangefeedDetails["tables"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ChangefeedDetails["tables"] | undefined, val: ChangefeedDetails["tables"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint32();
                    break;
                case 2:
                    val = ChangefeedTargetTable.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.ChangefeedDetails.tables");
            }
        }
        map[key ?? 0] = val ?? ChangefeedTargetTable.create();
    }
    private binaryReadMap4(map: ChangefeedDetails["opts"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ChangefeedDetails["opts"] | undefined, val: ChangefeedDetails["opts"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.jobs.jobspb.ChangefeedDetails.opts");
            }
        }
        map[key ?? ""] = val ?? "";
    }

}

export const ChangefeedDetails = /*#__PURE__*/ new ChangefeedDetails$Type();

class ResolvedSpan$Type extends MessageType<ResolvedSpan> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ResolvedSpan", [
            { no: 1, name: "span", kind: "message", T: () => Span },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 4, name: "boundary_type", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.ResolvedSpan.BoundaryType", ResolvedSpan_BoundaryType] }
        ]);
    }
    create(value?: PartialMessage<ResolvedSpan>): ResolvedSpan {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.boundaryType = 0;
        if (value !== undefined)
            reflectionMergePartial<ResolvedSpan>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResolvedSpan): ResolvedSpan {
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
                case  4:
                    message.boundaryType = reader.int32();
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

export const ResolvedSpan = /*#__PURE__*/ new ResolvedSpan$Type();

class ResolvedSpans$Type extends MessageType<ResolvedSpans> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ResolvedSpans", [
            { no: 1, name: "resolved_spans", kind: "message", repeat: 2 , T: () => ResolvedSpan },
            { no: 2, name: "stats", kind: "message", T: () => ResolvedSpans_Stats }
        ]);
    }
    create(value?: PartialMessage<ResolvedSpans>): ResolvedSpans {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.resolvedSpans = [];
        if (value !== undefined)
            reflectionMergePartial<ResolvedSpans>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResolvedSpans): ResolvedSpans {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.resolvedSpans.push(ResolvedSpan.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.stats = ResolvedSpans_Stats.internalBinaryRead(reader, reader.uint32(), options, message.stats);
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

export const ResolvedSpans = /*#__PURE__*/ new ResolvedSpans$Type();

class ResolvedSpans_Stats$Type extends MessageType<ResolvedSpans_Stats> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ResolvedSpans.Stats", [
            { no: 1, name: "recent_kv_count", kind: "scalar", T: 4 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<ResolvedSpans_Stats>): ResolvedSpans_Stats {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.recentKvCount = 0n;
        if (value !== undefined)
            reflectionMergePartial<ResolvedSpans_Stats>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ResolvedSpans_Stats): ResolvedSpans_Stats {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.recentKvCount = reader.uint64().toBigInt();
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

export const ResolvedSpans_Stats = /*#__PURE__*/ new ResolvedSpans_Stats$Type();

class TimestampSpansMap$Type extends MessageType<TimestampSpansMap> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.TimestampSpansMap", [
            { no: 1, name: "entries", kind: "message", repeat: 2 , T: () => TimestampSpansMap_Entry }
        ]);
    }
    create(value?: PartialMessage<TimestampSpansMap>): TimestampSpansMap {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.entries = [];
        if (value !== undefined)
            reflectionMergePartial<TimestampSpansMap>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TimestampSpansMap): TimestampSpansMap {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.entries.push(TimestampSpansMap_Entry.internalBinaryRead(reader, reader.uint32(), options));
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

export const TimestampSpansMap = /*#__PURE__*/ new TimestampSpansMap$Type();

class TimestampSpansMap_Entry$Type extends MessageType<TimestampSpansMap_Entry> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.TimestampSpansMap.Entry", [
            { no: 1, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 2, name: "spans", kind: "message", repeat: 2 , T: () => Span }
        ]);
    }
    create(value?: PartialMessage<TimestampSpansMap_Entry>): TimestampSpansMap_Entry {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.spans = [];
        if (value !== undefined)
            reflectionMergePartial<TimestampSpansMap_Entry>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TimestampSpansMap_Entry): TimestampSpansMap_Entry {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  2:
                    message.spans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
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

export const TimestampSpansMap_Entry = /*#__PURE__*/ new TimestampSpansMap_Entry$Type();

class ChangefeedProgress$Type extends MessageType<ChangefeedProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ChangefeedProgress", [
            { no: 3, name: "protected_timestamp_record", kind: "scalar", T: 12  },
            { no: 5, name: "span_level_checkpoint", kind: "message", T: () => TimestampSpansMap }
        ]);
    }
    create(value?: PartialMessage<ChangefeedProgress>): ChangefeedProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.protectedTimestampRecord = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<ChangefeedProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ChangefeedProgress): ChangefeedProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  3:
                    message.protectedTimestampRecord = reader.bytes();
                    break;
                case  5:
                    message.spanLevelCheckpoint = TimestampSpansMap.internalBinaryRead(reader, reader.uint32(), options, message.spanLevelCheckpoint);
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

export const ChangefeedProgress = /*#__PURE__*/ new ChangefeedProgress$Type();

class CreateStatsDetails$Type extends MessageType<CreateStatsDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.CreateStatsDetails", [
            { no: 1, name: "name", kind: "scalar", T: 9  },
            { no: 2, name: "table", kind: "message", T: () => TableDescriptor },
            { no: 3, name: "column_stats", kind: "message", repeat: 2 , T: () => CreateStatsDetails_ColStat },
            { no: 4, name: "statement", kind: "scalar", T: 9  },
            { no: 5, name: "as_of", kind: "message", T: () => Timestamp },
            { no: 7, name: "max_fraction_idle", kind: "scalar", T: 1  },
            { no: 6, name: "fq_table_name", kind: "scalar", T: 9  },
            { no: 8, name: "delete_other_stats", kind: "scalar", T: 8  },
            { no: 9, name: "using_extremes", kind: "scalar", T: 8  },
            { no: 10, name: "where_clause", kind: "scalar", T: 9  },
            { no: 11, name: "where_spans", kind: "message", repeat: 2 , T: () => Span },
            { no: 12, name: "where_index_id", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<CreateStatsDetails>): CreateStatsDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        message.columnStats = [];
        message.statement = "";
        message.maxFractionIdle = 0;
        message.fqTableName = "";
        message.deleteOtherStats = false;
        message.usingExtremes = false;
        message.whereClause = "";
        message.whereSpans = [];
        message.whereIndexId = 0n;
        if (value !== undefined)
            reflectionMergePartial<CreateStatsDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CreateStatsDetails): CreateStatsDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.table = TableDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.table);
                    break;
                case  3:
                    message.columnStats.push(CreateStatsDetails_ColStat.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.statement = reader.string();
                    break;
                case  5:
                    message.asOf = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.asOf);
                    break;
                case  7:
                    message.maxFractionIdle = reader.double();
                    break;
                case  6:
                    message.fqTableName = reader.string();
                    break;
                case  8:
                    message.deleteOtherStats = reader.bool();
                    break;
                case  9:
                    message.usingExtremes = reader.bool();
                    break;
                case  10:
                    message.whereClause = reader.string();
                    break;
                case  11:
                    message.whereSpans.push(Span.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  12:
                    message.whereIndexId = reader.int64().toBigInt();
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

export const CreateStatsDetails = /*#__PURE__*/ new CreateStatsDetails$Type();

class CreateStatsDetails_ColStat$Type extends MessageType<CreateStatsDetails_ColStat> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.CreateStatsDetails.ColStat", [
            { no: 1, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 2, name: "has_histogram", kind: "scalar", T: 8  },
            { no: 3, name: "inverted", kind: "scalar", T: 8  },
            { no: 4, name: "histogram_max_buckets", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<CreateStatsDetails_ColStat>): CreateStatsDetails_ColStat {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.columnIds = [];
        message.hasHistogram = false;
        message.inverted = false;
        message.histogramMaxBuckets = 0;
        if (value !== undefined)
            reflectionMergePartial<CreateStatsDetails_ColStat>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CreateStatsDetails_ColStat): CreateStatsDetails_ColStat {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  2:
                    message.hasHistogram = reader.bool();
                    break;
                case  3:
                    message.inverted = reader.bool();
                    break;
                case  4:
                    message.histogramMaxBuckets = reader.uint32();
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

export const CreateStatsDetails_ColStat = /*#__PURE__*/ new CreateStatsDetails_ColStat$Type();

class CreateStatsProgress$Type extends MessageType<CreateStatsProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.CreateStatsProgress", []);
    }
    create(value?: PartialMessage<CreateStatsProgress>): CreateStatsProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<CreateStatsProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CreateStatsProgress): CreateStatsProgress {
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

export const CreateStatsProgress = /*#__PURE__*/ new CreateStatsProgress$Type();

class MigrationDetails$Type extends MessageType<MigrationDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.MigrationDetails", [
            { no: 1, name: "cluster_version", kind: "message", T: () => ClusterVersion }
        ]);
    }
    create(value?: PartialMessage<MigrationDetails>): MigrationDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MigrationDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MigrationDetails): MigrationDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.clusterVersion = ClusterVersion.internalBinaryRead(reader, reader.uint32(), options, message.clusterVersion);
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

export const MigrationDetails = /*#__PURE__*/ new MigrationDetails$Type();

class MigrationProgress$Type extends MessageType<MigrationProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.MigrationProgress", [
            { no: 1, name: "watermark", kind: "scalar", T: 12  }
        ]);
    }
    create(value?: PartialMessage<MigrationProgress>): MigrationProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.watermark = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<MigrationProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MigrationProgress): MigrationProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.watermark = reader.bytes();
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

export const MigrationProgress = /*#__PURE__*/ new MigrationProgress$Type();

class AutoSQLStatsCompactionDetails$Type extends MessageType<AutoSQLStatsCompactionDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoSQLStatsCompactionDetails", []);
    }
    create(value?: PartialMessage<AutoSQLStatsCompactionDetails>): AutoSQLStatsCompactionDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoSQLStatsCompactionDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoSQLStatsCompactionDetails): AutoSQLStatsCompactionDetails {
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

export const AutoSQLStatsCompactionDetails = /*#__PURE__*/ new AutoSQLStatsCompactionDetails$Type();

class AutoSQLStatsCompactionProgress$Type extends MessageType<AutoSQLStatsCompactionProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoSQLStatsCompactionProgress", []);
    }
    create(value?: PartialMessage<AutoSQLStatsCompactionProgress>): AutoSQLStatsCompactionProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoSQLStatsCompactionProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoSQLStatsCompactionProgress): AutoSQLStatsCompactionProgress {
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

export const AutoSQLStatsCompactionProgress = /*#__PURE__*/ new AutoSQLStatsCompactionProgress$Type();

class RowLevelTTLDetails$Type extends MessageType<RowLevelTTLDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.RowLevelTTLDetails", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "cutoff", kind: "message", T: () => Timestamp$ },
            { no: 3, name: "table_version", kind: "scalar", T: 4 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<RowLevelTTLDetails>): RowLevelTTLDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.tableVersion = 0n;
        if (value !== undefined)
            reflectionMergePartial<RowLevelTTLDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RowLevelTTLDetails): RowLevelTTLDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.cutoff = Timestamp$.internalBinaryRead(reader, reader.uint32(), options, message.cutoff);
                    break;
                case  3:
                    message.tableVersion = reader.uint64().toBigInt();
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

export const RowLevelTTLDetails = /*#__PURE__*/ new RowLevelTTLDetails$Type();

class RowLevelTTLProgress$Type extends MessageType<RowLevelTTLProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.RowLevelTTLProgress", [
            { no: 1, name: "job_deleted_row_count", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "processor_progresses", kind: "message", repeat: 2 , T: () => RowLevelTTLProcessorProgress },
            { no: 4, name: "job_total_span_count", kind: "scalar", T: 3 , L: 0  },
            { no: 5, name: "job_processed_span_count", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<RowLevelTTLProgress>): RowLevelTTLProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.jobDeletedRowCount = 0n;
        message.processorProgresses = [];
        message.jobTotalSpanCount = 0n;
        message.jobProcessedSpanCount = 0n;
        if (value !== undefined)
            reflectionMergePartial<RowLevelTTLProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RowLevelTTLProgress): RowLevelTTLProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.jobDeletedRowCount = reader.int64().toBigInt();
                    break;
                case  2:
                    message.processorProgresses.push(RowLevelTTLProcessorProgress.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.jobTotalSpanCount = reader.int64().toBigInt();
                    break;
                case  5:
                    message.jobProcessedSpanCount = reader.int64().toBigInt();
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

export const RowLevelTTLProgress = /*#__PURE__*/ new RowLevelTTLProgress$Type();

class RowLevelTTLProcessorProgress$Type extends MessageType<RowLevelTTLProcessorProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.RowLevelTTLProcessorProgress", [
            { no: 1, name: "processor_id", kind: "scalar", T: 5  },
            { no: 2, name: "sql_instance_id", kind: "scalar", T: 5  },
            { no: 3, name: "deleted_row_count", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "total_span_count", kind: "scalar", T: 3 , L: 0  },
            { no: 6, name: "processed_span_count", kind: "scalar", T: 3 , L: 0  },
            { no: 5, name: "processor_concurrency", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<RowLevelTTLProcessorProgress>): RowLevelTTLProcessorProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.processorId = 0;
        message.sqlInstanceId = 0;
        message.deletedRowCount = 0n;
        message.totalSpanCount = 0n;
        message.processedSpanCount = 0n;
        message.processorConcurrency = 0n;
        if (value !== undefined)
            reflectionMergePartial<RowLevelTTLProcessorProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RowLevelTTLProcessorProgress): RowLevelTTLProcessorProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.processorId = reader.int32();
                    break;
                case  2:
                    message.sqlInstanceId = reader.int32();
                    break;
                case  3:
                    message.deletedRowCount = reader.int64().toBigInt();
                    break;
                case  4:
                    message.totalSpanCount = reader.int64().toBigInt();
                    break;
                case  6:
                    message.processedSpanCount = reader.int64().toBigInt();
                    break;
                case  5:
                    message.processorConcurrency = reader.int64().toBigInt();
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

export const RowLevelTTLProcessorProgress = /*#__PURE__*/ new RowLevelTTLProcessorProgress$Type();

class SchemaTelemetryDetails$Type extends MessageType<SchemaTelemetryDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaTelemetryDetails", []);
    }
    create(value?: PartialMessage<SchemaTelemetryDetails>): SchemaTelemetryDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SchemaTelemetryDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaTelemetryDetails): SchemaTelemetryDetails {
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

export const SchemaTelemetryDetails = /*#__PURE__*/ new SchemaTelemetryDetails$Type();

class SchemaTelemetryProgress$Type extends MessageType<SchemaTelemetryProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SchemaTelemetryProgress", []);
    }
    create(value?: PartialMessage<SchemaTelemetryProgress>): SchemaTelemetryProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SchemaTelemetryProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaTelemetryProgress): SchemaTelemetryProgress {
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

export const SchemaTelemetryProgress = /*#__PURE__*/ new SchemaTelemetryProgress$Type();

class PollJobsStatsDetails$Type extends MessageType<PollJobsStatsDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.PollJobsStatsDetails", []);
    }
    create(value?: PartialMessage<PollJobsStatsDetails>): PollJobsStatsDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PollJobsStatsDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PollJobsStatsDetails): PollJobsStatsDetails {
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

export const PollJobsStatsDetails = /*#__PURE__*/ new PollJobsStatsDetails$Type();

class PollJobsStatsProgress$Type extends MessageType<PollJobsStatsProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.PollJobsStatsProgress", []);
    }
    create(value?: PartialMessage<PollJobsStatsProgress>): PollJobsStatsProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PollJobsStatsProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PollJobsStatsProgress): PollJobsStatsProgress {
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

export const PollJobsStatsProgress = /*#__PURE__*/ new PollJobsStatsProgress$Type();

class AutoConfigRunnerDetails$Type extends MessageType<AutoConfigRunnerDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoConfigRunnerDetails", []);
    }
    create(value?: PartialMessage<AutoConfigRunnerDetails>): AutoConfigRunnerDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoConfigRunnerDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoConfigRunnerDetails): AutoConfigRunnerDetails {
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

export const AutoConfigRunnerDetails = /*#__PURE__*/ new AutoConfigRunnerDetails$Type();

class AutoConfigRunnerProgress$Type extends MessageType<AutoConfigRunnerProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoConfigRunnerProgress", []);
    }
    create(value?: PartialMessage<AutoConfigRunnerProgress>): AutoConfigRunnerProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoConfigRunnerProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoConfigRunnerProgress): AutoConfigRunnerProgress {
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

export const AutoConfigRunnerProgress = /*#__PURE__*/ new AutoConfigRunnerProgress$Type();

class AutoConfigEnvRunnerDetails$Type extends MessageType<AutoConfigEnvRunnerDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoConfigEnvRunnerDetails", []);
    }
    create(value?: PartialMessage<AutoConfigEnvRunnerDetails>): AutoConfigEnvRunnerDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoConfigEnvRunnerDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoConfigEnvRunnerDetails): AutoConfigEnvRunnerDetails {
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

export const AutoConfigEnvRunnerDetails = /*#__PURE__*/ new AutoConfigEnvRunnerDetails$Type();

class AutoConfigEnvRunnerProgress$Type extends MessageType<AutoConfigEnvRunnerProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoConfigEnvRunnerProgress", []);
    }
    create(value?: PartialMessage<AutoConfigEnvRunnerProgress>): AutoConfigEnvRunnerProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoConfigEnvRunnerProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoConfigEnvRunnerProgress): AutoConfigEnvRunnerProgress {
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

export const AutoConfigEnvRunnerProgress = /*#__PURE__*/ new AutoConfigEnvRunnerProgress$Type();

class AutoConfigTaskDetails$Type extends MessageType<AutoConfigTaskDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoConfigTaskDetails", []);
    }
    create(value?: PartialMessage<AutoConfigTaskDetails>): AutoConfigTaskDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoConfigTaskDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoConfigTaskDetails): AutoConfigTaskDetails {
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

export const AutoConfigTaskDetails = /*#__PURE__*/ new AutoConfigTaskDetails$Type();

class AutoConfigTaskProgress$Type extends MessageType<AutoConfigTaskProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoConfigTaskProgress", []);
    }
    create(value?: PartialMessage<AutoConfigTaskProgress>): AutoConfigTaskProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoConfigTaskProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoConfigTaskProgress): AutoConfigTaskProgress {
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

export const AutoConfigTaskProgress = /*#__PURE__*/ new AutoConfigTaskProgress$Type();

class AutoUpdateSQLActivityDetails$Type extends MessageType<AutoUpdateSQLActivityDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoUpdateSQLActivityDetails", []);
    }
    create(value?: PartialMessage<AutoUpdateSQLActivityDetails>): AutoUpdateSQLActivityDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoUpdateSQLActivityDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoUpdateSQLActivityDetails): AutoUpdateSQLActivityDetails {
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

export const AutoUpdateSQLActivityDetails = /*#__PURE__*/ new AutoUpdateSQLActivityDetails$Type();

class AutoUpdateSQLActivityProgress$Type extends MessageType<AutoUpdateSQLActivityProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.AutoUpdateSQLActivityProgress", []);
    }
    create(value?: PartialMessage<AutoUpdateSQLActivityProgress>): AutoUpdateSQLActivityProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoUpdateSQLActivityProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoUpdateSQLActivityProgress): AutoUpdateSQLActivityProgress {
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

export const AutoUpdateSQLActivityProgress = /*#__PURE__*/ new AutoUpdateSQLActivityProgress$Type();

class MVCCStatisticsJobDetails$Type extends MessageType<MVCCStatisticsJobDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.MVCCStatisticsJobDetails", []);
    }
    create(value?: PartialMessage<MVCCStatisticsJobDetails>): MVCCStatisticsJobDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MVCCStatisticsJobDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCStatisticsJobDetails): MVCCStatisticsJobDetails {
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

export const MVCCStatisticsJobDetails = /*#__PURE__*/ new MVCCStatisticsJobDetails$Type();

class MVCCStatisticsJobProgress$Type extends MessageType<MVCCStatisticsJobProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.MVCCStatisticsJobProgress", []);
    }
    create(value?: PartialMessage<MVCCStatisticsJobProgress>): MVCCStatisticsJobProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MVCCStatisticsJobProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MVCCStatisticsJobProgress): MVCCStatisticsJobProgress {
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

export const MVCCStatisticsJobProgress = /*#__PURE__*/ new MVCCStatisticsJobProgress$Type();

class StandbyReadTSPollerDetails$Type extends MessageType<StandbyReadTSPollerDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.StandbyReadTSPollerDetails", []);
    }
    create(value?: PartialMessage<StandbyReadTSPollerDetails>): StandbyReadTSPollerDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<StandbyReadTSPollerDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StandbyReadTSPollerDetails): StandbyReadTSPollerDetails {
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

export const StandbyReadTSPollerDetails = /*#__PURE__*/ new StandbyReadTSPollerDetails$Type();

class StandbyReadTSPollerProgress$Type extends MessageType<StandbyReadTSPollerProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.StandbyReadTSPollerProgress", []);
    }
    create(value?: PartialMessage<StandbyReadTSPollerProgress>): StandbyReadTSPollerProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<StandbyReadTSPollerProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StandbyReadTSPollerProgress): StandbyReadTSPollerProgress {
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

export const StandbyReadTSPollerProgress = /*#__PURE__*/ new StandbyReadTSPollerProgress$Type();

class HotRangesLoggerDetails$Type extends MessageType<HotRangesLoggerDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.HotRangesLoggerDetails", []);
    }
    create(value?: PartialMessage<HotRangesLoggerDetails>): HotRangesLoggerDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<HotRangesLoggerDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: HotRangesLoggerDetails): HotRangesLoggerDetails {
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

export const HotRangesLoggerDetails = /*#__PURE__*/ new HotRangesLoggerDetails$Type();

class InspectDetails$Type extends MessageType<InspectDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.InspectDetails", [
            { no: 1, name: "checks", kind: "message", repeat: 2 , T: () => InspectDetails_Check },
            { no: 2, name: "as_of", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<InspectDetails>): InspectDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.checks = [];
        if (value !== undefined)
            reflectionMergePartial<InspectDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InspectDetails): InspectDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.checks.push(InspectDetails_Check.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.asOf = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.asOf);
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

export const InspectDetails = /*#__PURE__*/ new InspectDetails$Type();

class InspectDetails_Check$Type extends MessageType<InspectDetails_Check> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.InspectDetails.Check", [
            { no: 1, name: "type", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.InspectDetails.Check.InspectCheckType", InspectDetails_Check_InspectCheckType] },
            { no: 2, name: "table_id", kind: "scalar", T: 13  },
            { no: 3, name: "index_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<InspectDetails_Check>): InspectDetails_Check {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.type = 0;
        message.tableId = 0;
        message.indexId = 0;
        if (value !== undefined)
            reflectionMergePartial<InspectDetails_Check>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InspectDetails_Check): InspectDetails_Check {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.type = reader.int32();
                    break;
                case  2:
                    message.tableId = reader.uint32();
                    break;
                case  3:
                    message.indexId = reader.uint32();
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

export const InspectDetails_Check = /*#__PURE__*/ new InspectDetails_Check$Type();

class UpdateTableMetadataCacheDetails$Type extends MessageType<UpdateTableMetadataCacheDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.UpdateTableMetadataCacheDetails", []);
    }
    create(value?: PartialMessage<UpdateTableMetadataCacheDetails>): UpdateTableMetadataCacheDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<UpdateTableMetadataCacheDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateTableMetadataCacheDetails): UpdateTableMetadataCacheDetails {
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

export const UpdateTableMetadataCacheDetails = /*#__PURE__*/ new UpdateTableMetadataCacheDetails$Type();

class UpdateTableMetadataCacheProgress$Type extends MessageType<UpdateTableMetadataCacheProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.UpdateTableMetadataCacheProgress", [
            { no: 1, name: "last_start_time", kind: "message", T: () => Timestamp$ },
            { no: 2, name: "last_completed_time", kind: "message", T: () => Timestamp$ },
            { no: 3, name: "status", kind: "enum", T: () => ["cockroach.sql.jobs.jobspb.UpdateTableMetadataCacheProgress.Status", UpdateTableMetadataCacheProgress_Status] }
        ]);
    }
    create(value?: PartialMessage<UpdateTableMetadataCacheProgress>): UpdateTableMetadataCacheProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.status = 0;
        if (value !== undefined)
            reflectionMergePartial<UpdateTableMetadataCacheProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateTableMetadataCacheProgress): UpdateTableMetadataCacheProgress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.lastStartTime = Timestamp$.internalBinaryRead(reader, reader.uint32(), options, message.lastStartTime);
                    break;
                case  2:
                    message.lastCompletedTime = Timestamp$.internalBinaryRead(reader, reader.uint32(), options, message.lastCompletedTime);
                    break;
                case  3:
                    message.status = reader.int32();
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

export const UpdateTableMetadataCacheProgress = /*#__PURE__*/ new UpdateTableMetadataCacheProgress$Type();

class ImportRollbackDetails$Type extends MessageType<ImportRollbackDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ImportRollbackDetails", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<ImportRollbackDetails>): ImportRollbackDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        if (value !== undefined)
            reflectionMergePartial<ImportRollbackDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ImportRollbackDetails): ImportRollbackDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
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

export const ImportRollbackDetails = /*#__PURE__*/ new ImportRollbackDetails$Type();

class SqlActivityFlushDetails$Type extends MessageType<SqlActivityFlushDetails> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SqlActivityFlushDetails", []);
    }
    create(value?: PartialMessage<SqlActivityFlushDetails>): SqlActivityFlushDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SqlActivityFlushDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SqlActivityFlushDetails): SqlActivityFlushDetails {
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

export const SqlActivityFlushDetails = /*#__PURE__*/ new SqlActivityFlushDetails$Type();

class SqlActivityFlushProgress$Type extends MessageType<SqlActivityFlushProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.SqlActivityFlushProgress", []);
    }
    create(value?: PartialMessage<SqlActivityFlushProgress>): SqlActivityFlushProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SqlActivityFlushProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SqlActivityFlushProgress): SqlActivityFlushProgress {
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

export const SqlActivityFlushProgress = /*#__PURE__*/ new SqlActivityFlushProgress$Type();

class HotRangesLoggerProgress$Type extends MessageType<HotRangesLoggerProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.HotRangesLoggerProgress", []);
    }
    create(value?: PartialMessage<HotRangesLoggerProgress>): HotRangesLoggerProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<HotRangesLoggerProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: HotRangesLoggerProgress): HotRangesLoggerProgress {
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

export const HotRangesLoggerProgress = /*#__PURE__*/ new HotRangesLoggerProgress$Type();

class InspectProgress$Type extends MessageType<InspectProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.InspectProgress", []);
    }
    create(value?: PartialMessage<InspectProgress>): InspectProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<InspectProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InspectProgress): InspectProgress {
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

export const InspectProgress = /*#__PURE__*/ new InspectProgress$Type();

class ImportRollbackProgress$Type extends MessageType<ImportRollbackProgress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.ImportRollbackProgress", []);
    }
    create(value?: PartialMessage<ImportRollbackProgress>): ImportRollbackProgress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ImportRollbackProgress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ImportRollbackProgress): ImportRollbackProgress {
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

export const ImportRollbackProgress = /*#__PURE__*/ new ImportRollbackProgress$Type();

class Payload$Type extends MessageType<Payload> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.Payload", [
            { no: 1, name: "description", kind: "scalar", T: 9  },
            { no: 16, name: "statement", kind: "scalar", repeat: 2 , T: 9  },
            { no: 2, name: "username_proto", kind: "scalar", T: 9  },
            { no: 3, name: "started_micros", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "finished_micros", kind: "scalar", T: 3 , L: 0  },
            { no: 6, name: "descriptor_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 8, name: "error", kind: "scalar", T: 9  },
            { no: 17, name: "resume_errors", kind: "message", repeat: 2 , T: () => EncodedError },
            { no: 18, name: "cleanup_errors", kind: "message", repeat: 2 , T: () => EncodedError },
            { no: 19, name: "final_resume_error", kind: "message", T: () => EncodedError },
            { no: 20, name: "noncancelable", kind: "scalar", T: 8  },
            { no: 10, name: "backup", kind: "message", oneof: "details", T: () => BackupDetails },
            { no: 11, name: "restore", kind: "message", oneof: "details", T: () => RestoreDetails },
            { no: 12, name: "schemaChange", kind: "message", oneof: "details", T: () => SchemaChangeDetails },
            { no: 13, name: "import", kind: "message", oneof: "details", T: () => ImportDetails },
            { no: 14, name: "changefeed", kind: "message", oneof: "details", T: () => ChangefeedDetails },
            { no: 15, name: "createStats", kind: "message", oneof: "details", T: () => CreateStatsDetails },
            { no: 21, name: "schemaChangeGC", kind: "message", oneof: "details", T: () => SchemaChangeGCDetails },
            { no: 22, name: "typeSchemaChange", kind: "message", oneof: "details", T: () => TypeSchemaChangeDetails },
            { no: 23, name: "streamIngestion", kind: "message", oneof: "details", T: () => StreamIngestionDetails },
            { no: 24, name: "newSchemaChange", kind: "message", oneof: "details", T: () => NewSchemaChangeDetails },
            { no: 25, name: "migration", kind: "message", oneof: "details", T: () => MigrationDetails },
            { no: 27, name: "autoSpanConfigReconciliation", kind: "message", oneof: "details", T: () => AutoSpanConfigReconciliationDetails },
            { no: 30, name: "autoSQLStatsCompaction", kind: "message", oneof: "details", T: () => AutoSQLStatsCompactionDetails },
            { no: 33, name: "streamReplication", kind: "message", oneof: "details", T: () => StreamReplicationDetails },
            { no: 34, name: "row_level_ttl", kind: "message", oneof: "details", T: () => RowLevelTTLDetails },
            { no: 37, name: "schema_telemetry", kind: "message", oneof: "details", T: () => SchemaTelemetryDetails },
            { no: 38, name: "keyVisualizerDetails", kind: "message", oneof: "details", T: () => KeyVisualizerDetails },
            { no: 39, name: "poll_jobs_stats", kind: "message", oneof: "details", T: () => PollJobsStatsDetails },
            { no: 41, name: "auto_config_runner", kind: "message", oneof: "details", T: () => AutoConfigRunnerDetails },
            { no: 42, name: "auto_config_env_runner", kind: "message", oneof: "details", T: () => AutoConfigEnvRunnerDetails },
            { no: 43, name: "auto_config_task", kind: "message", oneof: "details", T: () => AutoConfigTaskDetails },
            { no: 44, name: "auto_update_sql_activities", kind: "message", oneof: "details", T: () => AutoUpdateSQLActivityDetails },
            { no: 45, name: "mvcc_statistics_details", kind: "message", oneof: "details", T: () => MVCCStatisticsJobDetails },
            { no: 46, name: "import_rollback_details", kind: "message", oneof: "details", T: () => ImportRollbackDetails },
            { no: 47, name: "history_retention_details", kind: "message", oneof: "details", T: () => HistoryRetentionDetails },
            { no: 48, name: "logical_replication_details", kind: "message", oneof: "details", T: () => LogicalReplicationDetails },
            { no: 49, name: "update_table_metadata_cache_details", kind: "message", oneof: "details", T: () => UpdateTableMetadataCacheDetails },
            { no: 50, name: "standby_read_ts_poller_details", kind: "message", oneof: "details", T: () => StandbyReadTSPollerDetails },
            { no: 51, name: "sql_activity_flush_details", kind: "message", oneof: "details", T: () => SqlActivityFlushDetails },
            { no: 52, name: "hot_ranges_logger_details", kind: "message", oneof: "details", T: () => HotRangesLoggerDetails },
            { no: 53, name: "inspect_details", kind: "message", oneof: "details", T: () => InspectDetails },
            { no: 28, name: "pause_reason", kind: "scalar", T: 9  },
            { no: 35, name: "creation_cluster_id", kind: "scalar", T: 12  },
            { no: 36, name: "creation_cluster_version", kind: "message", T: () => Version },
            { no: 40, name: "maximum_pts_age", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<Payload>): Payload {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.description = "";
        message.statement = [];
        message.usernameProto = "";
        message.startedMicros = 0n;
        message.finishedMicros = 0n;
        message.descriptorIds = [];
        message.error = "";
        message.resumeErrors = [];
        message.cleanupErrors = [];
        message.noncancelable = false;
        message.details = { oneofKind: undefined };
        message.pauseReason = "";
        message.creationClusterId = new Uint8Array(0);
        message.maximumPtsAge = 0n;
        if (value !== undefined)
            reflectionMergePartial<Payload>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Payload): Payload {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.description = reader.string();
                    break;
                case  16:
                    message.statement.push(reader.string());
                    break;
                case  2:
                    message.usernameProto = reader.string();
                    break;
                case  3:
                    message.startedMicros = reader.int64().toBigInt();
                    break;
                case  4:
                    message.finishedMicros = reader.int64().toBigInt();
                    break;
                case  6:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.descriptorIds.push(reader.uint32());
                    else
                        message.descriptorIds.push(reader.uint32());
                    break;
                case  8:
                    message.error = reader.string();
                    break;
                case  17:
                    message.resumeErrors.push(EncodedError.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  18:
                    message.cleanupErrors.push(EncodedError.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  19:
                    message.finalResumeError = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.finalResumeError);
                    break;
                case  20:
                    message.noncancelable = reader.bool();
                    break;
                case  10:
                    message.details = {
                        oneofKind: "backup",
                        backup: BackupDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).backup)
                    };
                    break;
                case  11:
                    message.details = {
                        oneofKind: "restore",
                        restore: RestoreDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).restore)
                    };
                    break;
                case  12:
                    message.details = {
                        oneofKind: "schemaChange",
                        schemaChange: SchemaChangeDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).schemaChange)
                    };
                    break;
                case  13:
                    message.details = {
                        oneofKind: "import",
                        import: ImportDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).import)
                    };
                    break;
                case  14:
                    message.details = {
                        oneofKind: "changefeed",
                        changefeed: ChangefeedDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).changefeed)
                    };
                    break;
                case  15:
                    message.details = {
                        oneofKind: "createStats",
                        createStats: CreateStatsDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).createStats)
                    };
                    break;
                case  21:
                    message.details = {
                        oneofKind: "schemaChangeGC",
                        schemaChangeGC: SchemaChangeGCDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).schemaChangeGC)
                    };
                    break;
                case  22:
                    message.details = {
                        oneofKind: "typeSchemaChange",
                        typeSchemaChange: TypeSchemaChangeDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).typeSchemaChange)
                    };
                    break;
                case  23:
                    message.details = {
                        oneofKind: "streamIngestion",
                        streamIngestion: StreamIngestionDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).streamIngestion)
                    };
                    break;
                case  24:
                    message.details = {
                        oneofKind: "newSchemaChange",
                        newSchemaChange: NewSchemaChangeDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).newSchemaChange)
                    };
                    break;
                case  25:
                    message.details = {
                        oneofKind: "migration",
                        migration: MigrationDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).migration)
                    };
                    break;
                case  27:
                    message.details = {
                        oneofKind: "autoSpanConfigReconciliation",
                        autoSpanConfigReconciliation: AutoSpanConfigReconciliationDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoSpanConfigReconciliation)
                    };
                    break;
                case  30:
                    message.details = {
                        oneofKind: "autoSQLStatsCompaction",
                        autoSQLStatsCompaction: AutoSQLStatsCompactionDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoSQLStatsCompaction)
                    };
                    break;
                case  33:
                    message.details = {
                        oneofKind: "streamReplication",
                        streamReplication: StreamReplicationDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).streamReplication)
                    };
                    break;
                case  34:
                    message.details = {
                        oneofKind: "rowLevelTtl",
                        rowLevelTtl: RowLevelTTLDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).rowLevelTtl)
                    };
                    break;
                case  37:
                    message.details = {
                        oneofKind: "schemaTelemetry",
                        schemaTelemetry: SchemaTelemetryDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).schemaTelemetry)
                    };
                    break;
                case  38:
                    message.details = {
                        oneofKind: "keyVisualizerDetails",
                        keyVisualizerDetails: KeyVisualizerDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).keyVisualizerDetails)
                    };
                    break;
                case  39:
                    message.details = {
                        oneofKind: "pollJobsStats",
                        pollJobsStats: PollJobsStatsDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).pollJobsStats)
                    };
                    break;
                case  41:
                    message.details = {
                        oneofKind: "autoConfigRunner",
                        autoConfigRunner: AutoConfigRunnerDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoConfigRunner)
                    };
                    break;
                case  42:
                    message.details = {
                        oneofKind: "autoConfigEnvRunner",
                        autoConfigEnvRunner: AutoConfigEnvRunnerDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoConfigEnvRunner)
                    };
                    break;
                case  43:
                    message.details = {
                        oneofKind: "autoConfigTask",
                        autoConfigTask: AutoConfigTaskDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoConfigTask)
                    };
                    break;
                case  44:
                    message.details = {
                        oneofKind: "autoUpdateSqlActivities",
                        autoUpdateSqlActivities: AutoUpdateSQLActivityDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoUpdateSqlActivities)
                    };
                    break;
                case  45:
                    message.details = {
                        oneofKind: "mvccStatisticsDetails",
                        mvccStatisticsDetails: MVCCStatisticsJobDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).mvccStatisticsDetails)
                    };
                    break;
                case  46:
                    message.details = {
                        oneofKind: "importRollbackDetails",
                        importRollbackDetails: ImportRollbackDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).importRollbackDetails)
                    };
                    break;
                case  47:
                    message.details = {
                        oneofKind: "historyRetentionDetails",
                        historyRetentionDetails: HistoryRetentionDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).historyRetentionDetails)
                    };
                    break;
                case  48:
                    message.details = {
                        oneofKind: "logicalReplicationDetails",
                        logicalReplicationDetails: LogicalReplicationDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).logicalReplicationDetails)
                    };
                    break;
                case  49:
                    message.details = {
                        oneofKind: "updateTableMetadataCacheDetails",
                        updateTableMetadataCacheDetails: UpdateTableMetadataCacheDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).updateTableMetadataCacheDetails)
                    };
                    break;
                case  50:
                    message.details = {
                        oneofKind: "standbyReadTsPollerDetails",
                        standbyReadTsPollerDetails: StandbyReadTSPollerDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).standbyReadTsPollerDetails)
                    };
                    break;
                case  51:
                    message.details = {
                        oneofKind: "sqlActivityFlushDetails",
                        sqlActivityFlushDetails: SqlActivityFlushDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).sqlActivityFlushDetails)
                    };
                    break;
                case  52:
                    message.details = {
                        oneofKind: "hotRangesLoggerDetails",
                        hotRangesLoggerDetails: HotRangesLoggerDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).hotRangesLoggerDetails)
                    };
                    break;
                case  53:
                    message.details = {
                        oneofKind: "inspectDetails",
                        inspectDetails: InspectDetails.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).inspectDetails)
                    };
                    break;
                case  28:
                    message.pauseReason = reader.string();
                    break;
                case  35:
                    message.creationClusterId = reader.bytes();
                    break;
                case  36:
                    message.creationClusterVersion = Version.internalBinaryRead(reader, reader.uint32(), options, message.creationClusterVersion);
                    break;
                case  40:
                    message.maximumPtsAge = reader.int64().toBigInt();
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

export const Payload = /*#__PURE__*/ new Payload$Type();

class Progress$Type extends MessageType<Progress> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.Progress", [
            { no: 1, name: "fraction_completed", kind: "scalar", oneof: "progress", T: 2  },
            { no: 3, name: "high_water", kind: "message", oneof: "progress", T: () => Timestamp },
            { no: 2, name: "modified_micros", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "status_message", kind: "scalar", T: 9  },
            { no: 10, name: "backup", kind: "message", oneof: "details", T: () => BackupProgress },
            { no: 11, name: "restore", kind: "message", oneof: "details", T: () => RestoreProgress },
            { no: 12, name: "schemaChange", kind: "message", oneof: "details", T: () => SchemaChangeProgress },
            { no: 13, name: "import", kind: "message", oneof: "details", T: () => ImportProgress },
            { no: 14, name: "changefeed", kind: "message", oneof: "details", T: () => ChangefeedProgress },
            { no: 15, name: "createStats", kind: "message", oneof: "details", T: () => CreateStatsProgress },
            { no: 16, name: "schemaChangeGC", kind: "message", oneof: "details", T: () => SchemaChangeGCProgress },
            { no: 17, name: "typeSchemaChange", kind: "message", oneof: "details", T: () => TypeSchemaChangeProgress },
            { no: 18, name: "streamIngest", kind: "message", oneof: "details", T: () => StreamIngestionProgress },
            { no: 19, name: "newSchemaChange", kind: "message", oneof: "details", T: () => NewSchemaChangeProgress },
            { no: 20, name: "migration", kind: "message", oneof: "details", T: () => MigrationProgress },
            { no: 22, name: "AutoSpanConfigReconciliation", kind: "message", jsonName: "AutoSpanConfigReconciliation", oneof: "details", T: () => AutoSpanConfigReconciliationProgress },
            { no: 23, name: "autoSQLStatsCompaction", kind: "message", oneof: "details", T: () => AutoSQLStatsCompactionProgress },
            { no: 24, name: "streamReplication", kind: "message", oneof: "details", T: () => StreamReplicationProgress },
            { no: 25, name: "row_level_ttl", kind: "message", oneof: "details", T: () => RowLevelTTLProgress },
            { no: 26, name: "schema_telemetry", kind: "message", oneof: "details", T: () => SchemaTelemetryProgress },
            { no: 27, name: "keyVisualizerProgress", kind: "message", oneof: "details", T: () => KeyVisualizerProgress },
            { no: 28, name: "pollJobsStats", kind: "message", oneof: "details", T: () => PollJobsStatsProgress },
            { no: 29, name: "auto_config_runner", kind: "message", oneof: "details", T: () => AutoConfigRunnerProgress },
            { no: 30, name: "auto_config_env_runner", kind: "message", oneof: "details", T: () => AutoConfigEnvRunnerProgress },
            { no: 31, name: "auto_config_task", kind: "message", oneof: "details", T: () => AutoConfigTaskProgress },
            { no: 32, name: "update_sql_activity", kind: "message", oneof: "details", T: () => AutoUpdateSQLActivityProgress },
            { no: 33, name: "mvcc_statistics_progress", kind: "message", oneof: "details", T: () => MVCCStatisticsJobProgress },
            { no: 34, name: "import_rollback_progress", kind: "message", oneof: "details", T: () => ImportRollbackProgress },
            { no: 35, name: "HistoryRetentionProgress", kind: "message", jsonName: "HistoryRetentionProgress", oneof: "details", T: () => HistoryRetentionProgress },
            { no: 36, name: "LogicalReplication", kind: "message", jsonName: "LogicalReplication", oneof: "details", T: () => LogicalReplicationProgress },
            { no: 37, name: "table_metadata_cache", kind: "message", oneof: "details", T: () => UpdateTableMetadataCacheProgress },
            { no: 38, name: "standby_read_ts_poller", kind: "message", oneof: "details", T: () => StandbyReadTSPollerProgress },
            { no: 39, name: "sql_activity_flush", kind: "message", oneof: "details", T: () => SqlActivityFlushProgress },
            { no: 40, name: "hot_ranges_logger", kind: "message", oneof: "details", T: () => HotRangesLoggerProgress },
            { no: 41, name: "inspect", kind: "message", oneof: "details", T: () => InspectProgress },
            { no: 21, name: "trace_id", kind: "scalar", T: 4 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<Progress>): Progress {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.progress = { oneofKind: undefined };
        message.modifiedMicros = 0n;
        message.statusMessage = "";
        message.details = { oneofKind: undefined };
        message.traceId = 0n;
        if (value !== undefined)
            reflectionMergePartial<Progress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Progress): Progress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.progress = {
                        oneofKind: "fractionCompleted",
                        fractionCompleted: reader.float()
                    };
                    break;
                case  3:
                    message.progress = {
                        oneofKind: "highWater",
                        highWater: Timestamp.internalBinaryRead(reader, reader.uint32(), options, (message.progress as any).highWater)
                    };
                    break;
                case  2:
                    message.modifiedMicros = reader.int64().toBigInt();
                    break;
                case  4:
                    message.statusMessage = reader.string();
                    break;
                case  10:
                    message.details = {
                        oneofKind: "backup",
                        backup: BackupProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).backup)
                    };
                    break;
                case  11:
                    message.details = {
                        oneofKind: "restore",
                        restore: RestoreProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).restore)
                    };
                    break;
                case  12:
                    message.details = {
                        oneofKind: "schemaChange",
                        schemaChange: SchemaChangeProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).schemaChange)
                    };
                    break;
                case  13:
                    message.details = {
                        oneofKind: "import",
                        import: ImportProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).import)
                    };
                    break;
                case  14:
                    message.details = {
                        oneofKind: "changefeed",
                        changefeed: ChangefeedProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).changefeed)
                    };
                    break;
                case  15:
                    message.details = {
                        oneofKind: "createStats",
                        createStats: CreateStatsProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).createStats)
                    };
                    break;
                case  16:
                    message.details = {
                        oneofKind: "schemaChangeGC",
                        schemaChangeGC: SchemaChangeGCProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).schemaChangeGC)
                    };
                    break;
                case  17:
                    message.details = {
                        oneofKind: "typeSchemaChange",
                        typeSchemaChange: TypeSchemaChangeProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).typeSchemaChange)
                    };
                    break;
                case  18:
                    message.details = {
                        oneofKind: "streamIngest",
                        streamIngest: StreamIngestionProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).streamIngest)
                    };
                    break;
                case  19:
                    message.details = {
                        oneofKind: "newSchemaChange",
                        newSchemaChange: NewSchemaChangeProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).newSchemaChange)
                    };
                    break;
                case  20:
                    message.details = {
                        oneofKind: "migration",
                        migration: MigrationProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).migration)
                    };
                    break;
                case  22:
                    message.details = {
                        oneofKind: "autoSpanConfigReconciliation",
                        autoSpanConfigReconciliation: AutoSpanConfigReconciliationProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoSpanConfigReconciliation)
                    };
                    break;
                case  23:
                    message.details = {
                        oneofKind: "autoSQLStatsCompaction",
                        autoSQLStatsCompaction: AutoSQLStatsCompactionProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoSQLStatsCompaction)
                    };
                    break;
                case  24:
                    message.details = {
                        oneofKind: "streamReplication",
                        streamReplication: StreamReplicationProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).streamReplication)
                    };
                    break;
                case  25:
                    message.details = {
                        oneofKind: "rowLevelTtl",
                        rowLevelTtl: RowLevelTTLProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).rowLevelTtl)
                    };
                    break;
                case  26:
                    message.details = {
                        oneofKind: "schemaTelemetry",
                        schemaTelemetry: SchemaTelemetryProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).schemaTelemetry)
                    };
                    break;
                case  27:
                    message.details = {
                        oneofKind: "keyVisualizerProgress",
                        keyVisualizerProgress: KeyVisualizerProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).keyVisualizerProgress)
                    };
                    break;
                case  28:
                    message.details = {
                        oneofKind: "pollJobsStats",
                        pollJobsStats: PollJobsStatsProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).pollJobsStats)
                    };
                    break;
                case  29:
                    message.details = {
                        oneofKind: "autoConfigRunner",
                        autoConfigRunner: AutoConfigRunnerProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoConfigRunner)
                    };
                    break;
                case  30:
                    message.details = {
                        oneofKind: "autoConfigEnvRunner",
                        autoConfigEnvRunner: AutoConfigEnvRunnerProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoConfigEnvRunner)
                    };
                    break;
                case  31:
                    message.details = {
                        oneofKind: "autoConfigTask",
                        autoConfigTask: AutoConfigTaskProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).autoConfigTask)
                    };
                    break;
                case  32:
                    message.details = {
                        oneofKind: "updateSqlActivity",
                        updateSqlActivity: AutoUpdateSQLActivityProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).updateSqlActivity)
                    };
                    break;
                case  33:
                    message.details = {
                        oneofKind: "mvccStatisticsProgress",
                        mvccStatisticsProgress: MVCCStatisticsJobProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).mvccStatisticsProgress)
                    };
                    break;
                case  34:
                    message.details = {
                        oneofKind: "importRollbackProgress",
                        importRollbackProgress: ImportRollbackProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).importRollbackProgress)
                    };
                    break;
                case  35:
                    message.details = {
                        oneofKind: "historyRetentionProgress",
                        historyRetentionProgress: HistoryRetentionProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).historyRetentionProgress)
                    };
                    break;
                case  36:
                    message.details = {
                        oneofKind: "logicalReplication",
                        logicalReplication: LogicalReplicationProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).logicalReplication)
                    };
                    break;
                case  37:
                    message.details = {
                        oneofKind: "tableMetadataCache",
                        tableMetadataCache: UpdateTableMetadataCacheProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).tableMetadataCache)
                    };
                    break;
                case  38:
                    message.details = {
                        oneofKind: "standbyReadTsPoller",
                        standbyReadTsPoller: StandbyReadTSPollerProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).standbyReadTsPoller)
                    };
                    break;
                case  39:
                    message.details = {
                        oneofKind: "sqlActivityFlush",
                        sqlActivityFlush: SqlActivityFlushProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).sqlActivityFlush)
                    };
                    break;
                case  40:
                    message.details = {
                        oneofKind: "hotRangesLogger",
                        hotRangesLogger: HotRangesLoggerProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).hotRangesLogger)
                    };
                    break;
                case  41:
                    message.details = {
                        oneofKind: "inspect",
                        inspect: InspectProgress.internalBinaryRead(reader, reader.uint32(), options, (message.details as any).inspect)
                    };
                    break;
                case  21:
                    message.traceId = reader.uint64().toBigInt();
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

export const Progress = /*#__PURE__*/ new Progress$Type();

class Job$Type extends MessageType<Job> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.Job", [
            { no: 1, name: "id", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "progress", kind: "message", T: () => Progress },
            { no: 3, name: "payload", kind: "message", T: () => Payload }
        ]);
    }
    create(value?: PartialMessage<Job>): Job {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0n;
        if (value !== undefined)
            reflectionMergePartial<Job>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Job): Job {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.int64().toBigInt();
                    break;
                case  2:
                    message.progress = Progress.internalBinaryRead(reader, reader.uint32(), options, message.progress);
                    break;
                case  3:
                    message.payload = Payload.internalBinaryRead(reader, reader.uint32(), options, message.payload);
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

export const Job = /*#__PURE__*/ new Job$Type();

class RetriableExecutionFailure$Type extends MessageType<RetriableExecutionFailure> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.RetriableExecutionFailure", [
            { no: 1, name: "status", kind: "scalar", T: 9  },
            { no: 2, name: "execution_start_micros", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "execution_end_micros", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "instance_id", kind: "scalar", T: 5  },
            { no: 5, name: "error", kind: "message", T: () => EncodedError },
            { no: 6, name: "truncated_error", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<RetriableExecutionFailure>): RetriableExecutionFailure {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.status = "";
        message.executionStartMicros = 0n;
        message.executionEndMicros = 0n;
        message.instanceId = 0;
        message.truncatedError = "";
        if (value !== undefined)
            reflectionMergePartial<RetriableExecutionFailure>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RetriableExecutionFailure): RetriableExecutionFailure {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.status = reader.string();
                    break;
                case  2:
                    message.executionStartMicros = reader.int64().toBigInt();
                    break;
                case  3:
                    message.executionEndMicros = reader.int64().toBigInt();
                    break;
                case  4:
                    message.instanceId = reader.int32();
                    break;
                case  5:
                    message.error = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.error);
                    break;
                case  6:
                    message.truncatedError = reader.string();
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

export const RetriableExecutionFailure = /*#__PURE__*/ new RetriableExecutionFailure$Type();

class TraceData$Type extends MessageType<TraceData> {
    constructor() {
        super("cockroach.sql.jobs.jobspb.TraceData", [
            { no: 1, name: "collected_spans", kind: "message", repeat: 2 , T: () => RecordedSpan }
        ]);
    }
    create(value?: PartialMessage<TraceData>): TraceData {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.collectedSpans = [];
        if (value !== undefined)
            reflectionMergePartial<TraceData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TraceData): TraceData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.collectedSpans.push(RecordedSpan.internalBinaryRead(reader, reader.uint32(), options));
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

export const TraceData = /*#__PURE__*/ new TraceData$Type();
