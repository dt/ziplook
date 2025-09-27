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

export interface Timestamp {

    seconds: bigint;

    nanos: number;
}

class Timestamp$Type extends MessageType<Timestamp> {
    constructor() {
        super("google.protobuf.Timestamp", [
            { no: 1, name: "seconds", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "nanos", kind: "scalar", T: 5  }
        ]);
    }

    now(): Timestamp {
        const msg = this.create();
        const ms = Date.now();
        msg.seconds = PbLong.from(Math.floor(ms / 1000)).toBigInt();
        msg.nanos = (ms % 1000) * 1000000;
        return msg;
    }

    toDate(message: Timestamp): Date {
        return new Date(PbLong.from(message.seconds).toNumber() * 1000 + Math.ceil(message.nanos / 1000000));
    }

    fromDate(date: Date): Timestamp {
        const msg = this.create();
        const ms = date.getTime();
        msg.seconds = PbLong.from(Math.floor(ms / 1000)).toBigInt();
        msg.nanos = ((ms % 1000) + (ms < 0 && ms % 1000 !== 0 ? 1000 : 0)) * 1000000;
        return msg;
    }

    internalJsonWrite(message: Timestamp, options: JsonWriteOptions): JsonValue {
        let ms = PbLong.from(message.seconds).toNumber() * 1000;
        if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z"))
            throw new Error("Unable to encode Timestamp to JSON. Must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive.");
        if (message.nanos < 0)
            throw new Error("Unable to encode invalid Timestamp to JSON. Nanos must not be negative.");
        let z = "Z";
        if (message.nanos > 0) {
            let nanosStr = (message.nanos + 1000000000).toString().substring(1);
            if (nanosStr.substring(3) === "000000")
                z = "." + nanosStr.substring(0, 3) + "Z";
            else if (nanosStr.substring(6) === "000")
                z = "." + nanosStr.substring(0, 6) + "Z";
            else
                z = "." + nanosStr + "Z";
        }
        return new Date(ms).toISOString().replace(".000Z", z);
    }

    create(value?: PartialMessage<Timestamp>): Timestamp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.seconds = 0n;
        message.nanos = 0;
        if (value !== undefined)
            reflectionMergePartial<Timestamp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Timestamp): Timestamp {
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

export const Timestamp = /*#__PURE__*/ new Timestamp$Type();
