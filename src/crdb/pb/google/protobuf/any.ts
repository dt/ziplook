// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { isJsonObject } from "@protobuf-ts/runtime";
import { typeofJsonValue } from "@protobuf-ts/runtime";
import type { JsonValue } from "@protobuf-ts/runtime";
import { jsonWriteOptions } from "@protobuf-ts/runtime";
import type { JsonReadOptions } from "@protobuf-ts/runtime";
import type { JsonWriteOptions } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IMessageType } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface Any {

    typeUrl: string;

    value: Uint8Array;
}

class Any$Type extends MessageType<Any> {
    constructor() {
        super("google.protobuf.Any", [
            { no: 1, name: "type_url", kind: "scalar", T: 9  },
            { no: 2, name: "value", kind: "scalar", T: 12  }
        ]);
    }

    pack<T extends object>(message: T, type: IMessageType<T>): Any {
        return {
            typeUrl: this.typeNameToUrl(type.typeName), value: type.toBinary(message),
        };
    }

    unpack<T extends object>(any: Any, type: IMessageType<T>, options?: Partial<BinaryReadOptions>): T {
        if (!this.contains(any, type))
            throw new Error("Cannot unpack google.protobuf.Any with typeUrl '" + any.typeUrl + "' as " + type.typeName + ".");
        return type.fromBinary(any.value, options);
    }

    contains(any: Any, type: IMessageType<any> | string): boolean {
        if (!any.typeUrl.length)
            return false;
        let wants = typeof type == "string" ? type : type.typeName;
        let has = this.typeUrlToName(any.typeUrl);
        return wants === has;
    }

    internalJsonWrite(any: Any, options: JsonWriteOptions): JsonValue {
        if (any.typeUrl === "")
            return {};
        let typeName = this.typeUrlToName(any.typeUrl);
        let opt = jsonWriteOptions(options);
        let type = opt.typeRegistry?.find(t => t.typeName === typeName);
        if (!type)
            return any;
        let value = type.fromBinary(any.value, { readUnknownField: false });
        let json = type.internalJsonWrite(value, opt);
        if (typeName.startsWith("google.protobuf.") || !isJsonObject(json))
            json = { value: json };
        json["@type"] = any.typeUrl;
        return json;
    }

    typeNameToUrl(name: string): string {
        if (!name.length)
            throw new Error("invalid type name: " + name);
        return "type.googleapis.com/" + name;
    }
    typeUrlToName(url: string): string {
        if (!url.length)
            throw new Error("invalid type url: " + url);
        let slash = url.lastIndexOf("/");
        let name = slash > 0 ? url.substring(slash + 1) : url;
        if (!name.length)
            throw new Error("invalid type url: " + url);
        return name;
    }
    create(value?: PartialMessage<Any>): Any {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.typeUrl = "";
        message.value = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<Any>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Any): Any {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.typeUrl = reader.string();
                    break;
                case  2:
                    message.value = reader.bytes();
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

export const Any = /*#__PURE__*/ new Any$Type();
