// @ts-nocheck

import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { TenantConsumption } from "../../kv/kvpb/api";
import { TenantID } from "../../roachpb/data";
import { Timestamp } from "../../util/hlc/timestamp";
import { TenantCapabilities } from "../tenantcapabilitiespb/capabilities";

export interface ProtoInfo {

    deprecatedId?: bigint;

    deprecatedDataState?: ProtoInfo_DeprecatedDataState;

    droppedName?: string;

    physicalReplicationConsumerJobId?: bigint;

    physicalReplicationProducerJobIds: bigint[];

    capabilities?: TenantCapabilities;

    previousSourceTenant?: PreviousSourceTenant;

    lastRevertTenantTimestamp?: Timestamp;

    readFromTenant?: TenantID;
}

export enum ProtoInfo_DeprecatedDataState {

    READY = 0,

    ADD = 1,

    DROP = 2
}

export interface PreviousSourceTenant {

    clusterId?: Uint8Array;

    tenantId?: TenantID;

    cutoverTimestamp?: Timestamp;

    cutoverAsOf?: Timestamp;
}

export interface SQLInfo {

    id?: bigint;

    name?: string;

    dataState?: number;

    serviceMode?: number;
}

export interface UsageInfo {

    ruBurstLimit?: number;

    ruRefillRate?: number;

    ruCurrent?: number;

    consumption?: TenantConsumption;
}

export interface SettingOverride {

    name?: string;

    value?: string;

    valueType?: string;

    reason?: string;
}

export interface TenantInfoWithUsage {

    info?: ProtoInfo;

    usage?: UsageInfo;

    extraColumns?: SQLInfo;

    settingOverrides: SettingOverride[];
}

class ProtoInfo$Type extends MessageType<ProtoInfo> {
    constructor() {
        super("cockroach.multitenant.ProtoInfo", [
            { no: 1, name: "deprecated_id", kind: "scalar", opt: true, T: 4 , L: 0  },
            { no: 2, name: "deprecated_data_state", kind: "enum", opt: true, T: () => ["cockroach.multitenant.ProtoInfo.DeprecatedDataState", ProtoInfo_DeprecatedDataState] },
            { no: 3, name: "dropped_name", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "physical_replication_consumer_job_id", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 6, name: "physical_replication_producer_job_ids", kind: "scalar", repeat: 2 , T: 3 , L: 0  },
            { no: 5, name: "capabilities", kind: "message", T: () => TenantCapabilities },
            { no: 7, name: "previous_source_tenant", kind: "message", T: () => PreviousSourceTenant },
            { no: 8, name: "last_revert_tenant_timestamp", kind: "message", T: () => Timestamp },
            { no: 9, name: "read_from_tenant", kind: "message", T: () => TenantID }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ProtoInfo>): ProtoInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.physicalReplicationProducerJobIds = [];
        if (value !== undefined)
            reflectionMergePartial<ProtoInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ProtoInfo): ProtoInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.deprecatedId = reader.uint64().toBigInt();
                    break;
                case  2:
                    message.deprecatedDataState = reader.int32();
                    break;
                case  3:
                    message.droppedName = reader.string();
                    break;
                case  4:
                    message.physicalReplicationConsumerJobId = reader.int64().toBigInt();
                    break;
                case  6:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.physicalReplicationProducerJobIds.push(reader.int64().toBigInt());
                    else
                        message.physicalReplicationProducerJobIds.push(reader.int64().toBigInt());
                    break;
                case  5:
                    message.capabilities = TenantCapabilities.internalBinaryRead(reader, reader.uint32(), options, message.capabilities);
                    break;
                case  7:
                    message.previousSourceTenant = PreviousSourceTenant.internalBinaryRead(reader, reader.uint32(), options, message.previousSourceTenant);
                    break;
                case  8:
                    message.lastRevertTenantTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.lastRevertTenantTimestamp);
                    break;
                case  9:
                    message.readFromTenant = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.readFromTenant);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const ProtoInfo = /*#__PURE__*/ new ProtoInfo$Type();

class PreviousSourceTenant$Type extends MessageType<PreviousSourceTenant> {
    constructor() {
        super("cockroach.multitenant.PreviousSourceTenant", [
            { no: 1, name: "cluster_id", kind: "scalar", opt: true, T: 12  },
            { no: 2, name: "tenant_id", kind: "message", T: () => TenantID },
            { no: 3, name: "cutover_timestamp", kind: "message", T: () => Timestamp },
            { no: 4, name: "cutover_as_of", kind: "message", T: () => Timestamp }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<PreviousSourceTenant>): PreviousSourceTenant {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PreviousSourceTenant>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PreviousSourceTenant): PreviousSourceTenant {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.clusterId = reader.bytes();
                    break;
                case  2:
                    message.tenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.tenantId);
                    break;
                case  3:
                    message.cutoverTimestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.cutoverTimestamp);
                    break;
                case  4:
                    message.cutoverAsOf = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.cutoverAsOf);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const PreviousSourceTenant = /*#__PURE__*/ new PreviousSourceTenant$Type();

class SQLInfo$Type extends MessageType<SQLInfo> {
    constructor() {
        super("cockroach.multitenant.SQLInfo", [
            { no: 1, name: "id", kind: "scalar", opt: true, T: 4 , L: 0  },
            { no: 2, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "data_state", kind: "scalar", opt: true, T: 13  },
            { no: 4, name: "service_mode", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SQLInfo>): SQLInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SQLInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SQLInfo): SQLInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint64().toBigInt();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  3:
                    message.dataState = reader.uint32();
                    break;
                case  4:
                    message.serviceMode = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SQLInfo = /*#__PURE__*/ new SQLInfo$Type();

class UsageInfo$Type extends MessageType<UsageInfo> {
    constructor() {
        super("cockroach.multitenant.UsageInfo", [
            { no: 1, name: "ru_burst_limit", kind: "scalar", opt: true, T: 1  },
            { no: 2, name: "ru_refill_rate", kind: "scalar", opt: true, T: 1  },
            { no: 3, name: "ru_current", kind: "scalar", opt: true, T: 1  },
            { no: 4, name: "consumption", kind: "message", T: () => TenantConsumption }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<UsageInfo>): UsageInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<UsageInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UsageInfo): UsageInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.ruBurstLimit = reader.double();
                    break;
                case  2:
                    message.ruRefillRate = reader.double();
                    break;
                case  3:
                    message.ruCurrent = reader.double();
                    break;
                case  4:
                    message.consumption = TenantConsumption.internalBinaryRead(reader, reader.uint32(), options, message.consumption);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const UsageInfo = /*#__PURE__*/ new UsageInfo$Type();

class SettingOverride$Type extends MessageType<SettingOverride> {
    constructor() {
        super("cockroach.multitenant.SettingOverride", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "value", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "value_type", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "reason", kind: "scalar", opt: true, T: 9  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<SettingOverride>): SettingOverride {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SettingOverride>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SettingOverride): SettingOverride {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.value = reader.string();
                    break;
                case  3:
                    message.valueType = reader.string();
                    break;
                case  4:
                    message.reason = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SettingOverride = /*#__PURE__*/ new SettingOverride$Type();

class TenantInfoWithUsage$Type extends MessageType<TenantInfoWithUsage> {
    constructor() {
        super("cockroach.multitenant.TenantInfoWithUsage", [
            { no: 1, name: "info", kind: "message", T: () => ProtoInfo },
            { no: 2, name: "usage", kind: "message", T: () => UsageInfo },
            { no: 3, name: "extra_columns", kind: "message", T: () => SQLInfo },
            { no: 4, name: "setting_overrides", kind: "message", repeat: 2 , T: () => SettingOverride }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TenantInfoWithUsage>): TenantInfoWithUsage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.settingOverrides = [];
        if (value !== undefined)
            reflectionMergePartial<TenantInfoWithUsage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TenantInfoWithUsage): TenantInfoWithUsage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.info = ProtoInfo.internalBinaryRead(reader, reader.uint32(), options, message.info);
                    break;
                case  2:
                    message.usage = UsageInfo.internalBinaryRead(reader, reader.uint32(), options, message.usage);
                    break;
                case  3:
                    message.extraColumns = SQLInfo.internalBinaryRead(reader, reader.uint32(), options, message.extraColumns);
                    break;
                case  4:
                    message.settingOverrides.push(SettingOverride.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const TenantInfoWithUsage = /*#__PURE__*/ new TenantInfoWithUsage$Type();
