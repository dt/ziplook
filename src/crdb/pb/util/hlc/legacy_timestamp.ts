// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface LegacyTimestamp {

    wallTime?: bigint;

    logical?: number;
}

class LegacyTimestamp$Type extends MessageType<LegacyTimestamp> {
    constructor() {
        super("cockroach.util.hlc.LegacyTimestamp", [
            { no: 1, name: "wall_time", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 2, name: "logical", kind: "scalar", opt: true, T: 5  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.populate": true, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<LegacyTimestamp>): LegacyTimestamp {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<LegacyTimestamp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LegacyTimestamp): LegacyTimestamp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.wallTime = reader.int64().toBigInt();
                    break;
                case  2:
                    message.logical = reader.int32();
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

export const LegacyTimestamp = /*#__PURE__*/ new LegacyTimestamp$Type();
