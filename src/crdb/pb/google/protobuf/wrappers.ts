// @ts-nocheck
// Google protobuf well-known wrapper types
// These are commonly used to wrap primitive values in Any fields

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

// StringValue
export interface StringValue {
    value: string;
}

class StringValue$Type extends MessageType<StringValue> {
    constructor() {
        super("google.protobuf.StringValue", [
            { no: 1, name: "value", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<StringValue>): StringValue {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = "";
        if (value !== undefined)
            reflectionMergePartial<StringValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StringValue): StringValue {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    message.value = reader.string();
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
    internalBinaryWrite(message: StringValue, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        if (message.value !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}

export const StringValue = new StringValue$Type();

// BoolValue
export interface BoolValue {
    value: boolean;
}

class BoolValue$Type extends MessageType<BoolValue> {
    constructor() {
        super("google.protobuf.BoolValue", [
            { no: 1, name: "value", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<BoolValue>): BoolValue {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = false;
        if (value !== undefined)
            reflectionMergePartial<BoolValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BoolValue): BoolValue {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    message.value = reader.bool();
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
    internalBinaryWrite(message: BoolValue, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        if (message.value !== false)
            writer.tag(1, WireType.Varint).bool(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}

export const BoolValue = new BoolValue$Type();

// Int32Value
export interface Int32Value {
    value: number;
}

class Int32Value$Type extends MessageType<Int32Value> {
    constructor() {
        super("google.protobuf.Int32Value", [
            { no: 1, name: "value", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<Int32Value>): Int32Value {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = 0;
        if (value !== undefined)
            reflectionMergePartial<Int32Value>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Int32Value): Int32Value {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    message.value = reader.int32();
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
    internalBinaryWrite(message: Int32Value, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        if (message.value !== 0)
            writer.tag(1, WireType.Varint).int32(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}

export const Int32Value = new Int32Value$Type();

// Int64Value
export interface Int64Value {
    value: bigint;
}

class Int64Value$Type extends MessageType<Int64Value> {
    constructor() {
        super("google.protobuf.Int64Value", [
            { no: 1, name: "value", kind: "scalar", T: 3 /*ScalarType.INT64*/ }
        ]);
    }
    create(value?: PartialMessage<Int64Value>): Int64Value {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = 0n;
        if (value !== undefined)
            reflectionMergePartial<Int64Value>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Int64Value): Int64Value {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    message.value = reader.int64().toBigInt();
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
    internalBinaryWrite(message: Int64Value, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        if (message.value !== 0n)
            writer.tag(1, WireType.Varint).int64(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}

export const Int64Value = new Int64Value$Type();

// UInt32Value
export interface UInt32Value {
    value: number;
}

class UInt32Value$Type extends MessageType<UInt32Value> {
    constructor() {
        super("google.protobuf.UInt32Value", [
            { no: 1, name: "value", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
    create(value?: PartialMessage<UInt32Value>): UInt32Value {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = 0;
        if (value !== undefined)
            reflectionMergePartial<UInt32Value>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UInt32Value): UInt32Value {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    message.value = reader.uint32();
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
    internalBinaryWrite(message: UInt32Value, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        if (message.value !== 0)
            writer.tag(1, WireType.Varint).uint32(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}

export const UInt32Value = new UInt32Value$Type();

// UInt64Value
export interface UInt64Value {
    value: bigint;
}

class UInt64Value$Type extends MessageType<UInt64Value> {
    constructor() {
        super("google.protobuf.UInt64Value", [
            { no: 1, name: "value", kind: "scalar", T: 4 /*ScalarType.UINT64*/ }
        ]);
    }
    create(value?: PartialMessage<UInt64Value>): UInt64Value {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = 0n;
        if (value !== undefined)
            reflectionMergePartial<UInt64Value>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UInt64Value): UInt64Value {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    message.value = reader.uint64().toBigInt();
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
    internalBinaryWrite(message: UInt64Value, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        if (message.value !== 0n)
            writer.tag(1, WireType.Varint).uint64(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}

export const UInt64Value = new UInt64Value$Type();

// FloatValue
export interface FloatValue {
    value: number;
}

class FloatValue$Type extends MessageType<FloatValue> {
    constructor() {
        super("google.protobuf.FloatValue", [
            { no: 1, name: "value", kind: "scalar", T: 2 /*ScalarType.FLOAT*/ }
        ]);
    }
    create(value?: PartialMessage<FloatValue>): FloatValue {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = 0;
        if (value !== undefined)
            reflectionMergePartial<FloatValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FloatValue): FloatValue {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    message.value = reader.float();
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
    internalBinaryWrite(message: FloatValue, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        if (message.value !== 0)
            writer.tag(1, WireType.Bit32).float(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}

export const FloatValue = new FloatValue$Type();

// DoubleValue
export interface DoubleValue {
    value: number;
}

class DoubleValue$Type extends MessageType<DoubleValue> {
    constructor() {
        super("google.protobuf.DoubleValue", [
            { no: 1, name: "value", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
    create(value?: PartialMessage<DoubleValue>): DoubleValue {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = 0;
        if (value !== undefined)
            reflectionMergePartial<DoubleValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DoubleValue): DoubleValue {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    message.value = reader.double();
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
    internalBinaryWrite(message: DoubleValue, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        if (message.value !== 0)
            writer.tag(1, WireType.Bit64).double(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}

export const DoubleValue = new DoubleValue$Type();

// BytesValue
export interface BytesValue {
    value: Uint8Array;
}

class BytesValue$Type extends MessageType<BytesValue> {
    constructor() {
        super("google.protobuf.BytesValue", [
            { no: 1, name: "value", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<BytesValue>): BytesValue {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<BytesValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BytesValue): BytesValue {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
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
    internalBinaryWrite(message: BytesValue, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        if (message.value.length)
            writer.tag(1, WireType.LengthDelimited).bytes(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}

export const BytesValue = new BytesValue$Type();