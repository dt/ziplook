// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface EncodedValue {

    value: string;

    type: string;
}

class EncodedValue$Type extends MessageType<EncodedValue> {
    constructor() {
        super("cockroach.settings.EncodedValue", [
            { no: 1, name: "value", kind: "scalar", T: 9  },
            { no: 2, name: "type", kind: "scalar", T: 9  }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<EncodedValue>): EncodedValue {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = "";
        message.type = "";
        if (value !== undefined)
            reflectionMergePartial<EncodedValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EncodedValue): EncodedValue {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.value = reader.string();
                    break;
                case  2:
                    message.type = reader.string();
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

export const EncodedValue = /*#__PURE__*/ new EncodedValue$Type();
