// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Function_Param_Class } from "../catpb/function";
import { Function_Security } from "../catpb/function";
import { Function_NullInputBehavior } from "../catpb/function";
import { Function_Volatility } from "../catpb/function";
import { Function_Language } from "../catpb/function";
import { ZoneConfig } from "../../../config/zonepb/zone";
import { Version } from "../../../roachpb/metadata";
import { DefaultPrivilegeDescriptor } from "../catpb/privilege";
import { TenantID } from "../../../roachpb/data";
import { AutoStatsSettings } from "../catpb/catalog";
import { DescriptorState as DescriptorState$ } from "../../schemachanger/scpb/scpb";
import { PrivilegeDescriptor } from "../catpb/privilege";
import { PolicyCommand } from "../catpb/enum";
import { PolicyType } from "../catpb/enum";
import { Timestamp } from "../../../util/hlc/timestamp";
import { RowLevelTTL } from "../catpb/catalog";
import { LocalityConfig } from "../catpb/catalog";
import { TriggerEventType } from "../../sem/semenumpb/trigger";
import { TriggerActionTime } from "../../sem/semenumpb/trigger";
import { Config as Config$ } from "../../vecindex/vecpb/vec";
import { Config } from "../../../geo/geopb/config";
import { ShardedDescriptor } from "../catpb/catalog";
import { T as T$ } from "../../sem/idxtype/idxtype";
import { PartitioningDescriptor } from "../catpb/catalog";
import { InvertedIndexColumnKind } from "../catpb/enum";
import { IndexColumn_Direction } from "../catenumpb/index";
import { SystemColumnKind } from "../catpb/enum";
import { GeneratedAsIdentityType } from "../catpb/catalog";
import { T } from "../../types/types";
import { Match } from "../../sem/semenumpb/constraint";
import { ForeignKeyAction } from "../../sem/semenumpb/constraint";

export interface ForeignKeyReference {

    table?: number;

    index?: number;

    name?: string;

    validity?: ConstraintValidity;

    sharedPrefixLen?: number;

    onDelete?: ForeignKeyAction;

    onUpdate?: ForeignKeyAction;

    match?: Match;
}

export interface ForeignKeyConstraint {

    originTableId?: number;

    originColumnIds: number[];

    referencedColumnIds: number[];

    referencedTableId?: number;

    name?: string;

    validity?: ConstraintValidity;

    onDelete?: ForeignKeyAction;

    onUpdate?: ForeignKeyAction;

    match?: Match;

    constraintId?: number;
}

export interface UniqueWithoutIndexConstraint {

    tableId?: number;

    columnIds: number[];

    name?: string;

    validity?: ConstraintValidity;

    predicate?: string;

    constraintId?: number;
}

export interface ColumnDescriptor {

    name?: string;

    id?: number;

    type?: T;

    nullable?: boolean;

    defaultExpr?: string;

    onUpdateExpr?: string;

    hidden?: boolean;

    inaccessible?: boolean;

    generatedAsIdentityType?: GeneratedAsIdentityType;

    generatedAsIdentitySequenceOption?: string;

    usesSequenceIds: number[];

    ownsSequenceIds: number[];

    usesFunctionIds: number[];

    computeExpr?: string;

    virtual?: boolean;

    pgAttributeNum?: number;

    alterColumnTypeInProgress?: boolean;

    systemColumnKind?: SystemColumnKind;
}

export interface ColumnFamilyDescriptor {

    name?: string;

    id?: number;

    columnNames: string[];

    columnIds: number[];

    defaultColumnId?: number;
}

export interface InterleaveDescriptor {

    ancestors: InterleaveDescriptor_Ancestor[];
}

export interface InterleaveDescriptor_Ancestor {

    tableId?: number;

    indexId?: number;

    sharedPrefixLen?: number;
}

export interface IndexDescriptor {

    name?: string;

    id?: number;

    unique?: boolean;

    version?: number;

    keyColumnNames: string[];

    keyColumnDirections: IndexColumn_Direction[];

    storeColumnNames: string[];

    invertedColumnKinds: InvertedIndexColumnKind[];

    keyColumnIds: number[];

    keySuffixColumnIds: number[];

    storeColumnIds: number[];

    compositeColumnIds: number[];

    foreignKey?: ForeignKeyReference;

    referencedBy: ForeignKeyReference[];

    interleave?: InterleaveDescriptor;

    interleavedBy: ForeignKeyReference[];

    partitioning?: PartitioningDescriptor;

    type?: T$;

    createdExplicitly?: boolean;

    encodingType?: number;

    sharded?: ShardedDescriptor;

    disabled?: boolean;

    geoConfig?: Config;

    predicate?: string;

    useDeletePreservingEncoding?: boolean;

    createdAtNanos?: bigint;

    constraintId?: number;

    notVisible?: boolean;

    invisibility?: number;

    vecConfig?: Config$;

    hideForPrimaryKeyRecreate?: boolean;
}

export interface TriggerDescriptor {

    id?: number;

    name?: string;

    actionTime?: TriggerActionTime;

    events: TriggerDescriptor_Event[];

    newTransitionAlias?: string;

    oldTransitionAlias?: string;

    forEachRow?: boolean;

    whenExpr?: string;

    funcId?: number;

    funcArgs: string[];

    funcBody?: string;

    enabled?: boolean;

    dependsOn: number[];

    dependsOnTypes: number[];

    dependsOnRoutines: number[];
}

export interface TriggerDescriptor_Event {

    type?: TriggerEventType;

    columnNames: string[];
}

export interface ConstraintToUpdate {

    constraintType: ConstraintToUpdate_ConstraintType;

    name: string;

    check?: TableDescriptor_CheckConstraint;

    foreignKey?: ForeignKeyConstraint;

    notNullColumn?: number;

    uniqueWithoutIndexConstraint?: UniqueWithoutIndexConstraint;
}

export enum ConstraintToUpdate_ConstraintType {

    CHECK = 0,

    FOREIGN_KEY = 1,

    NOT_NULL = 2,

    UNIQUE_WITHOUT_INDEX = 3
}

export interface PrimaryKeySwap {

    oldPrimaryIndexId?: number;

    newPrimaryIndexId?: number;

    oldIndexes: number[];

    newIndexes: number[];

    newPrimaryIndexName?: string;

    localityConfigSwap?: PrimaryKeySwap_LocalityConfigSwap;
}

export interface PrimaryKeySwap_LocalityConfigSwap {

    oldLocalityConfig?: LocalityConfig;

    newLocalityConfig?: LocalityConfig;

    newRegionalByRowColumnId?: number;

    newRegionalByRowColumnDefaultExpr?: string;
}

export interface ModifyRowLevelTTL {

    rowLevelTtl?: RowLevelTTL;
}

export interface ComputedColumnSwap {

    newColumnId?: number;

    oldColumnId?: number;

    inverseExpr?: string;
}

export interface MaterializedViewRefresh {

    newPrimaryIndex?: IndexDescriptor;

    newIndexes: IndexDescriptor[];

    asOf?: Timestamp;

    shouldBackfill?: boolean;
}

export interface PolicyDescriptor {

    id?: number;

    name?: string;

    type?: PolicyType;

    command?: PolicyCommand;

    roleNames: string[];

    usingExpr?: string;

    usingColumnIds: number[];

    withCheckExpr?: string;

    withCheckColumnIds: number[];

    dependsOnTypes: number[];

    dependsOnFunctions: number[];

    dependsOnRelations: number[];
}

export interface DescriptorMutation {

    descriptor: {
        oneofKind: "column";

        column: ColumnDescriptor;
    } | {
        oneofKind: "index";

        index: IndexDescriptor;
    } | {
        oneofKind: "constraint";

        constraint: ConstraintToUpdate;
    } | {
        oneofKind: "primaryKeySwap";

        primaryKeySwap: PrimaryKeySwap;
    } | {
        oneofKind: "computedColumnSwap";

        computedColumnSwap: ComputedColumnSwap;
    } | {
        oneofKind: "materializedViewRefresh";

        materializedViewRefresh: MaterializedViewRefresh;
    } | {
        oneofKind: "modifyRowLevelTtl";

        modifyRowLevelTtl: ModifyRowLevelTTL;
    } | {
        oneofKind: undefined;
    };

    state?: DescriptorMutation_State;

    direction?: DescriptorMutation_Direction;

    mutationId?: number;

    rollback?: boolean;
}

export enum DescriptorMutation_State {

    UNKNOWN = 0,

    DELETE_ONLY = 1,

    WRITE_ONLY = 2,

    BACKFILLING = 3,

    MERGING = 4
}

export enum DescriptorMutation_Direction {

    NONE = 0,

    ADD = 1,

    DROP = 2
}

export interface NameInfo {

    parentId?: number;

    parentSchemaId?: number;

    name?: string;
}

export interface TableDescriptor {

    name?: string;

    id?: number;

    version?: bigint;

    modificationTime?: Timestamp;

    parentId?: number;

    unexposedParentSchemaId?: number;

    columns: ColumnDescriptor[];

    nextColumnId?: number;

    families: ColumnFamilyDescriptor[];

    nextFamilyId?: number;

    primaryIndex?: IndexDescriptor;

    indexes: IndexDescriptor[];

    nextIndexId?: number;

    privileges?: PrivilegeDescriptor;

    mutations: DescriptorMutation[];

    nextMutationId?: number;

    formatVersion?: number;

    state?: DescriptorState;

    offlineReason?: string;

    checks: TableDescriptor_CheckConstraint[];

    viewQuery?: string;

    isMaterializedView?: boolean;

    refreshViewRequired?: boolean;

    dependsOn: number[];

    dependsOnTypes: number[];

    dependsOnFunctions: number[];

    dependedOnBy: TableDescriptor_Reference[];

    mutationJobs: TableDescriptor_MutationJob[];

    declarativeSchemaChangerState?: DescriptorState$;

    sequenceOpts?: TableDescriptor_SequenceOpts;

    dropTime?: bigint;

    replacementOf?: TableDescriptor_Replacement;

    auditMode?: TableDescriptor_AuditMode;

    dropJobId?: bigint;

    createQuery?: string;

    createAsOfTime?: Timestamp;

    outboundFks: ForeignKeyConstraint[];

    inboundFks: ForeignKeyConstraint[];

    uniqueWithoutIndexConstraints: UniqueWithoutIndexConstraint[];

    temporary?: boolean;

    localityConfig?: LocalityConfig;

    partitionAllBy?: boolean;

    rowLevelTtl?: RowLevelTTL;

    excludeDataFromBackup?: boolean;

    nextConstraintId?: number;

    autoStatsSettings?: AutoStatsSettings;

    forecastStats?: boolean;

    histogramSamples?: number;

    histogramBuckets?: number;

    importStartWallTime?: bigint;

    schemaLocked?: boolean;

    importEpoch?: number;

    importType?: ImportType;

    external?: ExternalRowData;

    ldrJobIds: bigint[];

    replicatedPcrVersion?: number;

    triggers: TriggerDescriptor[];

    nextTriggerId?: number;

    policies: PolicyDescriptor[];

    nextPolicyId?: number;

    rowLevelSecurityEnabled?: boolean;

    rowLevelSecurityForced?: boolean;

    rbrUsingConstraint?: number;
}

export interface TableDescriptor_CheckConstraint {

    expr?: string;

    name?: string;

    validity?: ConstraintValidity;

    columnIds: number[];

    isNonNullConstraint?: boolean;

    fromHashShardedColumn?: boolean;

    constraintId?: number;
}

export interface TableDescriptor_Reference {

    id?: number;

    indexId?: number;

    columnIds: number[];

    byId?: boolean;
}

export interface TableDescriptor_MutationJob {

    mutationId?: number;

    jobId?: bigint;
}

export interface TableDescriptor_SequenceOpts {

    increment?: bigint;

    minValue?: bigint;

    maxValue?: bigint;

    start?: bigint;

    virtual?: boolean;

    sequenceOwner?: TableDescriptor_SequenceOpts_SequenceOwner;

    sessionCacheSize?: bigint;

    asIntegerType?: string;

    nodeCacheSize?: bigint;
}

export interface TableDescriptor_SequenceOpts_SequenceOwner {

    ownerColumnId?: number;

    ownerTableId?: number;
}

export interface TableDescriptor_Replacement {

    id?: number;

    time?: Timestamp;
}

export enum TableDescriptor_AuditMode {

    DISABLED = 0,

    READWRITE = 1
}

export interface ExternalRowData {

    asOf?: Timestamp;

    tenantId?: TenantID;

    tableId?: number;
}

export interface DatabaseDescriptor {

    name?: string;

    id?: number;

    modificationTime?: Timestamp;

    version?: bigint;

    privileges?: PrivilegeDescriptor;

    schemas: {
        [key: string]: DatabaseDescriptor_SchemaInfo;
    };

    state?: DescriptorState;

    offlineReason?: string;

    regionConfig?: DatabaseDescriptor_RegionConfig;

    defaultPrivileges?: DefaultPrivilegeDescriptor;

    declarativeSchemaChangerState?: DescriptorState$;

    systemDatabaseSchemaVersion?: Version;

    replicatedPcrVersion?: number;
}

export interface DatabaseDescriptor_SchemaInfo {

    id?: number;
}

export interface DatabaseDescriptor_RegionConfig {

    survivalGoal?: SurvivalGoal;

    primaryRegion?: string;

    regionEnumId?: number;

    placement?: DataPlacement;

    secondaryRegion?: string;
}

export interface SuperRegion {

    superRegionName?: string;

    regions: string[];
}

export interface ZoneConfigExtensions {

    global?: ZoneConfig;

    regional?: ZoneConfig;

    regionalIn: {
        [key: string]: ZoneConfig;
    };
}

export interface TypeDescriptor {

    name?: string;

    id?: number;

    version?: bigint;

    modificationTime?: Timestamp;

    privileges?: PrivilegeDescriptor;

    parentId?: number;

    parentSchemaId?: number;

    arrayTypeId?: number;

    state?: DescriptorState;

    offlineReason?: string;

    kind?: TypeDescriptor_Kind;

    referencingDescriptorIds: number[];

    enumMembers: TypeDescriptor_EnumMember[];

    alias?: T;

    regionConfig?: TypeDescriptor_RegionConfig;

    declarativeSchemaChangerState?: DescriptorState$;

    composite?: TypeDescriptor_Composite;

    replicatedPcrVersion?: number;
}

export interface TypeDescriptor_EnumMember {

    physicalRepresentation?: Uint8Array;

    logicalRepresentation?: string;

    capability?: TypeDescriptor_EnumMember_Capability;

    direction?: TypeDescriptor_EnumMember_Direction;
}

export enum TypeDescriptor_EnumMember_Capability {

    ALL = 0,

    READ_ONLY = 1
}

export enum TypeDescriptor_EnumMember_Direction {

    NONE = 0,

    ADD = 1,

    REMOVE = 2
}

export interface TypeDescriptor_RegionConfig {

    primaryRegion?: string;

    superRegions: SuperRegion[];

    zoneConfigExtensions?: ZoneConfigExtensions;

    secondaryRegion?: string;
}

export interface TypeDescriptor_Composite {

    elements: TypeDescriptor_Composite_CompositeElement[];
}

export interface TypeDescriptor_Composite_CompositeElement {

    elementType?: T;

    elementLabel?: string;
}

export enum TypeDescriptor_Kind {

    ENUM = 0,

    ALIAS = 1,

    MULTIREGION_ENUM = 2,

    TABLE_IMPLICIT_RECORD_TYPE = 3,

    COMPOSITE = 4
}

export interface SchemaDescriptor {

    name?: string;

    id?: number;

    state?: DescriptorState;

    offlineReason?: string;

    modificationTime?: Timestamp;

    version?: bigint;

    parentId?: number;

    privileges?: PrivilegeDescriptor;

    defaultPrivileges?: DefaultPrivilegeDescriptor;

    declarativeSchemaChangerState?: DescriptorState$;

    functions: {
        [key: string]: SchemaDescriptor_Function;
    };

    replicatedPcrVersion?: number;
}

export interface SchemaDescriptor_FunctionSignature {

    id?: number;

    argTypes: T[];

    returnType?: T;

    returnSet?: boolean;

    isProcedure?: boolean;

    outParamOrdinals: number[];

    outParamTypes: T[];

    defaultExprs: string[];
}

export interface SchemaDescriptor_Function {

    name?: string;

    signatures: SchemaDescriptor_FunctionSignature[];
}

export interface FunctionDescriptor {

    name?: string;

    id?: number;

    parentId?: number;

    parentSchemaId?: number;

    params: FunctionDescriptor_Parameter[];

    returnType?: FunctionDescriptor_ReturnType;

    lang?: Function_Language;

    functionBody?: string;

    volatility?: Function_Volatility;

    leakProof?: boolean;

    nullInputBehavior?: Function_NullInputBehavior;

    privileges?: PrivilegeDescriptor;

    dependsOn: number[];

    dependsOnTypes: number[];

    dependedOnBy: FunctionDescriptor_Reference[];

    state?: DescriptorState;

    offlineReason?: string;

    version?: number;

    modificationTime?: Timestamp;

    declarativeSchemaChangerState?: DescriptorState$;

    isProcedure?: boolean;

    dependsOnFunctions: number[];

    security?: Function_Security;

    replicatedPcrVersion?: number;
}

export interface FunctionDescriptor_Parameter {

    class?: Function_Param_Class;

    name?: string;

    type?: T;

    defaultExpr?: string;
}

export interface FunctionDescriptor_ReturnType {

    type?: T;

    returnSet?: boolean;
}

export interface FunctionDescriptor_Reference {

    id?: number;

    indexIds: number[];

    columnIds: number[];

    constraintIds: number[];

    triggerIds: number[];

    policyIds: number[];

    viewQuery?: boolean;
}

export interface Descriptor {

    union: {
        oneofKind: "table";

        table: TableDescriptor;
    } | {
        oneofKind: "database";

        database: DatabaseDescriptor;
    } | {
        oneofKind: "type";

        type: TypeDescriptor;
    } | {
        oneofKind: "schema";

        schema: SchemaDescriptor;
    } | {
        oneofKind: "function";

        function: FunctionDescriptor;
    } | {
        oneofKind: undefined;
    };
}

export enum ConstraintValidity {

    Validated = 0,

    Unvalidated = 1,

    Validating = 2,

    Dropping = 3
}

export enum DescriptorState {

    PUBLIC = 0,

    ADD = 1,

    DROP = 2,

    OFFLINE = 3
}

export enum ImportType {

    IMPORT_WITH_START_TIME_ONLY = 0,

    IMPORT_WITH_IMPORT_EPOCH = 1
}

export enum SurvivalGoal {

    ZONE_FAILURE = 0,

    REGION_FAILURE = 1
}

export enum DataPlacement {

    DEFAULT = 0,

    RESTRICTED = 1
}

class ForeignKeyReference$Type extends MessageType<ForeignKeyReference> {
    constructor() {
        super("cockroach.sql.sqlbase.ForeignKeyReference", [
            { no: 1, name: "table", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "index", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "validity", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.ConstraintValidity", ConstraintValidity] },
            { no: 5, name: "shared_prefix_len", kind: "scalar", opt: true, T: 5  },
            { no: 6, name: "on_delete", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.semenumpb.ForeignKeyAction", ForeignKeyAction] },
            { no: 7, name: "on_update", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.semenumpb.ForeignKeyAction", ForeignKeyAction] },
            { no: 8, name: "match", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.semenumpb.Match", Match] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ForeignKeyReference>): ForeignKeyReference {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ForeignKeyReference>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ForeignKeyReference): ForeignKeyReference {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.table = reader.uint32();
                    break;
                case  2:
                    message.index = reader.uint32();
                    break;
                case  3:
                    message.name = reader.string();
                    break;
                case  4:
                    message.validity = reader.int32();
                    break;
                case  5:
                    message.sharedPrefixLen = reader.int32();
                    break;
                case  6:
                    message.onDelete = reader.int32();
                    break;
                case  7:
                    message.onUpdate = reader.int32();
                    break;
                case  8:
                    message.match = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ForeignKeyReference = /*#__PURE__*/ new ForeignKeyReference$Type();

class ForeignKeyConstraint$Type extends MessageType<ForeignKeyConstraint> {
    constructor() {
        super("cockroach.sql.sqlbase.ForeignKeyConstraint", [
            { no: 1, name: "origin_table_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "origin_column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 3, name: "referenced_column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 4, name: "referenced_table_id", kind: "scalar", opt: true, T: 13  },
            { no: 5, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 6, name: "validity", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.ConstraintValidity", ConstraintValidity] },
            { no: 7, name: "on_delete", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.semenumpb.ForeignKeyAction", ForeignKeyAction] },
            { no: 8, name: "on_update", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.semenumpb.ForeignKeyAction", ForeignKeyAction] },
            { no: 9, name: "match", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.semenumpb.Match", Match] },
            { no: 14, name: "constraint_id", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ForeignKeyConstraint>): ForeignKeyConstraint {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.originColumnIds = [];
        message.referencedColumnIds = [];
        if (value !== undefined)
            reflectionMergePartial<ForeignKeyConstraint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ForeignKeyConstraint): ForeignKeyConstraint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.originTableId = reader.uint32();
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.originColumnIds.push(reader.uint32());
                    else
                        message.originColumnIds.push(reader.uint32());
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.referencedColumnIds.push(reader.uint32());
                    else
                        message.referencedColumnIds.push(reader.uint32());
                    break;
                case  4:
                    message.referencedTableId = reader.uint32();
                    break;
                case  5:
                    message.name = reader.string();
                    break;
                case  6:
                    message.validity = reader.int32();
                    break;
                case  7:
                    message.onDelete = reader.int32();
                    break;
                case  8:
                    message.onUpdate = reader.int32();
                    break;
                case  9:
                    message.match = reader.int32();
                    break;
                case  14:
                    message.constraintId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ForeignKeyConstraint = /*#__PURE__*/ new ForeignKeyConstraint$Type();

class UniqueWithoutIndexConstraint$Type extends MessageType<UniqueWithoutIndexConstraint> {
    constructor() {
        super("cockroach.sql.sqlbase.UniqueWithoutIndexConstraint", [
            { no: 1, name: "table_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 3, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "validity", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.ConstraintValidity", ConstraintValidity] },
            { no: 5, name: "predicate", kind: "scalar", opt: true, T: 9  },
            { no: 6, name: "constraint_id", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<UniqueWithoutIndexConstraint>): UniqueWithoutIndexConstraint {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.columnIds = [];
        if (value !== undefined)
            reflectionMergePartial<UniqueWithoutIndexConstraint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UniqueWithoutIndexConstraint): UniqueWithoutIndexConstraint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  3:
                    message.name = reader.string();
                    break;
                case  4:
                    message.validity = reader.int32();
                    break;
                case  5:
                    message.predicate = reader.string();
                    break;
                case  6:
                    message.constraintId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const UniqueWithoutIndexConstraint = /*#__PURE__*/ new UniqueWithoutIndexConstraint$Type();

class ColumnDescriptor$Type extends MessageType<ColumnDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.ColumnDescriptor", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "type", kind: "message", T: () => T },
            { no: 4, name: "nullable", kind: "scalar", opt: true, T: 8  },
            { no: 5, name: "default_expr", kind: "scalar", opt: true, T: 9  },
            { no: 18, name: "on_update_expr", kind: "scalar", opt: true, T: 9  },
            { no: 6, name: "hidden", kind: "scalar", opt: true, T: 8  },
            { no: 17, name: "inaccessible", kind: "scalar", opt: true, T: 8  },
            { no: 19, name: "generated_as_identity_type", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.GeneratedAsIdentityType", GeneratedAsIdentityType] },
            { no: 20, name: "generated_as_identity_sequence_option", kind: "scalar", opt: true, T: 9  },
            { no: 10, name: "uses_sequence_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 12, name: "owns_sequence_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 21, name: "uses_function_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 11, name: "compute_expr", kind: "scalar", opt: true, T: 9  },
            { no: 16, name: "virtual", kind: "scalar", opt: true, T: 8  },
            { no: 13, name: "pg_attribute_num", kind: "scalar", opt: true, T: 13  },
            { no: 14, name: "alter_column_type_in_progress", kind: "scalar", opt: true, T: 8  },
            { no: 15, name: "system_column_kind", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.SystemColumnKind", SystemColumnKind] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ColumnDescriptor>): ColumnDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.usesSequenceIds = [];
        message.ownsSequenceIds = [];
        message.usesFunctionIds = [];
        if (value !== undefined)
            reflectionMergePartial<ColumnDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnDescriptor): ColumnDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.id = reader.uint32();
                    break;
                case  3:
                    message.type = T.internalBinaryRead(reader, reader.uint32(), options, message.type);
                    break;
                case  4:
                    message.nullable = reader.bool();
                    break;
                case  5:
                    message.defaultExpr = reader.string();
                    break;
                case  18:
                    message.onUpdateExpr = reader.string();
                    break;
                case  6:
                    message.hidden = reader.bool();
                    break;
                case  17:
                    message.inaccessible = reader.bool();
                    break;
                case  19:
                    message.generatedAsIdentityType = reader.int32();
                    break;
                case  20:
                    message.generatedAsIdentitySequenceOption = reader.string();
                    break;
                case  10:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesSequenceIds.push(reader.uint32());
                    else
                        message.usesSequenceIds.push(reader.uint32());
                    break;
                case  12:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.ownsSequenceIds.push(reader.uint32());
                    else
                        message.ownsSequenceIds.push(reader.uint32());
                    break;
                case  21:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesFunctionIds.push(reader.uint32());
                    else
                        message.usesFunctionIds.push(reader.uint32());
                    break;
                case  11:
                    message.computeExpr = reader.string();
                    break;
                case  16:
                    message.virtual = reader.bool();
                    break;
                case  13:
                    message.pgAttributeNum = reader.uint32();
                    break;
                case  14:
                    message.alterColumnTypeInProgress = reader.bool();
                    break;
                case  15:
                    message.systemColumnKind = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ColumnDescriptor = /*#__PURE__*/ new ColumnDescriptor$Type();

class ColumnFamilyDescriptor$Type extends MessageType<ColumnFamilyDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.ColumnFamilyDescriptor", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "column_names", kind: "scalar", repeat: 2 , T: 9  },
            { no: 4, name: "column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 5, name: "default_column_id", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ColumnFamilyDescriptor>): ColumnFamilyDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.columnNames = [];
        message.columnIds = [];
        if (value !== undefined)
            reflectionMergePartial<ColumnFamilyDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnFamilyDescriptor): ColumnFamilyDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.id = reader.uint32();
                    break;
                case  3:
                    message.columnNames.push(reader.string());
                    break;
                case  4:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  5:
                    message.defaultColumnId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ColumnFamilyDescriptor = /*#__PURE__*/ new ColumnFamilyDescriptor$Type();

class InterleaveDescriptor$Type extends MessageType<InterleaveDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.InterleaveDescriptor", [
            { no: 1, name: "ancestors", kind: "message", repeat: 2 , T: () => InterleaveDescriptor_Ancestor }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<InterleaveDescriptor>): InterleaveDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.ancestors = [];
        if (value !== undefined)
            reflectionMergePartial<InterleaveDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InterleaveDescriptor): InterleaveDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.ancestors.push(InterleaveDescriptor_Ancestor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const InterleaveDescriptor = /*#__PURE__*/ new InterleaveDescriptor$Type();

class InterleaveDescriptor_Ancestor$Type extends MessageType<InterleaveDescriptor_Ancestor> {
    constructor() {
        super("cockroach.sql.sqlbase.InterleaveDescriptor.Ancestor", [
            { no: 1, name: "table_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "index_id", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "shared_prefix_len", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<InterleaveDescriptor_Ancestor>): InterleaveDescriptor_Ancestor {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<InterleaveDescriptor_Ancestor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InterleaveDescriptor_Ancestor): InterleaveDescriptor_Ancestor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.indexId = reader.uint32();
                    break;
                case  3:
                    message.sharedPrefixLen = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const InterleaveDescriptor_Ancestor = /*#__PURE__*/ new InterleaveDescriptor_Ancestor$Type();

class IndexDescriptor$Type extends MessageType<IndexDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.IndexDescriptor", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "unique", kind: "scalar", opt: true, T: 8  },
            { no: 18, name: "version", kind: "scalar", opt: true, T: 13  },
            { no: 4, name: "key_column_names", kind: "scalar", repeat: 2 , T: 9  },
            { no: 8, name: "key_column_directions", kind: "enum", repeat: 2 , T: () => ["cockroach.sql.catalog.catpb.IndexColumn.Direction", IndexColumn_Direction] },
            { no: 5, name: "store_column_names", kind: "scalar", repeat: 2 , T: 9  },
            { no: 27, name: "inverted_column_kinds", kind: "enum", repeat: 2 , T: () => ["cockroach.sql.catalog.catpb.InvertedIndexColumnKind", InvertedIndexColumnKind] },
            { no: 6, name: "key_column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 7, name: "key_suffix_column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 14, name: "store_column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 13, name: "composite_column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 9, name: "foreign_key", kind: "message", T: () => ForeignKeyReference },
            { no: 10, name: "referenced_by", kind: "message", repeat: 2 , T: () => ForeignKeyReference },
            { no: 11, name: "interleave", kind: "message", T: () => InterleaveDescriptor },
            { no: 12, name: "interleaved_by", kind: "message", repeat: 2 , T: () => ForeignKeyReference },
            { no: 15, name: "partitioning", kind: "message", T: () => PartitioningDescriptor },
            { no: 16, name: "type", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.idxtype.T", T$] },
            { no: 17, name: "created_explicitly", kind: "scalar", opt: true, T: 8  },
            { no: 19, name: "encoding_type", kind: "scalar", opt: true, T: 13  },
            { no: 20, name: "sharded", kind: "message", T: () => ShardedDescriptor },
            { no: 21, name: "disabled", kind: "scalar", opt: true, T: 8  },
            { no: 22, name: "geo_config", kind: "message", T: () => Config },
            { no: 23, name: "predicate", kind: "scalar", opt: true, T: 9  },
            { no: 24, name: "use_delete_preserving_encoding", kind: "scalar", opt: true, T: 8  },
            { no: 25, name: "created_at_nanos", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 26, name: "constraint_id", kind: "scalar", opt: true, T: 13  },
            { no: 28, name: "not_visible", kind: "scalar", opt: true, T: 8  },
            { no: 29, name: "invisibility", kind: "scalar", opt: true, T: 1  },
            { no: 30, name: "vec_config", kind: "message", T: () => Config$ },
            { no: 31, name: "hide_for_primary_key_recreate", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<IndexDescriptor>): IndexDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.keyColumnNames = [];
        message.keyColumnDirections = [];
        message.storeColumnNames = [];
        message.invertedColumnKinds = [];
        message.keyColumnIds = [];
        message.keySuffixColumnIds = [];
        message.storeColumnIds = [];
        message.compositeColumnIds = [];
        message.referencedBy = [];
        message.interleavedBy = [];
        if (value !== undefined)
            reflectionMergePartial<IndexDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexDescriptor): IndexDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.id = reader.uint32();
                    break;
                case  3:
                    message.unique = reader.bool();
                    break;
                case  18:
                    message.version = reader.uint32();
                    break;
                case  4:
                    message.keyColumnNames.push(reader.string());
                    break;
                case  8:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.keyColumnDirections.push(reader.int32());
                    else
                        message.keyColumnDirections.push(reader.int32());
                    break;
                case  5:
                    message.storeColumnNames.push(reader.string());
                    break;
                case  27:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.invertedColumnKinds.push(reader.int32());
                    else
                        message.invertedColumnKinds.push(reader.int32());
                    break;
                case  6:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.keyColumnIds.push(reader.uint32());
                    else
                        message.keyColumnIds.push(reader.uint32());
                    break;
                case  7:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.keySuffixColumnIds.push(reader.uint32());
                    else
                        message.keySuffixColumnIds.push(reader.uint32());
                    break;
                case  14:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.storeColumnIds.push(reader.uint32());
                    else
                        message.storeColumnIds.push(reader.uint32());
                    break;
                case  13:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.compositeColumnIds.push(reader.uint32());
                    else
                        message.compositeColumnIds.push(reader.uint32());
                    break;
                case  9:
                    message.foreignKey = ForeignKeyReference.internalBinaryRead(reader, reader.uint32(), options, message.foreignKey);
                    break;
                case  10:
                    message.referencedBy.push(ForeignKeyReference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  11:
                    message.interleave = InterleaveDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.interleave);
                    break;
                case  12:
                    message.interleavedBy.push(ForeignKeyReference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  15:
                    message.partitioning = PartitioningDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.partitioning);
                    break;
                case  16:
                    message.type = reader.int32();
                    break;
                case  17:
                    message.createdExplicitly = reader.bool();
                    break;
                case  19:
                    message.encodingType = reader.uint32();
                    break;
                case  20:
                    message.sharded = ShardedDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.sharded);
                    break;
                case  21:
                    message.disabled = reader.bool();
                    break;
                case  22:
                    message.geoConfig = Config.internalBinaryRead(reader, reader.uint32(), options, message.geoConfig);
                    break;
                case  23:
                    message.predicate = reader.string();
                    break;
                case  24:
                    message.useDeletePreservingEncoding = reader.bool();
                    break;
                case  25:
                    message.createdAtNanos = reader.int64().toBigInt();
                    break;
                case  26:
                    message.constraintId = reader.uint32();
                    break;
                case  28:
                    message.notVisible = reader.bool();
                    break;
                case  29:
                    message.invisibility = reader.double();
                    break;
                case  30:
                    message.vecConfig = Config$.internalBinaryRead(reader, reader.uint32(), options, message.vecConfig);
                    break;
                case  31:
                    message.hideForPrimaryKeyRecreate = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const IndexDescriptor = /*#__PURE__*/ new IndexDescriptor$Type();

class TriggerDescriptor$Type extends MessageType<TriggerDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.TriggerDescriptor", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "action_time", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.semenumpb.TriggerActionTime", TriggerActionTime] },
            { no: 4, name: "events", kind: "message", repeat: 2 , T: () => TriggerDescriptor_Event },
            { no: 5, name: "new_transition_alias", kind: "scalar", opt: true, T: 9  },
            { no: 6, name: "old_transition_alias", kind: "scalar", opt: true, T: 9  },
            { no: 7, name: "for_each_row", kind: "scalar", opt: true, T: 8  },
            { no: 8, name: "when_expr", kind: "scalar", opt: true, T: 9  },
            { no: 9, name: "func_id", kind: "scalar", opt: true, T: 13  },
            { no: 10, name: "func_args", kind: "scalar", repeat: 2 , T: 9  },
            { no: 11, name: "func_body", kind: "scalar", opt: true, T: 9  },
            { no: 12, name: "enabled", kind: "scalar", opt: true, T: 8  },
            { no: 13, name: "depends_on", kind: "scalar", repeat: 2 , T: 13  },
            { no: 14, name: "depends_on_types", kind: "scalar", repeat: 2 , T: 13  },
            { no: 15, name: "depends_on_routines", kind: "scalar", repeat: 2 , T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TriggerDescriptor>): TriggerDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.events = [];
        message.funcArgs = [];
        message.dependsOn = [];
        message.dependsOnTypes = [];
        message.dependsOnRoutines = [];
        if (value !== undefined)
            reflectionMergePartial<TriggerDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerDescriptor): TriggerDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  3:
                    message.actionTime = reader.int32();
                    break;
                case  4:
                    message.events.push(TriggerDescriptor_Event.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    message.newTransitionAlias = reader.string();
                    break;
                case  6:
                    message.oldTransitionAlias = reader.string();
                    break;
                case  7:
                    message.forEachRow = reader.bool();
                    break;
                case  8:
                    message.whenExpr = reader.string();
                    break;
                case  9:
                    message.funcId = reader.uint32();
                    break;
                case  10:
                    message.funcArgs.push(reader.string());
                    break;
                case  11:
                    message.funcBody = reader.string();
                    break;
                case  12:
                    message.enabled = reader.bool();
                    break;
                case  13:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOn.push(reader.uint32());
                    else
                        message.dependsOn.push(reader.uint32());
                    break;
                case  14:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOnTypes.push(reader.uint32());
                    else
                        message.dependsOnTypes.push(reader.uint32());
                    break;
                case  15:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOnRoutines.push(reader.uint32());
                    else
                        message.dependsOnRoutines.push(reader.uint32());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TriggerDescriptor = /*#__PURE__*/ new TriggerDescriptor$Type();

class TriggerDescriptor_Event$Type extends MessageType<TriggerDescriptor_Event> {
    constructor() {
        super("cockroach.sql.sqlbase.TriggerDescriptor.Event", [
            { no: 1, name: "type", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.semenumpb.TriggerEventType", TriggerEventType] },
            { no: 2, name: "column_names", kind: "scalar", repeat: 2 , T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TriggerDescriptor_Event>): TriggerDescriptor_Event {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.columnNames = [];
        if (value !== undefined)
            reflectionMergePartial<TriggerDescriptor_Event>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerDescriptor_Event): TriggerDescriptor_Event {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.type = reader.int32();
                    break;
                case  2:
                    message.columnNames.push(reader.string());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TriggerDescriptor_Event = /*#__PURE__*/ new TriggerDescriptor_Event$Type();

class ConstraintToUpdate$Type extends MessageType<ConstraintToUpdate> {
    constructor() {
        super("cockroach.sql.sqlbase.ConstraintToUpdate", [
            { no: 1, name: "constraint_type", kind: "enum", T: () => ["cockroach.sql.sqlbase.ConstraintToUpdate.ConstraintType", ConstraintToUpdate_ConstraintType] },
            { no: 2, name: "name", kind: "scalar", T: 9  },
            { no: 3, name: "check", kind: "message", T: () => TableDescriptor_CheckConstraint },
            { no: 4, name: "foreign_key", kind: "message", T: () => ForeignKeyConstraint },
            { no: 6, name: "not_null_column", kind: "scalar", opt: true, T: 13  },
            { no: 7, name: "unique_without_index_constraint", kind: "message", T: () => UniqueWithoutIndexConstraint }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ConstraintToUpdate>): ConstraintToUpdate {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.constraintType = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<ConstraintToUpdate>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConstraintToUpdate): ConstraintToUpdate {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.constraintType = reader.int32();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  3:
                    message.check = TableDescriptor_CheckConstraint.internalBinaryRead(reader, reader.uint32(), options, message.check);
                    break;
                case  4:
                    message.foreignKey = ForeignKeyConstraint.internalBinaryRead(reader, reader.uint32(), options, message.foreignKey);
                    break;
                case  6:
                    message.notNullColumn = reader.uint32();
                    break;
                case  7:
                    message.uniqueWithoutIndexConstraint = UniqueWithoutIndexConstraint.internalBinaryRead(reader, reader.uint32(), options, message.uniqueWithoutIndexConstraint);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ConstraintToUpdate = /*#__PURE__*/ new ConstraintToUpdate$Type();

class PrimaryKeySwap$Type extends MessageType<PrimaryKeySwap> {
    constructor() {
        super("cockroach.sql.sqlbase.PrimaryKeySwap", [
            { no: 4, name: "old_primary_index_id", kind: "scalar", opt: true, T: 13  },
            { no: 1, name: "new_primary_index_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "old_indexes", kind: "scalar", repeat: 2 , T: 13  },
            { no: 3, name: "new_indexes", kind: "scalar", repeat: 2 , T: 13  },
            { no: 5, name: "new_primary_index_name", kind: "scalar", opt: true, T: 9  },
            { no: 6, name: "locality_config_swap", kind: "message", T: () => PrimaryKeySwap_LocalityConfigSwap }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<PrimaryKeySwap>): PrimaryKeySwap {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.oldIndexes = [];
        message.newIndexes = [];
        if (value !== undefined)
            reflectionMergePartial<PrimaryKeySwap>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PrimaryKeySwap): PrimaryKeySwap {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  4:
                    message.oldPrimaryIndexId = reader.uint32();
                    break;
                case  1:
                    message.newPrimaryIndexId = reader.uint32();
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.oldIndexes.push(reader.uint32());
                    else
                        message.oldIndexes.push(reader.uint32());
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.newIndexes.push(reader.uint32());
                    else
                        message.newIndexes.push(reader.uint32());
                    break;
                case  5:
                    message.newPrimaryIndexName = reader.string();
                    break;
                case  6:
                    message.localityConfigSwap = PrimaryKeySwap_LocalityConfigSwap.internalBinaryRead(reader, reader.uint32(), options, message.localityConfigSwap);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PrimaryKeySwap = /*#__PURE__*/ new PrimaryKeySwap$Type();

class PrimaryKeySwap_LocalityConfigSwap$Type extends MessageType<PrimaryKeySwap_LocalityConfigSwap> {
    constructor() {
        super("cockroach.sql.sqlbase.PrimaryKeySwap.LocalityConfigSwap", [
            { no: 1, name: "old_locality_config", kind: "message", T: () => LocalityConfig },
            { no: 2, name: "new_locality_config", kind: "message", T: () => LocalityConfig },
            { no: 3, name: "new_regional_by_row_column_id", kind: "scalar", opt: true, T: 13  },
            { no: 4, name: "new_regional_by_row_column_default_expr", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<PrimaryKeySwap_LocalityConfigSwap>): PrimaryKeySwap_LocalityConfigSwap {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PrimaryKeySwap_LocalityConfigSwap>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PrimaryKeySwap_LocalityConfigSwap): PrimaryKeySwap_LocalityConfigSwap {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.oldLocalityConfig = LocalityConfig.internalBinaryRead(reader, reader.uint32(), options, message.oldLocalityConfig);
                    break;
                case  2:
                    message.newLocalityConfig = LocalityConfig.internalBinaryRead(reader, reader.uint32(), options, message.newLocalityConfig);
                    break;
                case  3:
                    message.newRegionalByRowColumnId = reader.uint32();
                    break;
                case  4:
                    message.newRegionalByRowColumnDefaultExpr = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PrimaryKeySwap_LocalityConfigSwap = /*#__PURE__*/ new PrimaryKeySwap_LocalityConfigSwap$Type();

class ModifyRowLevelTTL$Type extends MessageType<ModifyRowLevelTTL> {
    constructor() {
        super("cockroach.sql.sqlbase.ModifyRowLevelTTL", [
            { no: 1, name: "row_level_ttl", kind: "message", T: () => RowLevelTTL }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ModifyRowLevelTTL>): ModifyRowLevelTTL {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ModifyRowLevelTTL>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ModifyRowLevelTTL): ModifyRowLevelTTL {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rowLevelTtl = RowLevelTTL.internalBinaryRead(reader, reader.uint32(), options, message.rowLevelTtl);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ModifyRowLevelTTL = /*#__PURE__*/ new ModifyRowLevelTTL$Type();

class ComputedColumnSwap$Type extends MessageType<ComputedColumnSwap> {
    constructor() {
        super("cockroach.sql.sqlbase.ComputedColumnSwap", [
            { no: 1, name: "new_column_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "old_column_id", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "inverse_expr", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ComputedColumnSwap>): ComputedColumnSwap {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ComputedColumnSwap>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ComputedColumnSwap): ComputedColumnSwap {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.newColumnId = reader.uint32();
                    break;
                case  2:
                    message.oldColumnId = reader.uint32();
                    break;
                case  3:
                    message.inverseExpr = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ComputedColumnSwap = /*#__PURE__*/ new ComputedColumnSwap$Type();

class MaterializedViewRefresh$Type extends MessageType<MaterializedViewRefresh> {
    constructor() {
        super("cockroach.sql.sqlbase.MaterializedViewRefresh", [
            { no: 1, name: "new_primary_index", kind: "message", T: () => IndexDescriptor },
            { no: 2, name: "new_indexes", kind: "message", repeat: 2 , T: () => IndexDescriptor },
            { no: 3, name: "as_of", kind: "message", T: () => Timestamp },
            { no: 4, name: "should_backfill", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<MaterializedViewRefresh>): MaterializedViewRefresh {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.newIndexes = [];
        if (value !== undefined)
            reflectionMergePartial<MaterializedViewRefresh>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MaterializedViewRefresh): MaterializedViewRefresh {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.newPrimaryIndex = IndexDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.newPrimaryIndex);
                    break;
                case  2:
                    message.newIndexes.push(IndexDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.asOf = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.asOf);
                    break;
                case  4:
                    message.shouldBackfill = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const MaterializedViewRefresh = /*#__PURE__*/ new MaterializedViewRefresh$Type();

class PolicyDescriptor$Type extends MessageType<PolicyDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.PolicyDescriptor", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "type", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.PolicyType", PolicyType] },
            { no: 4, name: "command", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.PolicyCommand", PolicyCommand] },
            { no: 5, name: "role_names", kind: "scalar", repeat: 2 , T: 9  },
            { no: 6, name: "using_expr", kind: "scalar", opt: true, T: 9  },
            { no: 11, name: "using_column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 7, name: "with_check_expr", kind: "scalar", opt: true, T: 9  },
            { no: 12, name: "with_check_column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 8, name: "depends_on_types", kind: "scalar", repeat: 2 , T: 13  },
            { no: 9, name: "depends_on_functions", kind: "scalar", repeat: 2 , T: 13  },
            { no: 10, name: "depends_on_relations", kind: "scalar", repeat: 2 , T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<PolicyDescriptor>): PolicyDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.roleNames = [];
        message.usingColumnIds = [];
        message.withCheckColumnIds = [];
        message.dependsOnTypes = [];
        message.dependsOnFunctions = [];
        message.dependsOnRelations = [];
        if (value !== undefined)
            reflectionMergePartial<PolicyDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PolicyDescriptor): PolicyDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  3:
                    message.type = reader.int32();
                    break;
                case  4:
                    message.command = reader.int32();
                    break;
                case  5:
                    message.roleNames.push(reader.string());
                    break;
                case  6:
                    message.usingExpr = reader.string();
                    break;
                case  11:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usingColumnIds.push(reader.uint32());
                    else
                        message.usingColumnIds.push(reader.uint32());
                    break;
                case  7:
                    message.withCheckExpr = reader.string();
                    break;
                case  12:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.withCheckColumnIds.push(reader.uint32());
                    else
                        message.withCheckColumnIds.push(reader.uint32());
                    break;
                case  8:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOnTypes.push(reader.uint32());
                    else
                        message.dependsOnTypes.push(reader.uint32());
                    break;
                case  9:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOnFunctions.push(reader.uint32());
                    else
                        message.dependsOnFunctions.push(reader.uint32());
                    break;
                case  10:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOnRelations.push(reader.uint32());
                    else
                        message.dependsOnRelations.push(reader.uint32());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PolicyDescriptor = /*#__PURE__*/ new PolicyDescriptor$Type();

class DescriptorMutation$Type extends MessageType<DescriptorMutation> {
    constructor() {
        super("cockroach.sql.sqlbase.DescriptorMutation", [
            { no: 1, name: "column", kind: "message", oneof: "descriptor", T: () => ColumnDescriptor },
            { no: 2, name: "index", kind: "message", oneof: "descriptor", T: () => IndexDescriptor },
            { no: 8, name: "constraint", kind: "message", oneof: "descriptor", T: () => ConstraintToUpdate },
            { no: 9, name: "primaryKeySwap", kind: "message", oneof: "descriptor", T: () => PrimaryKeySwap },
            { no: 10, name: "computedColumnSwap", kind: "message", oneof: "descriptor", T: () => ComputedColumnSwap },
            { no: 11, name: "materializedViewRefresh", kind: "message", oneof: "descriptor", T: () => MaterializedViewRefresh },
            { no: 12, name: "modify_row_level_ttl", kind: "message", oneof: "descriptor", T: () => ModifyRowLevelTTL },
            { no: 3, name: "state", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.DescriptorMutation.State", DescriptorMutation_State] },
            { no: 4, name: "direction", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.DescriptorMutation.Direction", DescriptorMutation_Direction] },
            { no: 5, name: "mutation_id", kind: "scalar", opt: true, T: 13  },
            { no: 7, name: "rollback", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<DescriptorMutation>): DescriptorMutation {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.descriptor = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<DescriptorMutation>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DescriptorMutation): DescriptorMutation {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.descriptor = {
                        oneofKind: "column",
                        column: ColumnDescriptor.internalBinaryRead(reader, reader.uint32(), options, (message.descriptor as any).column)
                    };
                    break;
                case  2:
                    message.descriptor = {
                        oneofKind: "index",
                        index: IndexDescriptor.internalBinaryRead(reader, reader.uint32(), options, (message.descriptor as any).index)
                    };
                    break;
                case  8:
                    message.descriptor = {
                        oneofKind: "constraint",
                        constraint: ConstraintToUpdate.internalBinaryRead(reader, reader.uint32(), options, (message.descriptor as any).constraint)
                    };
                    break;
                case  9:
                    message.descriptor = {
                        oneofKind: "primaryKeySwap",
                        primaryKeySwap: PrimaryKeySwap.internalBinaryRead(reader, reader.uint32(), options, (message.descriptor as any).primaryKeySwap)
                    };
                    break;
                case  10:
                    message.descriptor = {
                        oneofKind: "computedColumnSwap",
                        computedColumnSwap: ComputedColumnSwap.internalBinaryRead(reader, reader.uint32(), options, (message.descriptor as any).computedColumnSwap)
                    };
                    break;
                case  11:
                    message.descriptor = {
                        oneofKind: "materializedViewRefresh",
                        materializedViewRefresh: MaterializedViewRefresh.internalBinaryRead(reader, reader.uint32(), options, (message.descriptor as any).materializedViewRefresh)
                    };
                    break;
                case  12:
                    message.descriptor = {
                        oneofKind: "modifyRowLevelTtl",
                        modifyRowLevelTtl: ModifyRowLevelTTL.internalBinaryRead(reader, reader.uint32(), options, (message.descriptor as any).modifyRowLevelTtl)
                    };
                    break;
                case  3:
                    message.state = reader.int32();
                    break;
                case  4:
                    message.direction = reader.int32();
                    break;
                case  5:
                    message.mutationId = reader.uint32();
                    break;
                case  7:
                    message.rollback = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const DescriptorMutation = /*#__PURE__*/ new DescriptorMutation$Type();

class NameInfo$Type extends MessageType<NameInfo> {
    constructor() {
        super("cockroach.sql.sqlbase.NameInfo", [
            { no: 1, name: "parent_id", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "parent_schema_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "name", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<NameInfo>): NameInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<NameInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NameInfo): NameInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.parentId = reader.uint32();
                    break;
                case  3:
                    message.parentSchemaId = reader.uint32();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const NameInfo = /*#__PURE__*/ new NameInfo$Type();

class TableDescriptor$Type extends MessageType<TableDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.TableDescriptor", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 5, name: "version", kind: "scalar", opt: true, T: 4 , L: 0  },
            { no: 7, name: "modification_time", kind: "message", T: () => Timestamp },
            { no: 4, name: "parent_id", kind: "scalar", opt: true, T: 13  },
            { no: 40, name: "unexposed_parent_schema_id", kind: "scalar", opt: true, T: 13  },
            { no: 8, name: "columns", kind: "message", repeat: 2 , T: () => ColumnDescriptor },
            { no: 9, name: "next_column_id", kind: "scalar", opt: true, T: 13  },
            { no: 22, name: "families", kind: "message", repeat: 2 , T: () => ColumnFamilyDescriptor },
            { no: 23, name: "next_family_id", kind: "scalar", opt: true, T: 13  },
            { no: 10, name: "primary_index", kind: "message", T: () => IndexDescriptor },
            { no: 11, name: "indexes", kind: "message", repeat: 2 , T: () => IndexDescriptor },
            { no: 12, name: "next_index_id", kind: "scalar", opt: true, T: 13  },
            { no: 13, name: "privileges", kind: "message", T: () => PrivilegeDescriptor },
            { no: 14, name: "mutations", kind: "message", repeat: 2 , T: () => DescriptorMutation },
            { no: 16, name: "next_mutation_id", kind: "scalar", opt: true, T: 13  },
            { no: 17, name: "format_version", kind: "scalar", opt: true, T: 13  },
            { no: 19, name: "state", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.DescriptorState", DescriptorState] },
            { no: 38, name: "offline_reason", kind: "scalar", opt: true, T: 9  },
            { no: 20, name: "checks", kind: "message", repeat: 2 , T: () => TableDescriptor_CheckConstraint },
            { no: 24, name: "view_query", kind: "scalar", opt: true, T: 9  },
            { no: 41, name: "is_materialized_view", kind: "scalar", opt: true, T: 8  },
            { no: 53, name: "refresh_view_required", kind: "scalar", opt: true, T: 8  },
            { no: 25, name: "dependsOn", kind: "scalar", repeat: 2 , T: 13  },
            { no: 45, name: "dependsOnTypes", kind: "scalar", repeat: 2 , T: 13  },
            { no: 55, name: "depends_on_functions", kind: "scalar", repeat: 2 , T: 13  },
            { no: 26, name: "dependedOnBy", kind: "message", repeat: 2 , T: () => TableDescriptor_Reference },
            { no: 27, name: "mutationJobs", kind: "message", repeat: 2 , T: () => TableDescriptor_MutationJob },
            { no: 50, name: "declarative_schema_changer_state", kind: "message", T: () => DescriptorState$ },
            { no: 28, name: "sequence_opts", kind: "message", T: () => TableDescriptor_SequenceOpts },
            { no: 29, name: "drop_time", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 30, name: "replacement_of", kind: "message", T: () => TableDescriptor_Replacement },
            { no: 31, name: "audit_mode", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.TableDescriptor.AuditMode", TableDescriptor_AuditMode] },
            { no: 32, name: "drop_job_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 34, name: "create_query", kind: "scalar", opt: true, T: 9  },
            { no: 35, name: "create_as_of_time", kind: "message", T: () => Timestamp },
            { no: 36, name: "outbound_fks", kind: "message", repeat: 2 , T: () => ForeignKeyConstraint },
            { no: 37, name: "inbound_fks", kind: "message", repeat: 2 , T: () => ForeignKeyConstraint },
            { no: 43, name: "unique_without_index_constraints", kind: "message", repeat: 2 , T: () => UniqueWithoutIndexConstraint },
            { no: 39, name: "temporary", kind: "scalar", opt: true, T: 8  },
            { no: 42, name: "locality_config", kind: "message", T: () => LocalityConfig },
            { no: 44, name: "partition_all_by", kind: "scalar", opt: true, T: 8  },
            { no: 47, name: "row_level_ttl", kind: "message", T: () => RowLevelTTL },
            { no: 48, name: "exclude_data_from_backup", kind: "scalar", opt: true, T: 8  },
            { no: 49, name: "next_constraint_id", kind: "scalar", opt: true, T: 13  },
            { no: 51, name: "auto_stats_settings", kind: "message", T: () => AutoStatsSettings },
            { no: 52, name: "forecast_stats", kind: "scalar", opt: true, T: 8  },
            { no: 56, name: "histogram_samples", kind: "scalar", opt: true, T: 13  },
            { no: 57, name: "histogram_buckets", kind: "scalar", opt: true, T: 13  },
            { no: 54, name: "import_start_wall_time", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 58, name: "schema_locked", kind: "scalar", opt: true, T: 8  },
            { no: 59, name: "import_epoch", kind: "scalar", opt: true, T: 13  },
            { no: 60, name: "import_type", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.ImportType", ImportType] },
            { no: 61, name: "external", kind: "message", T: () => ExternalRowData },
            { no: 62, name: "ldr_job_ids", kind: "scalar", repeat: 2 , T: 3 , L: 0  },
            { no: 63, name: "replicated_pcr_version", kind: "scalar", opt: true, T: 13  },
            { no: 64, name: "triggers", kind: "message", repeat: 2 , T: () => TriggerDescriptor },
            { no: 65, name: "next_trigger_id", kind: "scalar", opt: true, T: 13  },
            { no: 66, name: "policies", kind: "message", repeat: 2 , T: () => PolicyDescriptor },
            { no: 67, name: "next_policy_id", kind: "scalar", opt: true, T: 13  },
            { no: 68, name: "row_level_security_enabled", kind: "scalar", opt: true, T: 8  },
            { no: 69, name: "row_level_security_forced", kind: "scalar", opt: true, T: 8  },
            { no: 70, name: "rbr_using_constraint", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.goproto_getters": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TableDescriptor>): TableDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.columns = [];
        message.families = [];
        message.indexes = [];
        message.mutations = [];
        message.checks = [];
        message.dependsOn = [];
        message.dependsOnTypes = [];
        message.dependsOnFunctions = [];
        message.dependedOnBy = [];
        message.mutationJobs = [];
        message.outboundFks = [];
        message.inboundFks = [];
        message.uniqueWithoutIndexConstraints = [];
        message.ldrJobIds = [];
        message.triggers = [];
        message.policies = [];
        if (value !== undefined)
            reflectionMergePartial<TableDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableDescriptor): TableDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  3:
                    message.id = reader.uint32();
                    break;
                case  5:
                    message.version = reader.uint64().toBigInt();
                    break;
                case  7:
                    message.modificationTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.modificationTime);
                    break;
                case  4:
                    message.parentId = reader.uint32();
                    break;
                case  40:
                    message.unexposedParentSchemaId = reader.uint32();
                    break;
                case  8:
                    message.columns.push(ColumnDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  9:
                    message.nextColumnId = reader.uint32();
                    break;
                case  22:
                    message.families.push(ColumnFamilyDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  23:
                    message.nextFamilyId = reader.uint32();
                    break;
                case  10:
                    message.primaryIndex = IndexDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.primaryIndex);
                    break;
                case  11:
                    message.indexes.push(IndexDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  12:
                    message.nextIndexId = reader.uint32();
                    break;
                case  13:
                    message.privileges = PrivilegeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.privileges);
                    break;
                case  14:
                    message.mutations.push(DescriptorMutation.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  16:
                    message.nextMutationId = reader.uint32();
                    break;
                case  17:
                    message.formatVersion = reader.uint32();
                    break;
                case  19:
                    message.state = reader.int32();
                    break;
                case  38:
                    message.offlineReason = reader.string();
                    break;
                case  20:
                    message.checks.push(TableDescriptor_CheckConstraint.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  24:
                    message.viewQuery = reader.string();
                    break;
                case  41:
                    message.isMaterializedView = reader.bool();
                    break;
                case  53:
                    message.refreshViewRequired = reader.bool();
                    break;
                case  25:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOn.push(reader.uint32());
                    else
                        message.dependsOn.push(reader.uint32());
                    break;
                case  45:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOnTypes.push(reader.uint32());
                    else
                        message.dependsOnTypes.push(reader.uint32());
                    break;
                case  55:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOnFunctions.push(reader.uint32());
                    else
                        message.dependsOnFunctions.push(reader.uint32());
                    break;
                case  26:
                    message.dependedOnBy.push(TableDescriptor_Reference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  27:
                    message.mutationJobs.push(TableDescriptor_MutationJob.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  50:
                    message.declarativeSchemaChangerState = DescriptorState$.internalBinaryRead(reader, reader.uint32(), options, message.declarativeSchemaChangerState);
                    break;
                case  28:
                    message.sequenceOpts = TableDescriptor_SequenceOpts.internalBinaryRead(reader, reader.uint32(), options, message.sequenceOpts);
                    break;
                case  29:
                    message.dropTime = reader.int64().toBigInt();
                    break;
                case  30:
                    message.replacementOf = TableDescriptor_Replacement.internalBinaryRead(reader, reader.uint32(), options, message.replacementOf);
                    break;
                case  31:
                    message.auditMode = reader.int32();
                    break;
                case  32:
                    message.dropJobId = reader.int64().toBigInt();
                    break;
                case  34:
                    message.createQuery = reader.string();
                    break;
                case  35:
                    message.createAsOfTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.createAsOfTime);
                    break;
                case  36:
                    message.outboundFks.push(ForeignKeyConstraint.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  37:
                    message.inboundFks.push(ForeignKeyConstraint.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  43:
                    message.uniqueWithoutIndexConstraints.push(UniqueWithoutIndexConstraint.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  39:
                    message.temporary = reader.bool();
                    break;
                case  42:
                    message.localityConfig = LocalityConfig.internalBinaryRead(reader, reader.uint32(), options, message.localityConfig);
                    break;
                case  44:
                    message.partitionAllBy = reader.bool();
                    break;
                case  47:
                    message.rowLevelTtl = RowLevelTTL.internalBinaryRead(reader, reader.uint32(), options, message.rowLevelTtl);
                    break;
                case  48:
                    message.excludeDataFromBackup = reader.bool();
                    break;
                case  49:
                    message.nextConstraintId = reader.uint32();
                    break;
                case  51:
                    message.autoStatsSettings = AutoStatsSettings.internalBinaryRead(reader, reader.uint32(), options, message.autoStatsSettings);
                    break;
                case  52:
                    message.forecastStats = reader.bool();
                    break;
                case  56:
                    message.histogramSamples = reader.uint32();
                    break;
                case  57:
                    message.histogramBuckets = reader.uint32();
                    break;
                case  54:
                    message.importStartWallTime = reader.int64().toBigInt();
                    break;
                case  58:
                    message.schemaLocked = reader.bool();
                    break;
                case  59:
                    message.importEpoch = reader.uint32();
                    break;
                case  60:
                    message.importType = reader.int32();
                    break;
                case  61:
                    message.external = ExternalRowData.internalBinaryRead(reader, reader.uint32(), options, message.external);
                    break;
                case  62:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.ldrJobIds.push(reader.int64().toBigInt());
                    else
                        message.ldrJobIds.push(reader.int64().toBigInt());
                    break;
                case  63:
                    message.replicatedPcrVersion = reader.uint32();
                    break;
                case  64:
                    message.triggers.push(TriggerDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  65:
                    message.nextTriggerId = reader.uint32();
                    break;
                case  66:
                    message.policies.push(PolicyDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  67:
                    message.nextPolicyId = reader.uint32();
                    break;
                case  68:
                    message.rowLevelSecurityEnabled = reader.bool();
                    break;
                case  69:
                    message.rowLevelSecurityForced = reader.bool();
                    break;
                case  70:
                    message.rbrUsingConstraint = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableDescriptor = /*#__PURE__*/ new TableDescriptor$Type();

class TableDescriptor_CheckConstraint$Type extends MessageType<TableDescriptor_CheckConstraint> {
    constructor() {
        super("cockroach.sql.sqlbase.TableDescriptor.CheckConstraint", [
            { no: 1, name: "expr", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "validity", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.ConstraintValidity", ConstraintValidity] },
            { no: 5, name: "column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 6, name: "is_non_null_constraint", kind: "scalar", opt: true, T: 8  },
            { no: 7, name: "from_hash_sharded_column", kind: "scalar", opt: true, T: 8  },
            { no: 8, name: "constraint_id", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TableDescriptor_CheckConstraint>): TableDescriptor_CheckConstraint {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.columnIds = [];
        if (value !== undefined)
            reflectionMergePartial<TableDescriptor_CheckConstraint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableDescriptor_CheckConstraint): TableDescriptor_CheckConstraint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.expr = reader.string();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  3:
                    message.validity = reader.int32();
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  6:
                    message.isNonNullConstraint = reader.bool();
                    break;
                case  7:
                    message.fromHashShardedColumn = reader.bool();
                    break;
                case  8:
                    message.constraintId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableDescriptor_CheckConstraint = /*#__PURE__*/ new TableDescriptor_CheckConstraint$Type();

class TableDescriptor_Reference$Type extends MessageType<TableDescriptor_Reference> {
    constructor() {
        super("cockroach.sql.sqlbase.TableDescriptor.Reference", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "index_id", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 4, name: "by_id", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TableDescriptor_Reference>): TableDescriptor_Reference {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.columnIds = [];
        if (value !== undefined)
            reflectionMergePartial<TableDescriptor_Reference>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableDescriptor_Reference): TableDescriptor_Reference {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    message.indexId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  4:
                    message.byId = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableDescriptor_Reference = /*#__PURE__*/ new TableDescriptor_Reference$Type();

class TableDescriptor_MutationJob$Type extends MessageType<TableDescriptor_MutationJob> {
    constructor() {
        super("cockroach.sql.sqlbase.TableDescriptor.MutationJob", [
            { no: 1, name: "mutation_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "job_id", kind: "scalar", opt: true, T: 3 , L: 0  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TableDescriptor_MutationJob>): TableDescriptor_MutationJob {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TableDescriptor_MutationJob>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableDescriptor_MutationJob): TableDescriptor_MutationJob {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.mutationId = reader.uint32();
                    break;
                case  2:
                    message.jobId = reader.int64().toBigInt();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableDescriptor_MutationJob = /*#__PURE__*/ new TableDescriptor_MutationJob$Type();

class TableDescriptor_SequenceOpts$Type extends MessageType<TableDescriptor_SequenceOpts> {
    constructor() {
        super("cockroach.sql.sqlbase.TableDescriptor.SequenceOpts", [
            { no: 1, name: "increment", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 2, name: "min_value", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 3, name: "max_value", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 4, name: "start", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 5, name: "virtual", kind: "scalar", opt: true, T: 8  },
            { no: 6, name: "sequence_owner", kind: "message", T: () => TableDescriptor_SequenceOpts_SequenceOwner },
            { no: 7, name: "session_cache_size", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 8, name: "as_integer_type", kind: "scalar", opt: true, T: 9  },
            { no: 9, name: "node_cache_size", kind: "scalar", opt: true, T: 3 , L: 0  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TableDescriptor_SequenceOpts>): TableDescriptor_SequenceOpts {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TableDescriptor_SequenceOpts>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableDescriptor_SequenceOpts): TableDescriptor_SequenceOpts {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.increment = reader.int64().toBigInt();
                    break;
                case  2:
                    message.minValue = reader.int64().toBigInt();
                    break;
                case  3:
                    message.maxValue = reader.int64().toBigInt();
                    break;
                case  4:
                    message.start = reader.int64().toBigInt();
                    break;
                case  5:
                    message.virtual = reader.bool();
                    break;
                case  6:
                    message.sequenceOwner = TableDescriptor_SequenceOpts_SequenceOwner.internalBinaryRead(reader, reader.uint32(), options, message.sequenceOwner);
                    break;
                case  7:
                    message.sessionCacheSize = reader.int64().toBigInt();
                    break;
                case  8:
                    message.asIntegerType = reader.string();
                    break;
                case  9:
                    message.nodeCacheSize = reader.int64().toBigInt();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableDescriptor_SequenceOpts = /*#__PURE__*/ new TableDescriptor_SequenceOpts$Type();

class TableDescriptor_SequenceOpts_SequenceOwner$Type extends MessageType<TableDescriptor_SequenceOpts_SequenceOwner> {
    constructor() {
        super("cockroach.sql.sqlbase.TableDescriptor.SequenceOpts.SequenceOwner", [
            { no: 1, name: "owner_column_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "owner_table_id", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TableDescriptor_SequenceOpts_SequenceOwner>): TableDescriptor_SequenceOpts_SequenceOwner {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TableDescriptor_SequenceOpts_SequenceOwner>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableDescriptor_SequenceOpts_SequenceOwner): TableDescriptor_SequenceOpts_SequenceOwner {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.ownerColumnId = reader.uint32();
                    break;
                case  2:
                    message.ownerTableId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableDescriptor_SequenceOpts_SequenceOwner = /*#__PURE__*/ new TableDescriptor_SequenceOpts_SequenceOwner$Type();

class TableDescriptor_Replacement$Type extends MessageType<TableDescriptor_Replacement> {
    constructor() {
        super("cockroach.sql.sqlbase.TableDescriptor.Replacement", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "time", kind: "message", T: () => Timestamp }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TableDescriptor_Replacement>): TableDescriptor_Replacement {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TableDescriptor_Replacement>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableDescriptor_Replacement): TableDescriptor_Replacement {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    message.time = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.time);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableDescriptor_Replacement = /*#__PURE__*/ new TableDescriptor_Replacement$Type();

class ExternalRowData$Type extends MessageType<ExternalRowData> {
    constructor() {
        super("cockroach.sql.sqlbase.ExternalRowData", [
            { no: 1, name: "as_of", kind: "message", T: () => Timestamp },
            { no: 2, name: "tenant_id", kind: "message", T: () => TenantID },
            { no: 3, name: "table_id", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ExternalRowData>): ExternalRowData {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ExternalRowData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExternalRowData): ExternalRowData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.asOf = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.asOf);
                    break;
                case  2:
                    message.tenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.tenantId);
                    break;
                case  3:
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

export const ExternalRowData = /*#__PURE__*/ new ExternalRowData$Type();

class DatabaseDescriptor$Type extends MessageType<DatabaseDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.DatabaseDescriptor", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 4, name: "modification_time", kind: "message", T: () => Timestamp },
            { no: 5, name: "version", kind: "scalar", opt: true, T: 4 , L: 0  },
            { no: 3, name: "privileges", kind: "message", T: () => PrivilegeDescriptor },
            { no: 7, name: "schemas", kind: "map", K: 9 , V: { kind: "message", T: () => DatabaseDescriptor_SchemaInfo } },
            { no: 8, name: "state", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.DescriptorState", DescriptorState] },
            { no: 9, name: "offline_reason", kind: "scalar", opt: true, T: 9  },
            { no: 10, name: "region_config", kind: "message", T: () => DatabaseDescriptor_RegionConfig },
            { no: 11, name: "default_privileges", kind: "message", T: () => DefaultPrivilegeDescriptor },
            { no: 12, name: "declarative_schema_changer_state", kind: "message", T: () => DescriptorState$ },
            { no: 13, name: "system_database_schema_version", kind: "message", T: () => Version },
            { no: 14, name: "replicated_pcr_version", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.goproto_getters": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<DatabaseDescriptor>): DatabaseDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.schemas = {};
        if (value !== undefined)
            reflectionMergePartial<DatabaseDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DatabaseDescriptor): DatabaseDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.id = reader.uint32();
                    break;
                case  4:
                    message.modificationTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.modificationTime);
                    break;
                case  5:
                    message.version = reader.uint64().toBigInt();
                    break;
                case  3:
                    message.privileges = PrivilegeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.privileges);
                    break;
                case  7:
                    this.binaryReadMap7(message.schemas, reader, options);
                    break;
                case  8:
                    message.state = reader.int32();
                    break;
                case  9:
                    message.offlineReason = reader.string();
                    break;
                case  10:
                    message.regionConfig = DatabaseDescriptor_RegionConfig.internalBinaryRead(reader, reader.uint32(), options, message.regionConfig);
                    break;
                case  11:
                    message.defaultPrivileges = DefaultPrivilegeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.defaultPrivileges);
                    break;
                case  12:
                    message.declarativeSchemaChangerState = DescriptorState$.internalBinaryRead(reader, reader.uint32(), options, message.declarativeSchemaChangerState);
                    break;
                case  13:
                    message.systemDatabaseSchemaVersion = Version.internalBinaryRead(reader, reader.uint32(), options, message.systemDatabaseSchemaVersion);
                    break;
                case  14:
                    message.replicatedPcrVersion = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    private binaryReadMap7(map: DatabaseDescriptor["schemas"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof DatabaseDescriptor["schemas"] | undefined, val: DatabaseDescriptor["schemas"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = DatabaseDescriptor_SchemaInfo.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.sqlbase.DatabaseDescriptor.schemas");
            }
        }
        map[key ?? ""] = val ?? DatabaseDescriptor_SchemaInfo.create();
    }

}

export const DatabaseDescriptor = /*#__PURE__*/ new DatabaseDescriptor$Type();

class DatabaseDescriptor_SchemaInfo$Type extends MessageType<DatabaseDescriptor_SchemaInfo> {
    constructor() {
        super("cockroach.sql.sqlbase.DatabaseDescriptor.SchemaInfo", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<DatabaseDescriptor_SchemaInfo>): DatabaseDescriptor_SchemaInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<DatabaseDescriptor_SchemaInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DatabaseDescriptor_SchemaInfo): DatabaseDescriptor_SchemaInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const DatabaseDescriptor_SchemaInfo = /*#__PURE__*/ new DatabaseDescriptor_SchemaInfo$Type();

class DatabaseDescriptor_RegionConfig$Type extends MessageType<DatabaseDescriptor_RegionConfig> {
    constructor() {
        super("cockroach.sql.sqlbase.DatabaseDescriptor.RegionConfig", [
            { no: 2, name: "survival_goal", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.SurvivalGoal", SurvivalGoal] },
            { no: 3, name: "primary_region", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "region_enum_id", kind: "scalar", opt: true, T: 13  },
            { no: 5, name: "placement", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.DataPlacement", DataPlacement] },
            { no: 6, name: "secondary_region", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<DatabaseDescriptor_RegionConfig>): DatabaseDescriptor_RegionConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<DatabaseDescriptor_RegionConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DatabaseDescriptor_RegionConfig): DatabaseDescriptor_RegionConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.survivalGoal = reader.int32();
                    break;
                case  3:
                    message.primaryRegion = reader.string();
                    break;
                case  4:
                    message.regionEnumId = reader.uint32();
                    break;
                case  5:
                    message.placement = reader.int32();
                    break;
                case  6:
                    message.secondaryRegion = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const DatabaseDescriptor_RegionConfig = /*#__PURE__*/ new DatabaseDescriptor_RegionConfig$Type();

class SuperRegion$Type extends MessageType<SuperRegion> {
    constructor() {
        super("cockroach.sql.sqlbase.SuperRegion", [
            { no: 1, name: "super_region_name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "regions", kind: "scalar", repeat: 2 , T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SuperRegion>): SuperRegion {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.regions = [];
        if (value !== undefined)
            reflectionMergePartial<SuperRegion>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SuperRegion): SuperRegion {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.superRegionName = reader.string();
                    break;
                case  2:
                    message.regions.push(reader.string());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SuperRegion = /*#__PURE__*/ new SuperRegion$Type();

class ZoneConfigExtensions$Type extends MessageType<ZoneConfigExtensions> {
    constructor() {
        super("cockroach.sql.sqlbase.ZoneConfigExtensions", [
            { no: 1, name: "global", kind: "message", T: () => ZoneConfig },
            { no: 2, name: "regional", kind: "message", T: () => ZoneConfig },
            { no: 3, name: "regional_in", kind: "map", K: 9 , V: { kind: "message", T: () => ZoneConfig } }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ZoneConfigExtensions>): ZoneConfigExtensions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.regionalIn = {};
        if (value !== undefined)
            reflectionMergePartial<ZoneConfigExtensions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ZoneConfigExtensions): ZoneConfigExtensions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.global = ZoneConfig.internalBinaryRead(reader, reader.uint32(), options, message.global);
                    break;
                case  2:
                    message.regional = ZoneConfig.internalBinaryRead(reader, reader.uint32(), options, message.regional);
                    break;
                case  3:
                    this.binaryReadMap3(message.regionalIn, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    private binaryReadMap3(map: ZoneConfigExtensions["regionalIn"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ZoneConfigExtensions["regionalIn"] | undefined, val: ZoneConfigExtensions["regionalIn"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = ZoneConfig.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.sqlbase.ZoneConfigExtensions.regional_in");
            }
        }
        map[key ?? ""] = val ?? ZoneConfig.create();
    }

}

export const ZoneConfigExtensions = /*#__PURE__*/ new ZoneConfigExtensions$Type();

class TypeDescriptor$Type extends MessageType<TypeDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.TypeDescriptor", [
            { no: 3, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 9, name: "version", kind: "scalar", opt: true, T: 4 , L: 0  },
            { no: 10, name: "modification_time", kind: "message", T: () => Timestamp },
            { no: 14, name: "privileges", kind: "message", T: () => PrivilegeDescriptor },
            { no: 1, name: "parent_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "parent_schema_id", kind: "scalar", opt: true, T: 13  },
            { no: 8, name: "array_type_id", kind: "scalar", opt: true, T: 13  },
            { no: 13, name: "state", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.DescriptorState", DescriptorState] },
            { no: 15, name: "offline_reason", kind: "scalar", opt: true, T: 9  },
            { no: 5, name: "kind", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.TypeDescriptor.Kind", TypeDescriptor_Kind] },
            { no: 12, name: "referencing_descriptor_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 6, name: "enum_members", kind: "message", repeat: 2 , T: () => TypeDescriptor_EnumMember },
            { no: 7, name: "alias", kind: "message", T: () => T },
            { no: 16, name: "region_config", kind: "message", T: () => TypeDescriptor_RegionConfig },
            { no: 17, name: "declarative_schema_changer_state", kind: "message", T: () => DescriptorState$ },
            { no: 18, name: "composite", kind: "message", T: () => TypeDescriptor_Composite },
            { no: 20, name: "replicated_pcr_version", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.goproto_getters": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TypeDescriptor>): TypeDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.referencingDescriptorIds = [];
        message.enumMembers = [];
        if (value !== undefined)
            reflectionMergePartial<TypeDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TypeDescriptor): TypeDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  3:
                    message.name = reader.string();
                    break;
                case  4:
                    message.id = reader.uint32();
                    break;
                case  9:
                    message.version = reader.uint64().toBigInt();
                    break;
                case  10:
                    message.modificationTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.modificationTime);
                    break;
                case  14:
                    message.privileges = PrivilegeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.privileges);
                    break;
                case  1:
                    message.parentId = reader.uint32();
                    break;
                case  2:
                    message.parentSchemaId = reader.uint32();
                    break;
                case  8:
                    message.arrayTypeId = reader.uint32();
                    break;
                case  13:
                    message.state = reader.int32();
                    break;
                case  15:
                    message.offlineReason = reader.string();
                    break;
                case  5:
                    message.kind = reader.int32();
                    break;
                case  12:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.referencingDescriptorIds.push(reader.uint32());
                    else
                        message.referencingDescriptorIds.push(reader.uint32());
                    break;
                case  6:
                    message.enumMembers.push(TypeDescriptor_EnumMember.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.alias = T.internalBinaryRead(reader, reader.uint32(), options, message.alias);
                    break;
                case  16:
                    message.regionConfig = TypeDescriptor_RegionConfig.internalBinaryRead(reader, reader.uint32(), options, message.regionConfig);
                    break;
                case  17:
                    message.declarativeSchemaChangerState = DescriptorState$.internalBinaryRead(reader, reader.uint32(), options, message.declarativeSchemaChangerState);
                    break;
                case  18:
                    message.composite = TypeDescriptor_Composite.internalBinaryRead(reader, reader.uint32(), options, message.composite);
                    break;
                case  20:
                    message.replicatedPcrVersion = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TypeDescriptor = /*#__PURE__*/ new TypeDescriptor$Type();

class TypeDescriptor_EnumMember$Type extends MessageType<TypeDescriptor_EnumMember> {
    constructor() {
        super("cockroach.sql.sqlbase.TypeDescriptor.EnumMember", [
            { no: 1, name: "physical_representation", kind: "scalar", opt: true, T: 12  },
            { no: 2, name: "logical_representation", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "capability", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.TypeDescriptor.EnumMember.Capability", TypeDescriptor_EnumMember_Capability] },
            { no: 4, name: "direction", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.TypeDescriptor.EnumMember.Direction", TypeDescriptor_EnumMember_Direction] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TypeDescriptor_EnumMember>): TypeDescriptor_EnumMember {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TypeDescriptor_EnumMember>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TypeDescriptor_EnumMember): TypeDescriptor_EnumMember {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.physicalRepresentation = reader.bytes();
                    break;
                case  2:
                    message.logicalRepresentation = reader.string();
                    break;
                case  3:
                    message.capability = reader.int32();
                    break;
                case  4:
                    message.direction = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TypeDescriptor_EnumMember = /*#__PURE__*/ new TypeDescriptor_EnumMember$Type();

class TypeDescriptor_RegionConfig$Type extends MessageType<TypeDescriptor_RegionConfig> {
    constructor() {
        super("cockroach.sql.sqlbase.TypeDescriptor.RegionConfig", [
            { no: 1, name: "primary_region", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "super_regions", kind: "message", repeat: 2 , T: () => SuperRegion },
            { no: 3, name: "zone_config_extensions", kind: "message", T: () => ZoneConfigExtensions },
            { no: 4, name: "secondary_region", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TypeDescriptor_RegionConfig>): TypeDescriptor_RegionConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.superRegions = [];
        if (value !== undefined)
            reflectionMergePartial<TypeDescriptor_RegionConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TypeDescriptor_RegionConfig): TypeDescriptor_RegionConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.primaryRegion = reader.string();
                    break;
                case  2:
                    message.superRegions.push(SuperRegion.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.zoneConfigExtensions = ZoneConfigExtensions.internalBinaryRead(reader, reader.uint32(), options, message.zoneConfigExtensions);
                    break;
                case  4:
                    message.secondaryRegion = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TypeDescriptor_RegionConfig = /*#__PURE__*/ new TypeDescriptor_RegionConfig$Type();

class TypeDescriptor_Composite$Type extends MessageType<TypeDescriptor_Composite> {
    constructor() {
        super("cockroach.sql.sqlbase.TypeDescriptor.Composite", [
            { no: 1, name: "elements", kind: "message", repeat: 2 , T: () => TypeDescriptor_Composite_CompositeElement }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TypeDescriptor_Composite>): TypeDescriptor_Composite {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.elements = [];
        if (value !== undefined)
            reflectionMergePartial<TypeDescriptor_Composite>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TypeDescriptor_Composite): TypeDescriptor_Composite {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.elements.push(TypeDescriptor_Composite_CompositeElement.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TypeDescriptor_Composite = /*#__PURE__*/ new TypeDescriptor_Composite$Type();

class TypeDescriptor_Composite_CompositeElement$Type extends MessageType<TypeDescriptor_Composite_CompositeElement> {
    constructor() {
        super("cockroach.sql.sqlbase.TypeDescriptor.Composite.CompositeElement", [
            { no: 1, name: "element_type", kind: "message", T: () => T },
            { no: 2, name: "element_label", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TypeDescriptor_Composite_CompositeElement>): TypeDescriptor_Composite_CompositeElement {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TypeDescriptor_Composite_CompositeElement>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TypeDescriptor_Composite_CompositeElement): TypeDescriptor_Composite_CompositeElement {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.elementType = T.internalBinaryRead(reader, reader.uint32(), options, message.elementType);
                    break;
                case  2:
                    message.elementLabel = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TypeDescriptor_Composite_CompositeElement = /*#__PURE__*/ new TypeDescriptor_Composite_CompositeElement$Type();

class SchemaDescriptor$Type extends MessageType<SchemaDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.SchemaDescriptor", [
            { no: 2, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 8, name: "state", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.DescriptorState", DescriptorState] },
            { no: 9, name: "offline_reason", kind: "scalar", opt: true, T: 9  },
            { no: 5, name: "modification_time", kind: "message", T: () => Timestamp },
            { no: 6, name: "version", kind: "scalar", opt: true, T: 4 , L: 0  },
            { no: 1, name: "parent_id", kind: "scalar", opt: true, T: 13  },
            { no: 4, name: "privileges", kind: "message", T: () => PrivilegeDescriptor },
            { no: 10, name: "default_privileges", kind: "message", T: () => DefaultPrivilegeDescriptor },
            { no: 11, name: "declarative_schema_changer_state", kind: "message", T: () => DescriptorState$ },
            { no: 13, name: "functions", kind: "map", K: 9 , V: { kind: "message", T: () => SchemaDescriptor_Function } },
            { no: 14, name: "replicated_pcr_version", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.goproto_getters": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SchemaDescriptor>): SchemaDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.functions = {};
        if (value !== undefined)
            reflectionMergePartial<SchemaDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaDescriptor): SchemaDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.name = reader.string();
                    break;
                case  3:
                    message.id = reader.uint32();
                    break;
                case  8:
                    message.state = reader.int32();
                    break;
                case  9:
                    message.offlineReason = reader.string();
                    break;
                case  5:
                    message.modificationTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.modificationTime);
                    break;
                case  6:
                    message.version = reader.uint64().toBigInt();
                    break;
                case  1:
                    message.parentId = reader.uint32();
                    break;
                case  4:
                    message.privileges = PrivilegeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.privileges);
                    break;
                case  10:
                    message.defaultPrivileges = DefaultPrivilegeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.defaultPrivileges);
                    break;
                case  11:
                    message.declarativeSchemaChangerState = DescriptorState$.internalBinaryRead(reader, reader.uint32(), options, message.declarativeSchemaChangerState);
                    break;
                case  13:
                    this.binaryReadMap13(message.functions, reader, options);
                    break;
                case  14:
                    message.replicatedPcrVersion = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    private binaryReadMap13(map: SchemaDescriptor["functions"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof SchemaDescriptor["functions"] | undefined, val: SchemaDescriptor["functions"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = SchemaDescriptor_Function.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.sqlbase.SchemaDescriptor.functions");
            }
        }
        map[key ?? ""] = val ?? SchemaDescriptor_Function.create();
    }

}

export const SchemaDescriptor = /*#__PURE__*/ new SchemaDescriptor$Type();

class SchemaDescriptor_FunctionSignature$Type extends MessageType<SchemaDescriptor_FunctionSignature> {
    constructor() {
        super("cockroach.sql.sqlbase.SchemaDescriptor.FunctionSignature", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "arg_types", kind: "message", repeat: 2 , T: () => T },
            { no: 3, name: "return_type", kind: "message", T: () => T },
            { no: 4, name: "return_set", kind: "scalar", opt: true, T: 8  },
            { no: 5, name: "is_procedure", kind: "scalar", opt: true, T: 8  },
            { no: 6, name: "out_param_ordinals", kind: "scalar", repeat: 2 , T: 5  },
            { no: 7, name: "out_param_types", kind: "message", repeat: 2 , T: () => T },
            { no: 8, name: "default_exprs", kind: "scalar", repeat: 2 , T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SchemaDescriptor_FunctionSignature>): SchemaDescriptor_FunctionSignature {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.argTypes = [];
        message.outParamOrdinals = [];
        message.outParamTypes = [];
        message.defaultExprs = [];
        if (value !== undefined)
            reflectionMergePartial<SchemaDescriptor_FunctionSignature>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaDescriptor_FunctionSignature): SchemaDescriptor_FunctionSignature {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    message.argTypes.push(T.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.returnType = T.internalBinaryRead(reader, reader.uint32(), options, message.returnType);
                    break;
                case  4:
                    message.returnSet = reader.bool();
                    break;
                case  5:
                    message.isProcedure = reader.bool();
                    break;
                case  6:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.outParamOrdinals.push(reader.int32());
                    else
                        message.outParamOrdinals.push(reader.int32());
                    break;
                case  7:
                    message.outParamTypes.push(T.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  8:
                    message.defaultExprs.push(reader.string());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SchemaDescriptor_FunctionSignature = /*#__PURE__*/ new SchemaDescriptor_FunctionSignature$Type();

class SchemaDescriptor_Function$Type extends MessageType<SchemaDescriptor_Function> {
    constructor() {
        super("cockroach.sql.sqlbase.SchemaDescriptor.Function", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "signatures", kind: "message", repeat: 2 , T: () => SchemaDescriptor_FunctionSignature }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SchemaDescriptor_Function>): SchemaDescriptor_Function {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.signatures = [];
        if (value !== undefined)
            reflectionMergePartial<SchemaDescriptor_Function>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaDescriptor_Function): SchemaDescriptor_Function {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.signatures.push(SchemaDescriptor_FunctionSignature.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SchemaDescriptor_Function = /*#__PURE__*/ new SchemaDescriptor_Function$Type();

class FunctionDescriptor$Type extends MessageType<FunctionDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.FunctionDescriptor", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "parent_id", kind: "scalar", opt: true, T: 13  },
            { no: 4, name: "parent_schema_id", kind: "scalar", opt: true, T: 13  },
            { no: 5, name: "params", kind: "message", repeat: 2 , T: () => FunctionDescriptor_Parameter },
            { no: 6, name: "return_type", kind: "message", T: () => FunctionDescriptor_ReturnType },
            { no: 7, name: "lang", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.Language", Function_Language] },
            { no: 8, name: "function_body", kind: "scalar", opt: true, T: 9  },
            { no: 9, name: "volatility", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.Volatility", Function_Volatility] },
            { no: 10, name: "leak_proof", kind: "scalar", opt: true, T: 8  },
            { no: 11, name: "null_input_behavior", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.NullInputBehavior", Function_NullInputBehavior] },
            { no: 12, name: "privileges", kind: "message", T: () => PrivilegeDescriptor },
            { no: 13, name: "depends_on", kind: "scalar", repeat: 2 , T: 13  },
            { no: 14, name: "depends_on_types", kind: "scalar", repeat: 2 , T: 13  },
            { no: 15, name: "depended_on_by", kind: "message", repeat: 2 , T: () => FunctionDescriptor_Reference },
            { no: 16, name: "state", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.DescriptorState", DescriptorState] },
            { no: 17, name: "offline_reason", kind: "scalar", opt: true, T: 9  },
            { no: 18, name: "version", kind: "scalar", opt: true, T: 13  },
            { no: 19, name: "modification_time", kind: "message", T: () => Timestamp },
            { no: 20, name: "declarative_schema_changer_state", kind: "message", T: () => DescriptorState$ },
            { no: 21, name: "is_procedure", kind: "scalar", opt: true, T: 8  },
            { no: 22, name: "depends_on_functions", kind: "scalar", repeat: 2 , T: 13  },
            { no: 23, name: "security", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.Security", Function_Security] },
            { no: 24, name: "replicated_pcr_version", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.goproto_getters": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<FunctionDescriptor>): FunctionDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.params = [];
        message.dependsOn = [];
        message.dependsOnTypes = [];
        message.dependedOnBy = [];
        message.dependsOnFunctions = [];
        if (value !== undefined)
            reflectionMergePartial<FunctionDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionDescriptor): FunctionDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.id = reader.uint32();
                    break;
                case  3:
                    message.parentId = reader.uint32();
                    break;
                case  4:
                    message.parentSchemaId = reader.uint32();
                    break;
                case  5:
                    message.params.push(FunctionDescriptor_Parameter.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.returnType = FunctionDescriptor_ReturnType.internalBinaryRead(reader, reader.uint32(), options, message.returnType);
                    break;
                case  7:
                    message.lang = reader.int32();
                    break;
                case  8:
                    message.functionBody = reader.string();
                    break;
                case  9:
                    message.volatility = reader.int32();
                    break;
                case  10:
                    message.leakProof = reader.bool();
                    break;
                case  11:
                    message.nullInputBehavior = reader.int32();
                    break;
                case  12:
                    message.privileges = PrivilegeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.privileges);
                    break;
                case  13:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOn.push(reader.uint32());
                    else
                        message.dependsOn.push(reader.uint32());
                    break;
                case  14:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOnTypes.push(reader.uint32());
                    else
                        message.dependsOnTypes.push(reader.uint32());
                    break;
                case  15:
                    message.dependedOnBy.push(FunctionDescriptor_Reference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  16:
                    message.state = reader.int32();
                    break;
                case  17:
                    message.offlineReason = reader.string();
                    break;
                case  18:
                    message.version = reader.uint32();
                    break;
                case  19:
                    message.modificationTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.modificationTime);
                    break;
                case  20:
                    message.declarativeSchemaChangerState = DescriptorState$.internalBinaryRead(reader, reader.uint32(), options, message.declarativeSchemaChangerState);
                    break;
                case  21:
                    message.isProcedure = reader.bool();
                    break;
                case  22:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.dependsOnFunctions.push(reader.uint32());
                    else
                        message.dependsOnFunctions.push(reader.uint32());
                    break;
                case  23:
                    message.security = reader.int32();
                    break;
                case  24:
                    message.replicatedPcrVersion = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionDescriptor = /*#__PURE__*/ new FunctionDescriptor$Type();

class FunctionDescriptor_Parameter$Type extends MessageType<FunctionDescriptor_Parameter> {
    constructor() {
        super("cockroach.sql.sqlbase.FunctionDescriptor.Parameter", [
            { no: 1, name: "class", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.Param.Class", Function_Param_Class] },
            { no: 2, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "type", kind: "message", T: () => T },
            { no: 4, name: "default_expr", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<FunctionDescriptor_Parameter>): FunctionDescriptor_Parameter {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FunctionDescriptor_Parameter>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionDescriptor_Parameter): FunctionDescriptor_Parameter {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.class = reader.int32();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  3:
                    message.type = T.internalBinaryRead(reader, reader.uint32(), options, message.type);
                    break;
                case  4:
                    message.defaultExpr = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionDescriptor_Parameter = /*#__PURE__*/ new FunctionDescriptor_Parameter$Type();

class FunctionDescriptor_ReturnType$Type extends MessageType<FunctionDescriptor_ReturnType> {
    constructor() {
        super("cockroach.sql.sqlbase.FunctionDescriptor.ReturnType", [
            { no: 1, name: "type", kind: "message", T: () => T },
            { no: 2, name: "return_set", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<FunctionDescriptor_ReturnType>): FunctionDescriptor_ReturnType {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FunctionDescriptor_ReturnType>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionDescriptor_ReturnType): FunctionDescriptor_ReturnType {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.type = T.internalBinaryRead(reader, reader.uint32(), options, message.type);
                    break;
                case  2:
                    message.returnSet = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionDescriptor_ReturnType = /*#__PURE__*/ new FunctionDescriptor_ReturnType$Type();

class FunctionDescriptor_Reference$Type extends MessageType<FunctionDescriptor_Reference> {
    constructor() {
        super("cockroach.sql.sqlbase.FunctionDescriptor.Reference", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "index_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 3, name: "column_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 4, name: "constraint_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 5, name: "trigger_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 6, name: "policy_ids", kind: "scalar", repeat: 2 , T: 13  },
            { no: 7, name: "view_query", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<FunctionDescriptor_Reference>): FunctionDescriptor_Reference {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.indexIds = [];
        message.columnIds = [];
        message.constraintIds = [];
        message.triggerIds = [];
        message.policyIds = [];
        if (value !== undefined)
            reflectionMergePartial<FunctionDescriptor_Reference>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionDescriptor_Reference): FunctionDescriptor_Reference {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.indexIds.push(reader.uint32());
                    else
                        message.indexIds.push(reader.uint32());
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  4:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.constraintIds.push(reader.uint32());
                    else
                        message.constraintIds.push(reader.uint32());
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.triggerIds.push(reader.uint32());
                    else
                        message.triggerIds.push(reader.uint32());
                    break;
                case  6:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.policyIds.push(reader.uint32());
                    else
                        message.policyIds.push(reader.uint32());
                    break;
                case  7:
                    message.viewQuery = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionDescriptor_Reference = /*#__PURE__*/ new FunctionDescriptor_Reference$Type();

class Descriptor$Type extends MessageType<Descriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.Descriptor", [
            { no: 1, name: "table", kind: "message", oneof: "union", T: () => TableDescriptor },
            { no: 2, name: "database", kind: "message", oneof: "union", T: () => DatabaseDescriptor },
            { no: 3, name: "type", kind: "message", oneof: "union", T: () => TypeDescriptor },
            { no: 4, name: "schema", kind: "message", oneof: "union", T: () => SchemaDescriptor },
            { no: 5, name: "function", kind: "message", oneof: "union", T: () => FunctionDescriptor }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Descriptor>): Descriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.union = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<Descriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Descriptor): Descriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.union = {
                        oneofKind: "table",
                        table: TableDescriptor.internalBinaryRead(reader, reader.uint32(), options, (message.union as any).table)
                    };
                    break;
                case  2:
                    message.union = {
                        oneofKind: "database",
                        database: DatabaseDescriptor.internalBinaryRead(reader, reader.uint32(), options, (message.union as any).database)
                    };
                    break;
                case  3:
                    message.union = {
                        oneofKind: "type",
                        type: TypeDescriptor.internalBinaryRead(reader, reader.uint32(), options, (message.union as any).type)
                    };
                    break;
                case  4:
                    message.union = {
                        oneofKind: "schema",
                        schema: SchemaDescriptor.internalBinaryRead(reader, reader.uint32(), options, (message.union as any).schema)
                    };
                    break;
                case  5:
                    message.union = {
                        oneofKind: "function",
                        function: FunctionDescriptor.internalBinaryRead(reader, reader.uint32(), options, (message.union as any).function)
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

export const Descriptor = /*#__PURE__*/ new Descriptor$Type();
