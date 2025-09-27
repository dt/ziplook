// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface LocalityConfig {

    locality: {
        oneofKind: "global";

        global: LocalityConfig_Global;
    } | {
        oneofKind: "regionalByTable";

        regionalByTable: LocalityConfig_RegionalByTable;
    } | {
        oneofKind: "regionalByRow";

        regionalByRow: LocalityConfig_RegionalByRow;
    } | {
        oneofKind: undefined;
    };
}

export interface LocalityConfig_RegionalByTable {

    region?: string;
}

export interface LocalityConfig_RegionalByRow {

    as?: string;
}

export interface LocalityConfig_Global {
}

export interface ShardedDescriptor {

    isSharded?: boolean;

    name?: string;

    shardBuckets?: number;

    columnNames: string[];
}

export interface ScheduledRowLevelTTLArgs {

    tableId?: number;
}

export interface PartitioningDescriptor {

    numColumns?: number;

    numImplicitColumns?: number;

    list: PartitioningDescriptor_List[];

    range: PartitioningDescriptor_Range[];
}

export interface PartitioningDescriptor_List {

    name?: string;

    values: Uint8Array[];

    subpartitioning?: PartitioningDescriptor;
}

export interface PartitioningDescriptor_Range {

    name?: string;

    fromInclusive?: Uint8Array;

    toExclusive?: Uint8Array;
}

export interface RowLevelTTL {

    durationExpr?: string;

    selectBatchSize?: bigint;

    deleteBatchSize?: bigint;

    deletionCron?: string;

    scheduleId?: bigint;

    deleteRateLimit?: bigint;

    pause?: boolean;

    rowStatsPollInterval?: bigint;

    labelMetrics?: boolean;

    expirationExpr?: string;

    selectRateLimit?: bigint;

    disableChangefeedReplication?: boolean;
}

export interface AutoStatsSettings {

    enabled?: boolean;

    minStaleRows?: bigint;

    fractionStaleRows?: number;

    partialEnabled?: boolean;

    partialMinStaleRows?: bigint;

    partialFractionStaleRows?: number;

    fullEnabled?: boolean;
}

export enum GeneratedAsIdentityType {

    NOT_IDENTITY_COLUMN = 0,

    GENERATED_ALWAYS = 1,

    GENERATED_BY_DEFAULT = 2
}

class LocalityConfig$Type extends MessageType<LocalityConfig> {
    constructor() {
        super("cockroach.sql.catalog.catpb.LocalityConfig", [
            { no: 1, name: "global", kind: "message", oneof: "locality", T: () => LocalityConfig_Global },
            { no: 2, name: "regional_by_table", kind: "message", oneof: "locality", T: () => LocalityConfig_RegionalByTable },
            { no: 3, name: "regional_by_row", kind: "message", oneof: "locality", T: () => LocalityConfig_RegionalByRow }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<LocalityConfig>): LocalityConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.locality = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<LocalityConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LocalityConfig): LocalityConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.locality = {
                        oneofKind: "global",
                        global: LocalityConfig_Global.internalBinaryRead(reader, reader.uint32(), options, (message.locality as any).global)
                    };
                    break;
                case  2:
                    message.locality = {
                        oneofKind: "regionalByTable",
                        regionalByTable: LocalityConfig_RegionalByTable.internalBinaryRead(reader, reader.uint32(), options, (message.locality as any).regionalByTable)
                    };
                    break;
                case  3:
                    message.locality = {
                        oneofKind: "regionalByRow",
                        regionalByRow: LocalityConfig_RegionalByRow.internalBinaryRead(reader, reader.uint32(), options, (message.locality as any).regionalByRow)
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

export const LocalityConfig = /*#__PURE__*/ new LocalityConfig$Type();

class LocalityConfig_RegionalByTable$Type extends MessageType<LocalityConfig_RegionalByTable> {
    constructor() {
        super("cockroach.sql.catalog.catpb.LocalityConfig.RegionalByTable", [
            { no: 1, name: "region", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<LocalityConfig_RegionalByTable>): LocalityConfig_RegionalByTable {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<LocalityConfig_RegionalByTable>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LocalityConfig_RegionalByTable): LocalityConfig_RegionalByTable {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
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

export const LocalityConfig_RegionalByTable = /*#__PURE__*/ new LocalityConfig_RegionalByTable$Type();

class LocalityConfig_RegionalByRow$Type extends MessageType<LocalityConfig_RegionalByRow> {
    constructor() {
        super("cockroach.sql.catalog.catpb.LocalityConfig.RegionalByRow", [
            { no: 1, name: "as", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<LocalityConfig_RegionalByRow>): LocalityConfig_RegionalByRow {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<LocalityConfig_RegionalByRow>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LocalityConfig_RegionalByRow): LocalityConfig_RegionalByRow {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
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

export const LocalityConfig_RegionalByRow = /*#__PURE__*/ new LocalityConfig_RegionalByRow$Type();

class LocalityConfig_Global$Type extends MessageType<LocalityConfig_Global> {
    constructor() {
        super("cockroach.sql.catalog.catpb.LocalityConfig.Global", [], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<LocalityConfig_Global>): LocalityConfig_Global {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<LocalityConfig_Global>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LocalityConfig_Global): LocalityConfig_Global {
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

export const LocalityConfig_Global = /*#__PURE__*/ new LocalityConfig_Global$Type();

class ShardedDescriptor$Type extends MessageType<ShardedDescriptor> {
    constructor() {
        super("cockroach.sql.catalog.catpb.ShardedDescriptor", [
            { no: 1, name: "is_sharded", kind: "scalar", opt: true, T: 8  },
            { no: 2, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "shard_buckets", kind: "scalar", opt: true, T: 5  },
            { no: 4, name: "column_names", kind: "scalar", repeat: 2 , T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ShardedDescriptor>): ShardedDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.columnNames = [];
        if (value !== undefined)
            reflectionMergePartial<ShardedDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ShardedDescriptor): ShardedDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.isSharded = reader.bool();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  3:
                    message.shardBuckets = reader.int32();
                    break;
                case  4:
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

export const ShardedDescriptor = /*#__PURE__*/ new ShardedDescriptor$Type();

class ScheduledRowLevelTTLArgs$Type extends MessageType<ScheduledRowLevelTTLArgs> {
    constructor() {
        super("cockroach.sql.catalog.catpb.ScheduledRowLevelTTLArgs", [
            { no: 1, name: "table_id", kind: "scalar", opt: true, T: 13  }
        ]);
    }
    create(value?: PartialMessage<ScheduledRowLevelTTLArgs>): ScheduledRowLevelTTLArgs {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ScheduledRowLevelTTLArgs>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ScheduledRowLevelTTLArgs): ScheduledRowLevelTTLArgs {
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

export const ScheduledRowLevelTTLArgs = /*#__PURE__*/ new ScheduledRowLevelTTLArgs$Type();

class PartitioningDescriptor$Type extends MessageType<PartitioningDescriptor> {
    constructor() {
        super("cockroach.sql.catalog.catpb.PartitioningDescriptor", [
            { no: 1, name: "num_columns", kind: "scalar", opt: true, T: 13  },
            { no: 4, name: "num_implicit_columns", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "list", kind: "message", repeat: 2 , T: () => PartitioningDescriptor_List },
            { no: 3, name: "range", kind: "message", repeat: 2 , T: () => PartitioningDescriptor_Range }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<PartitioningDescriptor>): PartitioningDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.list = [];
        message.range = [];
        if (value !== undefined)
            reflectionMergePartial<PartitioningDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PartitioningDescriptor): PartitioningDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.numColumns = reader.uint32();
                    break;
                case  4:
                    message.numImplicitColumns = reader.uint32();
                    break;
                case  2:
                    message.list.push(PartitioningDescriptor_List.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.range.push(PartitioningDescriptor_Range.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PartitioningDescriptor = /*#__PURE__*/ new PartitioningDescriptor$Type();

class PartitioningDescriptor_List$Type extends MessageType<PartitioningDescriptor_List> {
    constructor() {
        super("cockroach.sql.catalog.catpb.PartitioningDescriptor.List", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "values", kind: "scalar", repeat: 2 , T: 12  },
            { no: 3, name: "subpartitioning", kind: "message", T: () => PartitioningDescriptor }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<PartitioningDescriptor_List>): PartitioningDescriptor_List {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.values = [];
        if (value !== undefined)
            reflectionMergePartial<PartitioningDescriptor_List>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PartitioningDescriptor_List): PartitioningDescriptor_List {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.values.push(reader.bytes());
                    break;
                case  3:
                    message.subpartitioning = PartitioningDescriptor.internalBinaryRead(reader, reader.uint32(), options, message.subpartitioning);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PartitioningDescriptor_List = /*#__PURE__*/ new PartitioningDescriptor_List$Type();

class PartitioningDescriptor_Range$Type extends MessageType<PartitioningDescriptor_Range> {
    constructor() {
        super("cockroach.sql.catalog.catpb.PartitioningDescriptor.Range", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "from_inclusive", kind: "scalar", opt: true, T: 12  },
            { no: 2, name: "to_exclusive", kind: "scalar", opt: true, T: 12  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<PartitioningDescriptor_Range>): PartitioningDescriptor_Range {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PartitioningDescriptor_Range>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PartitioningDescriptor_Range): PartitioningDescriptor_Range {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  3:
                    message.fromInclusive = reader.bytes();
                    break;
                case  2:
                    message.toExclusive = reader.bytes();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PartitioningDescriptor_Range = /*#__PURE__*/ new PartitioningDescriptor_Range$Type();

class RowLevelTTL$Type extends MessageType<RowLevelTTL> {
    constructor() {
        super("cockroach.sql.catalog.catpb.RowLevelTTL", [
            { no: 1, name: "duration_expr", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "select_batch_size", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 3, name: "delete_batch_size", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 4, name: "deletion_cron", kind: "scalar", opt: true, T: 9  },
            { no: 5, name: "schedule_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 7, name: "delete_rate_limit", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 8, name: "pause", kind: "scalar", opt: true, T: 8  },
            { no: 9, name: "row_stats_poll_interval", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 10, name: "label_metrics", kind: "scalar", opt: true, T: 8  },
            { no: 11, name: "expiration_expr", kind: "scalar", opt: true, T: 9  },
            { no: 12, name: "select_rate_limit", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 13, name: "disable_changefeed_replication", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<RowLevelTTL>): RowLevelTTL {
        const message = globalThis.Object.create((this.messagePrototype!));
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
                    message.durationExpr = reader.string();
                    break;
                case  2:
                    message.selectBatchSize = reader.int64().toBigInt();
                    break;
                case  3:
                    message.deleteBatchSize = reader.int64().toBigInt();
                    break;
                case  4:
                    message.deletionCron = reader.string();
                    break;
                case  5:
                    message.scheduleId = reader.int64().toBigInt();
                    break;
                case  7:
                    message.deleteRateLimit = reader.int64().toBigInt();
                    break;
                case  8:
                    message.pause = reader.bool();
                    break;
                case  9:
                    message.rowStatsPollInterval = reader.int64().toBigInt();
                    break;
                case  10:
                    message.labelMetrics = reader.bool();
                    break;
                case  11:
                    message.expirationExpr = reader.string();
                    break;
                case  12:
                    message.selectRateLimit = reader.int64().toBigInt();
                    break;
                case  13:
                    message.disableChangefeedReplication = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
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

class AutoStatsSettings$Type extends MessageType<AutoStatsSettings> {
    constructor() {
        super("cockroach.sql.catalog.catpb.AutoStatsSettings", [
            { no: 1, name: "enabled", kind: "scalar", opt: true, T: 8  },
            { no: 2, name: "min_stale_rows", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 3, name: "fraction_stale_rows", kind: "scalar", opt: true, T: 1  },
            { no: 4, name: "partial_enabled", kind: "scalar", opt: true, T: 8  },
            { no: 5, name: "partial_min_stale_rows", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 6, name: "partial_fraction_stale_rows", kind: "scalar", opt: true, T: 1  },
            { no: 7, name: "full_enabled", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<AutoStatsSettings>): AutoStatsSettings {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AutoStatsSettings>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AutoStatsSettings): AutoStatsSettings {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.enabled = reader.bool();
                    break;
                case  2:
                    message.minStaleRows = reader.int64().toBigInt();
                    break;
                case  3:
                    message.fractionStaleRows = reader.double();
                    break;
                case  4:
                    message.partialEnabled = reader.bool();
                    break;
                case  5:
                    message.partialMinStaleRows = reader.int64().toBigInt();
                    break;
                case  6:
                    message.partialFractionStaleRows = reader.double();
                    break;
                case  7:
                    message.fullEnabled = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const AutoStatsSettings = /*#__PURE__*/ new AutoStatsSettings$Type();
