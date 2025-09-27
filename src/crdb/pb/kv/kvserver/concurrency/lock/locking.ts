// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Level } from "../isolation/levels";
import { Timestamp } from "../../../../util/hlc/timestamp";

export interface Mode {

    strength: Strength;

    timestamp?: Timestamp;

    isoLevel: Level;
}

export enum Strength {

    None = 0,

    Shared = 1,

    Update = 2,

    Exclusive = 3,

    Intent = 4
}

export enum Durability {

    Unreplicated = 0,

    Replicated = 1
}

export enum WaitPolicy {

    Block = 0,

    Error = 1,

    SkipLocked = 2
}

class Mode$Type extends MessageType<Mode> {
    constructor() {
        super("cockroach.kv.kvserver.concurrency.lock.Mode", [
            { no: 1, name: "strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] },
            { no: 2, name: "timestamp", kind: "message", T: () => Timestamp },
            { no: 3, name: "iso_level", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.isolation.Level", Level] }
        ]);
    }
    create(value?: PartialMessage<Mode>): Mode {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.strength = 0;
        message.isoLevel = 0;
        if (value !== undefined)
            reflectionMergePartial<Mode>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Mode): Mode {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.strength = reader.int32();
                    break;
                case  2:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
                    break;
                case  3:
                    message.isoLevel = reader.int32();
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

export const Mode = /*#__PURE__*/ new Mode$Type();
