// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface FileDescriptorSet {

    file: FileDescriptorProto[];
}

export interface FileDescriptorProto {

    name?: string;

    package?: string;

    dependency: string[];

    publicDependency: number[];

    weakDependency: number[];

    messageType: DescriptorProto[];

    enumType: EnumDescriptorProto[];

    service: ServiceDescriptorProto[];

    extension: FieldDescriptorProto[];

    options?: FileOptions;

    sourceCodeInfo?: SourceCodeInfo;

    syntax?: string;
}

export interface DescriptorProto {

    name?: string;

    field: FieldDescriptorProto[];

    extension: FieldDescriptorProto[];

    nestedType: DescriptorProto[];

    enumType: EnumDescriptorProto[];

    extensionRange: DescriptorProto_ExtensionRange[];

    oneofDecl: OneofDescriptorProto[];

    options?: MessageOptions;

    reservedRange: DescriptorProto_ReservedRange[];

    reservedName: string[];
}

export interface DescriptorProto_ExtensionRange {

    start?: number;

    end?: number;

    options?: ExtensionRangeOptions;
}

export interface DescriptorProto_ReservedRange {

    start?: number;

    end?: number;
}

export interface ExtensionRangeOptions {

    uninterpretedOption: UninterpretedOption[];
}

export interface FieldDescriptorProto {

    name?: string;

    number?: number;

    label?: FieldDescriptorProto_Label;

    type?: FieldDescriptorProto_Type;

    typeName?: string;

    extendee?: string;

    defaultValue?: string;

    oneofIndex?: number;

    jsonName?: string;

    options?: FieldOptions;
}

export enum FieldDescriptorProto_Type {

    UNSPECIFIED$ = 0,

    DOUBLE = 1,

    FLOAT = 2,

    INT64 = 3,

    UINT64 = 4,

    INT32 = 5,

    FIXED64 = 6,

    FIXED32 = 7,

    BOOL = 8,

    STRING = 9,

    GROUP = 10,

    MESSAGE = 11,

    BYTES = 12,

    UINT32 = 13,

    ENUM = 14,

    SFIXED32 = 15,

    SFIXED64 = 16,

    SINT32 = 17,

    SINT64 = 18
}

export enum FieldDescriptorProto_Label {

    UNSPECIFIED$ = 0,

    OPTIONAL = 1,

    REQUIRED = 2,

    REPEATED = 3
}

export interface OneofDescriptorProto {

    name?: string;

    options?: OneofOptions;
}

export interface EnumDescriptorProto {

    name?: string;

    value: EnumValueDescriptorProto[];

    options?: EnumOptions;

    reservedRange: EnumDescriptorProto_EnumReservedRange[];

    reservedName: string[];
}

export interface EnumDescriptorProto_EnumReservedRange {

    start?: number;

    end?: number;
}

export interface EnumValueDescriptorProto {

    name?: string;

    number?: number;

    options?: EnumValueOptions;
}

export interface ServiceDescriptorProto {

    name?: string;

    method: MethodDescriptorProto[];

    options?: ServiceOptions;
}

export interface MethodDescriptorProto {

    name?: string;

    inputType?: string;

    outputType?: string;

    options?: MethodOptions;

    clientStreaming?: boolean;

    serverStreaming?: boolean;
}

export interface FileOptions {

    javaPackage?: string;

    javaOuterClassname?: string;

    javaMultipleFiles?: boolean;

    javaGenerateEqualsAndHash?: boolean;

    javaStringCheckUtf8?: boolean;

    optimizeFor?: FileOptions_OptimizeMode;

    goPackage?: string;

    ccGenericServices?: boolean;

    javaGenericServices?: boolean;

    pyGenericServices?: boolean;

    phpGenericServices?: boolean;

    deprecated?: boolean;

    ccEnableArenas?: boolean;

    objcClassPrefix?: string;

    csharpNamespace?: string;

    swiftPrefix?: string;

    phpClassPrefix?: string;

    phpNamespace?: string;

    phpMetadataNamespace?: string;

    rubyPackage?: string;

    uninterpretedOption: UninterpretedOption[];
}

export enum FileOptions_OptimizeMode {

    UNSPECIFIED$ = 0,

    SPEED = 1,

    CODE_SIZE = 2,

    LITE_RUNTIME = 3
}

export interface MessageOptions {

    messageSetWireFormat?: boolean;

    noStandardDescriptorAccessor?: boolean;

    deprecated?: boolean;

    mapEntry?: boolean;

    uninterpretedOption: UninterpretedOption[];
}

export interface FieldOptions {

    ctype?: FieldOptions_CType;

    packed?: boolean;

    jstype?: FieldOptions_JSType;

    lazy?: boolean;

    deprecated?: boolean;

    weak?: boolean;

    uninterpretedOption: UninterpretedOption[];
}

export enum FieldOptions_CType {

    STRING = 0,

    CORD = 1,

    STRING_PIECE = 2
}

export enum FieldOptions_JSType {

    JS_NORMAL = 0,

    JS_STRING = 1,

    JS_NUMBER = 2
}

export interface OneofOptions {

    uninterpretedOption: UninterpretedOption[];
}

export interface EnumOptions {

    allowAlias?: boolean;

    deprecated?: boolean;

    uninterpretedOption: UninterpretedOption[];
}

export interface EnumValueOptions {

    deprecated?: boolean;

    uninterpretedOption: UninterpretedOption[];
}

export interface ServiceOptions {

    deprecated?: boolean;

    uninterpretedOption: UninterpretedOption[];
}

export interface MethodOptions {

    deprecated?: boolean;

    idempotencyLevel?: MethodOptions_IdempotencyLevel;

    uninterpretedOption: UninterpretedOption[];
}

export enum MethodOptions_IdempotencyLevel {

    IDEMPOTENCY_UNKNOWN = 0,

    NO_SIDE_EFFECTS = 1,

    IDEMPOTENT = 2
}

export interface UninterpretedOption {

    name: UninterpretedOption_NamePart[];

    identifierValue?: string;

    positiveIntValue?: bigint;

    negativeIntValue?: bigint;

    doubleValue?: number;

    stringValue?: Uint8Array;

    aggregateValue?: string;
}

export interface UninterpretedOption_NamePart {

    namePart: string;

    isExtension: boolean;
}

export interface SourceCodeInfo {

    location: SourceCodeInfo_Location[];
}

export interface SourceCodeInfo_Location {

    path: number[];

    span: number[];

    leadingComments?: string;

    trailingComments?: string;

    leadingDetachedComments: string[];
}

export interface GeneratedCodeInfo {

    annotation: GeneratedCodeInfo_Annotation[];
}

export interface GeneratedCodeInfo_Annotation {

    path: number[];

    sourceFile?: string;

    begin?: number;

    end?: number;
}

class FileDescriptorSet$Type extends MessageType<FileDescriptorSet> {
    constructor() {
        super("google.protobuf.FileDescriptorSet", [
            { no: 1, name: "file", kind: "message", repeat: 2 , T: () => FileDescriptorProto }
        ]);
    }
    create(value?: PartialMessage<FileDescriptorSet>): FileDescriptorSet {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.file = [];
        if (value !== undefined)
            reflectionMergePartial<FileDescriptorSet>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FileDescriptorSet): FileDescriptorSet {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.file.push(FileDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
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

export const FileDescriptorSet = /*#__PURE__*/ new FileDescriptorSet$Type();

class FileDescriptorProto$Type extends MessageType<FileDescriptorProto> {
    constructor() {
        super("google.protobuf.FileDescriptorProto", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "package", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "dependency", kind: "scalar", repeat: 2 , T: 9  },
            { no: 10, name: "public_dependency", kind: "scalar", repeat: 2 , T: 5  },
            { no: 11, name: "weak_dependency", kind: "scalar", repeat: 2 , T: 5  },
            { no: 4, name: "message_type", kind: "message", repeat: 2 , T: () => DescriptorProto },
            { no: 5, name: "enum_type", kind: "message", repeat: 2 , T: () => EnumDescriptorProto },
            { no: 6, name: "service", kind: "message", repeat: 2 , T: () => ServiceDescriptorProto },
            { no: 7, name: "extension", kind: "message", repeat: 2 , T: () => FieldDescriptorProto },
            { no: 8, name: "options", kind: "message", T: () => FileOptions },
            { no: 9, name: "source_code_info", kind: "message", T: () => SourceCodeInfo },
            { no: 12, name: "syntax", kind: "scalar", opt: true, T: 9  }
        ]);
    }
    create(value?: PartialMessage<FileDescriptorProto>): FileDescriptorProto {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.dependency = [];
        message.publicDependency = [];
        message.weakDependency = [];
        message.messageType = [];
        message.enumType = [];
        message.service = [];
        message.extension = [];
        if (value !== undefined)
            reflectionMergePartial<FileDescriptorProto>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FileDescriptorProto): FileDescriptorProto {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.package = reader.string();
                    break;
                case  3:
                    message.dependency.push(reader.string());
                    break;
                case  10:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.publicDependency.push(reader.int32());
                    else
                        message.publicDependency.push(reader.int32());
                    break;
                case  11:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.weakDependency.push(reader.int32());
                    else
                        message.weakDependency.push(reader.int32());
                    break;
                case  4:
                    message.messageType.push(DescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    message.enumType.push(EnumDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.service.push(ServiceDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.extension.push(FieldDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  8:
                    message.options = FileOptions.internalBinaryRead(reader, reader.uint32(), options, message.options);
                    break;
                case  9:
                    message.sourceCodeInfo = SourceCodeInfo.internalBinaryRead(reader, reader.uint32(), options, message.sourceCodeInfo);
                    break;
                case  12:
                    message.syntax = reader.string();
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

export const FileDescriptorProto = /*#__PURE__*/ new FileDescriptorProto$Type();

class DescriptorProto$Type extends MessageType<DescriptorProto> {
    constructor() {
        super("google.protobuf.DescriptorProto", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "field", kind: "message", repeat: 2 , T: () => FieldDescriptorProto },
            { no: 6, name: "extension", kind: "message", repeat: 2 , T: () => FieldDescriptorProto },
            { no: 3, name: "nested_type", kind: "message", repeat: 2 , T: () => DescriptorProto },
            { no: 4, name: "enum_type", kind: "message", repeat: 2 , T: () => EnumDescriptorProto },
            { no: 5, name: "extension_range", kind: "message", repeat: 2 , T: () => DescriptorProto_ExtensionRange },
            { no: 8, name: "oneof_decl", kind: "message", repeat: 2 , T: () => OneofDescriptorProto },
            { no: 7, name: "options", kind: "message", T: () => MessageOptions },
            { no: 9, name: "reserved_range", kind: "message", repeat: 2 , T: () => DescriptorProto_ReservedRange },
            { no: 10, name: "reserved_name", kind: "scalar", repeat: 2 , T: 9  }
        ]);
    }
    create(value?: PartialMessage<DescriptorProto>): DescriptorProto {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.field = [];
        message.extension = [];
        message.nestedType = [];
        message.enumType = [];
        message.extensionRange = [];
        message.oneofDecl = [];
        message.reservedRange = [];
        message.reservedName = [];
        if (value !== undefined)
            reflectionMergePartial<DescriptorProto>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DescriptorProto): DescriptorProto {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.field.push(FieldDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  6:
                    message.extension.push(FieldDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.nestedType.push(DescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    message.enumType.push(EnumDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    message.extensionRange.push(DescriptorProto_ExtensionRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  8:
                    message.oneofDecl.push(OneofDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  7:
                    message.options = MessageOptions.internalBinaryRead(reader, reader.uint32(), options, message.options);
                    break;
                case  9:
                    message.reservedRange.push(DescriptorProto_ReservedRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  10:
                    message.reservedName.push(reader.string());
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

export const DescriptorProto = /*#__PURE__*/ new DescriptorProto$Type();

class DescriptorProto_ExtensionRange$Type extends MessageType<DescriptorProto_ExtensionRange> {
    constructor() {
        super("google.protobuf.DescriptorProto.ExtensionRange", [
            { no: 1, name: "start", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "end", kind: "scalar", opt: true, T: 5  },
            { no: 3, name: "options", kind: "message", T: () => ExtensionRangeOptions }
        ]);
    }
    create(value?: PartialMessage<DescriptorProto_ExtensionRange>): DescriptorProto_ExtensionRange {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<DescriptorProto_ExtensionRange>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DescriptorProto_ExtensionRange): DescriptorProto_ExtensionRange {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.start = reader.int32();
                    break;
                case  2:
                    message.end = reader.int32();
                    break;
                case  3:
                    message.options = ExtensionRangeOptions.internalBinaryRead(reader, reader.uint32(), options, message.options);
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

export const DescriptorProto_ExtensionRange = /*#__PURE__*/ new DescriptorProto_ExtensionRange$Type();

class DescriptorProto_ReservedRange$Type extends MessageType<DescriptorProto_ReservedRange> {
    constructor() {
        super("google.protobuf.DescriptorProto.ReservedRange", [
            { no: 1, name: "start", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "end", kind: "scalar", opt: true, T: 5  }
        ]);
    }
    create(value?: PartialMessage<DescriptorProto_ReservedRange>): DescriptorProto_ReservedRange {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<DescriptorProto_ReservedRange>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DescriptorProto_ReservedRange): DescriptorProto_ReservedRange {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.start = reader.int32();
                    break;
                case  2:
                    message.end = reader.int32();
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

export const DescriptorProto_ReservedRange = /*#__PURE__*/ new DescriptorProto_ReservedRange$Type();

class ExtensionRangeOptions$Type extends MessageType<ExtensionRangeOptions> {
    constructor() {
        super("google.protobuf.ExtensionRangeOptions", [
            { no: 999, name: "uninterpreted_option", kind: "message", repeat: 2 , T: () => UninterpretedOption }
        ]);
    }
    create(value?: PartialMessage<ExtensionRangeOptions>): ExtensionRangeOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uninterpretedOption = [];
        if (value !== undefined)
            reflectionMergePartial<ExtensionRangeOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExtensionRangeOptions): ExtensionRangeOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  999:
                    message.uninterpretedOption.push(UninterpretedOption.internalBinaryRead(reader, reader.uint32(), options));
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

export const ExtensionRangeOptions = /*#__PURE__*/ new ExtensionRangeOptions$Type();

class FieldDescriptorProto$Type extends MessageType<FieldDescriptorProto> {
    constructor() {
        super("google.protobuf.FieldDescriptorProto", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "number", kind: "scalar", opt: true, T: 5  },
            { no: 4, name: "label", kind: "enum", opt: true, T: () => ["google.protobuf.FieldDescriptorProto.Label", FieldDescriptorProto_Label, "LABEL_"] },
            { no: 5, name: "type", kind: "enum", opt: true, T: () => ["google.protobuf.FieldDescriptorProto.Type", FieldDescriptorProto_Type, "TYPE_"] },
            { no: 6, name: "type_name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "extendee", kind: "scalar", opt: true, T: 9  },
            { no: 7, name: "default_value", kind: "scalar", opt: true, T: 9  },
            { no: 9, name: "oneof_index", kind: "scalar", opt: true, T: 5  },
            { no: 10, name: "json_name", kind: "scalar", opt: true, T: 9  },
            { no: 8, name: "options", kind: "message", T: () => FieldOptions }
        ]);
    }
    create(value?: PartialMessage<FieldDescriptorProto>): FieldDescriptorProto {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FieldDescriptorProto>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FieldDescriptorProto): FieldDescriptorProto {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  3:
                    message.number = reader.int32();
                    break;
                case  4:
                    message.label = reader.int32();
                    break;
                case  5:
                    message.type = reader.int32();
                    break;
                case  6:
                    message.typeName = reader.string();
                    break;
                case  2:
                    message.extendee = reader.string();
                    break;
                case  7:
                    message.defaultValue = reader.string();
                    break;
                case  9:
                    message.oneofIndex = reader.int32();
                    break;
                case  10:
                    message.jsonName = reader.string();
                    break;
                case  8:
                    message.options = FieldOptions.internalBinaryRead(reader, reader.uint32(), options, message.options);
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

export const FieldDescriptorProto = /*#__PURE__*/ new FieldDescriptorProto$Type();

class OneofDescriptorProto$Type extends MessageType<OneofDescriptorProto> {
    constructor() {
        super("google.protobuf.OneofDescriptorProto", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "options", kind: "message", T: () => OneofOptions }
        ]);
    }
    create(value?: PartialMessage<OneofDescriptorProto>): OneofDescriptorProto {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<OneofDescriptorProto>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OneofDescriptorProto): OneofDescriptorProto {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.options = OneofOptions.internalBinaryRead(reader, reader.uint32(), options, message.options);
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

export const OneofDescriptorProto = /*#__PURE__*/ new OneofDescriptorProto$Type();

class EnumDescriptorProto$Type extends MessageType<EnumDescriptorProto> {
    constructor() {
        super("google.protobuf.EnumDescriptorProto", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "value", kind: "message", repeat: 2 , T: () => EnumValueDescriptorProto },
            { no: 3, name: "options", kind: "message", T: () => EnumOptions },
            { no: 4, name: "reserved_range", kind: "message", repeat: 2 , T: () => EnumDescriptorProto_EnumReservedRange },
            { no: 5, name: "reserved_name", kind: "scalar", repeat: 2 , T: 9  }
        ]);
    }
    create(value?: PartialMessage<EnumDescriptorProto>): EnumDescriptorProto {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.value = [];
        message.reservedRange = [];
        message.reservedName = [];
        if (value !== undefined)
            reflectionMergePartial<EnumDescriptorProto>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EnumDescriptorProto): EnumDescriptorProto {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.value.push(EnumValueDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.options = EnumOptions.internalBinaryRead(reader, reader.uint32(), options, message.options);
                    break;
                case  4:
                    message.reservedRange.push(EnumDescriptorProto_EnumReservedRange.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  5:
                    message.reservedName.push(reader.string());
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

export const EnumDescriptorProto = /*#__PURE__*/ new EnumDescriptorProto$Type();

class EnumDescriptorProto_EnumReservedRange$Type extends MessageType<EnumDescriptorProto_EnumReservedRange> {
    constructor() {
        super("google.protobuf.EnumDescriptorProto.EnumReservedRange", [
            { no: 1, name: "start", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "end", kind: "scalar", opt: true, T: 5  }
        ]);
    }
    create(value?: PartialMessage<EnumDescriptorProto_EnumReservedRange>): EnumDescriptorProto_EnumReservedRange {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<EnumDescriptorProto_EnumReservedRange>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EnumDescriptorProto_EnumReservedRange): EnumDescriptorProto_EnumReservedRange {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.start = reader.int32();
                    break;
                case  2:
                    message.end = reader.int32();
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

export const EnumDescriptorProto_EnumReservedRange = /*#__PURE__*/ new EnumDescriptorProto_EnumReservedRange$Type();

class EnumValueDescriptorProto$Type extends MessageType<EnumValueDescriptorProto> {
    constructor() {
        super("google.protobuf.EnumValueDescriptorProto", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "number", kind: "scalar", opt: true, T: 5  },
            { no: 3, name: "options", kind: "message", T: () => EnumValueOptions }
        ]);
    }
    create(value?: PartialMessage<EnumValueDescriptorProto>): EnumValueDescriptorProto {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<EnumValueDescriptorProto>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EnumValueDescriptorProto): EnumValueDescriptorProto {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.number = reader.int32();
                    break;
                case  3:
                    message.options = EnumValueOptions.internalBinaryRead(reader, reader.uint32(), options, message.options);
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

export const EnumValueDescriptorProto = /*#__PURE__*/ new EnumValueDescriptorProto$Type();

class ServiceDescriptorProto$Type extends MessageType<ServiceDescriptorProto> {
    constructor() {
        super("google.protobuf.ServiceDescriptorProto", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "method", kind: "message", repeat: 2 , T: () => MethodDescriptorProto },
            { no: 3, name: "options", kind: "message", T: () => ServiceOptions }
        ]);
    }
    create(value?: PartialMessage<ServiceDescriptorProto>): ServiceDescriptorProto {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.method = [];
        if (value !== undefined)
            reflectionMergePartial<ServiceDescriptorProto>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ServiceDescriptorProto): ServiceDescriptorProto {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.method.push(MethodDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.options = ServiceOptions.internalBinaryRead(reader, reader.uint32(), options, message.options);
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

export const ServiceDescriptorProto = /*#__PURE__*/ new ServiceDescriptorProto$Type();

class MethodDescriptorProto$Type extends MessageType<MethodDescriptorProto> {
    constructor() {
        super("google.protobuf.MethodDescriptorProto", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "input_type", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "output_type", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "options", kind: "message", T: () => MethodOptions },
            { no: 5, name: "client_streaming", kind: "scalar", opt: true, T: 8  },
            { no: 6, name: "server_streaming", kind: "scalar", opt: true, T: 8  }
        ]);
    }
    create(value?: PartialMessage<MethodDescriptorProto>): MethodDescriptorProto {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MethodDescriptorProto>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MethodDescriptorProto): MethodDescriptorProto {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.inputType = reader.string();
                    break;
                case  3:
                    message.outputType = reader.string();
                    break;
                case  4:
                    message.options = MethodOptions.internalBinaryRead(reader, reader.uint32(), options, message.options);
                    break;
                case  5:
                    message.clientStreaming = reader.bool();
                    break;
                case  6:
                    message.serverStreaming = reader.bool();
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

export const MethodDescriptorProto = /*#__PURE__*/ new MethodDescriptorProto$Type();

class FileOptions$Type extends MessageType<FileOptions> {
    constructor() {
        super("google.protobuf.FileOptions", [
            { no: 1, name: "java_package", kind: "scalar", opt: true, T: 9  },
            { no: 8, name: "java_outer_classname", kind: "scalar", opt: true, T: 9  },
            { no: 10, name: "java_multiple_files", kind: "scalar", opt: true, T: 8  },
            { no: 20, name: "java_generate_equals_and_hash", kind: "scalar", opt: true, T: 8  },
            { no: 27, name: "java_string_check_utf8", kind: "scalar", opt: true, T: 8  },
            { no: 9, name: "optimize_for", kind: "enum", opt: true, T: () => ["google.protobuf.FileOptions.OptimizeMode", FileOptions_OptimizeMode] },
            { no: 11, name: "go_package", kind: "scalar", opt: true, T: 9  },
            { no: 16, name: "cc_generic_services", kind: "scalar", opt: true, T: 8  },
            { no: 17, name: "java_generic_services", kind: "scalar", opt: true, T: 8  },
            { no: 18, name: "py_generic_services", kind: "scalar", opt: true, T: 8  },
            { no: 42, name: "php_generic_services", kind: "scalar", opt: true, T: 8  },
            { no: 23, name: "deprecated", kind: "scalar", opt: true, T: 8  },
            { no: 31, name: "cc_enable_arenas", kind: "scalar", opt: true, T: 8  },
            { no: 36, name: "objc_class_prefix", kind: "scalar", opt: true, T: 9  },
            { no: 37, name: "csharp_namespace", kind: "scalar", opt: true, T: 9  },
            { no: 39, name: "swift_prefix", kind: "scalar", opt: true, T: 9  },
            { no: 40, name: "php_class_prefix", kind: "scalar", opt: true, T: 9  },
            { no: 41, name: "php_namespace", kind: "scalar", opt: true, T: 9  },
            { no: 44, name: "php_metadata_namespace", kind: "scalar", opt: true, T: 9  },
            { no: 45, name: "ruby_package", kind: "scalar", opt: true, T: 9  },
            { no: 999, name: "uninterpreted_option", kind: "message", repeat: 2 , T: () => UninterpretedOption }
        ]);
    }
    create(value?: PartialMessage<FileOptions>): FileOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uninterpretedOption = [];
        if (value !== undefined)
            reflectionMergePartial<FileOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FileOptions): FileOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.javaPackage = reader.string();
                    break;
                case  8:
                    message.javaOuterClassname = reader.string();
                    break;
                case  10:
                    message.javaMultipleFiles = reader.bool();
                    break;
                case  20:
                    message.javaGenerateEqualsAndHash = reader.bool();
                    break;
                case  27:
                    message.javaStringCheckUtf8 = reader.bool();
                    break;
                case  9:
                    message.optimizeFor = reader.int32();
                    break;
                case  11:
                    message.goPackage = reader.string();
                    break;
                case  16:
                    message.ccGenericServices = reader.bool();
                    break;
                case  17:
                    message.javaGenericServices = reader.bool();
                    break;
                case  18:
                    message.pyGenericServices = reader.bool();
                    break;
                case  42:
                    message.phpGenericServices = reader.bool();
                    break;
                case  23:
                    message.deprecated = reader.bool();
                    break;
                case  31:
                    message.ccEnableArenas = reader.bool();
                    break;
                case  36:
                    message.objcClassPrefix = reader.string();
                    break;
                case  37:
                    message.csharpNamespace = reader.string();
                    break;
                case  39:
                    message.swiftPrefix = reader.string();
                    break;
                case  40:
                    message.phpClassPrefix = reader.string();
                    break;
                case  41:
                    message.phpNamespace = reader.string();
                    break;
                case  44:
                    message.phpMetadataNamespace = reader.string();
                    break;
                case  45:
                    message.rubyPackage = reader.string();
                    break;
                case  999:
                    message.uninterpretedOption.push(UninterpretedOption.internalBinaryRead(reader, reader.uint32(), options));
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

export const FileOptions = /*#__PURE__*/ new FileOptions$Type();

class MessageOptions$Type extends MessageType<MessageOptions> {
    constructor() {
        super("google.protobuf.MessageOptions", [
            { no: 1, name: "message_set_wire_format", kind: "scalar", opt: true, T: 8  },
            { no: 2, name: "no_standard_descriptor_accessor", kind: "scalar", opt: true, T: 8  },
            { no: 3, name: "deprecated", kind: "scalar", opt: true, T: 8  },
            { no: 7, name: "map_entry", kind: "scalar", opt: true, T: 8  },
            { no: 999, name: "uninterpreted_option", kind: "message", repeat: 2 , T: () => UninterpretedOption }
        ]);
    }
    create(value?: PartialMessage<MessageOptions>): MessageOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uninterpretedOption = [];
        if (value !== undefined)
            reflectionMergePartial<MessageOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MessageOptions): MessageOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.messageSetWireFormat = reader.bool();
                    break;
                case  2:
                    message.noStandardDescriptorAccessor = reader.bool();
                    break;
                case  3:
                    message.deprecated = reader.bool();
                    break;
                case  7:
                    message.mapEntry = reader.bool();
                    break;
                case  999:
                    message.uninterpretedOption.push(UninterpretedOption.internalBinaryRead(reader, reader.uint32(), options));
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

export const MessageOptions = /*#__PURE__*/ new MessageOptions$Type();

class FieldOptions$Type extends MessageType<FieldOptions> {
    constructor() {
        super("google.protobuf.FieldOptions", [
            { no: 1, name: "ctype", kind: "enum", opt: true, T: () => ["google.protobuf.FieldOptions.CType", FieldOptions_CType] },
            { no: 2, name: "packed", kind: "scalar", opt: true, T: 8  },
            { no: 6, name: "jstype", kind: "enum", opt: true, T: () => ["google.protobuf.FieldOptions.JSType", FieldOptions_JSType] },
            { no: 5, name: "lazy", kind: "scalar", opt: true, T: 8  },
            { no: 3, name: "deprecated", kind: "scalar", opt: true, T: 8  },
            { no: 10, name: "weak", kind: "scalar", opt: true, T: 8  },
            { no: 999, name: "uninterpreted_option", kind: "message", repeat: 2 , T: () => UninterpretedOption }
        ]);
    }
    create(value?: PartialMessage<FieldOptions>): FieldOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uninterpretedOption = [];
        if (value !== undefined)
            reflectionMergePartial<FieldOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FieldOptions): FieldOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.ctype = reader.int32();
                    break;
                case  2:
                    message.packed = reader.bool();
                    break;
                case  6:
                    message.jstype = reader.int32();
                    break;
                case  5:
                    message.lazy = reader.bool();
                    break;
                case  3:
                    message.deprecated = reader.bool();
                    break;
                case  10:
                    message.weak = reader.bool();
                    break;
                case  999:
                    message.uninterpretedOption.push(UninterpretedOption.internalBinaryRead(reader, reader.uint32(), options));
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

export const FieldOptions = /*#__PURE__*/ new FieldOptions$Type();

class OneofOptions$Type extends MessageType<OneofOptions> {
    constructor() {
        super("google.protobuf.OneofOptions", [
            { no: 999, name: "uninterpreted_option", kind: "message", repeat: 2 , T: () => UninterpretedOption }
        ]);
    }
    create(value?: PartialMessage<OneofOptions>): OneofOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uninterpretedOption = [];
        if (value !== undefined)
            reflectionMergePartial<OneofOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OneofOptions): OneofOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  999:
                    message.uninterpretedOption.push(UninterpretedOption.internalBinaryRead(reader, reader.uint32(), options));
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

export const OneofOptions = /*#__PURE__*/ new OneofOptions$Type();

class EnumOptions$Type extends MessageType<EnumOptions> {
    constructor() {
        super("google.protobuf.EnumOptions", [
            { no: 2, name: "allow_alias", kind: "scalar", opt: true, T: 8  },
            { no: 3, name: "deprecated", kind: "scalar", opt: true, T: 8  },
            { no: 999, name: "uninterpreted_option", kind: "message", repeat: 2 , T: () => UninterpretedOption }
        ]);
    }
    create(value?: PartialMessage<EnumOptions>): EnumOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uninterpretedOption = [];
        if (value !== undefined)
            reflectionMergePartial<EnumOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EnumOptions): EnumOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.allowAlias = reader.bool();
                    break;
                case  3:
                    message.deprecated = reader.bool();
                    break;
                case  999:
                    message.uninterpretedOption.push(UninterpretedOption.internalBinaryRead(reader, reader.uint32(), options));
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

export const EnumOptions = /*#__PURE__*/ new EnumOptions$Type();

class EnumValueOptions$Type extends MessageType<EnumValueOptions> {
    constructor() {
        super("google.protobuf.EnumValueOptions", [
            { no: 1, name: "deprecated", kind: "scalar", opt: true, T: 8  },
            { no: 999, name: "uninterpreted_option", kind: "message", repeat: 2 , T: () => UninterpretedOption }
        ]);
    }
    create(value?: PartialMessage<EnumValueOptions>): EnumValueOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uninterpretedOption = [];
        if (value !== undefined)
            reflectionMergePartial<EnumValueOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EnumValueOptions): EnumValueOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.deprecated = reader.bool();
                    break;
                case  999:
                    message.uninterpretedOption.push(UninterpretedOption.internalBinaryRead(reader, reader.uint32(), options));
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

export const EnumValueOptions = /*#__PURE__*/ new EnumValueOptions$Type();

class ServiceOptions$Type extends MessageType<ServiceOptions> {
    constructor() {
        super("google.protobuf.ServiceOptions", [
            { no: 33, name: "deprecated", kind: "scalar", opt: true, T: 8  },
            { no: 999, name: "uninterpreted_option", kind: "message", repeat: 2 , T: () => UninterpretedOption }
        ]);
    }
    create(value?: PartialMessage<ServiceOptions>): ServiceOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uninterpretedOption = [];
        if (value !== undefined)
            reflectionMergePartial<ServiceOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ServiceOptions): ServiceOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  33:
                    message.deprecated = reader.bool();
                    break;
                case  999:
                    message.uninterpretedOption.push(UninterpretedOption.internalBinaryRead(reader, reader.uint32(), options));
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

export const ServiceOptions = /*#__PURE__*/ new ServiceOptions$Type();

class MethodOptions$Type extends MessageType<MethodOptions> {
    constructor() {
        super("google.protobuf.MethodOptions", [
            { no: 33, name: "deprecated", kind: "scalar", opt: true, T: 8  },
            { no: 34, name: "idempotency_level", kind: "enum", opt: true, T: () => ["google.protobuf.MethodOptions.IdempotencyLevel", MethodOptions_IdempotencyLevel] },
            { no: 999, name: "uninterpreted_option", kind: "message", repeat: 2 , T: () => UninterpretedOption }
        ]);
    }
    create(value?: PartialMessage<MethodOptions>): MethodOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.uninterpretedOption = [];
        if (value !== undefined)
            reflectionMergePartial<MethodOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MethodOptions): MethodOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  33:
                    message.deprecated = reader.bool();
                    break;
                case  34:
                    message.idempotencyLevel = reader.int32();
                    break;
                case  999:
                    message.uninterpretedOption.push(UninterpretedOption.internalBinaryRead(reader, reader.uint32(), options));
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

export const MethodOptions = /*#__PURE__*/ new MethodOptions$Type();

class UninterpretedOption$Type extends MessageType<UninterpretedOption> {
    constructor() {
        super("google.protobuf.UninterpretedOption", [
            { no: 2, name: "name", kind: "message", repeat: 2 , T: () => UninterpretedOption_NamePart },
            { no: 3, name: "identifier_value", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "positive_int_value", kind: "scalar", opt: true, T: 4 , L: 0  },
            { no: 5, name: "negative_int_value", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 6, name: "double_value", kind: "scalar", opt: true, T: 1  },
            { no: 7, name: "string_value", kind: "scalar", opt: true, T: 12  },
            { no: 8, name: "aggregate_value", kind: "scalar", opt: true, T: 9  }
        ]);
    }
    create(value?: PartialMessage<UninterpretedOption>): UninterpretedOption {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = [];
        if (value !== undefined)
            reflectionMergePartial<UninterpretedOption>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UninterpretedOption): UninterpretedOption {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.name.push(UninterpretedOption_NamePart.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.identifierValue = reader.string();
                    break;
                case  4:
                    message.positiveIntValue = reader.uint64().toBigInt();
                    break;
                case  5:
                    message.negativeIntValue = reader.int64().toBigInt();
                    break;
                case  6:
                    message.doubleValue = reader.double();
                    break;
                case  7:
                    message.stringValue = reader.bytes();
                    break;
                case  8:
                    message.aggregateValue = reader.string();
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

export const UninterpretedOption = /*#__PURE__*/ new UninterpretedOption$Type();

class UninterpretedOption_NamePart$Type extends MessageType<UninterpretedOption_NamePart> {
    constructor() {
        super("google.protobuf.UninterpretedOption.NamePart", [
            { no: 1, name: "name_part", kind: "scalar", T: 9  },
            { no: 2, name: "is_extension", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<UninterpretedOption_NamePart>): UninterpretedOption_NamePart {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.namePart = "";
        message.isExtension = false;
        if (value !== undefined)
            reflectionMergePartial<UninterpretedOption_NamePart>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UninterpretedOption_NamePart): UninterpretedOption_NamePart {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.namePart = reader.string();
                    break;
                case  2:
                    message.isExtension = reader.bool();
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

export const UninterpretedOption_NamePart = /*#__PURE__*/ new UninterpretedOption_NamePart$Type();

class SourceCodeInfo$Type extends MessageType<SourceCodeInfo> {
    constructor() {
        super("google.protobuf.SourceCodeInfo", [
            { no: 1, name: "location", kind: "message", repeat: 2 , T: () => SourceCodeInfo_Location }
        ]);
    }
    create(value?: PartialMessage<SourceCodeInfo>): SourceCodeInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.location = [];
        if (value !== undefined)
            reflectionMergePartial<SourceCodeInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SourceCodeInfo): SourceCodeInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.location.push(SourceCodeInfo_Location.internalBinaryRead(reader, reader.uint32(), options));
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

export const SourceCodeInfo = /*#__PURE__*/ new SourceCodeInfo$Type();

class SourceCodeInfo_Location$Type extends MessageType<SourceCodeInfo_Location> {
    constructor() {
        super("google.protobuf.SourceCodeInfo.Location", [
            { no: 1, name: "path", kind: "scalar", repeat: 1 , T: 5  },
            { no: 2, name: "span", kind: "scalar", repeat: 1 , T: 5  },
            { no: 3, name: "leading_comments", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "trailing_comments", kind: "scalar", opt: true, T: 9  },
            { no: 6, name: "leading_detached_comments", kind: "scalar", repeat: 2 , T: 9  }
        ]);
    }
    create(value?: PartialMessage<SourceCodeInfo_Location>): SourceCodeInfo_Location {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.path = [];
        message.span = [];
        message.leadingDetachedComments = [];
        if (value !== undefined)
            reflectionMergePartial<SourceCodeInfo_Location>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SourceCodeInfo_Location): SourceCodeInfo_Location {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.path.push(reader.int32());
                    else
                        message.path.push(reader.int32());
                    break;
                case  2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.span.push(reader.int32());
                    else
                        message.span.push(reader.int32());
                    break;
                case  3:
                    message.leadingComments = reader.string();
                    break;
                case  4:
                    message.trailingComments = reader.string();
                    break;
                case  6:
                    message.leadingDetachedComments.push(reader.string());
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

export const SourceCodeInfo_Location = /*#__PURE__*/ new SourceCodeInfo_Location$Type();

class GeneratedCodeInfo$Type extends MessageType<GeneratedCodeInfo> {
    constructor() {
        super("google.protobuf.GeneratedCodeInfo", [
            { no: 1, name: "annotation", kind: "message", repeat: 2 , T: () => GeneratedCodeInfo_Annotation }
        ]);
    }
    create(value?: PartialMessage<GeneratedCodeInfo>): GeneratedCodeInfo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.annotation = [];
        if (value !== undefined)
            reflectionMergePartial<GeneratedCodeInfo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GeneratedCodeInfo): GeneratedCodeInfo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.annotation.push(GeneratedCodeInfo_Annotation.internalBinaryRead(reader, reader.uint32(), options));
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

export const GeneratedCodeInfo = /*#__PURE__*/ new GeneratedCodeInfo$Type();

class GeneratedCodeInfo_Annotation$Type extends MessageType<GeneratedCodeInfo_Annotation> {
    constructor() {
        super("google.protobuf.GeneratedCodeInfo.Annotation", [
            { no: 1, name: "path", kind: "scalar", repeat: 1 , T: 5  },
            { no: 2, name: "source_file", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "begin", kind: "scalar", opt: true, T: 5  },
            { no: 4, name: "end", kind: "scalar", opt: true, T: 5  }
        ]);
    }
    create(value?: PartialMessage<GeneratedCodeInfo_Annotation>): GeneratedCodeInfo_Annotation {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.path = [];
        if (value !== undefined)
            reflectionMergePartial<GeneratedCodeInfo_Annotation>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GeneratedCodeInfo_Annotation): GeneratedCodeInfo_Annotation {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.path.push(reader.int32());
                    else
                        message.path.push(reader.int32());
                    break;
                case  2:
                    message.sourceFile = reader.string();
                    break;
                case  3:
                    message.begin = reader.int32();
                    break;
                case  4:
                    message.end = reader.int32();
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

export const GeneratedCodeInfo_Annotation = /*#__PURE__*/ new GeneratedCodeInfo_Annotation$Type();
