// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface Function {
}

export interface Function_Param {
}

export enum Function_Param_Class {

    DEFAULT = 0,

    IN = 1,

    OUT = 2,

    IN_OUT = 3,

    VARIADIC = 4
}

export enum Function_Volatility {

    UNKNOWN_VOLATILITY = 0,

    VOLATILE = 1,

    IMMUTABLE = 2,

    STABLE = 3
}

export enum Function_NullInputBehavior {

    UNKNOWN_NULL_INPUT_BEHAVIOR = 0,

    CALLED_ON_NULL_INPUT = 1,

    RETURNS_NULL_ON_NULL_INPUT = 2,

    STRICT = 3
}

export enum Function_Language {

    UNKNOWN_LANGUAGE = 0,

    SQL = 1,

    PLPGSQL = 2
}

export enum Function_Security {

    INVOKER = 0,

    DEFINER = 1
}

export interface FunctionVolatility {

    volatility?: Function_Volatility;
}

export interface FunctionNullInputBehavior {

    nullInputBehavior?: Function_NullInputBehavior;
}

export interface FunctionLanguage {

    lang?: Function_Language;
}

export interface FunctionParamClass {

    class?: Function_Param_Class;
}

export interface FunctionSecurity {

    security?: Function_Security;
}

class Function$Type extends MessageType<Function> {
    constructor() {
        super("cockroach.sql.catalog.catpb.Function", []);
    }
    create(value?: PartialMessage<Function>): Function {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Function>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Function): Function {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
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

export const Function = /*#__PURE__*/ new Function$Type();

class Function_Param$Type extends MessageType<Function_Param> {
    constructor() {
        super("cockroach.sql.catalog.catpb.Function.Param", []);
    }
    create(value?: PartialMessage<Function_Param>): Function_Param {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Function_Param>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Function_Param): Function_Param {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
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

export const Function_Param = /*#__PURE__*/ new Function_Param$Type();

class FunctionVolatility$Type extends MessageType<FunctionVolatility> {
    constructor() {
        super("cockroach.sql.catalog.catpb.FunctionVolatility", [
            { no: 1, name: "volatility", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.Volatility", Function_Volatility] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<FunctionVolatility>): FunctionVolatility {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FunctionVolatility>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionVolatility): FunctionVolatility {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.volatility = reader.int32();
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

export const FunctionVolatility = /*#__PURE__*/ new FunctionVolatility$Type();

class FunctionNullInputBehavior$Type extends MessageType<FunctionNullInputBehavior> {
    constructor() {
        super("cockroach.sql.catalog.catpb.FunctionNullInputBehavior", [
            { no: 1, name: "nullInputBehavior", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.NullInputBehavior", Function_NullInputBehavior] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<FunctionNullInputBehavior>): FunctionNullInputBehavior {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FunctionNullInputBehavior>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionNullInputBehavior): FunctionNullInputBehavior {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.nullInputBehavior = reader.int32();
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

export const FunctionNullInputBehavior = /*#__PURE__*/ new FunctionNullInputBehavior$Type();

class FunctionLanguage$Type extends MessageType<FunctionLanguage> {
    constructor() {
        super("cockroach.sql.catalog.catpb.FunctionLanguage", [
            { no: 1, name: "lang", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.Language", Function_Language] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<FunctionLanguage>): FunctionLanguage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FunctionLanguage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionLanguage): FunctionLanguage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.lang = reader.int32();
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

export const FunctionLanguage = /*#__PURE__*/ new FunctionLanguage$Type();

class FunctionParamClass$Type extends MessageType<FunctionParamClass> {
    constructor() {
        super("cockroach.sql.catalog.catpb.FunctionParamClass", [
            { no: 1, name: "class", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.Param.Class", Function_Param_Class] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<FunctionParamClass>): FunctionParamClass {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FunctionParamClass>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionParamClass): FunctionParamClass {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.class = reader.int32();
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

export const FunctionParamClass = /*#__PURE__*/ new FunctionParamClass$Type();

class FunctionSecurity$Type extends MessageType<FunctionSecurity> {
    constructor() {
        super("cockroach.sql.catalog.catpb.FunctionSecurity", [
            { no: 1, name: "security", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.Function.Security", Function_Security] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<FunctionSecurity>): FunctionSecurity {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FunctionSecurity>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FunctionSecurity): FunctionSecurity {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.security = reader.int32();
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

export const FunctionSecurity = /*#__PURE__*/ new FunctionSecurity$Type();
