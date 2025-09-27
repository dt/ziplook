// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface DateStyle {

    style: Style;

    order: Order;
}

export enum Order {

    MDY = 0,

    DMY = 1,

    YMD = 2
}

export enum Style {

    ISO = 0,

    SQL = 1,

    POSTGRES = 2,

    GERMAN = 3
}

class DateStyle$Type extends MessageType<DateStyle> {
    constructor() {
        super("cockroach.util.timeutil.pgdate.DateStyle", [
            { no: 1, name: "style", kind: "enum", T: () => ["cockroach.util.timeutil.pgdate.Style", Style] },
            { no: 2, name: "order", kind: "enum", T: () => ["cockroach.util.timeutil.pgdate.Order", Order] }
        ]);
    }
    create(value?: PartialMessage<DateStyle>): DateStyle {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.style = 0;
        message.order = 0;
        if (value !== undefined)
            reflectionMergePartial<DateStyle>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DateStyle): DateStyle {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.style = reader.int32();
                    break;
                case  2:
                    message.order = reader.int32();
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

export const DateStyle = /*#__PURE__*/ new DateStyle$Type();
