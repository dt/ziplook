// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface IOThreshold {

    l0NumSubLevels: bigint;

    l0NumSubLevelsThreshold: bigint;

    l0NumFiles: bigint;

    l0NumFilesThreshold: bigint;

    l0Size: bigint;

    l0MinimumSizePerSubLevel: bigint;
}

class IOThreshold$Type extends MessageType<IOThreshold> {
    constructor() {
        super("cockroach.util.admission.admissionpb.IOThreshold", [
            { no: 1, name: "l0_num_sub_levels", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "l0_num_sub_levels_threshold", kind: "scalar", T: 3 , L: 0  },
            { no: 3, name: "l0_num_files", kind: "scalar", T: 3 , L: 0  },
            { no: 4, name: "l0_num_files_threshold", kind: "scalar", T: 3 , L: 0  },
            { no: 5, name: "l0_size", kind: "scalar", T: 3 , L: 0  },
            { no: 6, name: "l0_minimum_size_per_sub_level", kind: "scalar", T: 3 , L: 0  }
        ], { "gogoproto.goproto_stringer": false });
    }
    create(value?: PartialMessage<IOThreshold>): IOThreshold {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.l0NumSubLevels = 0n;
        message.l0NumSubLevelsThreshold = 0n;
        message.l0NumFiles = 0n;
        message.l0NumFilesThreshold = 0n;
        message.l0Size = 0n;
        message.l0MinimumSizePerSubLevel = 0n;
        if (value !== undefined)
            reflectionMergePartial<IOThreshold>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IOThreshold): IOThreshold {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.l0NumSubLevels = reader.int64().toBigInt();
                    break;
                case  2:
                    message.l0NumSubLevelsThreshold = reader.int64().toBigInt();
                    break;
                case  3:
                    message.l0NumFiles = reader.int64().toBigInt();
                    break;
                case  4:
                    message.l0NumFilesThreshold = reader.int64().toBigInt();
                    break;
                case  5:
                    message.l0Size = reader.int64().toBigInt();
                    break;
                case  6:
                    message.l0MinimumSizePerSubLevel = reader.int64().toBigInt();
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

export const IOThreshold = /*#__PURE__*/ new IOThreshold$Type();
