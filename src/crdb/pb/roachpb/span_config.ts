// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { EncodedError } from "../errorspb/errors";
import { RangeDescriptor } from "./metadata";
import { Span } from "./data";
import { TenantID } from "./data";
import { Timestamp } from "../util/hlc/timestamp";

export interface GCPolicy {

    ttlSeconds: number;

    protectionPolicies: ProtectionPolicy[];

    ignoreStrictEnforcement: boolean;
}

export interface ProtectionPolicy {

    protectedTimestamp?: Timestamp;

    ignoreIfExcludedFromBackup: boolean;
}

export interface Constraint {

    type: Constraint_Type;

    key: string;

    value: string;
}

export enum Constraint_Type {

    REQUIRED = 0,

    PROHIBITED = 1
}

export interface ConstraintsConjunction {

    numReplicas: number;

    constraints: Constraint[];
}

export interface LeasePreference {

    constraints: Constraint[];
}

export interface SpanConfig {

    rangeMinBytes: bigint;

    rangeMaxBytes: bigint;

    gcPolicy?: GCPolicy;

    globalReads: boolean;

    numReplicas: number;

    numVoters: number;

    constraints: ConstraintsConjunction[];

    voterConstraints: ConstraintsConjunction[];

    leasePreferences: LeasePreference[];

    rangefeedEnabled: boolean;

    excludeDataFromBackup: boolean;
}

export interface SystemSpanConfigTarget {

    sourceTenantId?: TenantID;

    type?: SystemSpanConfigTarget_Type;
}

export interface SystemSpanConfigTarget_TenantKeyspace {

    tenantId?: TenantID;
}

export interface SystemSpanConfigTarget_EntireKeyspace {
}

export interface SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet {
}

export interface SystemSpanConfigTarget_Type {

    type: {
        oneofKind: "specificTenantKeyspace";

        specificTenantKeyspace: SystemSpanConfigTarget_TenantKeyspace;
    } | {
        oneofKind: "entireKeyspace";

        entireKeyspace: SystemSpanConfigTarget_EntireKeyspace;
    } | {
        oneofKind: "allTenantKeyspaceTargetsSet";

        allTenantKeyspaceTargetsSet: SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet;
    } | {
        oneofKind: undefined;
    };
}

export interface SpanConfigTarget {

    union: {
        oneofKind: "span";

        span: Span;
    } | {
        oneofKind: "systemSpanConfigTarget";

        systemSpanConfigTarget: SystemSpanConfigTarget;
    } | {
        oneofKind: undefined;
    };
}

export interface SpanConfigEntry {

    target?: SpanConfigTarget;

    config?: SpanConfig;
}

export interface SpanConfigConformanceReport {

    underReplicated: ConformanceReportedRange[];

    overReplicated: ConformanceReportedRange[];

    violatingConstraints: ConformanceReportedRange[];

    unavailable: ConformanceReportedRange[];

    unavailableNodeIds: number[];
}

export interface ConformanceReportedRange {

    rangeDescriptor?: RangeDescriptor;

    config?: SpanConfig;
}

export interface GetSpanConfigsRequest {

    targets: SpanConfigTarget[];
}

export interface GetSpanConfigsResponse {

    spanConfigEntries: SpanConfigEntry[];
}

export interface UpdateSpanConfigsRequest {

    toDelete: SpanConfigTarget[];

    toUpsert: SpanConfigEntry[];

    minCommitTimestamp?: Timestamp;

    maxCommitTimestamp?: Timestamp;
}

export interface UpdateSpanConfigsResponse {

    error?: EncodedError;
}

export interface SpanConfigConformanceRequest {

    spans: Span[];
}

export interface SpanConfigConformanceResponse {

    report?: SpanConfigConformanceReport;
}

export interface GetAllSystemSpanConfigsThatApplyRequest {

    tenantId?: TenantID;
}

export interface GetAllSystemSpanConfigsThatApplyResponse {

    spanConfigs: SpanConfig[];
}

class GCPolicy$Type extends MessageType<GCPolicy> {
    constructor() {
        super("cockroach.roachpb.GCPolicy", [
            { no: 1, name: "ttl_seconds", kind: "scalar", T: 5  },
            { no: 2, name: "protection_policies", kind: "message", repeat: 2 , T: () => ProtectionPolicy },
            { no: 3, name: "ignore_strict_enforcement", kind: "scalar", T: 8  }
        ], { "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<GCPolicy>): GCPolicy {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.ttlSeconds = 0;
        message.protectionPolicies = [];
        message.ignoreStrictEnforcement = false;
        if (value !== undefined)
            reflectionMergePartial<GCPolicy>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GCPolicy): GCPolicy {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.ttlSeconds = reader.int32();
                    break;
                case  2:
                    message.protectionPolicies.push(ProtectionPolicy.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.ignoreStrictEnforcement = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const GCPolicy = /*#__PURE__*/ new GCPolicy$Type();

class ProtectionPolicy$Type extends MessageType<ProtectionPolicy> {
    constructor() {
        super("cockroach.roachpb.ProtectionPolicy", [
            { no: 1, name: "protected_timestamp", kind: "message", T: () => Timestamp },
            { no: 2, name: "ignore_if_excluded_from_backup", kind: "scalar", T: 8  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ProtectionPolicy>): ProtectionPolicy {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.ignoreIfExcludedFromBackup = false;
        if (value !== undefined)
            reflectionMergePartial<ProtectionPolicy>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ProtectionPolicy): ProtectionPolicy {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.protectedTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.protectedTimestamp);
                    break;
                case  2:
                    message.ignoreIfExcludedFromBackup = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ProtectionPolicy = /*#__PURE__*/ new ProtectionPolicy$Type();

class Constraint$Type extends MessageType<Constraint> {
    constructor() {
        super("cockroach.roachpb.Constraint", [
            { no: 1, name: "type", kind: "enum", T: () => ["cockroach.roachpb.Constraint.Type", Constraint_Type] },
            { no: 2, name: "key", kind: "scalar", T: 9  },
            { no: 3, name: "value", kind: "scalar", T: 9  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Constraint>): Constraint {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.type = 0;
        message.key = "";
        message.value = "";
        if (value !== undefined)
            reflectionMergePartial<Constraint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Constraint): Constraint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.type = reader.int32();
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

export const Constraint = /*#__PURE__*/ new Constraint$Type();

class ConstraintsConjunction$Type extends MessageType<ConstraintsConjunction> {
    constructor() {
        super("cockroach.roachpb.ConstraintsConjunction", [
            { no: 1, name: "num_replicas", kind: "scalar", T: 5  },
            { no: 2, name: "constraints", kind: "message", repeat: 2 , T: () => Constraint }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ConstraintsConjunction>): ConstraintsConjunction {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.numReplicas = 0;
        message.constraints = [];
        if (value !== undefined)
            reflectionMergePartial<ConstraintsConjunction>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConstraintsConjunction): ConstraintsConjunction {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.numReplicas = reader.int32();
                    break;
                case  2:
                    message.constraints.push(Constraint.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ConstraintsConjunction = /*#__PURE__*/ new ConstraintsConjunction$Type();

class LeasePreference$Type extends MessageType<LeasePreference> {
    constructor() {
        super("cockroach.roachpb.LeasePreference", [
            { no: 1, name: "constraints", kind: "message", repeat: 2 , T: () => Constraint }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<LeasePreference>): LeasePreference {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.constraints = [];
        if (value !== undefined)
            reflectionMergePartial<LeasePreference>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LeasePreference): LeasePreference {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.constraints.push(Constraint.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const LeasePreference = /*#__PURE__*/ new LeasePreference$Type();

class SpanConfig$Type extends MessageType<SpanConfig> {
    constructor() {
        super("cockroach.roachpb.SpanConfig", [
            { no: 1, name: "range_min_bytes", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "range_max_bytes", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "gc_policy", kind: "message", T: () => GCPolicy },
            { no: 4, name: "global_reads", kind: "scalar", T: 8  },
            { no: 5, name: "num_replicas", kind: "scalar", T: 5  },
            { no: 6, name: "num_voters", kind: "scalar", T: 5  },
            { no: 7, name: "constraints", kind: "message", repeat: 2 , T: () => ConstraintsConjunction },
            { no: 8, name: "voter_constraints", kind: "message", repeat: 2 , T: () => ConstraintsConjunction },
            { no: 9, name: "lease_preferences", kind: "message", repeat: 2 , T: () => LeasePreference },
            { no: 10, name: "rangefeed_enabled", kind: "scalar", T: 8  },
            { no: 11, name: "exclude_data_from_backup", kind: "scalar", T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SpanConfig>): SpanConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.rangeMinBytes = 0n;
        message.rangeMaxBytes = 0n;
        message.globalReads = false;
        message.numReplicas = 0;
        message.numVoters = 0;
        message.constraints = [];
        message.voterConstraints = [];
        message.leasePreferences = [];
        message.rangefeedEnabled = false;
        message.excludeDataFromBackup = false;
        if (value !== undefined)
            reflectionMergePartial<SpanConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfig): SpanConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rangeMinBytes = reader.int64().toBigInt();
                    break;
                case  2:
                    message.rangeMaxBytes = reader.int64().toBigInt();
                    break;
                case  3:
                    message.gcPolicy = GCPolicy.internalBinaryRead(reader, reader.uint32(), options, message.gcPolicy);
                    break;
                case  4:
                    message.globalReads = reader.bool();
                    break;
                case  5:
                    message.numReplicas = reader.int32();
                    break;
                case  6:
                    message.numVoters = reader.int32();
                    break;
                case  7:
                    message.constraints.push(ConstraintsConjunction.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  8:
                    message.voterConstraints.push(ConstraintsConjunction.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  9:
                    message.leasePreferences.push(LeasePreference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  10:
                    message.rangefeedEnabled = reader.bool();
                    break;
                case  11:
                    message.excludeDataFromBackup = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SpanConfig = /*#__PURE__*/ new SpanConfig$Type();

class SystemSpanConfigTarget$Type extends MessageType<SystemSpanConfigTarget> {
    constructor() {
        super("cockroach.roachpb.SystemSpanConfigTarget", [
            { no: 1, name: "source_tenant_id", kind: "message", T: () => TenantID },
            { no: 2, name: "type", kind: "message", T: () => SystemSpanConfigTarget_Type }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SystemSpanConfigTarget>): SystemSpanConfigTarget {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SystemSpanConfigTarget>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SystemSpanConfigTarget): SystemSpanConfigTarget {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.sourceTenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.sourceTenantId);
                    break;
                case  2:
                    message.type = SystemSpanConfigTarget_Type.internalBinaryRead(reader, reader.uint32(), options, message.type);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SystemSpanConfigTarget = /*#__PURE__*/ new SystemSpanConfigTarget$Type();

class SystemSpanConfigTarget_TenantKeyspace$Type extends MessageType<SystemSpanConfigTarget_TenantKeyspace> {
    constructor() {
        super("cockroach.roachpb.SystemSpanConfigTarget.TenantKeyspace", [
            { no: 1, name: "tenant_id", kind: "message", T: () => TenantID }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SystemSpanConfigTarget_TenantKeyspace>): SystemSpanConfigTarget_TenantKeyspace {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SystemSpanConfigTarget_TenantKeyspace>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SystemSpanConfigTarget_TenantKeyspace): SystemSpanConfigTarget_TenantKeyspace {
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

export const SystemSpanConfigTarget_TenantKeyspace = /*#__PURE__*/ new SystemSpanConfigTarget_TenantKeyspace$Type();

class SystemSpanConfigTarget_EntireKeyspace$Type extends MessageType<SystemSpanConfigTarget_EntireKeyspace> {
    constructor() {
        super("cockroach.roachpb.SystemSpanConfigTarget.EntireKeyspace", [], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SystemSpanConfigTarget_EntireKeyspace>): SystemSpanConfigTarget_EntireKeyspace {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SystemSpanConfigTarget_EntireKeyspace>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SystemSpanConfigTarget_EntireKeyspace): SystemSpanConfigTarget_EntireKeyspace {
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

export const SystemSpanConfigTarget_EntireKeyspace = /*#__PURE__*/ new SystemSpanConfigTarget_EntireKeyspace$Type();

class SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet$Type extends MessageType<SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet> {
    constructor() {
        super("cockroach.roachpb.SystemSpanConfigTarget.AllTenantKeyspaceTargetsSet", [], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet>): SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet): SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet {
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

export const SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet = /*#__PURE__*/ new SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet$Type();

class SystemSpanConfigTarget_Type$Type extends MessageType<SystemSpanConfigTarget_Type> {
    constructor() {
        super("cockroach.roachpb.SystemSpanConfigTarget.Type", [
            { no: 1, name: "specific_tenant_keyspace", kind: "message", oneof: "type", T: () => SystemSpanConfigTarget_TenantKeyspace },
            { no: 2, name: "entire_keyspace", kind: "message", oneof: "type", T: () => SystemSpanConfigTarget_EntireKeyspace },
            { no: 3, name: "all_tenant_keyspace_targets_set", kind: "message", oneof: "type", T: () => SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SystemSpanConfigTarget_Type>): SystemSpanConfigTarget_Type {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.type = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<SystemSpanConfigTarget_Type>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SystemSpanConfigTarget_Type): SystemSpanConfigTarget_Type {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.type = {
                        oneofKind: "specificTenantKeyspace",
                        specificTenantKeyspace: SystemSpanConfigTarget_TenantKeyspace.internalBinaryRead(reader, reader.uint32(), options, (message.type as any).specificTenantKeyspace)
                    };
                    break;
                case  2:
                    message.type = {
                        oneofKind: "entireKeyspace",
                        entireKeyspace: SystemSpanConfigTarget_EntireKeyspace.internalBinaryRead(reader, reader.uint32(), options, (message.type as any).entireKeyspace)
                    };
                    break;
                case  3:
                    message.type = {
                        oneofKind: "allTenantKeyspaceTargetsSet",
                        allTenantKeyspaceTargetsSet: SystemSpanConfigTarget_AllTenantKeyspaceTargetsSet.internalBinaryRead(reader, reader.uint32(), options, (message.type as any).allTenantKeyspaceTargetsSet)
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

export const SystemSpanConfigTarget_Type = /*#__PURE__*/ new SystemSpanConfigTarget_Type$Type();

class SpanConfigTarget$Type extends MessageType<SpanConfigTarget> {
    constructor() {
        super("cockroach.roachpb.SpanConfigTarget", [
            { no: 1, name: "span", kind: "message", oneof: "union", T: () => Span },
            { no: 2, name: "system_span_config_target", kind: "message", oneof: "union", T: () => SystemSpanConfigTarget }
        ]);
    }
    create(value?: PartialMessage<SpanConfigTarget>): SpanConfigTarget {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.union = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<SpanConfigTarget>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigTarget): SpanConfigTarget {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.union = {
                        oneofKind: "span",
                        span: Span.internalBinaryRead(reader, reader.uint32(), options, (message.union as any).span)
                    };
                    break;
                case  2:
                    message.union = {
                        oneofKind: "systemSpanConfigTarget",
                        systemSpanConfigTarget: SystemSpanConfigTarget.internalBinaryRead(reader, reader.uint32(), options, (message.union as any).systemSpanConfigTarget)
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

export const SpanConfigTarget = /*#__PURE__*/ new SpanConfigTarget$Type();

class SpanConfigEntry$Type extends MessageType<SpanConfigEntry> {
    constructor() {
        super("cockroach.roachpb.SpanConfigEntry", [
            { no: 3, name: "target", kind: "message", T: () => SpanConfigTarget },
            { no: 2, name: "config", kind: "message", T: () => SpanConfig }
        ]);
    }
    create(value?: PartialMessage<SpanConfigEntry>): SpanConfigEntry {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SpanConfigEntry>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigEntry): SpanConfigEntry {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  3:
                    message.target = SpanConfigTarget.internalBinaryRead(reader, reader.uint32(), options, message.target);
                    break;
                case  2:
                    message.config = SpanConfig.internalBinaryRead(reader, reader.uint32(), options, message.config);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SpanConfigEntry = /*#__PURE__*/ new SpanConfigEntry$Type();

class SpanConfigConformanceReport$Type extends MessageType<SpanConfigConformanceReport> {
    constructor() {
        super("cockroach.roachpb.SpanConfigConformanceReport", [
            { no: 1, name: "under_replicated", kind: "message", repeat: 2 , T: () => ConformanceReportedRange },
            { no: 2, name: "over_replicated", kind: "message", repeat: 2 , T: () => ConformanceReportedRange },
            { no: 3, name: "violating_constraints", kind: "message", repeat: 2 , T: () => ConformanceReportedRange },
            { no: 4, name: "unavailable", kind: "message", repeat: 2 , T: () => ConformanceReportedRange },
            { no: 5, name: "unavailable_node_ids", kind: "scalar", repeat: 1 , T: 5  }
        ]);
    }
    create(value?: PartialMessage<SpanConfigConformanceReport>): SpanConfigConformanceReport {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.underReplicated = [];
        message.overReplicated = [];
        message.violatingConstraints = [];
        message.unavailable = [];
        message.unavailableNodeIds = [];
        if (value !== undefined)
            reflectionMergePartial<SpanConfigConformanceReport>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigConformanceReport): SpanConfigConformanceReport {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.underReplicated.push(ConformanceReportedRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.overReplicated.push(ConformanceReportedRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.violatingConstraints.push(ConformanceReportedRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.unavailable.push(ConformanceReportedRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.unavailableNodeIds.push(reader.int32());
                    else
                        message.unavailableNodeIds.push(reader.int32());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SpanConfigConformanceReport = /*#__PURE__*/ new SpanConfigConformanceReport$Type();

class ConformanceReportedRange$Type extends MessageType<ConformanceReportedRange> {
    constructor() {
        super("cockroach.roachpb.ConformanceReportedRange", [
            { no: 1, name: "range_descriptor", kind: "message", T: () => RangeDescriptor },
            { no: 2, name: "config", kind: "message", T: () => SpanConfig }
        ]);
    }
    create(value?: PartialMessage<ConformanceReportedRange>): ConformanceReportedRange {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ConformanceReportedRange>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ConformanceReportedRange): ConformanceReportedRange {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rangeDescriptor = RangeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.rangeDescriptor);
                    break;
                case  2:
                    message.config = SpanConfig.internalBinaryRead(reader, reader.uint32(), options, message.config);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ConformanceReportedRange = /*#__PURE__*/ new ConformanceReportedRange$Type();

class GetSpanConfigsRequest$Type extends MessageType<GetSpanConfigsRequest> {
    constructor() {
        super("cockroach.roachpb.GetSpanConfigsRequest", [
            { no: 2, name: "targets", kind: "message", repeat: 2 , T: () => SpanConfigTarget }
        ]);
    }
    create(value?: PartialMessage<GetSpanConfigsRequest>): GetSpanConfigsRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.targets = [];
        if (value !== undefined)
            reflectionMergePartial<GetSpanConfigsRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetSpanConfigsRequest): GetSpanConfigsRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.targets.push(SpanConfigTarget.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const GetSpanConfigsRequest = /*#__PURE__*/ new GetSpanConfigsRequest$Type();

class GetSpanConfigsResponse$Type extends MessageType<GetSpanConfigsResponse> {
    constructor() {
        super("cockroach.roachpb.GetSpanConfigsResponse", [
            { no: 1, name: "span_config_entries", kind: "message", repeat: 2 , T: () => SpanConfigEntry }
        ]);
    }
    create(value?: PartialMessage<GetSpanConfigsResponse>): GetSpanConfigsResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.spanConfigEntries = [];
        if (value !== undefined)
            reflectionMergePartial<GetSpanConfigsResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetSpanConfigsResponse): GetSpanConfigsResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.spanConfigEntries.push(SpanConfigEntry.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const GetSpanConfigsResponse = /*#__PURE__*/ new GetSpanConfigsResponse$Type();

class UpdateSpanConfigsRequest$Type extends MessageType<UpdateSpanConfigsRequest> {
    constructor() {
        super("cockroach.roachpb.UpdateSpanConfigsRequest", [
            { no: 3, name: "to_delete", kind: "message", repeat: 2 , T: () => SpanConfigTarget },
            { no: 4, name: "to_upsert", kind: "message", repeat: 2 , T: () => SpanConfigEntry },
            { no: 6, name: "min_commit_timestamp", kind: "message", T: () => Timestamp },
            { no: 5, name: "max_commit_timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<UpdateSpanConfigsRequest>): UpdateSpanConfigsRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.toDelete = [];
        message.toUpsert = [];
        if (value !== undefined)
            reflectionMergePartial<UpdateSpanConfigsRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateSpanConfigsRequest): UpdateSpanConfigsRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  3:
                    message.toDelete.push(SpanConfigTarget.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.toUpsert.push(SpanConfigEntry.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.minCommitTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.minCommitTimestamp);
                    break;
                case  5:
                    message.maxCommitTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.maxCommitTimestamp);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const UpdateSpanConfigsRequest = /*#__PURE__*/ new UpdateSpanConfigsRequest$Type();

class UpdateSpanConfigsResponse$Type extends MessageType<UpdateSpanConfigsResponse> {
    constructor() {
        super("cockroach.roachpb.UpdateSpanConfigsResponse", [
            { no: 1, name: "error", kind: "message", T: () => EncodedError }
        ]);
    }
    create(value?: PartialMessage<UpdateSpanConfigsResponse>): UpdateSpanConfigsResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<UpdateSpanConfigsResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateSpanConfigsResponse): UpdateSpanConfigsResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.error = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.error);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const UpdateSpanConfigsResponse = /*#__PURE__*/ new UpdateSpanConfigsResponse$Type();

class SpanConfigConformanceRequest$Type extends MessageType<SpanConfigConformanceRequest> {
    constructor() {
        super("cockroach.roachpb.SpanConfigConformanceRequest", [
            { no: 1, name: "spans", kind: "message", repeat: 2 , T: () => Span }
        ]);
    }
    create(value?: PartialMessage<SpanConfigConformanceRequest>): SpanConfigConformanceRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.spans = [];
        if (value !== undefined)
            reflectionMergePartial<SpanConfigConformanceRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigConformanceRequest): SpanConfigConformanceRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
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

export const SpanConfigConformanceRequest = /*#__PURE__*/ new SpanConfigConformanceRequest$Type();

class SpanConfigConformanceResponse$Type extends MessageType<SpanConfigConformanceResponse> {
    constructor() {
        super("cockroach.roachpb.SpanConfigConformanceResponse", [
            { no: 1, name: "report", kind: "message", T: () => SpanConfigConformanceReport }
        ]);
    }
    create(value?: PartialMessage<SpanConfigConformanceResponse>): SpanConfigConformanceResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SpanConfigConformanceResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigConformanceResponse): SpanConfigConformanceResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.report = SpanConfigConformanceReport.internalBinaryRead(reader, reader.uint32(), options, message.report);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SpanConfigConformanceResponse = /*#__PURE__*/ new SpanConfigConformanceResponse$Type();

class GetAllSystemSpanConfigsThatApplyRequest$Type extends MessageType<GetAllSystemSpanConfigsThatApplyRequest> {
    constructor() {
        super("cockroach.roachpb.GetAllSystemSpanConfigsThatApplyRequest", [
            { no: 1, name: "tenant_id", kind: "message", T: () => TenantID }
        ]);
    }
    create(value?: PartialMessage<GetAllSystemSpanConfigsThatApplyRequest>): GetAllSystemSpanConfigsThatApplyRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<GetAllSystemSpanConfigsThatApplyRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetAllSystemSpanConfigsThatApplyRequest): GetAllSystemSpanConfigsThatApplyRequest {
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

export const GetAllSystemSpanConfigsThatApplyRequest = /*#__PURE__*/ new GetAllSystemSpanConfigsThatApplyRequest$Type();

class GetAllSystemSpanConfigsThatApplyResponse$Type extends MessageType<GetAllSystemSpanConfigsThatApplyResponse> {
    constructor() {
        super("cockroach.roachpb.GetAllSystemSpanConfigsThatApplyResponse", [
            { no: 1, name: "span_configs", kind: "message", repeat: 2 , T: () => SpanConfig }
        ]);
    }
    create(value?: PartialMessage<GetAllSystemSpanConfigsThatApplyResponse>): GetAllSystemSpanConfigsThatApplyResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.spanConfigs = [];
        if (value !== undefined)
            reflectionMergePartial<GetAllSystemSpanConfigsThatApplyResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetAllSystemSpanConfigsThatApplyResponse): GetAllSystemSpanConfigsThatApplyResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.spanConfigs.push(SpanConfig.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const GetAllSystemSpanConfigsThatApplyResponse = /*#__PURE__*/ new GetAllSystemSpanConfigsThatApplyResponse$Type();
