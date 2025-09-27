// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { FunctionSecurity as FunctionSecurity$ } from "../../catalog/catpb/function";
import { FunctionLanguage } from "../../catalog/catpb/function";
import { FunctionNullInputBehavior as FunctionNullInputBehavior$ } from "../../catalog/catpb/function";
import { FunctionVolatility as FunctionVolatility$ } from "../../catalog/catpb/function";
import { FunctionParamClass } from "../../catalog/catpb/function";
import { SubzoneSpan } from "../../../config/zonepb/zone";
import { Subzone } from "../../../config/zonepb/zone";
import { IndexColumn_Direction } from "../../catalog/catenumpb/index";
import { RowLevelTTL as RowLevelTTL$ } from "../../catalog/catpb/catalog";
import { PartitioningDescriptor } from "../../catalog/catpb/catalog";
import { ZoneConfig } from "../../../config/zonepb/zone";
import { TriggerEventType } from "../../sem/semenumpb/trigger";
import { TriggerActionTime } from "../../sem/semenumpb/trigger";
import { Match } from "../../sem/semenumpb/constraint";
import { ForeignKeyAction } from "../../sem/semenumpb/constraint";
import { Config as Config$ } from "../../vecindex/vecpb/vec";
import { Config } from "../../../geo/geopb/config";
import { ShardedDescriptor } from "../../catalog/catpb/catalog";
import { T as T$ } from "../../sem/idxtype/idxtype";
import { T } from "../../types/types";

export interface ElementProto {

    elementOneOf: {
        oneofKind: "database";

        database: Database;
    } | {
        oneofKind: "schema";

        schema: Schema;
    } | {
        oneofKind: "view";

        view: View;
    } | {
        oneofKind: "sequence";

        sequence: Sequence;
    } | {
        oneofKind: "table";

        table: Table;
    } | {
        oneofKind: "enumType";

        enumType: EnumType;
    } | {
        oneofKind: "aliasType";

        aliasType: AliasType;
    } | {
        oneofKind: "compositeType";

        compositeType: CompositeType;
    } | {
        oneofKind: "function";

        function: Function;
    } | {
        oneofKind: "namedRangeZoneConfig";

        namedRangeZoneConfig: NamedRangeZoneConfig;
    } | {
        oneofKind: "columnFamily";

        columnFamily: ColumnFamily;
    } | {
        oneofKind: "column";

        column: Column;
    } | {
        oneofKind: "primaryIndex";

        primaryIndex: PrimaryIndex;
    } | {
        oneofKind: "secondaryIndex";

        secondaryIndex: SecondaryIndex;
    } | {
        oneofKind: "temporaryIndex";

        temporaryIndex: TemporaryIndex;
    } | {
        oneofKind: "uniqueWithoutIndexConstraint";

        uniqueWithoutIndexConstraint: UniqueWithoutIndexConstraint;
    } | {
        oneofKind: "uniqueWithoutIndexConstraintUnvalidated";

        uniqueWithoutIndexConstraintUnvalidated: UniqueWithoutIndexConstraintUnvalidated;
    } | {
        oneofKind: "checkConstraint";

        checkConstraint: CheckConstraint;
    } | {
        oneofKind: "checkConstraintUnvalidated";

        checkConstraintUnvalidated: CheckConstraintUnvalidated;
    } | {
        oneofKind: "foreignKeyConstraint";

        foreignKeyConstraint: ForeignKeyConstraint;
    } | {
        oneofKind: "foreignKeyConstraintUnvalidated";

        foreignKeyConstraintUnvalidated: ForeignKeyConstraintUnvalidated;
    } | {
        oneofKind: "tableComment";

        tableComment: TableComment;
    } | {
        oneofKind: "rowLevelTtl";

        rowLevelTtl: RowLevelTTL;
    } | {
        oneofKind: "tableZoneConfig";

        tableZoneConfig: TableZoneConfig;
    } | {
        oneofKind: "indexZoneConfig";

        indexZoneConfig: IndexZoneConfig;
    } | {
        oneofKind: "tableData";

        tableData: TableData;
    } | {
        oneofKind: "tablePartitioning";

        tablePartitioning: TablePartitioning;
    } | {
        oneofKind: "tableSchemaLocked";

        tableSchemaLocked: TableSchemaLocked;
    } | {
        oneofKind: "ldrJobIds";

        ldrJobIds: LDRJobIDs;
    } | {
        oneofKind: "partitionZoneConfig";

        partitionZoneConfig: PartitionZoneConfig;
    } | {
        oneofKind: "trigger";

        trigger: Trigger;
    } | {
        oneofKind: "policy";

        policy: Policy;
    } | {
        oneofKind: "rowLevelSecurityEnabled";

        rowLevelSecurityEnabled: RowLevelSecurityEnabled;
    } | {
        oneofKind: "rowLevelSecurityForced";

        rowLevelSecurityForced: RowLevelSecurityForced;
    } | {
        oneofKind: "tableLocalityGlobal";

        tableLocalityGlobal: TableLocalityGlobal;
    } | {
        oneofKind: "tableLocalityPrimaryRegion";

        tableLocalityPrimaryRegion: TableLocalityPrimaryRegion;
    } | {
        oneofKind: "tableLocalitySecondaryRegion";

        tableLocalitySecondaryRegion: TableLocalitySecondaryRegion;
    } | {
        oneofKind: "tableLocalityRegionalByRow";

        tableLocalityRegionalByRow: TableLocalityRegionalByRow;
    } | {
        oneofKind: "tableLocalityRegionalByRowUsingConstraint";

        tableLocalityRegionalByRowUsingConstraint: TableLocalityRegionalByRowUsingConstraint;
    } | {
        oneofKind: "columnName";

        columnName: ColumnName;
    } | {
        oneofKind: "columnType";

        columnType: ColumnType;
    } | {
        oneofKind: "columnDefaultExpression";

        columnDefaultExpression: ColumnDefaultExpression;
    } | {
        oneofKind: "columnOnUpdateExpression";

        columnOnUpdateExpression: ColumnOnUpdateExpression;
    } | {
        oneofKind: "sequenceOwner";

        sequenceOwner: SequenceOwner;
    } | {
        oneofKind: "columnComment";

        columnComment: ColumnComment;
    } | {
        oneofKind: "columnNotNull";

        columnNotNull: ColumnNotNull;
    } | {
        oneofKind: "columnComputeExpression";

        columnComputeExpression: ColumnComputeExpression;
    } | {
        oneofKind: "sequenceOption";

        sequenceOption: SequenceOption;
    } | {
        oneofKind: "indexName";

        indexName: IndexName;
    } | {
        oneofKind: "indexPartitioning";

        indexPartitioning: IndexPartitioning;
    } | {
        oneofKind: "indexComment";

        indexComment: IndexComment;
    } | {
        oneofKind: "indexColumn";

        indexColumn: IndexColumn;
    } | {
        oneofKind: "indexData";

        indexData: IndexData;
    } | {
        oneofKind: "constraintWithoutIndexName";

        constraintWithoutIndexName: ConstraintWithoutIndexName;
    } | {
        oneofKind: "constraintComment";

        constraintComment: ConstraintComment;
    } | {
        oneofKind: "namespace";

        namespace: Namespace;
    } | {
        oneofKind: "owner";

        owner: Owner;
    } | {
        oneofKind: "userPrivileges";

        userPrivileges: UserPrivileges;
    } | {
        oneofKind: "databaseRegionConfig";

        databaseRegionConfig: DatabaseRegionConfig;
    } | {
        oneofKind: "databaseRoleSetting";

        databaseRoleSetting: DatabaseRoleSetting;
    } | {
        oneofKind: "databaseComment";

        databaseComment: DatabaseComment;
    } | {
        oneofKind: "databaseData";

        databaseData: DatabaseData;
    } | {
        oneofKind: "databaseZoneConfig";

        databaseZoneConfig: DatabaseZoneConfig;
    } | {
        oneofKind: "schemaParent";

        schemaParent: SchemaParent;
    } | {
        oneofKind: "schemaComment";

        schemaComment: SchemaComment;
    } | {
        oneofKind: "schemaChild";

        schemaChild: SchemaChild;
    } | {
        oneofKind: "enumTypeValue";

        enumTypeValue: EnumTypeValue;
    } | {
        oneofKind: "compositeTypeAttrType";

        compositeTypeAttrType: CompositeTypeAttrType;
    } | {
        oneofKind: "compositeTypeAttrName";

        compositeTypeAttrName: CompositeTypeAttrName;
    } | {
        oneofKind: "functionName";

        functionName: FunctionName;
    } | {
        oneofKind: "functionVolatility";

        functionVolatility: FunctionVolatility;
    } | {
        oneofKind: "functionLeakProof";

        functionLeakProof: FunctionLeakProof;
    } | {
        oneofKind: "functionNullInputBehavior";

        functionNullInputBehavior: FunctionNullInputBehavior;
    } | {
        oneofKind: "functionBody";

        functionBody: FunctionBody;
    } | {
        oneofKind: "functionSecurity";

        functionSecurity: FunctionSecurity;
    } | {
        oneofKind: "typeComment";

        typeComment: TypeComment;
    } | {
        oneofKind: "triggerName";

        triggerName: TriggerName;
    } | {
        oneofKind: "triggerEnabled";

        triggerEnabled: TriggerEnabled;
    } | {
        oneofKind: "triggerTiming";

        triggerTiming: TriggerTiming;
    } | {
        oneofKind: "triggerEvents";

        triggerEvents: TriggerEvents;
    } | {
        oneofKind: "triggerTransition";

        triggerTransition: TriggerTransition;
    } | {
        oneofKind: "triggerWhen";

        triggerWhen: TriggerWhen;
    } | {
        oneofKind: "triggerFunctionCall";

        triggerFunctionCall: TriggerFunctionCall;
    } | {
        oneofKind: "triggerDeps";

        triggerDeps: TriggerDeps;
    } | {
        oneofKind: "policyName";

        policyName: PolicyName;
    } | {
        oneofKind: "policyRole";

        policyRole: PolicyRole;
    } | {
        oneofKind: "policyUsingExpr";

        policyUsingExpr: PolicyUsingExpr;
    } | {
        oneofKind: "policyWithCheckExpr";

        policyWithCheckExpr: PolicyWithCheckExpr;
    } | {
        oneofKind: "policyDeps";

        policyDeps: PolicyDeps;
    } | {
        oneofKind: undefined;
    };
}

export interface TypeT {

    type?: T;

    closedTypeIds: number[];

    typeName: string;
}

export interface Expression {

    expr: string;

    usesTypeIds: number[];

    usesSequenceIds: number[];

    referencedColumnIds: number[];

    usesFunctionIds: number[];
}

export interface Column {

    tableId: number;

    columnId: number;

    isHidden: boolean;

    isInaccessible: boolean;

    generatedAsIdentityType: number;

    generatedAsIdentitySequenceOption: string;

    pgAttributeNum: number;

    isSystemColumn: boolean;
}

export interface ColumnType {

    tableId: number;

    familyId: number;

    columnId: number;

    embeddedTypeT?: TypeT;

    isNullable: boolean;

    computeExpr?: Expression;

    isVirtual: boolean;

    elementCreationMetadata?: ElementCreationMetadata;

    columnFamilyOrderFollowsColumnId: number;
}

export interface ColumnComputeExpression {

    tableId: number;

    columnId: number;

    embeddedExpr?: Expression;

    usage: ColumnComputeExpression_Usage;
}

export enum ColumnComputeExpression_Usage {

    REGULAR = 0,

    ALTER_TYPE_USING = 1
}

export interface ColumnFamily {

    tableId: number;

    familyId: number;

    name: string;
}

export interface Index {

    tableId: number;

    indexId: number;

    isUnique: boolean;

    isInverted: boolean;

    type: T$;

    sharding?: ShardedDescriptor;

    isCreatedExplicitly: boolean;

    constraintId: number;

    isConcurrently: boolean;

    sourceIndexId: number;

    temporaryIndexId: number;

    geoConfig?: Config;

    isNotVisible: boolean;

    invisibility: number;

    vecConfig?: Config$;
}

export interface PrimaryIndex {

    embeddedIndex?: Index;
}

export interface SecondaryIndex {

    embeddedIndex?: Index;

    embeddedExpr?: Expression;

    recreateSourceId: number;

    recreateTargetId: number;

    hideForPrimaryKeyRecreated: boolean;
}

export interface TemporaryIndex {

    embeddedIndex?: Index;

    isUsingSecondaryEncoding: boolean;

    expr?: Expression;
}

export interface SchemaParent {

    schemaId: number;

    parentDatabaseId: number;
}

export interface SchemaChild {

    childObjectId: number;

    schemaId: number;
}

export interface Policy {

    tableId: number;

    policyId: number;

    type: number;

    command: number;
}

export interface PolicyName {

    tableId: number;

    policyId: number;

    name: string;
}

export interface PolicyRole {

    tableId: number;

    policyId: number;

    roleName: string;
}

export interface PolicyUsingExpr {

    tableId: number;

    policyId: number;

    embeddedExpr?: Expression;
}

export interface PolicyWithCheckExpr {

    tableId: number;

    policyId: number;

    embeddedExpr?: Expression;
}

export interface PolicyDeps {

    tableId: number;

    policyId: number;

    usesTypeIds: number[];

    usesRelationIds: number[];

    usesFunctionIds: number[];
}

export interface RowLevelSecurityEnabled {

    tableId: number;
}

export interface RowLevelSecurityForced {

    tableId: number;

    isForced: boolean;
}

export interface Sequence {

    sequenceId: number;

    restartWith: bigint;

    useRestartWith: boolean;

    isTemporary: boolean;
}

export interface SequenceOption {

    sequenceId: number;

    key: string;

    value: string;
}

export interface SequenceOwner {

    sequenceId: number;

    tableId: number;

    columnId: number;
}

export interface ColumnDefaultExpression {

    tableId: number;

    columnId: number;

    embeddedExpr?: Expression;
}

export interface ColumnOnUpdateExpression {

    tableId: number;

    columnId: number;

    embeddedExpr?: Expression;
}

export interface View {

    viewId: number;

    usesTypeIds: number[];

    usesRelationIds: number[];

    usesRoutineIds: number[];

    forwardReferences: View_Reference[];

    isTemporary: boolean;

    isMaterialized: boolean;
}

export interface View_Reference {

    toId: number;

    indexId: number;

    columnIds: number[];
}

export interface Table {

    tableId: number;

    isTemporary: boolean;
}

export interface UniqueWithoutIndexConstraint {

    tableId: number;

    constraintId: number;

    columnIds: number[];

    predicate?: Expression;

    indexIdForValidation: number;
}

export interface UniqueWithoutIndexConstraintUnvalidated {

    tableId: number;

    constraintId: number;

    columnIds: number[];

    predicate?: Expression;
}

export interface CheckConstraint {

    tableId: number;

    constraintId: number;

    columnIds: number[];

    embeddedExpr?: Expression;

    fromHashShardedColumn: boolean;

    indexIdForValidation: number;
}

export interface CheckConstraintUnvalidated {

    tableId: number;

    constraintId: number;

    columnIds: number[];

    embeddedExpr?: Expression;
}

export interface ForeignKeyConstraint {

    tableId: number;

    constraintId: number;

    columnIds: number[];

    referencedTableId: number;

    referencedColumnIds: number[];

    onUpdateAction: ForeignKeyAction;

    onDeleteAction: ForeignKeyAction;

    compositeKeyMatchMethod: Match;

    indexIdForValidation: number;
}

export interface ForeignKeyConstraintUnvalidated {

    tableId: number;

    constraintId: number;

    columnIds: number[];

    referencedTableId: number;

    referencedColumnIds: number[];

    onUpdateAction: ForeignKeyAction;

    onDeleteAction: ForeignKeyAction;

    compositeKeyMatchMethod: Match;
}

export interface Trigger {

    tableId: number;

    triggerId: number;
}

export interface TriggerName {

    tableId: number;

    triggerId: number;

    name: string;
}

export interface TriggerEnabled {

    tableId: number;

    triggerId: number;

    enabled: boolean;
}

export interface TriggerTiming {

    tableId: number;

    triggerId: number;

    actionTime: TriggerActionTime;

    forEachRow: boolean;
}

export interface TriggerEvent {

    type: TriggerEventType;

    columnNames: string[];
}

export interface TriggerEvents {

    tableId: number;

    triggerId: number;

    events: TriggerEvent[];
}

export interface TriggerTransition {

    tableId: number;

    triggerId: number;

    newTransitionAlias: string;

    oldTransitionAlias: string;
}

export interface TriggerWhen {

    tableId: number;

    triggerId: number;

    whenExpr: string;
}

export interface TriggerFunctionCall {

    tableId: number;

    triggerId: number;

    funcId: number;

    funcArgs: string[];

    funcBody: string;
}

export interface TriggerDeps {

    tableId: number;

    triggerId: number;

    usesRelationIds: number[];

    usesRelations: TriggerDeps_RelationReference[];

    usesTypeIds: number[];

    usesRoutineIds: number[];
}

export interface TriggerDeps_RelationReference {

    id: number;

    columnIds: number[];

    indexId: number;
}

export interface EnumType {

    typeId: number;

    arrayTypeId: number;

    isMultiRegion: boolean;
}

export interface AliasType {

    typeId: number;

    embeddedTypeT?: TypeT;
}

export interface CompositeType {

    typeId: number;

    arrayTypeId: number;
}

export interface Schema {

    schemaId: number;

    isTemporary: boolean;

    isPublic: boolean;

    isVirtual: boolean;
}

export interface Database {

    databaseId: number;
}

export interface Namespace {

    databaseId: number;

    schemaId: number;

    descriptorId: number;

    name: string;
}

export interface Owner {

    descriptorId: number;

    owner: string;
}

export interface UserPrivileges {

    descriptorId: number;

    userName: string;

    privileges: bigint;

    withGrantOption: bigint;
}

export interface NamedRangeZoneConfig {

    rangeId: number;

    zoneConfig?: ZoneConfig;

    seqNum: number;
}

export interface TableLocalityGlobal {

    tableId: number;
}

export interface TableLocalityPrimaryRegion {

    tableId: number;
}

export interface TableLocalitySecondaryRegion {

    tableId: number;

    regionEnumTypeId: number;

    regionName: string;
}

export interface TableLocalityRegionalByRow {

    tableId: number;

    as: string;
}

export interface TableLocalityRegionalByRowUsingConstraint {

    tableId: number;

    constraintId: number;
}

export interface IndexPartitioning {

    tableId: number;

    indexId: number;

    partitioning?: PartitioningDescriptor;
}

export interface RowLevelTTL {

    tableId: number;

    rowLevelTtl?: RowLevelTTL$;

    ttlExpr?: Expression;
}

export interface ColumnName {

    tableId: number;

    columnId: number;

    name: string;
}

export interface IndexName {

    tableId: number;

    indexId: number;

    name: string;
}

export interface ConstraintWithoutIndexName {

    tableId: number;

    constraintId: number;

    name: string;
}

export interface TableComment {

    tableId: number;

    comment: string;
}

export interface TypeComment {

    typeId: number;

    comment: string;
}

export interface DatabaseComment {

    databaseId: number;

    comment: string;
}

export interface SchemaComment {

    schemaId: number;

    comment: string;
}

export interface IndexComment {

    tableId: number;

    indexId: number;

    comment: string;
}

export interface ColumnComment {

    tableId: number;

    columnId: number;

    comment: string;

    pgAttributeNum: number;
}

export interface ColumnNotNull {

    tableId: number;

    columnId: number;

    indexIdForValidation: number;
}

export interface ConstraintComment {

    tableId: number;

    constraintId: number;

    comment: string;
}

export interface DatabaseRegionConfig {

    databaseId: number;

    regionEnumTypeId: number;
}

export interface DatabaseRoleSetting {

    databaseId: number;

    roleName: string;
}

export interface IndexColumn {

    tableId: number;

    indexId: number;

    columnId: number;

    ordinalInKind: number;

    kind: IndexColumn_Kind;

    direction: IndexColumn_Direction;

    implicit: boolean;

    invertedKind: number;
}

export enum IndexColumn_Kind {

    KEY = 0,

    KEY_SUFFIX = 1,

    STORED = 2
}

export interface EnumTypeValue {

    typeId: number;

    physicalRepresentation: Uint8Array;

    logicalRepresentation: string;
}

export interface CompositeTypeAttrName {

    compositeTypeId: number;

    name: string;
}

export interface CompositeTypeAttrType {

    compositeTypeId: number;

    embeddedTypeT?: TypeT;
}

export interface DatabaseZoneConfig {

    databaseId: number;

    zoneConfig?: ZoneConfig;

    seqNum: number;
}

export interface TableZoneConfig {

    tableId: number;

    zoneConfig?: ZoneConfig;

    seqNum: number;
}

export interface IndexZoneConfig {

    tableId: number;

    indexId: number;

    subzone?: Subzone;

    subzoneSpans: SubzoneSpan[];

    seqNum: number;

    oldIdxRef: number;
}

export interface PartitionZoneConfig {

    tableId: number;

    indexId: number;

    partitionName: string;

    subzone?: Subzone;

    subzoneSpans: SubzoneSpan[];

    seqNum: number;

    oldIdxRef: number;
}

export interface DatabaseData {

    databaseId: number;
}

export interface TableData {

    tableId: number;

    databaseId: number;
}

export interface IndexData {

    tableId: number;

    indexId: number;
}

export interface TablePartitioning {

    tableId: number;
}

export interface TableSchemaLocked {

    tableId: number;
}

export interface LDRJobIDs {

    tableId: number;

    jobIds: bigint[];
}

export interface Function {

    functionId: number;

    params: Function_Parameter[];

    returnSet: boolean;

    returnType?: TypeT;

    isProcedure: boolean;
}

export interface Function_Parameter {

    name: string;

    class?: FunctionParamClass;

    type?: TypeT;

    defaultExpr: string;
}

export interface FunctionName {

    functionId: number;

    name: string;
}

export interface FunctionVolatility {

    functionId: number;

    volatility?: FunctionVolatility$;
}

export interface FunctionLeakProof {

    functionId: number;

    leakProof: boolean;
}

export interface FunctionNullInputBehavior {

    functionId: number;

    nullInputBehavior?: FunctionNullInputBehavior$;
}

export interface FunctionBody {

    functionId: number;

    body: string;

    lang?: FunctionLanguage;

    usesTables: FunctionBody_TableReference[];

    usesViews: FunctionBody_ViewReference[];

    usesSequenceIds: number[];

    usesTypeIds: number[];

    usesFunctionIds: number[];
}

export interface FunctionBody_TableReference {

    tableId: number;

    columnIds: number[];

    indexId: number;
}

export interface FunctionBody_ViewReference {

    viewId: number;

    columnIds: number[];
}

export interface FunctionSecurity {

    functionId: number;

    security?: FunctionSecurity$;
}

export interface ElementCreationMetadata {

    in231OrLater: boolean;

    in243OrLater: boolean;
}

class ElementProto$Type extends MessageType<ElementProto> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ElementProto", [
            { no: 1, name: "database", kind: "message", oneof: "elementOneOf", T: () => Database },
            { no: 2, name: "schema", kind: "message", oneof: "elementOneOf", T: () => Schema },
            { no: 3, name: "view", kind: "message", oneof: "elementOneOf", T: () => View },
            { no: 4, name: "sequence", kind: "message", oneof: "elementOneOf", T: () => Sequence },
            { no: 5, name: "table", kind: "message", oneof: "elementOneOf", T: () => Table },
            { no: 6, name: "enum_type", kind: "message", oneof: "elementOneOf", T: () => EnumType },
            { no: 7, name: "alias_type", kind: "message", oneof: "elementOneOf", T: () => AliasType },
            { no: 8, name: "composite_type", kind: "message", oneof: "elementOneOf", T: () => CompositeType },
            { no: 9, name: "function", kind: "message", oneof: "elementOneOf", T: () => Function },
            { no: 220, name: "named_range_zone_config", kind: "message", oneof: "elementOneOf", T: () => NamedRangeZoneConfig },
            { no: 20, name: "column_family", kind: "message", oneof: "elementOneOf", T: () => ColumnFamily },
            { no: 21, name: "column", kind: "message", oneof: "elementOneOf", T: () => Column },
            { no: 22, name: "primary_index", kind: "message", oneof: "elementOneOf", T: () => PrimaryIndex },
            { no: 23, name: "secondary_index", kind: "message", oneof: "elementOneOf", T: () => SecondaryIndex },
            { no: 24, name: "temporary_index", kind: "message", oneof: "elementOneOf", T: () => TemporaryIndex },
            { no: 25, name: "unique_without_index_constraint", kind: "message", oneof: "elementOneOf", T: () => UniqueWithoutIndexConstraint },
            { no: 171, name: "unique_without_index_constraint_unvalidated", kind: "message", oneof: "elementOneOf", T: () => UniqueWithoutIndexConstraintUnvalidated },
            { no: 26, name: "check_constraint", kind: "message", oneof: "elementOneOf", T: () => CheckConstraint },
            { no: 170, name: "check_constraint_unvalidated", kind: "message", oneof: "elementOneOf", T: () => CheckConstraintUnvalidated },
            { no: 27, name: "foreign_key_constraint", kind: "message", oneof: "elementOneOf", T: () => ForeignKeyConstraint },
            { no: 172, name: "foreign_key_constraint_unvalidated", kind: "message", oneof: "elementOneOf", T: () => ForeignKeyConstraintUnvalidated },
            { no: 28, name: "table_comment", kind: "message", oneof: "elementOneOf", T: () => TableComment },
            { no: 29, name: "row_level_ttl", kind: "message", oneof: "elementOneOf", T: () => RowLevelTTL },
            { no: 121, name: "table_zone_config", kind: "message", oneof: "elementOneOf", T: () => TableZoneConfig },
            { no: 122, name: "index_zone_config", kind: "message", oneof: "elementOneOf", T: () => IndexZoneConfig },
            { no: 131, name: "table_data", kind: "message", oneof: "elementOneOf", T: () => TableData },
            { no: 132, name: "table_partitioning", kind: "message", oneof: "elementOneOf", T: () => TablePartitioning },
            { no: 133, name: "table_schema_locked", kind: "message", oneof: "elementOneOf", T: () => TableSchemaLocked },
            { no: 134, name: "ldr_job_ids", kind: "message", oneof: "elementOneOf", T: () => LDRJobIDs },
            { no: 135, name: "partition_zone_config", kind: "message", oneof: "elementOneOf", T: () => PartitionZoneConfig },
            { no: 136, name: "trigger", kind: "message", oneof: "elementOneOf", T: () => Trigger },
            { no: 137, name: "policy", kind: "message", oneof: "elementOneOf", T: () => Policy },
            { no: 138, name: "row_level_security_enabled", kind: "message", oneof: "elementOneOf", T: () => RowLevelSecurityEnabled },
            { no: 139, name: "row_level_security_forced", kind: "message", oneof: "elementOneOf", T: () => RowLevelSecurityForced },
            { no: 110, name: "table_locality_global", kind: "message", oneof: "elementOneOf", T: () => TableLocalityGlobal },
            { no: 111, name: "table_locality_primary_region", kind: "message", oneof: "elementOneOf", T: () => TableLocalityPrimaryRegion },
            { no: 112, name: "table_locality_secondary_region", kind: "message", oneof: "elementOneOf", T: () => TableLocalitySecondaryRegion },
            { no: 113, name: "table_locality_regional_by_row", kind: "message", oneof: "elementOneOf", T: () => TableLocalityRegionalByRow },
            { no: 114, name: "table_locality_regional_by_row_using_constraint", kind: "message", oneof: "elementOneOf", T: () => TableLocalityRegionalByRowUsingConstraint },
            { no: 30, name: "column_name", kind: "message", oneof: "elementOneOf", T: () => ColumnName },
            { no: 31, name: "column_type", kind: "message", oneof: "elementOneOf", T: () => ColumnType },
            { no: 32, name: "column_default_expression", kind: "message", oneof: "elementOneOf", T: () => ColumnDefaultExpression },
            { no: 33, name: "column_on_update_expression", kind: "message", oneof: "elementOneOf", T: () => ColumnOnUpdateExpression },
            { no: 34, name: "sequence_owner", kind: "message", oneof: "elementOneOf", T: () => SequenceOwner },
            { no: 35, name: "column_comment", kind: "message", oneof: "elementOneOf", T: () => ColumnComment },
            { no: 36, name: "column_not_null", kind: "message", oneof: "elementOneOf", T: () => ColumnNotNull },
            { no: 190, name: "column_compute_expression", kind: "message", oneof: "elementOneOf", T: () => ColumnComputeExpression },
            { no: 37, name: "sequence_option", kind: "message", oneof: "elementOneOf", T: () => SequenceOption },
            { no: 40, name: "index_name", kind: "message", oneof: "elementOneOf", T: () => IndexName },
            { no: 41, name: "index_partitioning", kind: "message", oneof: "elementOneOf", T: () => IndexPartitioning },
            { no: 43, name: "index_comment", kind: "message", oneof: "elementOneOf", T: () => IndexComment },
            { no: 44, name: "index_column", kind: "message", oneof: "elementOneOf", T: () => IndexColumn },
            { no: 45, name: "index_data", kind: "message", oneof: "elementOneOf", T: () => IndexData },
            { no: 51, name: "constraint_without_index_name", kind: "message", oneof: "elementOneOf", T: () => ConstraintWithoutIndexName },
            { no: 52, name: "constraint_comment", kind: "message", oneof: "elementOneOf", T: () => ConstraintComment },
            { no: 60, name: "namespace", kind: "message", oneof: "elementOneOf", T: () => Namespace },
            { no: 61, name: "owner", kind: "message", oneof: "elementOneOf", T: () => Owner },
            { no: 62, name: "user_privileges", kind: "message", oneof: "elementOneOf", T: () => UserPrivileges },
            { no: 80, name: "database_region_config", kind: "message", oneof: "elementOneOf", T: () => DatabaseRegionConfig },
            { no: 81, name: "database_role_setting", kind: "message", oneof: "elementOneOf", T: () => DatabaseRoleSetting },
            { no: 82, name: "database_comment", kind: "message", oneof: "elementOneOf", T: () => DatabaseComment },
            { no: 83, name: "database_data", kind: "message", oneof: "elementOneOf", T: () => DatabaseData },
            { no: 84, name: "database_zone_config", kind: "message", oneof: "elementOneOf", T: () => DatabaseZoneConfig },
            { no: 90, name: "schema_parent", kind: "message", oneof: "elementOneOf", T: () => SchemaParent },
            { no: 91, name: "schema_comment", kind: "message", oneof: "elementOneOf", T: () => SchemaComment },
            { no: 100, name: "schema_child", kind: "message", oneof: "elementOneOf", T: () => SchemaChild },
            { no: 120, name: "enum_type_value", kind: "message", oneof: "elementOneOf", T: () => EnumTypeValue },
            { no: 140, name: "composite_type_attr_type", kind: "message", oneof: "elementOneOf", T: () => CompositeTypeAttrType },
            { no: 141, name: "composite_type_attr_name", kind: "message", oneof: "elementOneOf", T: () => CompositeTypeAttrName },
            { no: 160, name: "function_name", kind: "message", oneof: "elementOneOf", T: () => FunctionName },
            { no: 161, name: "function_volatility", kind: "message", oneof: "elementOneOf", T: () => FunctionVolatility },
            { no: 162, name: "function_leak_proof", kind: "message", oneof: "elementOneOf", T: () => FunctionLeakProof },
            { no: 163, name: "function_null_input_behavior", kind: "message", oneof: "elementOneOf", T: () => FunctionNullInputBehavior },
            { no: 164, name: "function_body", kind: "message", oneof: "elementOneOf", T: () => FunctionBody },
            { no: 165, name: "function_security", kind: "message", oneof: "elementOneOf", T: () => FunctionSecurity },
            { no: 180, name: "type_comment", kind: "message", oneof: "elementOneOf", T: () => TypeComment },
            { no: 200, name: "trigger_name", kind: "message", oneof: "elementOneOf", T: () => TriggerName },
            { no: 201, name: "trigger_enabled", kind: "message", oneof: "elementOneOf", T: () => TriggerEnabled },
            { no: 202, name: "trigger_timing", kind: "message", oneof: "elementOneOf", T: () => TriggerTiming },
            { no: 203, name: "trigger_events", kind: "message", oneof: "elementOneOf", T: () => TriggerEvents },
            { no: 204, name: "trigger_transition", kind: "message", oneof: "elementOneOf", T: () => TriggerTransition },
            { no: 205, name: "trigger_when", kind: "message", oneof: "elementOneOf", T: () => TriggerWhen },
            { no: 206, name: "trigger_function_call", kind: "message", oneof: "elementOneOf", T: () => TriggerFunctionCall },
            { no: 207, name: "trigger_deps", kind: "message", oneof: "elementOneOf", T: () => TriggerDeps },
            { no: 240, name: "policy_name", kind: "message", oneof: "elementOneOf", T: () => PolicyName },
            { no: 241, name: "policy_role", kind: "message", oneof: "elementOneOf", T: () => PolicyRole },
            { no: 242, name: "policy_using_expr", kind: "message", oneof: "elementOneOf", T: () => PolicyUsingExpr },
            { no: 243, name: "policy_with_check_expr", kind: "message", oneof: "elementOneOf", T: () => PolicyWithCheckExpr },
            { no: 244, name: "policy_deps", kind: "message", oneof: "elementOneOf", T: () => PolicyDeps }
        ]);
    }
    create(value?: PartialMessage<ElementProto>): ElementProto {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.elementOneOf = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<ElementProto>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ElementProto): ElementProto {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.elementOneOf = {
                        oneofKind: "database",
                        database: Database.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).database)
                    };
                    break;
                case  2:
                    message.elementOneOf = {
                        oneofKind: "schema",
                        schema: Schema.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).schema)
                    };
                    break;
                case  3:
                    message.elementOneOf = {
                        oneofKind: "view",
                        view: View.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).view)
                    };
                    break;
                case  4:
                    message.elementOneOf = {
                        oneofKind: "sequence",
                        sequence: Sequence.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).sequence)
                    };
                    break;
                case  5:
                    message.elementOneOf = {
                        oneofKind: "table",
                        table: Table.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).table)
                    };
                    break;
                case  6:
                    message.elementOneOf = {
                        oneofKind: "enumType",
                        enumType: EnumType.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).enumType)
                    };
                    break;
                case  7:
                    message.elementOneOf = {
                        oneofKind: "aliasType",
                        aliasType: AliasType.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).aliasType)
                    };
                    break;
                case  8:
                    message.elementOneOf = {
                        oneofKind: "compositeType",
                        compositeType: CompositeType.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).compositeType)
                    };
                    break;
                case  9:
                    message.elementOneOf = {
                        oneofKind: "function",
                        function: Function.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).function)
                    };
                    break;
                case  220:
                    message.elementOneOf = {
                        oneofKind: "namedRangeZoneConfig",
                        namedRangeZoneConfig: NamedRangeZoneConfig.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).namedRangeZoneConfig)
                    };
                    break;
                case  20:
                    message.elementOneOf = {
                        oneofKind: "columnFamily",
                        columnFamily: ColumnFamily.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).columnFamily)
                    };
                    break;
                case  21:
                    message.elementOneOf = {
                        oneofKind: "column",
                        column: Column.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).column)
                    };
                    break;
                case  22:
                    message.elementOneOf = {
                        oneofKind: "primaryIndex",
                        primaryIndex: PrimaryIndex.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).primaryIndex)
                    };
                    break;
                case  23:
                    message.elementOneOf = {
                        oneofKind: "secondaryIndex",
                        secondaryIndex: SecondaryIndex.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).secondaryIndex)
                    };
                    break;
                case  24:
                    message.elementOneOf = {
                        oneofKind: "temporaryIndex",
                        temporaryIndex: TemporaryIndex.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).temporaryIndex)
                    };
                    break;
                case  25:
                    message.elementOneOf = {
                        oneofKind: "uniqueWithoutIndexConstraint",
                        uniqueWithoutIndexConstraint: UniqueWithoutIndexConstraint.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).uniqueWithoutIndexConstraint)
                    };
                    break;
                case  171:
                    message.elementOneOf = {
                        oneofKind: "uniqueWithoutIndexConstraintUnvalidated",
                        uniqueWithoutIndexConstraintUnvalidated: UniqueWithoutIndexConstraintUnvalidated.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).uniqueWithoutIndexConstraintUnvalidated)
                    };
                    break;
                case  26:
                    message.elementOneOf = {
                        oneofKind: "checkConstraint",
                        checkConstraint: CheckConstraint.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).checkConstraint)
                    };
                    break;
                case  170:
                    message.elementOneOf = {
                        oneofKind: "checkConstraintUnvalidated",
                        checkConstraintUnvalidated: CheckConstraintUnvalidated.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).checkConstraintUnvalidated)
                    };
                    break;
                case  27:
                    message.elementOneOf = {
                        oneofKind: "foreignKeyConstraint",
                        foreignKeyConstraint: ForeignKeyConstraint.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).foreignKeyConstraint)
                    };
                    break;
                case  172:
                    message.elementOneOf = {
                        oneofKind: "foreignKeyConstraintUnvalidated",
                        foreignKeyConstraintUnvalidated: ForeignKeyConstraintUnvalidated.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).foreignKeyConstraintUnvalidated)
                    };
                    break;
                case  28:
                    message.elementOneOf = {
                        oneofKind: "tableComment",
                        tableComment: TableComment.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tableComment)
                    };
                    break;
                case  29:
                    message.elementOneOf = {
                        oneofKind: "rowLevelTtl",
                        rowLevelTtl: RowLevelTTL.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).rowLevelTtl)
                    };
                    break;
                case  121:
                    message.elementOneOf = {
                        oneofKind: "tableZoneConfig",
                        tableZoneConfig: TableZoneConfig.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tableZoneConfig)
                    };
                    break;
                case  122:
                    message.elementOneOf = {
                        oneofKind: "indexZoneConfig",
                        indexZoneConfig: IndexZoneConfig.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).indexZoneConfig)
                    };
                    break;
                case  131:
                    message.elementOneOf = {
                        oneofKind: "tableData",
                        tableData: TableData.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tableData)
                    };
                    break;
                case  132:
                    message.elementOneOf = {
                        oneofKind: "tablePartitioning",
                        tablePartitioning: TablePartitioning.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tablePartitioning)
                    };
                    break;
                case  133:
                    message.elementOneOf = {
                        oneofKind: "tableSchemaLocked",
                        tableSchemaLocked: TableSchemaLocked.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tableSchemaLocked)
                    };
                    break;
                case  134:
                    message.elementOneOf = {
                        oneofKind: "ldrJobIds",
                        ldrJobIds: LDRJobIDs.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).ldrJobIds)
                    };
                    break;
                case  135:
                    message.elementOneOf = {
                        oneofKind: "partitionZoneConfig",
                        partitionZoneConfig: PartitionZoneConfig.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).partitionZoneConfig)
                    };
                    break;
                case  136:
                    message.elementOneOf = {
                        oneofKind: "trigger",
                        trigger: Trigger.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).trigger)
                    };
                    break;
                case  137:
                    message.elementOneOf = {
                        oneofKind: "policy",
                        policy: Policy.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).policy)
                    };
                    break;
                case  138:
                    message.elementOneOf = {
                        oneofKind: "rowLevelSecurityEnabled",
                        rowLevelSecurityEnabled: RowLevelSecurityEnabled.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).rowLevelSecurityEnabled)
                    };
                    break;
                case  139:
                    message.elementOneOf = {
                        oneofKind: "rowLevelSecurityForced",
                        rowLevelSecurityForced: RowLevelSecurityForced.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).rowLevelSecurityForced)
                    };
                    break;
                case  110:
                    message.elementOneOf = {
                        oneofKind: "tableLocalityGlobal",
                        tableLocalityGlobal: TableLocalityGlobal.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tableLocalityGlobal)
                    };
                    break;
                case  111:
                    message.elementOneOf = {
                        oneofKind: "tableLocalityPrimaryRegion",
                        tableLocalityPrimaryRegion: TableLocalityPrimaryRegion.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tableLocalityPrimaryRegion)
                    };
                    break;
                case  112:
                    message.elementOneOf = {
                        oneofKind: "tableLocalitySecondaryRegion",
                        tableLocalitySecondaryRegion: TableLocalitySecondaryRegion.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tableLocalitySecondaryRegion)
                    };
                    break;
                case  113:
                    message.elementOneOf = {
                        oneofKind: "tableLocalityRegionalByRow",
                        tableLocalityRegionalByRow: TableLocalityRegionalByRow.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tableLocalityRegionalByRow)
                    };
                    break;
                case  114:
                    message.elementOneOf = {
                        oneofKind: "tableLocalityRegionalByRowUsingConstraint",
                        tableLocalityRegionalByRowUsingConstraint: TableLocalityRegionalByRowUsingConstraint.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).tableLocalityRegionalByRowUsingConstraint)
                    };
                    break;
                case  30:
                    message.elementOneOf = {
                        oneofKind: "columnName",
                        columnName: ColumnName.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).columnName)
                    };
                    break;
                case  31:
                    message.elementOneOf = {
                        oneofKind: "columnType",
                        columnType: ColumnType.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).columnType)
                    };
                    break;
                case  32:
                    message.elementOneOf = {
                        oneofKind: "columnDefaultExpression",
                        columnDefaultExpression: ColumnDefaultExpression.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).columnDefaultExpression)
                    };
                    break;
                case  33:
                    message.elementOneOf = {
                        oneofKind: "columnOnUpdateExpression",
                        columnOnUpdateExpression: ColumnOnUpdateExpression.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).columnOnUpdateExpression)
                    };
                    break;
                case  34:
                    message.elementOneOf = {
                        oneofKind: "sequenceOwner",
                        sequenceOwner: SequenceOwner.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).sequenceOwner)
                    };
                    break;
                case  35:
                    message.elementOneOf = {
                        oneofKind: "columnComment",
                        columnComment: ColumnComment.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).columnComment)
                    };
                    break;
                case  36:
                    message.elementOneOf = {
                        oneofKind: "columnNotNull",
                        columnNotNull: ColumnNotNull.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).columnNotNull)
                    };
                    break;
                case  190:
                    message.elementOneOf = {
                        oneofKind: "columnComputeExpression",
                        columnComputeExpression: ColumnComputeExpression.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).columnComputeExpression)
                    };
                    break;
                case  37:
                    message.elementOneOf = {
                        oneofKind: "sequenceOption",
                        sequenceOption: SequenceOption.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).sequenceOption)
                    };
                    break;
                case  40:
                    message.elementOneOf = {
                        oneofKind: "indexName",
                        indexName: IndexName.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).indexName)
                    };
                    break;
                case  41:
                    message.elementOneOf = {
                        oneofKind: "indexPartitioning",
                        indexPartitioning: IndexPartitioning.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).indexPartitioning)
                    };
                    break;
                case  43:
                    message.elementOneOf = {
                        oneofKind: "indexComment",
                        indexComment: IndexComment.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).indexComment)
                    };
                    break;
                case  44:
                    message.elementOneOf = {
                        oneofKind: "indexColumn",
                        indexColumn: IndexColumn.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).indexColumn)
                    };
                    break;
                case  45:
                    message.elementOneOf = {
                        oneofKind: "indexData",
                        indexData: IndexData.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).indexData)
                    };
                    break;
                case  51:
                    message.elementOneOf = {
                        oneofKind: "constraintWithoutIndexName",
                        constraintWithoutIndexName: ConstraintWithoutIndexName.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).constraintWithoutIndexName)
                    };
                    break;
                case  52:
                    message.elementOneOf = {
                        oneofKind: "constraintComment",
                        constraintComment: ConstraintComment.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).constraintComment)
                    };
                    break;
                case  60:
                    message.elementOneOf = {
                        oneofKind: "namespace",
                        namespace: Namespace.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).namespace)
                    };
                    break;
                case  61:
                    message.elementOneOf = {
                        oneofKind: "owner",
                        owner: Owner.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).owner)
                    };
                    break;
                case  62:
                    message.elementOneOf = {
                        oneofKind: "userPrivileges",
                        userPrivileges: UserPrivileges.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).userPrivileges)
                    };
                    break;
                case  80:
                    message.elementOneOf = {
                        oneofKind: "databaseRegionConfig",
                        databaseRegionConfig: DatabaseRegionConfig.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).databaseRegionConfig)
                    };
                    break;
                case  81:
                    message.elementOneOf = {
                        oneofKind: "databaseRoleSetting",
                        databaseRoleSetting: DatabaseRoleSetting.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).databaseRoleSetting)
                    };
                    break;
                case  82:
                    message.elementOneOf = {
                        oneofKind: "databaseComment",
                        databaseComment: DatabaseComment.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).databaseComment)
                    };
                    break;
                case  83:
                    message.elementOneOf = {
                        oneofKind: "databaseData",
                        databaseData: DatabaseData.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).databaseData)
                    };
                    break;
                case  84:
                    message.elementOneOf = {
                        oneofKind: "databaseZoneConfig",
                        databaseZoneConfig: DatabaseZoneConfig.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).databaseZoneConfig)
                    };
                    break;
                case  90:
                    message.elementOneOf = {
                        oneofKind: "schemaParent",
                        schemaParent: SchemaParent.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).schemaParent)
                    };
                    break;
                case  91:
                    message.elementOneOf = {
                        oneofKind: "schemaComment",
                        schemaComment: SchemaComment.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).schemaComment)
                    };
                    break;
                case  100:
                    message.elementOneOf = {
                        oneofKind: "schemaChild",
                        schemaChild: SchemaChild.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).schemaChild)
                    };
                    break;
                case  120:
                    message.elementOneOf = {
                        oneofKind: "enumTypeValue",
                        enumTypeValue: EnumTypeValue.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).enumTypeValue)
                    };
                    break;
                case  140:
                    message.elementOneOf = {
                        oneofKind: "compositeTypeAttrType",
                        compositeTypeAttrType: CompositeTypeAttrType.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).compositeTypeAttrType)
                    };
                    break;
                case  141:
                    message.elementOneOf = {
                        oneofKind: "compositeTypeAttrName",
                        compositeTypeAttrName: CompositeTypeAttrName.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).compositeTypeAttrName)
                    };
                    break;
                case  160:
                    message.elementOneOf = {
                        oneofKind: "functionName",
                        functionName: FunctionName.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).functionName)
                    };
                    break;
                case  161:
                    message.elementOneOf = {
                        oneofKind: "functionVolatility",
                        functionVolatility: FunctionVolatility.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).functionVolatility)
                    };
                    break;
                case  162:
                    message.elementOneOf = {
                        oneofKind: "functionLeakProof",
                        functionLeakProof: FunctionLeakProof.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).functionLeakProof)
                    };
                    break;
                case  163:
                    message.elementOneOf = {
                        oneofKind: "functionNullInputBehavior",
                        functionNullInputBehavior: FunctionNullInputBehavior.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).functionNullInputBehavior)
                    };
                    break;
                case  164:
                    message.elementOneOf = {
                        oneofKind: "functionBody",
                        functionBody: FunctionBody.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).functionBody)
                    };
                    break;
                case  165:
                    message.elementOneOf = {
                        oneofKind: "functionSecurity",
                        functionSecurity: FunctionSecurity.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).functionSecurity)
                    };
                    break;
                case  180:
                    message.elementOneOf = {
                        oneofKind: "typeComment",
                        typeComment: TypeComment.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).typeComment)
                    };
                    break;
                case  200:
                    message.elementOneOf = {
                        oneofKind: "triggerName",
                        triggerName: TriggerName.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).triggerName)
                    };
                    break;
                case  201:
                    message.elementOneOf = {
                        oneofKind: "triggerEnabled",
                        triggerEnabled: TriggerEnabled.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).triggerEnabled)
                    };
                    break;
                case  202:
                    message.elementOneOf = {
                        oneofKind: "triggerTiming",
                        triggerTiming: TriggerTiming.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).triggerTiming)
                    };
                    break;
                case  203:
                    message.elementOneOf = {
                        oneofKind: "triggerEvents",
                        triggerEvents: TriggerEvents.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).triggerEvents)
                    };
                    break;
                case  204:
                    message.elementOneOf = {
                        oneofKind: "triggerTransition",
                        triggerTransition: TriggerTransition.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).triggerTransition)
                    };
                    break;
                case  205:
                    message.elementOneOf = {
                        oneofKind: "triggerWhen",
                        triggerWhen: TriggerWhen.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).triggerWhen)
                    };
                    break;
                case  206:
                    message.elementOneOf = {
                        oneofKind: "triggerFunctionCall",
                        triggerFunctionCall: TriggerFunctionCall.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).triggerFunctionCall)
                    };
                    break;
                case  207:
                    message.elementOneOf = {
                        oneofKind: "triggerDeps",
                        triggerDeps: TriggerDeps.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).triggerDeps)
                    };
                    break;
                case  240:
                    message.elementOneOf = {
                        oneofKind: "policyName",
                        policyName: PolicyName.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).policyName)
                    };
                    break;
                case  241:
                    message.elementOneOf = {
                        oneofKind: "policyRole",
                        policyRole: PolicyRole.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).policyRole)
                    };
                    break;
                case  242:
                    message.elementOneOf = {
                        oneofKind: "policyUsingExpr",
                        policyUsingExpr: PolicyUsingExpr.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).policyUsingExpr)
                    };
                    break;
                case  243:
                    message.elementOneOf = {
                        oneofKind: "policyWithCheckExpr",
                        policyWithCheckExpr: PolicyWithCheckExpr.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).policyWithCheckExpr)
                    };
                    break;
                case  244:
                    message.elementOneOf = {
                        oneofKind: "policyDeps",
                        policyDeps: PolicyDeps.internalBinaryRead(reader, reader.uint32(), options, (message.elementOneOf as any).policyDeps)
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

export const ElementProto = /*#__PURE__*/ new ElementProto$Type();

class TypeT$Type extends MessageType<TypeT> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TypeT", [
            { no: 1, name: "type", kind: "message", T: () => T },
            { no: 2, name: "closed_type_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 3, name: "type_name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<TypeT>): TypeT {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.closedTypeIds = [];
        message.typeName = "";
        if (value !== undefined)
            reflectionMergePartial<TypeT>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TypeT): TypeT {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.type = T.internalBinaryRead(reader, reader.uint32(), options, message.type);
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.closedTypeIds.push(reader.uint32());
                    else
                        message.closedTypeIds.push(reader.uint32());
                    break;
                case  3:
                    message.typeName = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TypeT = /*#__PURE__*/ new TypeT$Type();

class Expression$Type extends MessageType<Expression> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Expression", [
            { no: 1, name: "expr", kind: "scalar", T: 9  },
            { no: 2, name: "uses_type_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 3, name: "uses_sequence_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "referenced_column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 5, name: "uses_function_ids", kind: "scalar", repeat: 1 , T: 13  }
        ]);
    }
    create(value?: PartialMessage<Expression>): Expression {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.expr = "";
        message.usesTypeIds = [];
        message.usesSequenceIds = [];
        message.referencedColumnIds = [];
        message.usesFunctionIds = [];
        if (value !== undefined)
            reflectionMergePartial<Expression>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Expression): Expression {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.expr = reader.string();
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesTypeIds.push(reader.uint32());
                    else
                        message.usesTypeIds.push(reader.uint32());
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesSequenceIds.push(reader.uint32());
                    else
                        message.usesSequenceIds.push(reader.uint32());
                    break;
                case  4:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.referencedColumnIds.push(reader.uint32());
                    else
                        message.referencedColumnIds.push(reader.uint32());
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesFunctionIds.push(reader.uint32());
                    else
                        message.usesFunctionIds.push(reader.uint32());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Expression = /*#__PURE__*/ new Expression$Type();

class Column$Type extends MessageType<Column> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Column", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "column_id", kind: "scalar", T: 13  },
            { no: 3, name: "is_hidden", kind: "scalar", T: 8  },
            { no: 4, name: "is_inaccessible", kind: "scalar", T: 8  },
            { no: 5, name: "generated_as_identity_type", kind: "scalar", T: 13  },
            { no: 6, name: "generated_as_identity_sequence_option", kind: "scalar", T: 9  },
            { no: 7, name: "pg_attribute_num", kind: "scalar", T: 13  },
            { no: 8, name: "is_system_column", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<Column>): Column {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.columnId = 0;
        message.isHidden = false;
        message.isInaccessible = false;
        message.generatedAsIdentityType = 0;
        message.generatedAsIdentitySequenceOption = "";
        message.pgAttributeNum = 0;
        message.isSystemColumn = false;
        if (value !== undefined)
            reflectionMergePartial<Column>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Column): Column {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.columnId = reader.uint32();
                    break;
                case  3:
                    message.isHidden = reader.bool();
                    break;
                case  4:
                    message.isInaccessible = reader.bool();
                    break;
                case  5:
                    message.generatedAsIdentityType = reader.uint32();
                    break;
                case  6:
                    message.generatedAsIdentitySequenceOption = reader.string();
                    break;
                case  7:
                    message.pgAttributeNum = reader.uint32();
                    break;
                case  8:
                    message.isSystemColumn = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Column = /*#__PURE__*/ new Column$Type();

class ColumnType$Type extends MessageType<ColumnType> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ColumnType", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "family_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_id", kind: "scalar", T: 13  },
            { no: 4, name: "embedded_type_t", kind: "message", T: () => TypeT },
            { no: 5, name: "is_nullable", kind: "scalar", T: 8  },
            { no: 6, name: "compute_expr", kind: "message", T: () => Expression },
            { no: 7, name: "is_virtual", kind: "scalar", T: 8  },
            { no: 11, name: "element_creation_metadata", kind: "message", T: () => ElementCreationMetadata },
            { no: 12, name: "column_family_order_follows_column_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<ColumnType>): ColumnType {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.familyId = 0;
        message.columnId = 0;
        message.isNullable = false;
        message.isVirtual = false;
        message.columnFamilyOrderFollowsColumnId = 0;
        if (value !== undefined)
            reflectionMergePartial<ColumnType>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnType): ColumnType {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.familyId = reader.uint32();
                    break;
                case  3:
                    message.columnId = reader.uint32();
                    break;
                case  4:
                    message.embeddedTypeT = TypeT.internalBinaryRead(reader, reader.uint32(), options, message.embeddedTypeT);
                    break;
                case  5:
                    message.isNullable = reader.bool();
                    break;
                case  6:
                    message.computeExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.computeExpr);
                    break;
                case  7:
                    message.isVirtual = reader.bool();
                    break;
                case  11:
                    message.elementCreationMetadata = ElementCreationMetadata.internalBinaryRead(reader, reader.uint32(), options, message.elementCreationMetadata);
                    break;
                case  12:
                    message.columnFamilyOrderFollowsColumnId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ColumnType = /*#__PURE__*/ new ColumnType$Type();

class ColumnComputeExpression$Type extends MessageType<ColumnComputeExpression> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ColumnComputeExpression", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "column_id", kind: "scalar", T: 13  },
            { no: 3, name: "embedded_expr", kind: "message", T: () => Expression },
            { no: 5, name: "usage", kind: "enum", T: () => ["cockroach.sql.schemachanger.scpb.ColumnComputeExpression.Usage", ColumnComputeExpression_Usage] }
        ]);
    }
    create(value?: PartialMessage<ColumnComputeExpression>): ColumnComputeExpression {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.columnId = 0;
        message.usage = 0;
        if (value !== undefined)
            reflectionMergePartial<ColumnComputeExpression>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnComputeExpression): ColumnComputeExpression {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.columnId = reader.uint32();
                    break;
                case  3:
                    message.embeddedExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.embeddedExpr);
                    break;
                case  5:
                    message.usage = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ColumnComputeExpression = /*#__PURE__*/ new ColumnComputeExpression$Type();

class ColumnFamily$Type extends MessageType<ColumnFamily> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ColumnFamily", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "family_id", kind: "scalar", T: 13  },
            { no: 3, name: "name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<ColumnFamily>): ColumnFamily {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.familyId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<ColumnFamily>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnFamily): ColumnFamily {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.familyId = reader.uint32();
                    break;
                case  3:
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

export const ColumnFamily = /*#__PURE__*/ new ColumnFamily$Type();

class Index$Type extends MessageType<Index> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Index", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "index_id", kind: "scalar", T: 13  },
            { no: 10, name: "is_unique", kind: "scalar", T: 8  },
            { no: 11, name: "is_inverted", kind: "scalar", T: 8  },
            { no: 26, name: "type", kind: "enum", T: () => ["cockroach.sql.sem.idxtype.T", T$] },
            { no: 12, name: "sharding", kind: "message", T: () => ShardedDescriptor },
            { no: 13, name: "is_created_explicitly", kind: "scalar", T: 8  },
            { no: 14, name: "constraint_id", kind: "scalar", T: 13  },
            { no: 20, name: "is_concurrently", kind: "scalar", T: 8  },
            { no: 21, name: "source_index_id", kind: "scalar", T: 13  },
            { no: 22, name: "temporary_index_id", kind: "scalar", T: 13  },
            { no: 24, name: "geo_config", kind: "message", T: () => Config },
            { no: 23, name: "is_not_visible", kind: "scalar", T: 8  },
            { no: 25, name: "invisibility", kind: "scalar", T: 1  },
            { no: 27, name: "vec_config", kind: "message", T: () => Config$ }
        ]);
    }
    create(value?: PartialMessage<Index>): Index {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.indexId = 0;
        message.isUnique = false;
        message.isInverted = false;
        message.type = 0;
        message.isCreatedExplicitly = false;
        message.constraintId = 0;
        message.isConcurrently = false;
        message.sourceIndexId = 0;
        message.temporaryIndexId = 0;
        message.isNotVisible = false;
        message.invisibility = 0;
        if (value !== undefined)
            reflectionMergePartial<Index>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Index): Index {
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
                case  10:
                    message.isUnique = reader.bool();
                    break;
                case  11:
                    message.isInverted = reader.bool();
                    break;
                case  26:
                    message.type = reader.int32();
                    break;
                case  12:
                    message.sharding = ShardedDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.sharding);
                    break;
                case  13:
                    message.isCreatedExplicitly = reader.bool();
                    break;
                case  14:
                    message.constraintId = reader.uint32();
                    break;
                case  20:
                    message.isConcurrently = reader.bool();
                    break;
                case  21:
                    message.sourceIndexId = reader.uint32();
                    break;
                case  22:
                    message.temporaryIndexId = reader.uint32();
                    break;
                case  24:
                    message.geoConfig = Config.internalBinaryRead(reader, reader.uint32(), options, message.geoConfig);
                    break;
                case  23:
                    message.isNotVisible = reader.bool();
                    break;
                case  25:
                    message.invisibility = reader.double();
                    break;
                case  27:
                    message.vecConfig = Config$.internalBinaryRead(reader, reader.uint32(), options, message.vecConfig);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Index = /*#__PURE__*/ new Index$Type();

class PrimaryIndex$Type extends MessageType<PrimaryIndex> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.PrimaryIndex", [
            { no: 1, name: "embedded_index", kind: "message", T: () => Index }
        ]);
    }
    create(value?: PartialMessage<PrimaryIndex>): PrimaryIndex {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PrimaryIndex>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PrimaryIndex): PrimaryIndex {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.embeddedIndex = Index.internalBinaryRead(reader, reader.uint32(), options, message.embeddedIndex);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PrimaryIndex = /*#__PURE__*/ new PrimaryIndex$Type();

class SecondaryIndex$Type extends MessageType<SecondaryIndex> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.SecondaryIndex", [
            { no: 1, name: "embedded_index", kind: "message", T: () => Index },
            { no: 3, name: "embedded_expr", kind: "message", T: () => Expression },
            { no: 4, name: "recreate_source_id", kind: "scalar", T: 13  },
            { no: 5, name: "recreate_target_id", kind: "scalar", T: 13  },
            { no: 6, name: "hide_for_primary_key_recreated", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<SecondaryIndex>): SecondaryIndex {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.recreateSourceId = 0;
        message.recreateTargetId = 0;
        message.hideForPrimaryKeyRecreated = false;
        if (value !== undefined)
            reflectionMergePartial<SecondaryIndex>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SecondaryIndex): SecondaryIndex {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.embeddedIndex = Index.internalBinaryRead(reader, reader.uint32(), options, message.embeddedIndex);
                    break;
                case  3:
                    message.embeddedExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.embeddedExpr);
                    break;
                case  4:
                    message.recreateSourceId = reader.uint32();
                    break;
                case  5:
                    message.recreateTargetId = reader.uint32();
                    break;
                case  6:
                    message.hideForPrimaryKeyRecreated = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SecondaryIndex = /*#__PURE__*/ new SecondaryIndex$Type();

class TemporaryIndex$Type extends MessageType<TemporaryIndex> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TemporaryIndex", [
            { no: 1, name: "embedded_index", kind: "message", T: () => Index },
            { no: 2, name: "is_using_secondary_encoding", kind: "scalar", T: 8  },
            { no: 3, name: "expr", kind: "message", T: () => Expression }
        ]);
    }
    create(value?: PartialMessage<TemporaryIndex>): TemporaryIndex {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.isUsingSecondaryEncoding = false;
        if (value !== undefined)
            reflectionMergePartial<TemporaryIndex>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TemporaryIndex): TemporaryIndex {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.embeddedIndex = Index.internalBinaryRead(reader, reader.uint32(), options, message.embeddedIndex);
                    break;
                case  2:
                    message.isUsingSecondaryEncoding = reader.bool();
                    break;
                case  3:
                    message.expr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.expr);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TemporaryIndex = /*#__PURE__*/ new TemporaryIndex$Type();

class SchemaParent$Type extends MessageType<SchemaParent> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.SchemaParent", [
            { no: 1, name: "schema_id", kind: "scalar", T: 13  },
            { no: 2, name: "parent_database_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<SchemaParent>): SchemaParent {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.schemaId = 0;
        message.parentDatabaseId = 0;
        if (value !== undefined)
            reflectionMergePartial<SchemaParent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaParent): SchemaParent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.schemaId = reader.uint32();
                    break;
                case  2:
                    message.parentDatabaseId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SchemaParent = /*#__PURE__*/ new SchemaParent$Type();

class SchemaChild$Type extends MessageType<SchemaChild> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.SchemaChild", [
            { no: 1, name: "child_object_id", kind: "scalar", T: 13  },
            { no: 2, name: "schema_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<SchemaChild>): SchemaChild {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.childObjectId = 0;
        message.schemaId = 0;
        if (value !== undefined)
            reflectionMergePartial<SchemaChild>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaChild): SchemaChild {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.childObjectId = reader.uint32();
                    break;
                case  2:
                    message.schemaId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SchemaChild = /*#__PURE__*/ new SchemaChild$Type();

class Policy$Type extends MessageType<Policy> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Policy", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "policy_id", kind: "scalar", T: 13  },
            { no: 3, name: "type", kind: "scalar", T: 13  },
            { no: 4, name: "command", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<Policy>): Policy {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.policyId = 0;
        message.type = 0;
        message.command = 0;
        if (value !== undefined)
            reflectionMergePartial<Policy>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Policy): Policy {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.policyId = reader.uint32();
                    break;
                case  3:
                    message.type = reader.uint32();
                    break;
                case  4:
                    message.command = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Policy = /*#__PURE__*/ new Policy$Type();

class PolicyName$Type extends MessageType<PolicyName> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.PolicyName", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "policy_id", kind: "scalar", T: 13  },
            { no: 3, name: "name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<PolicyName>): PolicyName {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.policyId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<PolicyName>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PolicyName): PolicyName {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.policyId = reader.uint32();
                    break;
                case  3:
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

export const PolicyName = /*#__PURE__*/ new PolicyName$Type();

class PolicyRole$Type extends MessageType<PolicyRole> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.PolicyRole", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "policy_id", kind: "scalar", T: 13  },
            { no: 3, name: "role_name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<PolicyRole>): PolicyRole {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.policyId = 0;
        message.roleName = "";
        if (value !== undefined)
            reflectionMergePartial<PolicyRole>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PolicyRole): PolicyRole {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.policyId = reader.uint32();
                    break;
                case  3:
                    message.roleName = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PolicyRole = /*#__PURE__*/ new PolicyRole$Type();

class PolicyUsingExpr$Type extends MessageType<PolicyUsingExpr> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.PolicyUsingExpr", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "policy_id", kind: "scalar", T: 13  },
            { no: 3, name: "embedded_expr", kind: "message", T: () => Expression }
        ]);
    }
    create(value?: PartialMessage<PolicyUsingExpr>): PolicyUsingExpr {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.policyId = 0;
        if (value !== undefined)
            reflectionMergePartial<PolicyUsingExpr>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PolicyUsingExpr): PolicyUsingExpr {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.policyId = reader.uint32();
                    break;
                case  3:
                    message.embeddedExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.embeddedExpr);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PolicyUsingExpr = /*#__PURE__*/ new PolicyUsingExpr$Type();

class PolicyWithCheckExpr$Type extends MessageType<PolicyWithCheckExpr> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.PolicyWithCheckExpr", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "policy_id", kind: "scalar", T: 13  },
            { no: 3, name: "embedded_expr", kind: "message", T: () => Expression }
        ]);
    }
    create(value?: PartialMessage<PolicyWithCheckExpr>): PolicyWithCheckExpr {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.policyId = 0;
        if (value !== undefined)
            reflectionMergePartial<PolicyWithCheckExpr>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PolicyWithCheckExpr): PolicyWithCheckExpr {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.policyId = reader.uint32();
                    break;
                case  3:
                    message.embeddedExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.embeddedExpr);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PolicyWithCheckExpr = /*#__PURE__*/ new PolicyWithCheckExpr$Type();

class PolicyDeps$Type extends MessageType<PolicyDeps> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.PolicyDeps", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "policy_id", kind: "scalar", T: 13  },
            { no: 3, name: "uses_type_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "uses_relation_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 5, name: "uses_function_ids", kind: "scalar", repeat: 1 , T: 13  }
        ]);
    }
    create(value?: PartialMessage<PolicyDeps>): PolicyDeps {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.policyId = 0;
        message.usesTypeIds = [];
        message.usesRelationIds = [];
        message.usesFunctionIds = [];
        if (value !== undefined)
            reflectionMergePartial<PolicyDeps>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PolicyDeps): PolicyDeps {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.policyId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesTypeIds.push(reader.uint32());
                    else
                        message.usesTypeIds.push(reader.uint32());
                    break;
                case  4:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesRelationIds.push(reader.uint32());
                    else
                        message.usesRelationIds.push(reader.uint32());
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesFunctionIds.push(reader.uint32());
                    else
                        message.usesFunctionIds.push(reader.uint32());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PolicyDeps = /*#__PURE__*/ new PolicyDeps$Type();

class RowLevelSecurityEnabled$Type extends MessageType<RowLevelSecurityEnabled> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.RowLevelSecurityEnabled", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<RowLevelSecurityEnabled>): RowLevelSecurityEnabled {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        if (value !== undefined)
            reflectionMergePartial<RowLevelSecurityEnabled>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RowLevelSecurityEnabled): RowLevelSecurityEnabled {
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

export const RowLevelSecurityEnabled = /*#__PURE__*/ new RowLevelSecurityEnabled$Type();

class RowLevelSecurityForced$Type extends MessageType<RowLevelSecurityForced> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.RowLevelSecurityForced", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "is_forced", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<RowLevelSecurityForced>): RowLevelSecurityForced {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.isForced = false;
        if (value !== undefined)
            reflectionMergePartial<RowLevelSecurityForced>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RowLevelSecurityForced): RowLevelSecurityForced {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.isForced = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const RowLevelSecurityForced = /*#__PURE__*/ new RowLevelSecurityForced$Type();

class Sequence$Type extends MessageType<Sequence> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Sequence", [
            { no: 1, name: "sequence_id", kind: "scalar", T: 13  },
            { no: 2, name: "restart_with", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "use_restart_with", kind: "scalar", T: 8  },
            { no: 10, name: "is_temporary", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<Sequence>): Sequence {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.sequenceId = 0;
        message.restartWith = 0n;
        message.useRestartWith = false;
        message.isTemporary = false;
        if (value !== undefined)
            reflectionMergePartial<Sequence>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Sequence): Sequence {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.sequenceId = reader.uint32();
                    break;
                case  2:
                    message.restartWith = reader.int64().toBigInt();
                    break;
                case  3:
                    message.useRestartWith = reader.bool();
                    break;
                case  10:
                    message.isTemporary = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Sequence = /*#__PURE__*/ new Sequence$Type();

class SequenceOption$Type extends MessageType<SequenceOption> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.SequenceOption", [
            { no: 1, name: "sequence_id", kind: "scalar", T: 13  },
            { no: 2, name: "key", kind: "scalar", T: 9  },
            { no: 3, name: "value", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<SequenceOption>): SequenceOption {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.sequenceId = 0;
        message.key = "";
        message.value = "";
        if (value !== undefined)
            reflectionMergePartial<SequenceOption>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SequenceOption): SequenceOption {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.sequenceId = reader.uint32();
                    break;
                case  2:
                    message.key = reader.string();
                    break;
                case  3:
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

export const SequenceOption = /*#__PURE__*/ new SequenceOption$Type();

class SequenceOwner$Type extends MessageType<SequenceOwner> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.SequenceOwner", [
            { no: 1, name: "sequence_id", kind: "scalar", T: 13  },
            { no: 2, name: "table_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<SequenceOwner>): SequenceOwner {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.sequenceId = 0;
        message.tableId = 0;
        message.columnId = 0;
        if (value !== undefined)
            reflectionMergePartial<SequenceOwner>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SequenceOwner): SequenceOwner {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.sequenceId = reader.uint32();
                    break;
                case  2:
                    message.tableId = reader.uint32();
                    break;
                case  3:
                    message.columnId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SequenceOwner = /*#__PURE__*/ new SequenceOwner$Type();

class ColumnDefaultExpression$Type extends MessageType<ColumnDefaultExpression> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ColumnDefaultExpression", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "column_id", kind: "scalar", T: 13  },
            { no: 3, name: "embedded_expr", kind: "message", T: () => Expression }
        ]);
    }
    create(value?: PartialMessage<ColumnDefaultExpression>): ColumnDefaultExpression {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.columnId = 0;
        if (value !== undefined)
            reflectionMergePartial<ColumnDefaultExpression>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnDefaultExpression): ColumnDefaultExpression {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.columnId = reader.uint32();
                    break;
                case  3:
                    message.embeddedExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.embeddedExpr);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ColumnDefaultExpression = /*#__PURE__*/ new ColumnDefaultExpression$Type();

class ColumnOnUpdateExpression$Type extends MessageType<ColumnOnUpdateExpression> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ColumnOnUpdateExpression", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "column_id", kind: "scalar", T: 13  },
            { no: 3, name: "embedded_expr", kind: "message", T: () => Expression }
        ]);
    }
    create(value?: PartialMessage<ColumnOnUpdateExpression>): ColumnOnUpdateExpression {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.columnId = 0;
        if (value !== undefined)
            reflectionMergePartial<ColumnOnUpdateExpression>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnOnUpdateExpression): ColumnOnUpdateExpression {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.columnId = reader.uint32();
                    break;
                case  3:
                    message.embeddedExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.embeddedExpr);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ColumnOnUpdateExpression = /*#__PURE__*/ new ColumnOnUpdateExpression$Type();

class View$Type extends MessageType<View> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.View", [
            { no: 1, name: "view_id", kind: "scalar", T: 13  },
            { no: 2, name: "uses_type_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 3, name: "uses_relation_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 12, name: "uses_routine_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "forward_references", kind: "message", repeat: 2 , T: () => View_Reference },
            { no: 10, name: "is_temporary", kind: "scalar", T: 8  },
            { no: 11, name: "is_materialized", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<View>): View {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.viewId = 0;
        message.usesTypeIds = [];
        message.usesRelationIds = [];
        message.usesRoutineIds = [];
        message.forwardReferences = [];
        message.isTemporary = false;
        message.isMaterialized = false;
        if (value !== undefined)
            reflectionMergePartial<View>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: View): View {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.viewId = reader.uint32();
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesTypeIds.push(reader.uint32());
                    else
                        message.usesTypeIds.push(reader.uint32());
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesRelationIds.push(reader.uint32());
                    else
                        message.usesRelationIds.push(reader.uint32());
                    break;
                case  12:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesRoutineIds.push(reader.uint32());
                    else
                        message.usesRoutineIds.push(reader.uint32());
                    break;
                case  4:
                    message.forwardReferences.push(View_Reference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  10:
                    message.isTemporary = reader.bool();
                    break;
                case  11:
                    message.isMaterialized = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const View = /*#__PURE__*/ new View$Type();

class View_Reference$Type extends MessageType<View_Reference> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.View.Reference", [
            { no: 1, name: "to_id", kind: "scalar", T: 13  },
            { no: 2, name: "index_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<View_Reference>): View_Reference {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.toId = 0;
        message.indexId = 0;
        message.columnIds = [];
        if (value !== undefined)
            reflectionMergePartial<View_Reference>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: View_Reference): View_Reference {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.toId = reader.uint32();
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
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const View_Reference = /*#__PURE__*/ new View_Reference$Type();

class Table$Type extends MessageType<Table> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Table", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 10, name: "is_temporary", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<Table>): Table {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.isTemporary = false;
        if (value !== undefined)
            reflectionMergePartial<Table>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Table): Table {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  10:
                    message.isTemporary = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Table = /*#__PURE__*/ new Table$Type();

class UniqueWithoutIndexConstraint$Type extends MessageType<UniqueWithoutIndexConstraint> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.UniqueWithoutIndexConstraint", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "constraint_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "predicate", kind: "message", T: () => Expression },
            { no: 5, name: "index_id_for_validation", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<UniqueWithoutIndexConstraint>): UniqueWithoutIndexConstraint {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.constraintId = 0;
        message.columnIds = [];
        message.indexIdForValidation = 0;
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
                    message.constraintId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  4:
                    message.predicate = Expression.internalBinaryRead(reader, reader.uint32(), options, message.predicate);
                    break;
                case  5:
                    message.indexIdForValidation = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
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

class UniqueWithoutIndexConstraintUnvalidated$Type extends MessageType<UniqueWithoutIndexConstraintUnvalidated> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.UniqueWithoutIndexConstraintUnvalidated", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "constraint_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "predicate", kind: "message", T: () => Expression }
        ]);
    }
    create(value?: PartialMessage<UniqueWithoutIndexConstraintUnvalidated>): UniqueWithoutIndexConstraintUnvalidated {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.constraintId = 0;
        message.columnIds = [];
        if (value !== undefined)
            reflectionMergePartial<UniqueWithoutIndexConstraintUnvalidated>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UniqueWithoutIndexConstraintUnvalidated): UniqueWithoutIndexConstraintUnvalidated {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.constraintId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  4:
                    message.predicate = Expression.internalBinaryRead(reader, reader.uint32(), options, message.predicate);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const UniqueWithoutIndexConstraintUnvalidated = /*#__PURE__*/ new UniqueWithoutIndexConstraintUnvalidated$Type();

class CheckConstraint$Type extends MessageType<CheckConstraint> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.CheckConstraint", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "constraint_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "embedded_expr", kind: "message", T: () => Expression },
            { no: 5, name: "from_hash_sharded_column", kind: "scalar", T: 8  },
            { no: 6, name: "index_id_for_validation", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<CheckConstraint>): CheckConstraint {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.constraintId = 0;
        message.columnIds = [];
        message.fromHashShardedColumn = false;
        message.indexIdForValidation = 0;
        if (value !== undefined)
            reflectionMergePartial<CheckConstraint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CheckConstraint): CheckConstraint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.constraintId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  4:
                    message.embeddedExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.embeddedExpr);
                    break;
                case  5:
                    message.fromHashShardedColumn = reader.bool();
                    break;
                case  6:
                    message.indexIdForValidation = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const CheckConstraint = /*#__PURE__*/ new CheckConstraint$Type();

class CheckConstraintUnvalidated$Type extends MessageType<CheckConstraintUnvalidated> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.CheckConstraintUnvalidated", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "constraint_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "embedded_expr", kind: "message", T: () => Expression }
        ]);
    }
    create(value?: PartialMessage<CheckConstraintUnvalidated>): CheckConstraintUnvalidated {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.constraintId = 0;
        message.columnIds = [];
        if (value !== undefined)
            reflectionMergePartial<CheckConstraintUnvalidated>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CheckConstraintUnvalidated): CheckConstraintUnvalidated {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.constraintId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  4:
                    message.embeddedExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.embeddedExpr);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const CheckConstraintUnvalidated = /*#__PURE__*/ new CheckConstraintUnvalidated$Type();

class ForeignKeyConstraint$Type extends MessageType<ForeignKeyConstraint> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ForeignKeyConstraint", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "constraint_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "referenced_table_id", kind: "scalar", T: 13  },
            { no: 5, name: "referenced_column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 6, name: "on_update_action", kind: "enum", T: () => ["cockroach.sql.sem.semenumpb.ForeignKeyAction", ForeignKeyAction] },
            { no: 7, name: "on_delete_action", kind: "enum", T: () => ["cockroach.sql.sem.semenumpb.ForeignKeyAction", ForeignKeyAction] },
            { no: 8, name: "composite_key_match_method", kind: "enum", T: () => ["cockroach.sql.sem.semenumpb.Match", Match] },
            { no: 9, name: "index_id_for_validation", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<ForeignKeyConstraint>): ForeignKeyConstraint {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.constraintId = 0;
        message.columnIds = [];
        message.referencedTableId = 0;
        message.referencedColumnIds = [];
        message.onUpdateAction = 0;
        message.onDeleteAction = 0;
        message.compositeKeyMatchMethod = 0;
        message.indexIdForValidation = 0;
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
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.constraintId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  4:
                    message.referencedTableId = reader.uint32();
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.referencedColumnIds.push(reader.uint32());
                    else
                        message.referencedColumnIds.push(reader.uint32());
                    break;
                case  6:
                    message.onUpdateAction = reader.int32();
                    break;
                case  7:
                    message.onDeleteAction = reader.int32();
                    break;
                case  8:
                    message.compositeKeyMatchMethod = reader.int32();
                    break;
                case  9:
                    message.indexIdForValidation = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
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

class ForeignKeyConstraintUnvalidated$Type extends MessageType<ForeignKeyConstraintUnvalidated> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ForeignKeyConstraintUnvalidated", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "constraint_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 4, name: "referenced_table_id", kind: "scalar", T: 13  },
            { no: 5, name: "referenced_column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 6, name: "on_update_action", kind: "enum", T: () => ["cockroach.sql.sem.semenumpb.ForeignKeyAction", ForeignKeyAction] },
            { no: 7, name: "on_delete_action", kind: "enum", T: () => ["cockroach.sql.sem.semenumpb.ForeignKeyAction", ForeignKeyAction] },
            { no: 8, name: "composite_key_match_method", kind: "enum", T: () => ["cockroach.sql.sem.semenumpb.Match", Match] }
        ]);
    }
    create(value?: PartialMessage<ForeignKeyConstraintUnvalidated>): ForeignKeyConstraintUnvalidated {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.constraintId = 0;
        message.columnIds = [];
        message.referencedTableId = 0;
        message.referencedColumnIds = [];
        message.onUpdateAction = 0;
        message.onDeleteAction = 0;
        message.compositeKeyMatchMethod = 0;
        if (value !== undefined)
            reflectionMergePartial<ForeignKeyConstraintUnvalidated>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ForeignKeyConstraintUnvalidated): ForeignKeyConstraintUnvalidated {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.constraintId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                case  4:
                    message.referencedTableId = reader.uint32();
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.referencedColumnIds.push(reader.uint32());
                    else
                        message.referencedColumnIds.push(reader.uint32());
                    break;
                case  6:
                    message.onUpdateAction = reader.int32();
                    break;
                case  7:
                    message.onDeleteAction = reader.int32();
                    break;
                case  8:
                    message.compositeKeyMatchMethod = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ForeignKeyConstraintUnvalidated = /*#__PURE__*/ new ForeignKeyConstraintUnvalidated$Type();

class Trigger$Type extends MessageType<Trigger> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Trigger", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "trigger_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<Trigger>): Trigger {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.triggerId = 0;
        if (value !== undefined)
            reflectionMergePartial<Trigger>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Trigger): Trigger {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.triggerId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Trigger = /*#__PURE__*/ new Trigger$Type();

class TriggerName$Type extends MessageType<TriggerName> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerName", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "trigger_id", kind: "scalar", T: 13  },
            { no: 3, name: "name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<TriggerName>): TriggerName {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.triggerId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<TriggerName>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerName): TriggerName {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.triggerId = reader.uint32();
                    break;
                case  3:
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

export const TriggerName = /*#__PURE__*/ new TriggerName$Type();

class TriggerEnabled$Type extends MessageType<TriggerEnabled> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerEnabled", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "trigger_id", kind: "scalar", T: 13  },
            { no: 3, name: "enabled", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<TriggerEnabled>): TriggerEnabled {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.triggerId = 0;
        message.enabled = false;
        if (value !== undefined)
            reflectionMergePartial<TriggerEnabled>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerEnabled): TriggerEnabled {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.triggerId = reader.uint32();
                    break;
                case  3:
                    message.enabled = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TriggerEnabled = /*#__PURE__*/ new TriggerEnabled$Type();

class TriggerTiming$Type extends MessageType<TriggerTiming> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerTiming", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "trigger_id", kind: "scalar", T: 13  },
            { no: 3, name: "action_time", kind: "enum", T: () => ["cockroach.sql.sem.semenumpb.TriggerActionTime", TriggerActionTime] },
            { no: 4, name: "for_each_row", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<TriggerTiming>): TriggerTiming {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.triggerId = 0;
        message.actionTime = 0;
        message.forEachRow = false;
        if (value !== undefined)
            reflectionMergePartial<TriggerTiming>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerTiming): TriggerTiming {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.triggerId = reader.uint32();
                    break;
                case  3:
                    message.actionTime = reader.int32();
                    break;
                case  4:
                    message.forEachRow = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TriggerTiming = /*#__PURE__*/ new TriggerTiming$Type();

class TriggerEvent$Type extends MessageType<TriggerEvent> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerEvent", [
            { no: 1, name: "type", kind: "enum", T: () => ["cockroach.sql.sem.semenumpb.TriggerEventType", TriggerEventType] },
            { no: 2, name: "column_names", kind: "scalar", repeat: 2 , T: 9  }
        ]);
    }
    create(value?: PartialMessage<TriggerEvent>): TriggerEvent {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.type = 0;
        message.columnNames = [];
        if (value !== undefined)
            reflectionMergePartial<TriggerEvent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerEvent): TriggerEvent {
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

export const TriggerEvent = /*#__PURE__*/ new TriggerEvent$Type();

class TriggerEvents$Type extends MessageType<TriggerEvents> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerEvents", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "trigger_id", kind: "scalar", T: 13  },
            { no: 3, name: "events", kind: "message", repeat: 2 , T: () => TriggerEvent }
        ]);
    }
    create(value?: PartialMessage<TriggerEvents>): TriggerEvents {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.triggerId = 0;
        message.events = [];
        if (value !== undefined)
            reflectionMergePartial<TriggerEvents>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerEvents): TriggerEvents {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.triggerId = reader.uint32();
                    break;
                case  3:
                    message.events.push(TriggerEvent.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TriggerEvents = /*#__PURE__*/ new TriggerEvents$Type();

class TriggerTransition$Type extends MessageType<TriggerTransition> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerTransition", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "trigger_id", kind: "scalar", T: 13  },
            { no: 3, name: "new_transition_alias", kind: "scalar", T: 9  },
            { no: 4, name: "old_transition_alias", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<TriggerTransition>): TriggerTransition {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.triggerId = 0;
        message.newTransitionAlias = "";
        message.oldTransitionAlias = "";
        if (value !== undefined)
            reflectionMergePartial<TriggerTransition>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerTransition): TriggerTransition {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.triggerId = reader.uint32();
                    break;
                case  3:
                    message.newTransitionAlias = reader.string();
                    break;
                case  4:
                    message.oldTransitionAlias = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TriggerTransition = /*#__PURE__*/ new TriggerTransition$Type();

class TriggerWhen$Type extends MessageType<TriggerWhen> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerWhen", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "trigger_id", kind: "scalar", T: 13  },
            { no: 3, name: "when_expr", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<TriggerWhen>): TriggerWhen {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.triggerId = 0;
        message.whenExpr = "";
        if (value !== undefined)
            reflectionMergePartial<TriggerWhen>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerWhen): TriggerWhen {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.triggerId = reader.uint32();
                    break;
                case  3:
                    message.whenExpr = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TriggerWhen = /*#__PURE__*/ new TriggerWhen$Type();

class TriggerFunctionCall$Type extends MessageType<TriggerFunctionCall> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerFunctionCall", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "trigger_id", kind: "scalar", T: 13  },
            { no: 3, name: "func_id", kind: "scalar", T: 13  },
            { no: 4, name: "func_args", kind: "scalar", repeat: 2 , T: 9  },
            { no: 5, name: "func_body", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<TriggerFunctionCall>): TriggerFunctionCall {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.triggerId = 0;
        message.funcId = 0;
        message.funcArgs = [];
        message.funcBody = "";
        if (value !== undefined)
            reflectionMergePartial<TriggerFunctionCall>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerFunctionCall): TriggerFunctionCall {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.triggerId = reader.uint32();
                    break;
                case  3:
                    message.funcId = reader.uint32();
                    break;
                case  4:
                    message.funcArgs.push(reader.string());
                    break;
                case  5:
                    message.funcBody = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TriggerFunctionCall = /*#__PURE__*/ new TriggerFunctionCall$Type();

class TriggerDeps$Type extends MessageType<TriggerDeps> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerDeps", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "trigger_id", kind: "scalar", T: 13  },
            { no: 3, name: "uses_relation_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 6, name: "uses_relations", kind: "message", repeat: 2 , T: () => TriggerDeps_RelationReference },
            { no: 4, name: "uses_type_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 5, name: "uses_routine_ids", kind: "scalar", repeat: 1 , T: 13  }
        ]);
    }
    create(value?: PartialMessage<TriggerDeps>): TriggerDeps {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.triggerId = 0;
        message.usesRelationIds = [];
        message.usesRelations = [];
        message.usesTypeIds = [];
        message.usesRoutineIds = [];
        if (value !== undefined)
            reflectionMergePartial<TriggerDeps>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerDeps): TriggerDeps {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.triggerId = reader.uint32();
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesRelationIds.push(reader.uint32());
                    else
                        message.usesRelationIds.push(reader.uint32());
                    break;
                case  6:
                    message.usesRelations.push(TriggerDeps_RelationReference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesTypeIds.push(reader.uint32());
                    else
                        message.usesTypeIds.push(reader.uint32());
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesRoutineIds.push(reader.uint32());
                    else
                        message.usesRoutineIds.push(reader.uint32());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TriggerDeps = /*#__PURE__*/ new TriggerDeps$Type();

class TriggerDeps_RelationReference$Type extends MessageType<TriggerDeps_RelationReference> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TriggerDeps.RelationReference", [
            { no: 1, name: "id", kind: "scalar", T: 13  },
            { no: 2, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 3, name: "index_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<TriggerDeps_RelationReference>): TriggerDeps_RelationReference {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0;
        message.columnIds = [];
        message.indexId = 0;
        if (value !== undefined)
            reflectionMergePartial<TriggerDeps_RelationReference>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TriggerDeps_RelationReference): TriggerDeps_RelationReference {
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
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
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

export const TriggerDeps_RelationReference = /*#__PURE__*/ new TriggerDeps_RelationReference$Type();

class EnumType$Type extends MessageType<EnumType> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.EnumType", [
            { no: 1, name: "type_id", kind: "scalar", T: 13  },
            { no: 2, name: "array_type_id", kind: "scalar", T: 13  },
            { no: 3, name: "is_multi_region", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<EnumType>): EnumType {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.typeId = 0;
        message.arrayTypeId = 0;
        message.isMultiRegion = false;
        if (value !== undefined)
            reflectionMergePartial<EnumType>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EnumType): EnumType {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.typeId = reader.uint32();
                    break;
                case  2:
                    message.arrayTypeId = reader.uint32();
                    break;
                case  3:
                    message.isMultiRegion = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const EnumType = /*#__PURE__*/ new EnumType$Type();

class AliasType$Type extends MessageType<AliasType> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.AliasType", [
            { no: 1, name: "type_id", kind: "scalar", T: 13  },
            { no: 2, name: "embedded_type_t", kind: "message", T: () => TypeT }
        ]);
    }
    create(value?: PartialMessage<AliasType>): AliasType {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.typeId = 0;
        if (value !== undefined)
            reflectionMergePartial<AliasType>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AliasType): AliasType {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.typeId = reader.uint32();
                    break;
                case  2:
                    message.embeddedTypeT = TypeT.internalBinaryRead(reader, reader.uint32(), options, message.embeddedTypeT);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const AliasType = /*#__PURE__*/ new AliasType$Type();

class CompositeType$Type extends MessageType<CompositeType> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.CompositeType", [
            { no: 1, name: "type_id", kind: "scalar", T: 13  },
            { no: 2, name: "array_type_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<CompositeType>): CompositeType {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.typeId = 0;
        message.arrayTypeId = 0;
        if (value !== undefined)
            reflectionMergePartial<CompositeType>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CompositeType): CompositeType {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.typeId = reader.uint32();
                    break;
                case  2:
                    message.arrayTypeId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const CompositeType = /*#__PURE__*/ new CompositeType$Type();

class Schema$Type extends MessageType<Schema> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Schema", [
            { no: 1, name: "schema_id", kind: "scalar", T: 13  },
            { no: 10, name: "is_temporary", kind: "scalar", T: 8  },
            { no: 11, name: "is_public", kind: "scalar", T: 8  },
            { no: 12, name: "is_virtual", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<Schema>): Schema {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.schemaId = 0;
        message.isTemporary = false;
        message.isPublic = false;
        message.isVirtual = false;
        if (value !== undefined)
            reflectionMergePartial<Schema>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Schema): Schema {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.schemaId = reader.uint32();
                    break;
                case  10:
                    message.isTemporary = reader.bool();
                    break;
                case  11:
                    message.isPublic = reader.bool();
                    break;
                case  12:
                    message.isVirtual = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Schema = /*#__PURE__*/ new Schema$Type();

class Database$Type extends MessageType<Database> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Database", [
            { no: 1, name: "database_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<Database>): Database {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.databaseId = 0;
        if (value !== undefined)
            reflectionMergePartial<Database>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Database): Database {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.databaseId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Database = /*#__PURE__*/ new Database$Type();

class Namespace$Type extends MessageType<Namespace> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Namespace", [
            { no: 1, name: "database_id", kind: "scalar", T: 13  },
            { no: 2, name: "schema_id", kind: "scalar", T: 13  },
            { no: 3, name: "descriptor_id", kind: "scalar", T: 13  },
            { no: 4, name: "name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<Namespace>): Namespace {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.databaseId = 0;
        message.schemaId = 0;
        message.descriptorId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<Namespace>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Namespace): Namespace {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.databaseId = reader.uint32();
                    break;
                case  2:
                    message.schemaId = reader.uint32();
                    break;
                case  3:
                    message.descriptorId = reader.uint32();
                    break;
                case  4:
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

export const Namespace = /*#__PURE__*/ new Namespace$Type();

class Owner$Type extends MessageType<Owner> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Owner", [
            { no: 1, name: "descriptor_id", kind: "scalar", T: 13  },
            { no: 2, name: "owner", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<Owner>): Owner {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.descriptorId = 0;
        message.owner = "";
        if (value !== undefined)
            reflectionMergePartial<Owner>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Owner): Owner {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.descriptorId = reader.uint32();
                    break;
                case  2:
                    message.owner = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Owner = /*#__PURE__*/ new Owner$Type();

class UserPrivileges$Type extends MessageType<UserPrivileges> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.UserPrivileges", [
            { no: 1, name: "descriptor_id", kind: "scalar", T: 13  },
            { no: 2, name: "user_name", kind: "scalar", T: 9  },
            { no: 3, name: "privileges", kind: "scalar", T: 4 , L: 0  },
            { no: 4, name: "with_grant_option", kind: "scalar", T: 4 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<UserPrivileges>): UserPrivileges {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.descriptorId = 0;
        message.userName = "";
        message.privileges = 0n;
        message.withGrantOption = 0n;
        if (value !== undefined)
            reflectionMergePartial<UserPrivileges>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UserPrivileges): UserPrivileges {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.descriptorId = reader.uint32();
                    break;
                case  2:
                    message.userName = reader.string();
                    break;
                case  3:
                    message.privileges = reader.uint64().toBigInt();
                    break;
                case  4:
                    message.withGrantOption = reader.uint64().toBigInt();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const UserPrivileges = /*#__PURE__*/ new UserPrivileges$Type();

class NamedRangeZoneConfig$Type extends MessageType<NamedRangeZoneConfig> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.NamedRangeZoneConfig", [
            { no: 1, name: "range_id", kind: "scalar", T: 13  },
            { no: 2, name: "zone_config", kind: "message", T: () => ZoneConfig },
            { no: 3, name: "seq_num", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<NamedRangeZoneConfig>): NamedRangeZoneConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rangeId = 0;
        message.seqNum = 0;
        if (value !== undefined)
            reflectionMergePartial<NamedRangeZoneConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NamedRangeZoneConfig): NamedRangeZoneConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rangeId = reader.uint32();
                    break;
                case  2:
                    message.zoneConfig = ZoneConfig.internalBinaryRead(reader, reader.uint32(), options, message.zoneConfig);
                    break;
                case  3:
                    message.seqNum = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const NamedRangeZoneConfig = /*#__PURE__*/ new NamedRangeZoneConfig$Type();

class TableLocalityGlobal$Type extends MessageType<TableLocalityGlobal> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TableLocalityGlobal", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<TableLocalityGlobal>): TableLocalityGlobal {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        if (value !== undefined)
            reflectionMergePartial<TableLocalityGlobal>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableLocalityGlobal): TableLocalityGlobal {
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

export const TableLocalityGlobal = /*#__PURE__*/ new TableLocalityGlobal$Type();

class TableLocalityPrimaryRegion$Type extends MessageType<TableLocalityPrimaryRegion> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TableLocalityPrimaryRegion", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<TableLocalityPrimaryRegion>): TableLocalityPrimaryRegion {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        if (value !== undefined)
            reflectionMergePartial<TableLocalityPrimaryRegion>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableLocalityPrimaryRegion): TableLocalityPrimaryRegion {
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

export const TableLocalityPrimaryRegion = /*#__PURE__*/ new TableLocalityPrimaryRegion$Type();

class TableLocalitySecondaryRegion$Type extends MessageType<TableLocalitySecondaryRegion> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TableLocalitySecondaryRegion", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "region_enum_type_id", kind: "scalar", T: 13  },
            { no: 3, name: "region_name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<TableLocalitySecondaryRegion>): TableLocalitySecondaryRegion {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.regionEnumTypeId = 0;
        message.regionName = "";
        if (value !== undefined)
            reflectionMergePartial<TableLocalitySecondaryRegion>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableLocalitySecondaryRegion): TableLocalitySecondaryRegion {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.regionEnumTypeId = reader.uint32();
                    break;
                case  3:
                    message.regionName = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableLocalitySecondaryRegion = /*#__PURE__*/ new TableLocalitySecondaryRegion$Type();

class TableLocalityRegionalByRow$Type extends MessageType<TableLocalityRegionalByRow> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TableLocalityRegionalByRow", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "as", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<TableLocalityRegionalByRow>): TableLocalityRegionalByRow {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.as = "";
        if (value !== undefined)
            reflectionMergePartial<TableLocalityRegionalByRow>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableLocalityRegionalByRow): TableLocalityRegionalByRow {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.as = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableLocalityRegionalByRow = /*#__PURE__*/ new TableLocalityRegionalByRow$Type();

class TableLocalityRegionalByRowUsingConstraint$Type extends MessageType<TableLocalityRegionalByRowUsingConstraint> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TableLocalityRegionalByRowUsingConstraint", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "constraint_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<TableLocalityRegionalByRowUsingConstraint>): TableLocalityRegionalByRowUsingConstraint {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.constraintId = 0;
        if (value !== undefined)
            reflectionMergePartial<TableLocalityRegionalByRowUsingConstraint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableLocalityRegionalByRowUsingConstraint): TableLocalityRegionalByRowUsingConstraint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
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

export const TableLocalityRegionalByRowUsingConstraint = /*#__PURE__*/ new TableLocalityRegionalByRowUsingConstraint$Type();

class IndexPartitioning$Type extends MessageType<IndexPartitioning> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.IndexPartitioning", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "index_id", kind: "scalar", T: 13  },
            { no: 3, name: "partitioning", kind: "message", T: () => PartitioningDescriptor }
        ]);
    }
    create(value?: PartialMessage<IndexPartitioning>): IndexPartitioning {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.indexId = 0;
        if (value !== undefined)
            reflectionMergePartial<IndexPartitioning>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexPartitioning): IndexPartitioning {
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
                    message.partitioning = PartitioningDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.partitioning);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const IndexPartitioning = /*#__PURE__*/ new IndexPartitioning$Type();

class RowLevelTTL$Type extends MessageType<RowLevelTTL> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.RowLevelTTL", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "row_level_ttl", kind: "message", T: () => RowLevelTTL$ },
            { no: 3, name: "ttl_expr", kind: "message", T: () => Expression }
        ]);
    }
    create(value?: PartialMessage<RowLevelTTL>): RowLevelTTL {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        if (value !== undefined)
            reflectionMergePartial<RowLevelTTL>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RowLevelTTL): RowLevelTTL {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.rowLevelTtl = RowLevelTTL$.internalBinaryRead(reader, reader.uint32(), options, message.rowLevelTtl);
                    break;
                case  3:
                    message.ttlExpr = Expression.internalBinaryRead(reader, reader.uint32(), options, message.ttlExpr);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const RowLevelTTL = /*#__PURE__*/ new RowLevelTTL$Type();

class ColumnName$Type extends MessageType<ColumnName> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ColumnName", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "column_id", kind: "scalar", T: 13  },
            { no: 3, name: "name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<ColumnName>): ColumnName {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.columnId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<ColumnName>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnName): ColumnName {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.columnId = reader.uint32();
                    break;
                case  3:
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

export const ColumnName = /*#__PURE__*/ new ColumnName$Type();

class IndexName$Type extends MessageType<IndexName> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.IndexName", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "index_id", kind: "scalar", T: 13  },
            { no: 3, name: "name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<IndexName>): IndexName {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.indexId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<IndexName>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexName): IndexName {
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

export const IndexName = /*#__PURE__*/ new IndexName$Type();

class ConstraintWithoutIndexName$Type extends MessageType<ConstraintWithoutIndexName> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ConstraintWithoutIndexName", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "constraint_id", kind: "scalar", T: 13  },
            { no: 4, name: "name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<ConstraintWithoutIndexName>): ConstraintWithoutIndexName {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.constraintId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<ConstraintWithoutIndexName>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConstraintWithoutIndexName): ConstraintWithoutIndexName {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.constraintId = reader.uint32();
                    break;
                case  4:
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

export const ConstraintWithoutIndexName = /*#__PURE__*/ new ConstraintWithoutIndexName$Type();

class TableComment$Type extends MessageType<TableComment> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TableComment", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "comment", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<TableComment>): TableComment {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.comment = "";
        if (value !== undefined)
            reflectionMergePartial<TableComment>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableComment): TableComment {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.comment = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableComment = /*#__PURE__*/ new TableComment$Type();

class TypeComment$Type extends MessageType<TypeComment> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TypeComment", [
            { no: 1, name: "type_id", kind: "scalar", T: 13  },
            { no: 2, name: "comment", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<TypeComment>): TypeComment {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.typeId = 0;
        message.comment = "";
        if (value !== undefined)
            reflectionMergePartial<TypeComment>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TypeComment): TypeComment {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.typeId = reader.uint32();
                    break;
                case  2:
                    message.comment = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TypeComment = /*#__PURE__*/ new TypeComment$Type();

class DatabaseComment$Type extends MessageType<DatabaseComment> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.DatabaseComment", [
            { no: 1, name: "database_id", kind: "scalar", T: 13  },
            { no: 2, name: "comment", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<DatabaseComment>): DatabaseComment {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.databaseId = 0;
        message.comment = "";
        if (value !== undefined)
            reflectionMergePartial<DatabaseComment>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DatabaseComment): DatabaseComment {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.databaseId = reader.uint32();
                    break;
                case  2:
                    message.comment = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const DatabaseComment = /*#__PURE__*/ new DatabaseComment$Type();

class SchemaComment$Type extends MessageType<SchemaComment> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.SchemaComment", [
            { no: 1, name: "schema_id", kind: "scalar", T: 13  },
            { no: 2, name: "comment", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<SchemaComment>): SchemaComment {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.schemaId = 0;
        message.comment = "";
        if (value !== undefined)
            reflectionMergePartial<SchemaComment>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SchemaComment): SchemaComment {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.schemaId = reader.uint32();
                    break;
                case  2:
                    message.comment = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SchemaComment = /*#__PURE__*/ new SchemaComment$Type();

class IndexComment$Type extends MessageType<IndexComment> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.IndexComment", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "index_id", kind: "scalar", T: 13  },
            { no: 3, name: "comment", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<IndexComment>): IndexComment {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.indexId = 0;
        message.comment = "";
        if (value !== undefined)
            reflectionMergePartial<IndexComment>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexComment): IndexComment {
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
                    message.comment = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const IndexComment = /*#__PURE__*/ new IndexComment$Type();

class ColumnComment$Type extends MessageType<ColumnComment> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ColumnComment", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "column_id", kind: "scalar", T: 13  },
            { no: 3, name: "comment", kind: "scalar", T: 9  },
            { no: 4, name: "pg_attribute_num", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<ColumnComment>): ColumnComment {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.columnId = 0;
        message.comment = "";
        message.pgAttributeNum = 0;
        if (value !== undefined)
            reflectionMergePartial<ColumnComment>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnComment): ColumnComment {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.columnId = reader.uint32();
                    break;
                case  3:
                    message.comment = reader.string();
                    break;
                case  4:
                    message.pgAttributeNum = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ColumnComment = /*#__PURE__*/ new ColumnComment$Type();

class ColumnNotNull$Type extends MessageType<ColumnNotNull> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ColumnNotNull", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "column_id", kind: "scalar", T: 13  },
            { no: 3, name: "index_id_for_validation", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<ColumnNotNull>): ColumnNotNull {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.columnId = 0;
        message.indexIdForValidation = 0;
        if (value !== undefined)
            reflectionMergePartial<ColumnNotNull>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ColumnNotNull): ColumnNotNull {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.columnId = reader.uint32();
                    break;
                case  3:
                    message.indexIdForValidation = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ColumnNotNull = /*#__PURE__*/ new ColumnNotNull$Type();

class ConstraintComment$Type extends MessageType<ConstraintComment> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ConstraintComment", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "constraint_id", kind: "scalar", T: 13  },
            { no: 3, name: "comment", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<ConstraintComment>): ConstraintComment {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.constraintId = 0;
        message.comment = "";
        if (value !== undefined)
            reflectionMergePartial<ConstraintComment>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConstraintComment): ConstraintComment {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.constraintId = reader.uint32();
                    break;
                case  3:
                    message.comment = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ConstraintComment = /*#__PURE__*/ new ConstraintComment$Type();

class DatabaseRegionConfig$Type extends MessageType<DatabaseRegionConfig> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.DatabaseRegionConfig", [
            { no: 1, name: "database_id", kind: "scalar", T: 13  },
            { no: 2, name: "region_enum_type_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<DatabaseRegionConfig>): DatabaseRegionConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.databaseId = 0;
        message.regionEnumTypeId = 0;
        if (value !== undefined)
            reflectionMergePartial<DatabaseRegionConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DatabaseRegionConfig): DatabaseRegionConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.databaseId = reader.uint32();
                    break;
                case  2:
                    message.regionEnumTypeId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const DatabaseRegionConfig = /*#__PURE__*/ new DatabaseRegionConfig$Type();

class DatabaseRoleSetting$Type extends MessageType<DatabaseRoleSetting> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.DatabaseRoleSetting", [
            { no: 1, name: "database_id", kind: "scalar", T: 13  },
            { no: 2, name: "role_name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<DatabaseRoleSetting>): DatabaseRoleSetting {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.databaseId = 0;
        message.roleName = "";
        if (value !== undefined)
            reflectionMergePartial<DatabaseRoleSetting>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DatabaseRoleSetting): DatabaseRoleSetting {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.databaseId = reader.uint32();
                    break;
                case  2:
                    message.roleName = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const DatabaseRoleSetting = /*#__PURE__*/ new DatabaseRoleSetting$Type();

class IndexColumn$Type extends MessageType<IndexColumn> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.IndexColumn", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "index_id", kind: "scalar", T: 13  },
            { no: 3, name: "column_id", kind: "scalar", T: 13  },
            { no: 4, name: "ordinal_in_kind", kind: "scalar", T: 13  },
            { no: 5, name: "kind", kind: "enum", T: () => ["cockroach.sql.schemachanger.scpb.IndexColumn.Kind", IndexColumn_Kind] },
            { no: 6, name: "direction", kind: "enum", T: () => ["cockroach.sql.catalog.catpb.IndexColumn.Direction", IndexColumn_Direction] },
            { no: 7, name: "implicit", kind: "scalar", T: 8  },
            { no: 8, name: "inverted_kind", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<IndexColumn>): IndexColumn {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.indexId = 0;
        message.columnId = 0;
        message.ordinalInKind = 0;
        message.kind = 0;
        message.direction = 0;
        message.implicit = false;
        message.invertedKind = 0;
        if (value !== undefined)
            reflectionMergePartial<IndexColumn>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexColumn): IndexColumn {
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
                    message.columnId = reader.uint32();
                    break;
                case  4:
                    message.ordinalInKind = reader.uint32();
                    break;
                case  5:
                    message.kind = reader.int32();
                    break;
                case  6:
                    message.direction = reader.int32();
                    break;
                case  7:
                    message.implicit = reader.bool();
                    break;
                case  8:
                    message.invertedKind = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const IndexColumn = /*#__PURE__*/ new IndexColumn$Type();

class EnumTypeValue$Type extends MessageType<EnumTypeValue> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.EnumTypeValue", [
            { no: 1, name: "type_id", kind: "scalar", T: 13  },
            { no: 2, name: "physical_representation", kind: "scalar", T: 12  },
            { no: 3, name: "logical_representation", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<EnumTypeValue>): EnumTypeValue {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.typeId = 0;
        message.physicalRepresentation = new Uint8Array(0);
        message.logicalRepresentation = "";
        if (value !== undefined)
            reflectionMergePartial<EnumTypeValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EnumTypeValue): EnumTypeValue {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.typeId = reader.uint32();
                    break;
                case  2:
                    message.physicalRepresentation = reader.bytes();
                    break;
                case  3:
                    message.logicalRepresentation = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const EnumTypeValue = /*#__PURE__*/ new EnumTypeValue$Type();

class CompositeTypeAttrName$Type extends MessageType<CompositeTypeAttrName> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.CompositeTypeAttrName", [
            { no: 1, name: "composite_type_id", kind: "scalar", T: 13  },
            { no: 2, name: "name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<CompositeTypeAttrName>): CompositeTypeAttrName {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.compositeTypeId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<CompositeTypeAttrName>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CompositeTypeAttrName): CompositeTypeAttrName {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.compositeTypeId = reader.uint32();
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

export const CompositeTypeAttrName = /*#__PURE__*/ new CompositeTypeAttrName$Type();

class CompositeTypeAttrType$Type extends MessageType<CompositeTypeAttrType> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.CompositeTypeAttrType", [
            { no: 1, name: "composite_type_id", kind: "scalar", T: 13  },
            { no: 2, name: "embedded_type_t", kind: "message", T: () => TypeT }
        ]);
    }
    create(value?: PartialMessage<CompositeTypeAttrType>): CompositeTypeAttrType {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.compositeTypeId = 0;
        if (value !== undefined)
            reflectionMergePartial<CompositeTypeAttrType>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CompositeTypeAttrType): CompositeTypeAttrType {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.compositeTypeId = reader.uint32();
                    break;
                case  2:
                    message.embeddedTypeT = TypeT.internalBinaryRead(reader, reader.uint32(), options, message.embeddedTypeT);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const CompositeTypeAttrType = /*#__PURE__*/ new CompositeTypeAttrType$Type();

class DatabaseZoneConfig$Type extends MessageType<DatabaseZoneConfig> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.DatabaseZoneConfig", [
            { no: 1, name: "database_id", kind: "scalar", T: 13  },
            { no: 2, name: "zone_config", kind: "message", T: () => ZoneConfig },
            { no: 3, name: "seq_num", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<DatabaseZoneConfig>): DatabaseZoneConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.databaseId = 0;
        message.seqNum = 0;
        if (value !== undefined)
            reflectionMergePartial<DatabaseZoneConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DatabaseZoneConfig): DatabaseZoneConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.databaseId = reader.uint32();
                    break;
                case  2:
                    message.zoneConfig = ZoneConfig.internalBinaryRead(reader, reader.uint32(), options, message.zoneConfig);
                    break;
                case  3:
                    message.seqNum = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const DatabaseZoneConfig = /*#__PURE__*/ new DatabaseZoneConfig$Type();

class TableZoneConfig$Type extends MessageType<TableZoneConfig> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TableZoneConfig", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "zone_config", kind: "message", T: () => ZoneConfig },
            { no: 3, name: "seq_num", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<TableZoneConfig>): TableZoneConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.seqNum = 0;
        if (value !== undefined)
            reflectionMergePartial<TableZoneConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableZoneConfig): TableZoneConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.zoneConfig = ZoneConfig.internalBinaryRead(reader, reader.uint32(), options, message.zoneConfig);
                    break;
                case  3:
                    message.seqNum = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableZoneConfig = /*#__PURE__*/ new TableZoneConfig$Type();

class IndexZoneConfig$Type extends MessageType<IndexZoneConfig> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.IndexZoneConfig", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "index_id", kind: "scalar", T: 13  },
            { no: 4, name: "subzone", kind: "message", T: () => Subzone },
            { no: 5, name: "subzone_spans", kind: "message", repeat: 2 , T: () => SubzoneSpan },
            { no: 6, name: "seq_num", kind: "scalar", T: 13  },
            { no: 7, name: "old_idx_ref", kind: "scalar", T: 5  }
        ]);
    }
    create(value?: PartialMessage<IndexZoneConfig>): IndexZoneConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.indexId = 0;
        message.subzoneSpans = [];
        message.seqNum = 0;
        message.oldIdxRef = 0;
        if (value !== undefined)
            reflectionMergePartial<IndexZoneConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexZoneConfig): IndexZoneConfig {
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
                case  4:
                    message.subzone = Subzone.internalBinaryRead(reader, reader.uint32(), options, message.subzone);
                    break;
                case  5:
                    message.subzoneSpans.push(SubzoneSpan.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.seqNum = reader.uint32();
                    break;
                case  7:
                    message.oldIdxRef = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const IndexZoneConfig = /*#__PURE__*/ new IndexZoneConfig$Type();

class PartitionZoneConfig$Type extends MessageType<PartitionZoneConfig> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.PartitionZoneConfig", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "index_id", kind: "scalar", T: 13  },
            { no: 3, name: "partition_name", kind: "scalar", T: 9  },
            { no: 4, name: "subzone", kind: "message", T: () => Subzone },
            { no: 5, name: "subzone_spans", kind: "message", repeat: 2 , T: () => SubzoneSpan },
            { no: 6, name: "seq_num", kind: "scalar", T: 13  },
            { no: 7, name: "old_idx_ref", kind: "scalar", T: 5  }
        ]);
    }
    create(value?: PartialMessage<PartitionZoneConfig>): PartitionZoneConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.indexId = 0;
        message.partitionName = "";
        message.subzoneSpans = [];
        message.seqNum = 0;
        message.oldIdxRef = 0;
        if (value !== undefined)
            reflectionMergePartial<PartitionZoneConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PartitionZoneConfig): PartitionZoneConfig {
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
                    message.partitionName = reader.string();
                    break;
                case  4:
                    message.subzone = Subzone.internalBinaryRead(reader, reader.uint32(), options, message.subzone);
                    break;
                case  5:
                    message.subzoneSpans.push(SubzoneSpan.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.seqNum = reader.uint32();
                    break;
                case  7:
                    message.oldIdxRef = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PartitionZoneConfig = /*#__PURE__*/ new PartitionZoneConfig$Type();

class DatabaseData$Type extends MessageType<DatabaseData> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.DatabaseData", [
            { no: 1, name: "database_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<DatabaseData>): DatabaseData {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.databaseId = 0;
        if (value !== undefined)
            reflectionMergePartial<DatabaseData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DatabaseData): DatabaseData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.databaseId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const DatabaseData = /*#__PURE__*/ new DatabaseData$Type();

class TableData$Type extends MessageType<TableData> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TableData", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "database_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<TableData>): TableData {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.databaseId = 0;
        if (value !== undefined)
            reflectionMergePartial<TableData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableData): TableData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tableId = reader.uint32();
                    break;
                case  2:
                    message.databaseId = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TableData = /*#__PURE__*/ new TableData$Type();

class IndexData$Type extends MessageType<IndexData> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.IndexData", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "index_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<IndexData>): IndexData {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.indexId = 0;
        if (value !== undefined)
            reflectionMergePartial<IndexData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexData): IndexData {
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
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const IndexData = /*#__PURE__*/ new IndexData$Type();

class TablePartitioning$Type extends MessageType<TablePartitioning> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TablePartitioning", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<TablePartitioning>): TablePartitioning {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        if (value !== undefined)
            reflectionMergePartial<TablePartitioning>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TablePartitioning): TablePartitioning {
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

export const TablePartitioning = /*#__PURE__*/ new TablePartitioning$Type();

class TableSchemaLocked$Type extends MessageType<TableSchemaLocked> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TableSchemaLocked", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<TableSchemaLocked>): TableSchemaLocked {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        if (value !== undefined)
            reflectionMergePartial<TableSchemaLocked>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TableSchemaLocked): TableSchemaLocked {
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

export const TableSchemaLocked = /*#__PURE__*/ new TableSchemaLocked$Type();

class LDRJobIDs$Type extends MessageType<LDRJobIDs> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.LDRJobIDs", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "job_ids", kind: "scalar", repeat: 1 , T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<LDRJobIDs>): LDRJobIDs {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.jobIds = [];
        if (value !== undefined)
            reflectionMergePartial<LDRJobIDs>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LDRJobIDs): LDRJobIDs {
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
                            message.jobIds.push(reader.int64().toBigInt());
                    else
                        message.jobIds.push(reader.int64().toBigInt());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const LDRJobIDs = /*#__PURE__*/ new LDRJobIDs$Type();

class Function$Type extends MessageType<Function> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Function", [
            { no: 1, name: "function_id", kind: "scalar", T: 13  },
            { no: 2, name: "params", kind: "message", repeat: 2 , T: () => Function_Parameter },
            { no: 3, name: "return_set", kind: "scalar", T: 8  },
            { no: 4, name: "return_type", kind: "message", T: () => TypeT },
            { no: 5, name: "is_procedure", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<Function>): Function {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.functionId = 0;
        message.params = [];
        message.returnSet = false;
        message.isProcedure = false;
        if (value !== undefined)
            reflectionMergePartial<Function>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Function): Function {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.functionId = reader.uint32();
                    break;
                case  2:
                    message.params.push(Function_Parameter.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.returnSet = reader.bool();
                    break;
                case  4:
                    message.returnType = TypeT.internalBinaryRead(reader, reader.uint32(), options, message.returnType);
                    break;
                case  5:
                    message.isProcedure = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Function = /*#__PURE__*/ new Function$Type();

class Function_Parameter$Type extends MessageType<Function_Parameter> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Function.Parameter", [
            { no: 1, name: "name", kind: "scalar", T: 9  },
            { no: 2, name: "class", kind: "message", T: () => FunctionParamClass },
            { no: 3, name: "type", kind: "message", T: () => TypeT },
            { no: 4, name: "default_expr", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<Function_Parameter>): Function_Parameter {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        message.defaultExpr = "";
        if (value !== undefined)
            reflectionMergePartial<Function_Parameter>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Function_Parameter): Function_Parameter {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.class = FunctionParamClass.internalBinaryRead(reader, reader.uint32(), options, message.class);
                    break;
                case  3:
                    message.type = TypeT.internalBinaryRead(reader, reader.uint32(), options, message.type);
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

export const Function_Parameter = /*#__PURE__*/ new Function_Parameter$Type();

class FunctionName$Type extends MessageType<FunctionName> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.FunctionName", [
            { no: 1, name: "function_id", kind: "scalar", T: 13  },
            { no: 2, name: "name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<FunctionName>): FunctionName {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.functionId = 0;
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<FunctionName>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionName): FunctionName {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.functionId = reader.uint32();
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

export const FunctionName = /*#__PURE__*/ new FunctionName$Type();

class FunctionVolatility$Type extends MessageType<FunctionVolatility> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.FunctionVolatility", [
            { no: 1, name: "function_id", kind: "scalar", T: 13  },
            { no: 2, name: "volatility", kind: "message", T: () => FunctionVolatility$ }
        ]);
    }
    create(value?: PartialMessage<FunctionVolatility>): FunctionVolatility {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.functionId = 0;
        if (value !== undefined)
            reflectionMergePartial<FunctionVolatility>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionVolatility): FunctionVolatility {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.functionId = reader.uint32();
                    break;
                case  2:
                    message.volatility = FunctionVolatility$.internalBinaryRead(reader, reader.uint32(), options, message.volatility);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionVolatility = /*#__PURE__*/ new FunctionVolatility$Type();

class FunctionLeakProof$Type extends MessageType<FunctionLeakProof> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.FunctionLeakProof", [
            { no: 1, name: "function_id", kind: "scalar", T: 13  },
            { no: 2, name: "leak_proof", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<FunctionLeakProof>): FunctionLeakProof {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.functionId = 0;
        message.leakProof = false;
        if (value !== undefined)
            reflectionMergePartial<FunctionLeakProof>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionLeakProof): FunctionLeakProof {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.functionId = reader.uint32();
                    break;
                case  2:
                    message.leakProof = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionLeakProof = /*#__PURE__*/ new FunctionLeakProof$Type();

class FunctionNullInputBehavior$Type extends MessageType<FunctionNullInputBehavior> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.FunctionNullInputBehavior", [
            { no: 1, name: "function_id", kind: "scalar", T: 13  },
            { no: 11, name: "null_input_behavior", kind: "message", T: () => FunctionNullInputBehavior$ }
        ]);
    }
    create(value?: PartialMessage<FunctionNullInputBehavior>): FunctionNullInputBehavior {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.functionId = 0;
        if (value !== undefined)
            reflectionMergePartial<FunctionNullInputBehavior>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionNullInputBehavior): FunctionNullInputBehavior {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.functionId = reader.uint32();
                    break;
                case  11:
                    message.nullInputBehavior = FunctionNullInputBehavior$.internalBinaryRead(reader, reader.uint32(), options, message.nullInputBehavior);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionNullInputBehavior = /*#__PURE__*/ new FunctionNullInputBehavior$Type();

class FunctionBody$Type extends MessageType<FunctionBody> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.FunctionBody", [
            { no: 1, name: "function_id", kind: "scalar", T: 13  },
            { no: 2, name: "body", kind: "scalar", T: 9  },
            { no: 3, name: "lang", kind: "message", T: () => FunctionLanguage },
            { no: 4, name: "uses_tables", kind: "message", repeat: 2 , T: () => FunctionBody_TableReference },
            { no: 5, name: "uses_views", kind: "message", repeat: 2 , T: () => FunctionBody_ViewReference },
            { no: 6, name: "uses_sequence_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 7, name: "uses_type_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 8, name: "uses_function_ids", kind: "scalar", repeat: 1 , T: 13  }
        ]);
    }
    create(value?: PartialMessage<FunctionBody>): FunctionBody {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.functionId = 0;
        message.body = "";
        message.usesTables = [];
        message.usesViews = [];
        message.usesSequenceIds = [];
        message.usesTypeIds = [];
        message.usesFunctionIds = [];
        if (value !== undefined)
            reflectionMergePartial<FunctionBody>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionBody): FunctionBody {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.functionId = reader.uint32();
                    break;
                case  2:
                    message.body = reader.string();
                    break;
                case  3:
                    message.lang = FunctionLanguage.internalBinaryRead(reader, reader.uint32(), options, message.lang);
                    break;
                case  4:
                    message.usesTables.push(FunctionBody_TableReference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    message.usesViews.push(FunctionBody_ViewReference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesSequenceIds.push(reader.uint32());
                    else
                        message.usesSequenceIds.push(reader.uint32());
                    break;
                case  7:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesTypeIds.push(reader.uint32());
                    else
                        message.usesTypeIds.push(reader.uint32());
                    break;
                case  8:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.usesFunctionIds.push(reader.uint32());
                    else
                        message.usesFunctionIds.push(reader.uint32());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionBody = /*#__PURE__*/ new FunctionBody$Type();

class FunctionBody_TableReference$Type extends MessageType<FunctionBody_TableReference> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.FunctionBody.TableReference", [
            { no: 1, name: "table_id", kind: "scalar", T: 13  },
            { no: 2, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  },
            { no: 3, name: "index_id", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<FunctionBody_TableReference>): FunctionBody_TableReference {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tableId = 0;
        message.columnIds = [];
        message.indexId = 0;
        if (value !== undefined)
            reflectionMergePartial<FunctionBody_TableReference>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionBody_TableReference): FunctionBody_TableReference {
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

export const FunctionBody_TableReference = /*#__PURE__*/ new FunctionBody_TableReference$Type();

class FunctionBody_ViewReference$Type extends MessageType<FunctionBody_ViewReference> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.FunctionBody.ViewReference", [
            { no: 1, name: "view_id", kind: "scalar", T: 13  },
            { no: 2, name: "column_ids", kind: "scalar", repeat: 1 , T: 13  }
        ]);
    }
    create(value?: PartialMessage<FunctionBody_ViewReference>): FunctionBody_ViewReference {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.viewId = 0;
        message.columnIds = [];
        if (value !== undefined)
            reflectionMergePartial<FunctionBody_ViewReference>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionBody_ViewReference): FunctionBody_ViewReference {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.viewId = reader.uint32();
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.columnIds.push(reader.uint32());
                    else
                        message.columnIds.push(reader.uint32());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionBody_ViewReference = /*#__PURE__*/ new FunctionBody_ViewReference$Type();

class FunctionSecurity$Type extends MessageType<FunctionSecurity> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.FunctionSecurity", [
            { no: 1, name: "function_id", kind: "scalar", T: 13  },
            { no: 2, name: "security", kind: "message", T: () => FunctionSecurity$ }
        ]);
    }
    create(value?: PartialMessage<FunctionSecurity>): FunctionSecurity {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.functionId = 0;
        if (value !== undefined)
            reflectionMergePartial<FunctionSecurity>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionSecurity): FunctionSecurity {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.functionId = reader.uint32();
                    break;
                case  2:
                    message.security = FunctionSecurity$.internalBinaryRead(reader, reader.uint32(), options, message.security);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FunctionSecurity = /*#__PURE__*/ new FunctionSecurity$Type();

class ElementCreationMetadata$Type extends MessageType<ElementCreationMetadata> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.ElementCreationMetadata", [
            { no: 1, name: "in_23_1_or_later", kind: "scalar", T: 8  },
            { no: 2, name: "in_24_3_or_later", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<ElementCreationMetadata>): ElementCreationMetadata {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.in231OrLater = false;
        message.in243OrLater = false;
        if (value !== undefined)
            reflectionMergePartial<ElementCreationMetadata>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ElementCreationMetadata): ElementCreationMetadata {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.in231OrLater = reader.bool();
                    break;
                case  2:
                    message.in243OrLater = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ElementCreationMetadata = /*#__PURE__*/ new ElementCreationMetadata$Type();
