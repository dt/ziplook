// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Constraint } from "../../roachpb/span_config";

export interface TenantCapabilities {

    disableAdminSplit: boolean;

    disableAdminScatter: boolean;

    canViewNodeInfo: boolean;

    canViewTsdbMetrics: boolean;

    spanConfigBounds?: SpanConfigBounds;

    canAdminUnsplit: boolean;

    canAdminRelocateRange: boolean;

    exemptFromRateLimiting: boolean;

    canUseNodelocalStorage: boolean;

    canCheckConsistency: boolean;

    canDebugProcess: boolean;

    canViewAllMetrics: boolean;

    canPrepareTxns: boolean;
}

export interface SpanConfigBounds {

    gcTtlSeconds?: SpanConfigBounds_Int32Range;

    rangeMaxBytes?: SpanConfigBounds_Int64Range;

    rangeMinBytes?: SpanConfigBounds_Int64Range;

    numReplicas?: SpanConfigBounds_Int32Range;

    numVoters?: SpanConfigBounds_Int32Range;

    constraintBounds?: SpanConfigBounds_ConstraintBounds;
}

export interface SpanConfigBounds_Int32Range {

    start: number;

    end: number;
}

export interface SpanConfigBounds_Int64Range {

    start: bigint;

    end: bigint;
}

export interface SpanConfigBounds_ConstraintsConjunction {

    constraints: Constraint[];
}

export interface SpanConfigBounds_ConstraintBounds {

    allowed: Constraint[];

    fallback: SpanConfigBounds_ConstraintsConjunction[];
}

class TenantCapabilities$Type extends MessageType<TenantCapabilities> {
    constructor() {
        super("cockroach.multitenant.tenantcapabilitiespb.TenantCapabilities", [
            { no: 1, name: "disable_admin_split", kind: "scalar", T: 8  },
            { no: 6, name: "disable_admin_scatter", kind: "scalar", T: 8  },
            { no: 2, name: "can_view_node_info", kind: "scalar", T: 8  },
            { no: 3, name: "can_view_tsdb_metrics", kind: "scalar", T: 8  },
            { no: 4, name: "span_config_bounds", kind: "message", T: () => SpanConfigBounds },
            { no: 5, name: "can_admin_unsplit", kind: "scalar", T: 8  },
            { no: 7, name: "can_admin_relocate_range", kind: "scalar", T: 8  },
            { no: 8, name: "exempt_from_rate_limiting", kind: "scalar", T: 8  },
            { no: 9, name: "can_use_nodelocal_storage", kind: "scalar", T: 8  },
            { no: 10, name: "can_check_consistency", kind: "scalar", T: 8  },
            { no: 11, name: "can_debug_process", kind: "scalar", T: 8  },
            { no: 12, name: "can_view_all_metrics", kind: "scalar", T: 8  },
            { no: 13, name: "can_prepare_txns", kind: "scalar", T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TenantCapabilities>): TenantCapabilities {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.disableAdminSplit = false;
        message.disableAdminScatter = false;
        message.canViewNodeInfo = false;
        message.canViewTsdbMetrics = false;
        message.canAdminUnsplit = false;
        message.canAdminRelocateRange = false;
        message.exemptFromRateLimiting = false;
        message.canUseNodelocalStorage = false;
        message.canCheckConsistency = false;
        message.canDebugProcess = false;
        message.canViewAllMetrics = false;
        message.canPrepareTxns = false;
        if (value !== undefined)
            reflectionMergePartial<TenantCapabilities>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantCapabilities): TenantCapabilities {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.disableAdminSplit = reader.bool();
                    break;
                case  6:
                    message.disableAdminScatter = reader.bool();
                    break;
                case  2:
                    message.canViewNodeInfo = reader.bool();
                    break;
                case  3:
                    message.canViewTsdbMetrics = reader.bool();
                    break;
                case  4:
                    message.spanConfigBounds = SpanConfigBounds.internalBinaryRead(reader, reader.uint32(), options, message.spanConfigBounds);
                    break;
                case  5:
                    message.canAdminUnsplit = reader.bool();
                    break;
                case  7:
                    message.canAdminRelocateRange = reader.bool();
                    break;
                case  8:
                    message.exemptFromRateLimiting = reader.bool();
                    break;
                case  9:
                    message.canUseNodelocalStorage = reader.bool();
                    break;
                case  10:
                    message.canCheckConsistency = reader.bool();
                    break;
                case  11:
                    message.canDebugProcess = reader.bool();
                    break;
                case  12:
                    message.canViewAllMetrics = reader.bool();
                    break;
                case  13:
                    message.canPrepareTxns = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TenantCapabilities = /*#__PURE__*/ new TenantCapabilities$Type();

class SpanConfigBounds$Type extends MessageType<SpanConfigBounds> {
    constructor() {
        super("cockroach.multitenant.tenantcapabilitiespb.SpanConfigBounds", [
            { no: 1, name: "gc_ttl_seconds", kind: "message", T: () => SpanConfigBounds_Int32Range },
            { no: 2, name: "range_max_bytes", kind: "message", T: () => SpanConfigBounds_Int64Range },
            { no: 3, name: "range_min_bytes", kind: "message", T: () => SpanConfigBounds_Int64Range },
            { no: 4, name: "num_replicas", kind: "message", T: () => SpanConfigBounds_Int32Range },
            { no: 5, name: "num_voters", kind: "message", T: () => SpanConfigBounds_Int32Range },
            { no: 6, name: "constraint_bounds", kind: "message", T: () => SpanConfigBounds_ConstraintBounds }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SpanConfigBounds>): SpanConfigBounds {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SpanConfigBounds>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigBounds): SpanConfigBounds {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.gcTtlSeconds = SpanConfigBounds_Int32Range.internalBinaryRead(reader, reader.uint32(), options, message.gcTtlSeconds);
                    break;
                case  2:
                    message.rangeMaxBytes = SpanConfigBounds_Int64Range.internalBinaryRead(reader, reader.uint32(), options, message.rangeMaxBytes);
                    break;
                case  3:
                    message.rangeMinBytes = SpanConfigBounds_Int64Range.internalBinaryRead(reader, reader.uint32(), options, message.rangeMinBytes);
                    break;
                case  4:
                    message.numReplicas = SpanConfigBounds_Int32Range.internalBinaryRead(reader, reader.uint32(), options, message.numReplicas);
                    break;
                case  5:
                    message.numVoters = SpanConfigBounds_Int32Range.internalBinaryRead(reader, reader.uint32(), options, message.numVoters);
                    break;
                case  6:
                    message.constraintBounds = SpanConfigBounds_ConstraintBounds.internalBinaryRead(reader, reader.uint32(), options, message.constraintBounds);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SpanConfigBounds = /*#__PURE__*/ new SpanConfigBounds$Type();

class SpanConfigBounds_Int32Range$Type extends MessageType<SpanConfigBounds_Int32Range> {
    constructor() {
        super("cockroach.multitenant.tenantcapabilitiespb.SpanConfigBounds.Int32Range", [
            { no: 1, name: "start", kind: "scalar", T: 5  },
            { no: 2, name: "end", kind: "scalar", T: 5  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SpanConfigBounds_Int32Range>): SpanConfigBounds_Int32Range {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.start = 0;
        message.end = 0;
        if (value !== undefined)
            reflectionMergePartial<SpanConfigBounds_Int32Range>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigBounds_Int32Range): SpanConfigBounds_Int32Range {
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

export const SpanConfigBounds_Int32Range = /*#__PURE__*/ new SpanConfigBounds_Int32Range$Type();

class SpanConfigBounds_Int64Range$Type extends MessageType<SpanConfigBounds_Int64Range> {
    constructor() {
        super("cockroach.multitenant.tenantcapabilitiespb.SpanConfigBounds.Int64Range", [
            { no: 1, name: "start", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "end", kind: "scalar", T: 3 , L: 0  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SpanConfigBounds_Int64Range>): SpanConfigBounds_Int64Range {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.start = 0n;
        message.end = 0n;
        if (value !== undefined)
            reflectionMergePartial<SpanConfigBounds_Int64Range>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigBounds_Int64Range): SpanConfigBounds_Int64Range {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.start = reader.int64().toBigInt();
                    break;
                case  2:
                    message.end = reader.int64().toBigInt();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SpanConfigBounds_Int64Range = /*#__PURE__*/ new SpanConfigBounds_Int64Range$Type();

class SpanConfigBounds_ConstraintsConjunction$Type extends MessageType<SpanConfigBounds_ConstraintsConjunction> {
    constructor() {
        super("cockroach.multitenant.tenantcapabilitiespb.SpanConfigBounds.ConstraintsConjunction", [
            { no: 1, name: "constraints", kind: "message", repeat: 2 , T: () => Constraint }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SpanConfigBounds_ConstraintsConjunction>): SpanConfigBounds_ConstraintsConjunction {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.constraints = [];
        if (value !== undefined)
            reflectionMergePartial<SpanConfigBounds_ConstraintsConjunction>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigBounds_ConstraintsConjunction): SpanConfigBounds_ConstraintsConjunction {
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

export const SpanConfigBounds_ConstraintsConjunction = /*#__PURE__*/ new SpanConfigBounds_ConstraintsConjunction$Type();

class SpanConfigBounds_ConstraintBounds$Type extends MessageType<SpanConfigBounds_ConstraintBounds> {
    constructor() {
        super("cockroach.multitenant.tenantcapabilitiespb.SpanConfigBounds.ConstraintBounds", [
            { no: 1, name: "allowed", kind: "message", repeat: 2 , T: () => Constraint },
            { no: 2, name: "fallback", kind: "message", repeat: 2 , T: () => SpanConfigBounds_ConstraintsConjunction }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SpanConfigBounds_ConstraintBounds>): SpanConfigBounds_ConstraintBounds {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.allowed = [];
        message.fallback = [];
        if (value !== undefined)
            reflectionMergePartial<SpanConfigBounds_ConstraintBounds>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpanConfigBounds_ConstraintBounds): SpanConfigBounds_ConstraintBounds {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.allowed.push(Constraint.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.fallback.push(SpanConfigBounds_ConstraintsConjunction.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SpanConfigBounds_ConstraintBounds = /*#__PURE__*/ new SpanConfigBounds_ConstraintBounds$Type();
