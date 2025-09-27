// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Duration } from "../../../../google/protobuf/duration";
import { Strength } from "./locking";
import { TxnMeta } from "../../../../storage/enginepb/mvcc3";

export interface Waiter {

    waitingTxn?: TxnMeta;

    activeWaiter: boolean;

    strength: Strength;

    waitDuration?: Duration;
}

class Waiter$Type extends MessageType<Waiter> {
    constructor() {
        super("cockroach.kv.kvserver.concurrency.lock.Waiter", [
            { no: 1, name: "waiting_txn", kind: "message", T: () => TxnMeta },
            { no: 2, name: "active_waiter", kind: "scalar", T: 8  },
            { no: 3, name: "strength", kind: "enum", T: () => ["cockroach.kv.kvserver.concurrency.lock.Strength", Strength] },
            { no: 4, name: "wait_duration", kind: "message", T: () => Duration }
        ]);
    }
    create(value?: PartialMessage<Waiter>): Waiter {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.activeWaiter = false;
        message.strength = 0;
        if (value !== undefined)
            reflectionMergePartial<Waiter>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Waiter): Waiter {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.waitingTxn = TxnMeta.internalBinaryRead(reader, reader.uint32(), options, message.waitingTxn);
                    break;
                case  2:
                    message.activeWaiter = reader.bool();
                    break;
                case  3:
                    message.strength = reader.int32();
                    break;
                case  4:
                    message.waitDuration = Duration.internalBinaryRead(reader, reader.uint32(), options, message.waitDuration);
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

export const Waiter = /*#__PURE__*/ new Waiter$Type();
