// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { DateStyle } from "../../util/timeutil/pgdate/pgdate";
import { IntervalStyle } from "../../util/duration/duration";
import { BytesEncodeFormat } from "../lex/encode";
import { Duration } from "../../google/protobuf/duration";

export interface SessionData {

    database: string;

    applicationName: string;

    userProto: string;

    dataConversionConfig?: DataConversionConfig;

    vectorizeMode: VectorizeExecMode;

    testingVectorizeInjectPanics: boolean;

    defaultIntSize: number;

    location: string;

    searchPath: string[];

    temporarySchemaName: string;

    seqState?: SequenceState;

    workMemLimit: bigint;

    lockTimeout?: Duration;

    internal: boolean;

    onUpdateRehomeRowEnabled: boolean;

    joinReaderOrderingStrategyBatchSize: bigint;

    parallelizeMultiKeyLookupJoinsEnabled: boolean;

    trigramSimilarityThreshold: number;

    troubleshootingMode: boolean;

    joinReaderNoOrderingStrategyBatchSize: bigint;

    joinReaderIndexJoinStrategyBatchSize: bigint;

    indexJoinStreamerBatchSize: bigint;

    directColumnarScansEnabled: boolean;

    defaultTextSearchConfig: string;

    streamerAlwaysMaintainOrdering: boolean;

    streamerInOrderEagerMemoryUsageFraction: number;

    streamerOutOfOrderEagerMemoryUsageFraction: number;

    streamerHeadOfLineOnlyFraction: number;

    distsqlPlanGatewayBias: bigint;

    streamerEnabled: boolean;

    deadlockTimeout?: Duration;
}

export interface DataConversionConfig {

    bytesEncodeFormat: BytesEncodeFormat;

    extraFloatDigits: number;

    intervalStyle: IntervalStyle;

    dateStyle?: DateStyle;
}

export interface SequenceState {

    seqs: SequenceState_Seq[];

    lastSeqIncremented: number;
}

export interface SequenceState_Seq {

    seqId: number;

    latestVal: bigint;
}

export enum VectorizeExecMode {

    unset = 0,

    deprecated201auto = 1,

    on = 2,

    experimental_always = 3,

    off = 4
}

class SessionData$Type extends MessageType<SessionData> {
    constructor() {
        super("cockroach.sql.sessiondatapb.SessionData", [
            { no: 1, name: "database", kind: "scalar", T: 9  },
            { no: 2, name: "application_name", kind: "scalar", T: 9  },
            { no: 3, name: "user_proto", kind: "scalar", T: 9  },
            { no: 4, name: "data_conversion_config", kind: "message", T: () => DataConversionConfig },
            { no: 5, name: "vectorize_mode", kind: "enum", T: () => ["cockroach.sql.sessiondatapb.VectorizeExecMode", VectorizeExecMode] },
            { no: 6, name: "testing_vectorize_inject_panics", kind: "scalar", T: 8  },
            { no: 7, name: "default_int_size", kind: "scalar", T: 5  },
            { no: 8, name: "location", kind: "scalar", T: 9  },
            { no: 9, name: "search_path", kind: "scalar", repeat: 2 , T: 9  },
            { no: 10, name: "temporary_schema_name", kind: "scalar", T: 9  },
            { no: 11, name: "seq_state", kind: "message", T: () => SequenceState },
            { no: 12, name: "WorkMemLimit", kind: "scalar", jsonName: "WorkMemLimit", T: 3 , L: 0  },
            { no: 15, name: "lock_timeout", kind: "message", T: () => Duration },
            { no: 16, name: "internal", kind: "scalar", T: 8  },
            { no: 17, name: "on_update_rehome_row_enabled", kind: "scalar", T: 8  },
            { no: 18, name: "join_reader_ordering_strategy_batch_size", kind: "scalar", T: 3 , L: 0  },
            { no: 19, name: "parallelize_multi_key_lookup_joins_enabled", kind: "scalar", T: 8  },
            { no: 20, name: "trigram_similarity_threshold", kind: "scalar", T: 1  },
            { no: 21, name: "troubleshooting_mode", kind: "scalar", T: 8  },
            { no: 22, name: "join_reader_no_ordering_strategy_batch_size", kind: "scalar", T: 3 , L: 0  },
            { no: 23, name: "join_reader_index_join_strategy_batch_size", kind: "scalar", T: 3 , L: 0  },
            { no: 24, name: "index_join_streamer_batch_size", kind: "scalar", T: 3 , L: 0  },
            { no: 25, name: "direct_columnar_scans_enabled", kind: "scalar", T: 8  },
            { no: 26, name: "default_text_search_config", kind: "scalar", T: 9  },
            { no: 27, name: "streamer_always_maintain_ordering", kind: "scalar", T: 8  },
            { no: 28, name: "streamer_in_order_eager_memory_usage_fraction", kind: "scalar", T: 1  },
            { no: 29, name: "streamer_out_of_order_eager_memory_usage_fraction", kind: "scalar", T: 1  },
            { no: 30, name: "streamer_head_of_line_only_fraction", kind: "scalar", T: 1  },
            { no: 31, name: "distsql_plan_gateway_bias", kind: "scalar", T: 3 , L: 0  },
            { no: 32, name: "streamer_enabled", kind: "scalar", T: 8  },
            { no: 33, name: "deadlock_timeout", kind: "message", T: () => Duration }
        ]);
    }
    create(value?: PartialMessage<SessionData>): SessionData {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.database = "";
        message.applicationName = "";
        message.userProto = "";
        message.vectorizeMode = 0;
        message.testingVectorizeInjectPanics = false;
        message.defaultIntSize = 0;
        message.location = "";
        message.searchPath = [];
        message.temporarySchemaName = "";
        message.workMemLimit = 0n;
        message.internal = false;
        message.onUpdateRehomeRowEnabled = false;
        message.joinReaderOrderingStrategyBatchSize = 0n;
        message.parallelizeMultiKeyLookupJoinsEnabled = false;
        message.trigramSimilarityThreshold = 0;
        message.troubleshootingMode = false;
        message.joinReaderNoOrderingStrategyBatchSize = 0n;
        message.joinReaderIndexJoinStrategyBatchSize = 0n;
        message.indexJoinStreamerBatchSize = 0n;
        message.directColumnarScansEnabled = false;
        message.defaultTextSearchConfig = "";
        message.streamerAlwaysMaintainOrdering = false;
        message.streamerInOrderEagerMemoryUsageFraction = 0;
        message.streamerOutOfOrderEagerMemoryUsageFraction = 0;
        message.streamerHeadOfLineOnlyFraction = 0;
        message.distsqlPlanGatewayBias = 0n;
        message.streamerEnabled = false;
        if (value !== undefined)
            reflectionMergePartial<SessionData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SessionData): SessionData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.database = reader.string();
                    break;
                case  2:
                    message.applicationName = reader.string();
                    break;
                case  3:
                    message.userProto = reader.string();
                    break;
                case  4:
                    message.dataConversionConfig = DataConversionConfig.internalBinaryRead(reader, reader.uint32(), options, message.dataConversionConfig);
                    break;
                case  5:
                    message.vectorizeMode = reader.int32();
                    break;
                case  6:
                    message.testingVectorizeInjectPanics = reader.bool();
                    break;
                case  7:
                    message.defaultIntSize = reader.int32();
                    break;
                case  8:
                    message.location = reader.string();
                    break;
                case  9:
                    message.searchPath.push(reader.string());
                    break;
                case  10:
                    message.temporarySchemaName = reader.string();
                    break;
                case  11:
                    message.seqState = SequenceState.internalBinaryRead(reader, reader.uint32(), options, message.seqState);
                    break;
                case  12:
                    message.workMemLimit = reader.int64().toBigInt();
                    break;
                case  15:
                    message.lockTimeout = Duration.internalBinaryRead(reader, reader.uint32(), options, message.lockTimeout);
                    break;
                case  16:
                    message.internal = reader.bool();
                    break;
                case  17:
                    message.onUpdateRehomeRowEnabled = reader.bool();
                    break;
                case  18:
                    message.joinReaderOrderingStrategyBatchSize = reader.int64().toBigInt();
                    break;
                case  19:
                    message.parallelizeMultiKeyLookupJoinsEnabled = reader.bool();
                    break;
                case  20:
                    message.trigramSimilarityThreshold = reader.double();
                    break;
                case  21:
                    message.troubleshootingMode = reader.bool();
                    break;
                case  22:
                    message.joinReaderNoOrderingStrategyBatchSize = reader.int64().toBigInt();
                    break;
                case  23:
                    message.joinReaderIndexJoinStrategyBatchSize = reader.int64().toBigInt();
                    break;
                case  24:
                    message.indexJoinStreamerBatchSize = reader.int64().toBigInt();
                    break;
                case  25:
                    message.directColumnarScansEnabled = reader.bool();
                    break;
                case  26:
                    message.defaultTextSearchConfig = reader.string();
                    break;
                case  27:
                    message.streamerAlwaysMaintainOrdering = reader.bool();
                    break;
                case  28:
                    message.streamerInOrderEagerMemoryUsageFraction = reader.double();
                    break;
                case  29:
                    message.streamerOutOfOrderEagerMemoryUsageFraction = reader.double();
                    break;
                case  30:
                    message.streamerHeadOfLineOnlyFraction = reader.double();
                    break;
                case  31:
                    message.distsqlPlanGatewayBias = reader.int64().toBigInt();
                    break;
                case  32:
                    message.streamerEnabled = reader.bool();
                    break;
                case  33:
                    message.deadlockTimeout = Duration.internalBinaryRead(reader, reader.uint32(), options, message.deadlockTimeout);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SessionData = /*#__PURE__*/ new SessionData$Type();

class DataConversionConfig$Type extends MessageType<DataConversionConfig> {
    constructor() {
        super("cockroach.sql.sessiondatapb.DataConversionConfig", [
            { no: 1, name: "bytes_encode_format", kind: "enum", T: () => ["cockroach.sql.sessiondatapb.BytesEncodeFormat", BytesEncodeFormat] },
            { no: 2, name: "extra_float_digits", kind: "scalar", T: 5  },
            { no: 3, name: "interval_style", kind: "enum", T: () => ["cockroach.util.duration.IntervalStyle", IntervalStyle] },
            { no: 4, name: "date_style", kind: "message", T: () => DateStyle }
        ]);
    }
    create(value?: PartialMessage<DataConversionConfig>): DataConversionConfig {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.bytesEncodeFormat = 0;
        message.extraFloatDigits = 0;
        message.intervalStyle = 0;
        if (value !== undefined)
            reflectionMergePartial<DataConversionConfig>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DataConversionConfig): DataConversionConfig {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.bytesEncodeFormat = reader.int32();
                    break;
                case  2:
                    message.extraFloatDigits = reader.int32();
                    break;
                case  3:
                    message.intervalStyle = reader.int32();
                    break;
                case  4:
                    message.dateStyle = DateStyle.internalBinaryRead(reader, reader.uint32(), options, message.dateStyle);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const DataConversionConfig = /*#__PURE__*/ new DataConversionConfig$Type();

class SequenceState$Type extends MessageType<SequenceState> {
    constructor() {
        super("cockroach.sql.sessiondatapb.SequenceState", [
            { no: 1, name: "seqs", kind: "message", repeat: 2 , T: () => SequenceState_Seq },
            { no: 2, name: "last_seq_incremented", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<SequenceState>): SequenceState {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.seqs = [];
        message.lastSeqIncremented = 0;
        if (value !== undefined)
            reflectionMergePartial<SequenceState>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SequenceState): SequenceState {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.seqs.push(SequenceState_Seq.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.lastSeqIncremented = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SequenceState = /*#__PURE__*/ new SequenceState$Type();

class SequenceState_Seq$Type extends MessageType<SequenceState_Seq> {
    constructor() {
        super("cockroach.sql.sessiondatapb.SequenceState.Seq", [
            { no: 1, name: "seq_id", kind: "scalar", T: 13  },
            { no: 2, name: "latest_val", kind: "scalar", T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<SequenceState_Seq>): SequenceState_Seq {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.seqId = 0;
        message.latestVal = 0n;
        if (value !== undefined)
            reflectionMergePartial<SequenceState_Seq>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SequenceState_Seq): SequenceState_Seq {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.seqId = reader.uint32();
                    break;
                case  2:
                    message.latestVal = reader.int64().toBigInt();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const SequenceState_Seq = /*#__PURE__*/ new SequenceState_Seq$Type();
