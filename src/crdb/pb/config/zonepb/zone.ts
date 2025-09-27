// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface GCPolicy {

    ttlSeconds?: number;
}

export interface Constraint {

    type?: Constraint_Type;

    key?: string;

    value?: string;
}

export enum Constraint_Type {

    DEPRECATED_POSITIVE = 0,

    REQUIRED = 1,

    PROHIBITED = 2
}

export interface ConstraintsConjunction {

    numReplicas?: number;

    constraints: Constraint[];
}

export interface LeasePreference {

    constraints: Constraint[];
}

export interface ZoneConfig {

    rangeMinBytes?: bigint;

    rangeMaxBytes?: bigint;

    gc?: GCPolicy;

    globalReads?: boolean;

    numReplicas?: number;

    numVoters?: number;

    constraints: ConstraintsConjunction[];

    voterConstraints: ConstraintsConjunction[];

    inheritedConstraints?: boolean;

    nullVoterConstraintsIsEmpty?: boolean;

    leasePreferences: LeasePreference[];

    inheritedLeasePreferences?: boolean;

    subzones: Subzone[];

    subzoneSpans: SubzoneSpan[];
}

export interface Subzone {

    indexId?: number;

    partitionName?: string;

    config?: ZoneConfig;
}

export interface SubzoneSpan {

    key?: Uint8Array;

    endKey?: Uint8Array;

    subzoneIndex?: number;
}

class GCPolicy$Type extends MessageType<GCPolicy> {
    constructor() {
        super("cockroach.config.zonepb.GCPolicy", [
            { no: 1, name: "ttl_seconds", kind: "scalar", opt: true, T: 5  }
        ], { "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<GCPolicy>): GCPolicy {
        const message = globalThis.Object.create((this.messagePrototype!));
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
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
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

class Constraint$Type extends MessageType<Constraint> {
    constructor() {
        super("cockroach.config.zonepb.Constraint", [
            { no: 1, name: "type", kind: "enum", opt: true, T: () => ["cockroach.config.zonepb.Constraint.Type", Constraint_Type] },
            { no: 2, name: "key", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "value", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Constraint>): Constraint {
        const message = globalThis.Object.create((this.messagePrototype!));
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
        super("cockroach.config.zonepb.ConstraintsConjunction", [
            { no: 7, name: "num_replicas", kind: "scalar", opt: true, T: 5  },
            { no: 6, name: "constraints", kind: "message", repeat: 2 , T: () => Constraint }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ConstraintsConjunction>): ConstraintsConjunction {
        const message = globalThis.Object.create((this.messagePrototype!));
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
                case  7:
                    message.numReplicas = reader.int32();
                    break;
                case  6:
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
        super("cockroach.config.zonepb.LeasePreference", [
            { no: 1, name: "constraints", kind: "message", repeat: 2 , T: () => Constraint }
        ], { "gogoproto.populate": true, "gogoproto.equal": true });
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

class ZoneConfig$Type extends MessageType<ZoneConfig> {
    constructor() {
        super("cockroach.config.zonepb.ZoneConfig", [
            { no: 2, name: "range_min_bytes", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 3, name: "range_max_bytes", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 4, name: "gc", kind: "message", T: () => GCPolicy },
            { no: 12, name: "global_reads", kind: "scalar", opt: true, T: 8  },
            { no: 5, name: "num_replicas", kind: "scalar", opt: true, T: 5  },
            { no: 13, name: "num_voters", kind: "scalar", opt: true, T: 5  },
            { no: 6, name: "constraints", kind: "message", repeat: 2 , T: () => ConstraintsConjunction },
            { no: 14, name: "voter_constraints", kind: "message", repeat: 2 , T: () => ConstraintsConjunction },
            { no: 10, name: "inherited_constraints", kind: "scalar", opt: true, T: 8  },
            { no: 15, name: "null_voter_constraints_is_empty", kind: "scalar", opt: true, T: 8  },
            { no: 9, name: "lease_preferences", kind: "message", repeat: 2 , T: () => LeasePreference },
            { no: 11, name: "inherited_lease_preferences", kind: "scalar", opt: true, T: 8  },
            { no: 8, name: "subzones", kind: "message", repeat: 2 , T: () => Subzone },
            { no: 7, name: "subzone_spans", kind: "message", repeat: 2 , T: () => SubzoneSpan }
        ], { "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ZoneConfig>): ZoneConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.constraints = [];
        message.voterConstraints = [];
        message.leasePreferences = [];
        message.subzones = [];
        message.subzoneSpans = [];
        if (value !== undefined)
            reflectionMergePartial<ZoneConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ZoneConfig): ZoneConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.rangeMinBytes = reader.int64().toBigInt();
                    break;
                case  3:
                    message.rangeMaxBytes = reader.int64().toBigInt();
                    break;
                case  4:
                    message.gc = GCPolicy.internalBinaryRead(reader, reader.uint32(), options, message.gc);
                    break;
                case  12:
                    message.globalReads = reader.bool();
                    break;
                case  5:
                    message.numReplicas = reader.int32();
                    break;
                case  13:
                    message.numVoters = reader.int32();
                    break;
                case  6:
                    message.constraints.push(ConstraintsConjunction.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  14:
                    message.voterConstraints.push(ConstraintsConjunction.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  10:
                    message.inheritedConstraints = reader.bool();
                    break;
                case  15:
                    message.nullVoterConstraintsIsEmpty = reader.bool();
                    break;
                case  9:
                    message.leasePreferences.push(LeasePreference.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  11:
                    message.inheritedLeasePreferences = reader.bool();
                    break;
                case  8:
                    message.subzones.push(Subzone.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.subzoneSpans.push(SubzoneSpan.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ZoneConfig = /*#__PURE__*/ new ZoneConfig$Type();

class Subzone$Type extends MessageType<Subzone> {
    constructor() {
        super("cockroach.config.zonepb.Subzone", [
            { no: 1, name: "index_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "partition_name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "config", kind: "message", T: () => ZoneConfig }
        ], { "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Subzone>): Subzone {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Subzone>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Subzone): Subzone {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.indexId = reader.uint32();
                    break;
                case  2:
                    message.partitionName = reader.string();
                    break;
                case  3:
                    message.config = ZoneConfig.internalBinaryRead(reader, reader.uint32(), options, message.config);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Subzone = /*#__PURE__*/ new Subzone$Type();

class SubzoneSpan$Type extends MessageType<SubzoneSpan> {
    constructor() {
        super("cockroach.config.zonepb.SubzoneSpan", [
            { no: 1, name: "key", kind: "scalar", opt: true, T: 12  },
            { no: 2, name: "end_key", kind: "scalar", opt: true, T: 12  },
            { no: 3, name: "subzone_index", kind: "scalar", opt: true, T: 5  }
        ], { "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SubzoneSpan>): SubzoneSpan {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SubzoneSpan>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubzoneSpan): SubzoneSpan {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.bytes();
                    break;
                case  2:
                    message.endKey = reader.bytes();
                    break;
                case  3:
                    message.subzoneIndex = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SubzoneSpan = /*#__PURE__*/ new SubzoneSpan$Type();
