// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface Config {

    dims: number;

    seed: bigint;

    buildBeamSize: number;

    minPartitionSize: number;

    maxPartitionSize: number;

    isDeterministic: boolean;

    rotAlgorithm: RotAlgorithm;

    distanceMetric: DistanceMetric;
}

export enum RotAlgorithm {

    RotMatrix = 0,

    RotNone = 1,

    RotGivens = 2
}

export enum DistanceMetric {

    L2SquaredDistance = 0,

    InnerProductDistance = 1,

    CosineDistance = 2
}

class Config$Type extends MessageType<Config> {
    constructor() {
        super("cockroach.sql.vecindex.vecpb.Config", [
            { no: 1, name: "dims", kind: "scalar", T: 5  },
            { no: 2, name: "seed", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "build_beam_size", kind: "scalar", T: 5  },
            { no: 4, name: "min_partition_size", kind: "scalar", T: 5  },
            { no: 5, name: "max_partition_size", kind: "scalar", T: 5  },
            { no: 6, name: "is_deterministic", kind: "scalar", T: 8  },
            { no: 7, name: "rot_algorithm", kind: "enum", T: () => ["cockroach.sql.vecindex.vecpb.RotAlgorithm", RotAlgorithm] },
            { no: 8, name: "distance_metric", kind: "enum", T: () => ["cockroach.sql.vecindex.vecpb.DistanceMetric", DistanceMetric] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<Config>): Config {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.dims = 0;
        message.seed = 0n;
        message.buildBeamSize = 0;
        message.minPartitionSize = 0;
        message.maxPartitionSize = 0;
        message.isDeterministic = false;
        message.rotAlgorithm = 0;
        message.distanceMetric = 0;
        if (value !== undefined)
            reflectionMergePartial<Config>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Config): Config {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.dims = reader.int32();
                    break;
                case  2:
                    message.seed = reader.int64().toBigInt();
                    break;
                case  3:
                    message.buildBeamSize = reader.int32();
                    break;
                case  4:
                    message.minPartitionSize = reader.int32();
                    break;
                case  5:
                    message.maxPartitionSize = reader.int32();
                    break;
                case  6:
                    message.isDeterministic = reader.bool();
                    break;
                case  7:
                    message.rotAlgorithm = reader.int32();
                    break;
                case  8:
                    message.distanceMetric = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }

}

export const Config = /*#__PURE__*/ new Config$Type();
