// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { typeofJsonValue } from "@protobuf-ts/runtime";
import type { JsonValue } from "@protobuf-ts/runtime";
import type { JsonReadOptions } from "@protobuf-ts/runtime";
import type { JsonWriteOptions } from "@protobuf-ts/runtime";
import { PbLong } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface Duration {

    seconds: bigint;

    nanos: number;
}

class Duration$Type extends MessageType<Duration> {
    constructor() {
        super("google.protobuf.Duration", [
            { no: 1, name: "seconds", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "nanos", kind: "scalar", T: 5  }
        ]);
    }

    internalJsonWrite(message: Duration, options: JsonWriteOptions): JsonValue {
        let s = PbLong.from(message.seconds).toNumber();
        if (s > 315576000000 || s < -315576000000)
            throw new Error("Duration value out of range.");
        let text = message.seconds.toString();
        if (s === 0 && message.nanos < 0)
            text = "-" + text;
        if (message.nanos !== 0) {
            let nanosStr = Math.abs(message.nanos).toString();
            nanosStr = "0".repeat(9 - nanosStr.length) + nanosStr;
            if (nanosStr.substring(3) === "000000")
                nanosStr = nanosStr.substring(0, 3);
            else if (nanosStr.substring(6) === "000")
                nanosStr = nanosStr.substring(0, 6);
            text += "." + nanosStr;
        }
        return text + "s";
    }

    create(value?: PartialMessage<Duration>): Duration {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.seconds = 0n;
        message.nanos = 0;
        if (value !== undefined)
            reflectionMergePartial<Duration>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Duration): Duration {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.seconds = reader.int64().toBigInt();
                    break;
                case  2:
                    message.nanos = reader.int32();
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

export const Duration = /*#__PURE__*/ new Duration$Type();
