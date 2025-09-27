// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { UnresolvedAddr } from "../util/unresolved_addr";
import { IOThreshold } from "../util/admission/admissionpb/io_threshold";
import { Timestamp } from "../util/hlc/timestamp";

export interface Attributes {

    attrs: string[];
}

export interface ReplicationTarget {

    nodeId?: number;

    storeId?: number;
}

export interface ReplicaDescriptor {

    nodeId?: number;

    storeId?: number;

    replicaId?: number;

    type?: ReplicaType;
}

export interface ReplicaIdent {

    rangeId?: bigint;

    replica?: ReplicaDescriptor;
}

export interface RangeDescriptor {

    rangeId?: bigint;

    startKey?: Uint8Array;

    endKey?: Uint8Array;

    internalReplicas: ReplicaDescriptor[];

    nextReplicaId?: number;

    generation?: bigint;

    stickyBit?: Timestamp;
}

export interface Percentiles {

    p10?: number;

    p25?: number;

    p50?: number;

    p75?: number;

    p90?: number;

    pMax?: number;
}

export interface NodeCapacity {

    storesCpuRate?: bigint;

    numStores?: number;

    nodeCpuRateUsage?: bigint;

    nodeCpuRateCapacity?: bigint;
}

export interface StoreCapacity {

    capacity?: bigint;

    available?: bigint;

    used?: bigint;

    logicalBytes?: bigint;

    rangeCount?: number;

    leaseCount?: number;

    queriesPerSecond?: number;

    writesPerSecond?: number;

    cpuPerSecond?: number;

    ioThreshold?: IOThreshold;

    ioThresholdMax?: IOThreshold;

    writeBytesPerSecond?: number;

    bytesPerReplica?: Percentiles;

    writesPerReplica?: Percentiles;
}

export interface StoreProperties {

    encrypted?: boolean;

    readOnly?: boolean;

    dir?: string;

    walFailoverPath?: string;

    fileStoreProperties?: FileStoreProperties;
}

export interface FileStoreProperties {

    path?: string;

    fsType?: string;

    blockDevice?: string;

    mountPoint?: string;

    mountOptions?: string;
}

export interface NodeDescriptor {

    nodeId?: number;

    address?: UnresolvedAddr;

    attrs?: Attributes;

    locality?: Locality;

    serverVersion?: Version;

    buildTag?: string;

    startedAt?: bigint;

    localityAddress: LocalityAddress[];

    clusterName?: string;

    sqlAddress?: UnresolvedAddr;

    httpAddress?: UnresolvedAddr;
}

export interface LocalityAddress {

    address?: UnresolvedAddr;

    localityTier?: Tier;
}

export interface StoreDescriptor {

    storeId?: number;

    attrs?: Attributes;

    node?: NodeDescriptor;

    capacity?: StoreCapacity;

    properties?: StoreProperties;

    nodeCapacity?: NodeCapacity;
}

export interface Locality {

    tiers: Tier[];
}

export interface Tier {

    key?: string;

    value?: string;
}

export interface Version {

    majorVal?: number;

    minorVal?: number;

    patch?: number;

    internal?: number;
}

export interface GCHint {

    latestRangeDeleteTimestamp?: Timestamp;

    gcTimestamp?: Timestamp;

    gcTimestampNext?: Timestamp;
}

export interface ForceFlushIndex {

    index?: bigint;
}

export enum ReplicaType {

    VOTER_FULL = 0,

    VOTER_INCOMING = 2,

    VOTER_OUTGOING = 3,

    VOTER_DEMOTING_LEARNER = 4,

    LEARNER = 1,

    NON_VOTER = 5,

    VOTER_DEMOTING_NON_VOTER = 6
}

export enum LocalityComparisonType {

    UNDEFINED = 0,

    CROSS_REGION = 1,

    SAME_REGION_CROSS_ZONE = 2,

    SAME_REGION_SAME_ZONE = 3
}

class Attributes$Type extends MessageType<Attributes> {
    constructor() {
        super("cockroach.roachpb.Attributes", [
            { no: 1, name: "attrs", kind: "scalar", repeat: 2 , T: 9  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Attributes>): Attributes {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.attrs = [];
        if (value !== undefined)
            reflectionMergePartial<Attributes>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Attributes): Attributes {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.attrs.push(reader.string());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Attributes = /*#__PURE__*/ new Attributes$Type();

class ReplicationTarget$Type extends MessageType<ReplicationTarget> {
    constructor() {
        super("cockroach.roachpb.ReplicationTarget", [
            { no: 1, name: "node_id", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "store_id", kind: "scalar", opt: true, T: 5  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ReplicationTarget>): ReplicationTarget {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ReplicationTarget>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReplicationTarget): ReplicationTarget {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.nodeId = reader.int32();
                    break;
                case  2:
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

export const ReplicationTarget = /*#__PURE__*/ new ReplicationTarget$Type();

class ReplicaDescriptor$Type extends MessageType<ReplicaDescriptor> {
    constructor() {
        super("cockroach.roachpb.ReplicaDescriptor", [
            { no: 1, name: "node_id", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "store_id", kind: "scalar", opt: true, T: 5  },
            { no: 3, name: "replica_id", kind: "scalar", opt: true, T: 5  },
            { no: 4, name: "type", kind: "enum", opt: true, T: () => ["cockroach.roachpb.ReplicaType", ReplicaType] }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ReplicaDescriptor>): ReplicaDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ReplicaDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReplicaDescriptor): ReplicaDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.nodeId = reader.int32();
                    break;
                case  2:
                    message.storeId = reader.int32();
                    break;
                case  3:
                    message.replicaId = reader.int32();
                    break;
                case  4:
                    message.type = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ReplicaDescriptor = /*#__PURE__*/ new ReplicaDescriptor$Type();

class ReplicaIdent$Type extends MessageType<ReplicaIdent> {
    constructor() {
        super("cockroach.roachpb.ReplicaIdent", [
            { no: 1, name: "range_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 2, name: "replica", kind: "message", T: () => ReplicaDescriptor }
        ]);
    }
    create(value?: PartialMessage<ReplicaIdent>): ReplicaIdent {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ReplicaIdent>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReplicaIdent): ReplicaIdent {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rangeId = reader.int64().toBigInt();
                    break;
                case  2:
                    message.replica = ReplicaDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.replica);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ReplicaIdent = /*#__PURE__*/ new ReplicaIdent$Type();

class RangeDescriptor$Type extends MessageType<RangeDescriptor> {
    constructor() {
        super("cockroach.roachpb.RangeDescriptor", [
            { no: 1, name: "range_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 2, name: "start_key", kind: "scalar", opt: true, T: 12  },
            { no: 3, name: "end_key", kind: "scalar", opt: true, T: 12  },
            { no: 4, name: "internal_replicas", kind: "message", repeat: 2 , T: () => ReplicaDescriptor },
            { no: 5, name: "next_replica_id", kind: "scalar", opt: true, T: 5  },
            { no: 6, name: "generation", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 7, name: "sticky_bit", kind: "message", T: () => Timestamp }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<RangeDescriptor>): RangeDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.internalReplicas = [];
        if (value !== undefined)
            reflectionMergePartial<RangeDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RangeDescriptor): RangeDescriptor {
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
                    message.endKey = reader.bytes();
                    break;
                case  4:
                    message.internalReplicas.push(ReplicaDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    message.nextReplicaId = reader.int32();
                    break;
                case  6:
                    message.generation = reader.int64().toBigInt();
                    break;
                case  7:
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

export const RangeDescriptor = /*#__PURE__*/ new RangeDescriptor$Type();

class Percentiles$Type extends MessageType<Percentiles> {
    constructor() {
        super("cockroach.roachpb.Percentiles", [
            { no: 1, name: "p10", kind: "scalar", opt: true, T: 1  },
            { no: 2, name: "p25", kind: "scalar", opt: true, T: 1  },
            { no: 3, name: "p50", kind: "scalar", opt: true, T: 1  },
            { no: 4, name: "p75", kind: "scalar", opt: true, T: 1  },
            { no: 5, name: "p90", kind: "scalar", opt: true, T: 1  },
            { no: 6, name: "pMax", kind: "scalar", opt: true, T: 1  }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<Percentiles>): Percentiles {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Percentiles>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Percentiles): Percentiles {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.p10 = reader.double();
                    break;
                case  2:
                    message.p25 = reader.double();
                    break;
                case  3:
                    message.p50 = reader.double();
                    break;
                case  4:
                    message.p75 = reader.double();
                    break;
                case  5:
                    message.p90 = reader.double();
                    break;
                case  6:
                    message.pMax = reader.double();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Percentiles = /*#__PURE__*/ new Percentiles$Type();

class NodeCapacity$Type extends MessageType<NodeCapacity> {
    constructor() {
        super("cockroach.roachpb.NodeCapacity", [
            { no: 1, name: "stores_cpu_rate", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 2, name: "num_stores", kind: "scalar", opt: true, T: 5  },
            { no: 3, name: "node_cpu_rate_usage", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 4, name: "node_cpu_rate_capacity", kind: "scalar", opt: true, T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<NodeCapacity>): NodeCapacity {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<NodeCapacity>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NodeCapacity): NodeCapacity {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.storesCpuRate = reader.int64().toBigInt();
                    break;
                case  2:
                    message.numStores = reader.int32();
                    break;
                case  3:
                    message.nodeCpuRateUsage = reader.int64().toBigInt();
                    break;
                case  4:
                    message.nodeCpuRateCapacity = reader.int64().toBigInt();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const NodeCapacity = /*#__PURE__*/ new NodeCapacity$Type();

class StoreCapacity$Type extends MessageType<StoreCapacity> {
    constructor() {
        super("cockroach.roachpb.StoreCapacity", [
            { no: 1, name: "capacity", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 2, name: "available", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 8, name: "used", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 9, name: "logical_bytes", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 3, name: "range_count", kind: "scalar", opt: true, T: 5  },
            { no: 4, name: "lease_count", kind: "scalar", opt: true, T: 5  },
            { no: 10, name: "queries_per_second", kind: "scalar", opt: true, T: 1  },
            { no: 5, name: "writes_per_second", kind: "scalar", opt: true, T: 1  },
            { no: 14, name: "cpu_per_second", kind: "scalar", opt: true, T: 1  },
            { no: 13, name: "io_threshold", kind: "message", T: () => IOThreshold },
            { no: 15, name: "io_threshold_max", kind: "message", T: () => IOThreshold },
            { no: 16, name: "write_bytes_per_second", kind: "scalar", opt: true, T: 1  },
            { no: 6, name: "bytes_per_replica", kind: "message", T: () => Percentiles },
            { no: 7, name: "writes_per_replica", kind: "message", T: () => Percentiles }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<StoreCapacity>): StoreCapacity {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<StoreCapacity>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StoreCapacity): StoreCapacity {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.capacity = reader.int64().toBigInt();
                    break;
                case  2:
                    message.available = reader.int64().toBigInt();
                    break;
                case  8:
                    message.used = reader.int64().toBigInt();
                    break;
                case  9:
                    message.logicalBytes = reader.int64().toBigInt();
                    break;
                case  3:
                    message.rangeCount = reader.int32();
                    break;
                case  4:
                    message.leaseCount = reader.int32();
                    break;
                case  10:
                    message.queriesPerSecond = reader.double();
                    break;
                case  5:
                    message.writesPerSecond = reader.double();
                    break;
                case  14:
                    message.cpuPerSecond = reader.double();
                    break;
                case  13:
                    message.ioThreshold = IOThreshold.internalBinaryRead(reader, reader.uint32(), options, message.ioThreshold);
                    break;
                case  15:
                    message.ioThresholdMax = IOThreshold.internalBinaryRead(reader, reader.uint32(), options, message.ioThresholdMax);
                    break;
                case  16:
                    message.writeBytesPerSecond = reader.double();
                    break;
                case  6:
                    message.bytesPerReplica = Percentiles.internalBinaryRead(reader, reader.uint32(), options, message.bytesPerReplica);
                    break;
                case  7:
                    message.writesPerReplica = Percentiles.internalBinaryRead(reader, reader.uint32(), options, message.writesPerReplica);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const StoreCapacity = /*#__PURE__*/ new StoreCapacity$Type();

class StoreProperties$Type extends MessageType<StoreProperties> {
    constructor() {
        super("cockroach.roachpb.StoreProperties", [
            { no: 1, name: "encrypted", kind: "scalar", opt: true, T: 8  },
            { no: 2, name: "read_only", kind: "scalar", opt: true, T: 8  },
            { no: 4, name: "dir", kind: "scalar", opt: true, T: 9  },
            { no: 5, name: "wal_failover_path", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "file_store_properties", kind: "message", T: () => FileStoreProperties }
        ]);
    }
    create(value?: PartialMessage<StoreProperties>): StoreProperties {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<StoreProperties>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StoreProperties): StoreProperties {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.encrypted = reader.bool();
                    break;
                case  2:
                    message.readOnly = reader.bool();
                    break;
                case  4:
                    message.dir = reader.string();
                    break;
                case  5:
                    message.walFailoverPath = reader.string();
                    break;
                case  3:
                    message.fileStoreProperties = FileStoreProperties.internalBinaryRead(reader, reader.uint32(), options, message.fileStoreProperties);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const StoreProperties = /*#__PURE__*/ new StoreProperties$Type();

class FileStoreProperties$Type extends MessageType<FileStoreProperties> {
    constructor() {
        super("cockroach.roachpb.FileStoreProperties", [
            { no: 1, name: "path", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "fs_type", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "block_device", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "mount_point", kind: "scalar", opt: true, T: 9  },
            { no: 5, name: "mount_options", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<FileStoreProperties>): FileStoreProperties {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FileStoreProperties>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FileStoreProperties): FileStoreProperties {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.path = reader.string();
                    break;
                case  2:
                    message.fsType = reader.string();
                    break;
                case  3:
                    message.blockDevice = reader.string();
                    break;
                case  4:
                    message.mountPoint = reader.string();
                    break;
                case  5:
                    message.mountOptions = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const FileStoreProperties = /*#__PURE__*/ new FileStoreProperties$Type();

class NodeDescriptor$Type extends MessageType<NodeDescriptor> {
    constructor() {
        super("cockroach.roachpb.NodeDescriptor", [
            { no: 1, name: "node_id", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "address", kind: "message", T: () => UnresolvedAddr },
            { no: 3, name: "attrs", kind: "message", T: () => Attributes },
            { no: 4, name: "locality", kind: "message", T: () => Locality },
            { no: 5, name: "ServerVersion", kind: "message", jsonName: "ServerVersion", T: () => Version },
            { no: 6, name: "build_tag", kind: "scalar", opt: true, T: 9  },
            { no: 7, name: "started_at", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 8, name: "locality_address", kind: "message", repeat: 2 , T: () => LocalityAddress },
            { no: 9, name: "cluster_name", kind: "scalar", opt: true, T: 9  },
            { no: 10, name: "sql_address", kind: "message", T: () => UnresolvedAddr },
            { no: 11, name: "http_address", kind: "message", T: () => UnresolvedAddr }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<NodeDescriptor>): NodeDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.localityAddress = [];
        if (value !== undefined)
            reflectionMergePartial<NodeDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NodeDescriptor): NodeDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.nodeId = reader.int32();
                    break;
                case  2:
                    message.address = UnresolvedAddr.internalBinaryRead(reader, reader.uint32(), options, message.address);
                    break;
                case  3:
                    message.attrs = Attributes.internalBinaryRead(reader, reader.uint32(), options, message.attrs);
                    break;
                case  4:
                    message.locality = Locality.internalBinaryRead(reader, reader.uint32(), options, message.locality);
                    break;
                case  5:
                    message.serverVersion = Version.internalBinaryRead(reader, reader.uint32(), options, message.serverVersion);
                    break;
                case  6:
                    message.buildTag = reader.string();
                    break;
                case  7:
                    message.startedAt = reader.int64().toBigInt();
                    break;
                case  8:
                    message.localityAddress.push(LocalityAddress.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  9:
                    message.clusterName = reader.string();
                    break;
                case  10:
                    message.sqlAddress = UnresolvedAddr.internalBinaryRead(reader, reader.uint32(), options, message.sqlAddress);
                    break;
                case  11:
                    message.httpAddress = UnresolvedAddr.internalBinaryRead(reader, reader.uint32(), options, message.httpAddress);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const NodeDescriptor = /*#__PURE__*/ new NodeDescriptor$Type();

class LocalityAddress$Type extends MessageType<LocalityAddress> {
    constructor() {
        super("cockroach.roachpb.LocalityAddress", [
            { no: 1, name: "address", kind: "message", T: () => UnresolvedAddr },
            { no: 2, name: "locality_tier", kind: "message", T: () => Tier }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<LocalityAddress>): LocalityAddress {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<LocalityAddress>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LocalityAddress): LocalityAddress {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.address = UnresolvedAddr.internalBinaryRead(reader, reader.uint32(), options, message.address);
                    break;
                case  2:
                    message.localityTier = Tier.internalBinaryRead(reader, reader.uint32(), options, message.localityTier);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const LocalityAddress = /*#__PURE__*/ new LocalityAddress$Type();

class StoreDescriptor$Type extends MessageType<StoreDescriptor> {
    constructor() {
        super("cockroach.roachpb.StoreDescriptor", [
            { no: 1, name: "store_id", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "attrs", kind: "message", T: () => Attributes },
            { no: 3, name: "node", kind: "message", T: () => NodeDescriptor },
            { no: 4, name: "capacity", kind: "message", T: () => StoreCapacity },
            { no: 5, name: "properties", kind: "message", T: () => StoreProperties },
            { no: 6, name: "node_capacity", kind: "message", T: () => NodeCapacity }
        ]);
    }
    create(value?: PartialMessage<StoreDescriptor>): StoreDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<StoreDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StoreDescriptor): StoreDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.storeId = reader.int32();
                    break;
                case  2:
                    message.attrs = Attributes.internalBinaryRead(reader, reader.uint32(), options, message.attrs);
                    break;
                case  3:
                    message.node = NodeDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.node);
                    break;
                case  4:
                    message.capacity = StoreCapacity.internalBinaryRead(reader, reader.uint32(), options, message.capacity);
                    break;
                case  5:
                    message.properties = StoreProperties.internalBinaryRead(reader, reader.uint32(), options, message.properties);
                    break;
                case  6:
                    message.nodeCapacity = NodeCapacity.internalBinaryRead(reader, reader.uint32(), options, message.nodeCapacity);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const StoreDescriptor = /*#__PURE__*/ new StoreDescriptor$Type();

class Locality$Type extends MessageType<Locality> {
    constructor() {
        super("cockroach.roachpb.Locality", [
            { no: 1, name: "tiers", kind: "message", repeat: 2 , T: () => Tier }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Locality>): Locality {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tiers = [];
        if (value !== undefined)
            reflectionMergePartial<Locality>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Locality): Locality {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tiers.push(Tier.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Locality = /*#__PURE__*/ new Locality$Type();

class Tier$Type extends MessageType<Tier> {
    constructor() {
        super("cockroach.roachpb.Tier", [
            { no: 1, name: "key", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "value", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Tier>): Tier {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Tier>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Tier): Tier {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.key = reader.string();
                    break;
                case  2:
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

export const Tier = /*#__PURE__*/ new Tier$Type();

class Version$Type extends MessageType<Version> {
    constructor() {
        super("cockroach.roachpb.Version", [
            { no: 1, name: "major_val", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "minor_val", kind: "scalar", opt: true, T: 5  },
            { no: 3, name: "patch", kind: "scalar", opt: true, T: 5  },
            { no: 4, name: "internal", kind: "scalar", opt: true, T: 5  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Version>): Version {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Version>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Version): Version {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.majorVal = reader.int32();
                    break;
                case  2:
                    message.minorVal = reader.int32();
                    break;
                case  3:
                    message.patch = reader.int32();
                    break;
                case  4:
                    message.internal = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Version = /*#__PURE__*/ new Version$Type();

class GCHint$Type extends MessageType<GCHint> {
    constructor() {
        super("cockroach.roachpb.GCHint", [
            { no: 1, name: "latest_range_delete_timestamp", kind: "message", T: () => Timestamp },
            { no: 2, name: "gc_timestamp", kind: "message", T: () => Timestamp },
            { no: 3, name: "gc_timestamp_next", kind: "message", T: () => Timestamp }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<GCHint>): GCHint {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<GCHint>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GCHint): GCHint {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.latestRangeDeleteTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.latestRangeDeleteTimestamp);
                    break;
                case  2:
                    message.gcTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.gcTimestamp);
                    break;
                case  3:
                    message.gcTimestampNext = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.gcTimestampNext);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const GCHint = /*#__PURE__*/ new GCHint$Type();

class ForceFlushIndex$Type extends MessageType<ForceFlushIndex> {
    constructor() {
        super("cockroach.roachpb.ForceFlushIndex", [
            { no: 1, name: "index", kind: "scalar", opt: true, T: 4 , L: 0  }
        ], { "gogoproto.goproto_stringer": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ForceFlushIndex>): ForceFlushIndex {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ForceFlushIndex>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ForceFlushIndex): ForceFlushIndex {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.index = reader.uint64().toBigInt();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ForceFlushIndex = /*#__PURE__*/ new ForceFlushIndex$Type();
