// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType as MessageType$ } from "@protobuf-ts/runtime";
import { Any } from "../google/protobuf/any";

export interface EncodedError {

    error: {
        oneofKind: "leaf";

        leaf: EncodedErrorLeaf;
    } | {
        oneofKind: "wrapper";

        wrapper: EncodedWrapper;
    } | {
        oneofKind: undefined;
    };
}

export interface EncodedErrorLeaf {

    message: string;

    details?: EncodedErrorDetails;

    multierrorCauses: EncodedError[];
}

export interface EncodedErrorDetails {

    originalTypeName: string;

    errorTypeMark?: ErrorTypeMark;

    reportablePayload: string[];

    fullDetails?: Any;
}

export interface EncodedWrapper {

    cause?: EncodedError;

    message: string;

    details?: EncodedErrorDetails;

    messageType: MessageType;
}

export interface ErrorTypeMark {

    familyName: string;

    extension: string;
}

export interface StringsPayload {

    details: string[];
}

export interface ErrnoPayload {

    origErrno: bigint;

    arch: string;

    isPermission: boolean;

    isExist: boolean;

    isNotExist: boolean;

    isTimeout: boolean;

    isTemporary: boolean;
}

export enum MessageType {

    PREFIX = 0,

    FULL_MESSAGE = 1
}

class EncodedError$Type extends MessageType$<EncodedError> {
    constructor() {
        super("cockroach.errorspb.EncodedError", [
            { no: 1, name: "leaf", kind: "message", oneof: "error", T: () => EncodedErrorLeaf },
            { no: 2, name: "wrapper", kind: "message", oneof: "error", T: () => EncodedWrapper }
        ]);
    }
    create(value?: PartialMessage<EncodedError>): EncodedError {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.error = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<EncodedError>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EncodedError): EncodedError {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.error = {
                        oneofKind: "leaf",
                        leaf: EncodedErrorLeaf.internalBinaryRead(reader, reader.uint32(), options, (message.error as any).leaf)
                    };
                    break;
                case  2:
                    message.error = {
                        oneofKind: "wrapper",
                        wrapper: EncodedWrapper.internalBinaryRead(reader, reader.uint32(), options, (message.error as any).wrapper)
                    };
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

export const EncodedError = /*#__PURE__*/ new EncodedError$Type();

class EncodedErrorLeaf$Type extends MessageType$<EncodedErrorLeaf> {
    constructor() {
        super("cockroach.errorspb.EncodedErrorLeaf", [
            { no: 1, name: "message", kind: "scalar", T: 9  },
            { no: 2, name: "details", kind: "message", T: () => EncodedErrorDetails },
            { no: 3, name: "multierror_causes", kind: "message", repeat: 2 , T: () => EncodedError }
        ]);
    }
    create(value?: PartialMessage<EncodedErrorLeaf>): EncodedErrorLeaf {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.message = "";
        message.multierrorCauses = [];
        if (value !== undefined)
            reflectionMergePartial<EncodedErrorLeaf>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EncodedErrorLeaf): EncodedErrorLeaf {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.message = reader.string();
                    break;
                case  2:
                    message.details = EncodedErrorDetails.internalBinaryRead(reader, reader.uint32(), options, message.details);
                    break;
                case  3:
                    message.multierrorCauses.push(EncodedError.internalBinaryRead(reader, reader.uint32(), options));
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

export const EncodedErrorLeaf = /*#__PURE__*/ new EncodedErrorLeaf$Type();

class EncodedErrorDetails$Type extends MessageType$<EncodedErrorDetails> {
    constructor() {
        super("cockroach.errorspb.EncodedErrorDetails", [
            { no: 1, name: "original_type_name", kind: "scalar", T: 9  },
            { no: 2, name: "error_type_mark", kind: "message", T: () => ErrorTypeMark },
            { no: 3, name: "reportable_payload", kind: "scalar", repeat: 2 , T: 9  },
            { no: 4, name: "full_details", kind: "message", T: () => Any }
        ]);
    }
    create(value?: PartialMessage<EncodedErrorDetails>): EncodedErrorDetails {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.originalTypeName = "";
        message.reportablePayload = [];
        if (value !== undefined)
            reflectionMergePartial<EncodedErrorDetails>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EncodedErrorDetails): EncodedErrorDetails {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.originalTypeName = reader.string();
                    break;
                case  2:
                    message.errorTypeMark = ErrorTypeMark.internalBinaryRead(reader, reader.uint32(), options, message.errorTypeMark);
                    break;
                case  3:
                    message.reportablePayload.push(reader.string());
                    break;
                case  4:
                    message.fullDetails = Any.internalBinaryRead(reader, reader.uint32(), options, message.fullDetails);
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

export const EncodedErrorDetails = /*#__PURE__*/ new EncodedErrorDetails$Type();

class EncodedWrapper$Type extends MessageType$<EncodedWrapper> {
    constructor() {
        super("cockroach.errorspb.EncodedWrapper", [
            { no: 1, name: "cause", kind: "message", T: () => EncodedError },
            { no: 2, name: "message", kind: "scalar", T: 9  },
            { no: 3, name: "details", kind: "message", T: () => EncodedErrorDetails },
            { no: 4, name: "message_type", kind: "enum", T: () => ["cockroach.errorspb.MessageType", MessageType] }
        ]);
    }
    create(value?: PartialMessage<EncodedWrapper>): EncodedWrapper {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.message = "";
        message.messageType = 0;
        if (value !== undefined)
            reflectionMergePartial<EncodedWrapper>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EncodedWrapper): EncodedWrapper {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.cause = EncodedError.internalBinaryRead(reader, reader.uint32(), options, message.cause);
                    break;
                case  2:
                    message.message = reader.string();
                    break;
                case  3:
                    message.details = EncodedErrorDetails.internalBinaryRead(reader, reader.uint32(), options, message.details);
                    break;
                case  4:
                    message.messageType = reader.int32();
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

export const EncodedWrapper = /*#__PURE__*/ new EncodedWrapper$Type();

class ErrorTypeMark$Type extends MessageType$<ErrorTypeMark> {
    constructor() {
        super("cockroach.errorspb.ErrorTypeMark", [
            { no: 1, name: "family_name", kind: "scalar", T: 9  },
            { no: 2, name: "extension", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<ErrorTypeMark>): ErrorTypeMark {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.familyName = "";
        message.extension = "";
        if (value !== undefined)
            reflectionMergePartial<ErrorTypeMark>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ErrorTypeMark): ErrorTypeMark {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.familyName = reader.string();
                    break;
                case  2:
                    message.extension = reader.string();
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

export const ErrorTypeMark = /*#__PURE__*/ new ErrorTypeMark$Type();

class StringsPayload$Type extends MessageType$<StringsPayload> {
    constructor() {
        super("cockroach.errorspb.StringsPayload", [
            { no: 1, name: "details", kind: "scalar", repeat: 2 , T: 9  }
        ]);
    }
    create(value?: PartialMessage<StringsPayload>): StringsPayload {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.details = [];
        if (value !== undefined)
            reflectionMergePartial<StringsPayload>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StringsPayload): StringsPayload {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.details.push(reader.string());
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

export const StringsPayload = /*#__PURE__*/ new StringsPayload$Type();

class ErrnoPayload$Type extends MessageType$<ErrnoPayload> {
    constructor() {
        super("cockroach.errorspb.ErrnoPayload", [
            { no: 1, name: "orig_errno", kind: "scalar", T: 3 , L: 0  },
            { no: 2, name: "arch", kind: "scalar", T: 9  },
            { no: 3, name: "is_permission", kind: "scalar", T: 8  },
            { no: 4, name: "is_exist", kind: "scalar", T: 8  },
            { no: 5, name: "is_not_exist", kind: "scalar", T: 8  },
            { no: 6, name: "is_timeout", kind: "scalar", T: 8  },
            { no: 7, name: "is_temporary", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<ErrnoPayload>): ErrnoPayload {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.origErrno = 0n;
        message.arch = "";
        message.isPermission = false;
        message.isExist = false;
        message.isNotExist = false;
        message.isTimeout = false;
        message.isTemporary = false;
        if (value !== undefined)
            reflectionMergePartial<ErrnoPayload>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ErrnoPayload): ErrnoPayload {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.origErrno = reader.int64().toBigInt();
                    break;
                case  2:
                    message.arch = reader.string();
                    break;
                case  3:
                    message.isPermission = reader.bool();
                    break;
                case  4:
                    message.isExist = reader.bool();
                    break;
                case  5:
                    message.isNotExist = reader.bool();
                    break;
                case  6:
                    message.isTimeout = reader.bool();
                    break;
                case  7:
                    message.isTemporary = reader.bool();
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

export const ErrnoPayload = /*#__PURE__*/ new ErrnoPayload$Type();
