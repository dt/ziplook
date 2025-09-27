// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { ShapeType } from "../../geo/geopb/geopb";

export interface IntervalDurationField {

    durationType?: IntervalDurationType;

    fromDurationType?: IntervalDurationType;
}

export interface GeoMetadata {

    srid?: number;

    shapeType?: ShapeType;
}

export interface PersistentUserDefinedTypeMetadata {

    arrayTypeOid?: number;
}

export interface InternalType {

    family?: Family;

    width?: number;

    precision?: number;

    arrayDimensions: number[];

    locale?: string;

    visibleType?: number;

    arrayElemType?: Family;

    tupleContents: T[];

    tupleLabels: string[];

    oid?: number;

    arrayContents?: T;

    timePrecisionIsSet?: boolean;

    intervalDurationField?: IntervalDurationField;

    geoMetadata?: GeoMetadata;

    udtMetadata?: PersistentUserDefinedTypeMetadata;
}
// CRDB never actually writes types.T, it writes the fields of types.InternalType when a field is of type T.
export type T = InternalType;

export enum Family {

    BoolFamily = 0,

    IntFamily = 1,

    FloatFamily = 2,

    DecimalFamily = 3,

    DateFamily = 4,

    TimestampFamily = 5,

    IntervalFamily = 6,

    StringFamily = 7,

    BytesFamily = 8,

    TimestampTZFamily = 9,

    CollatedStringFamily = 10,

    OidFamily = 12,

    UnknownFamily = 13,

    UuidFamily = 14,

    ArrayFamily = 15,

    INetFamily = 16,

    TimeFamily = 17,

    JsonFamily = 18,

    TimeTZFamily = 19,

    TupleFamily = 20,

    BitFamily = 21,

    GeometryFamily = 22,

    GeographyFamily = 23,

    EnumFamily = 24,

    Box2DFamily = 25,

    VoidFamily = 26,

    EncodedKeyFamily = 27,

    TSQueryFamily = 28,

    TSVectorFamily = 29,

    PGLSNFamily = 30,

    RefCursorFamily = 31,

    PGVectorFamily = 32,

    TriggerFamily = 33,

    JsonpathFamily = 34,

    LTreeFamily = 35,

    AnyFamily = 100
}

export enum IntervalDurationType {

    UNSET = 0,

    YEAR = 1,

    MONTH = 2,

    DAY = 3,

    HOUR = 4,

    MINUTE = 5,

    SECOND = 6,

    MILLISECOND = 7
}

class IntervalDurationField$Type extends MessageType<IntervalDurationField> {
    constructor() {
        super("cockroach.sql.sem.types.IntervalDurationField", [
            { no: 1, name: "duration_type", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.types.IntervalDurationType", IntervalDurationType] },
            { no: 2, name: "from_duration_type", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.types.IntervalDurationType", IntervalDurationType] }
        ]);
    }
    create(value?: PartialMessage<IntervalDurationField>): IntervalDurationField {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IntervalDurationField>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IntervalDurationField): IntervalDurationField {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.durationType = reader.int32();
                    break;
                case  2:
                    message.fromDurationType = reader.int32();
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

export const IntervalDurationField = /*#__PURE__*/ new IntervalDurationField$Type();

class GeoMetadata$Type extends MessageType<GeoMetadata> {
    constructor() {
        super("cockroach.sql.sem.types.GeoMetadata", [
            { no: 1, name: "srid", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "shape_type", kind: "enum", opt: true, T: () => ["cockroach.geopb.ShapeType", ShapeType] }
        ]);
    }
    create(value?: PartialMessage<GeoMetadata>): GeoMetadata {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<GeoMetadata>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GeoMetadata): GeoMetadata {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.srid = reader.int32();
                    break;
                case  2:
                    message.shapeType = reader.int32();
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

export const GeoMetadata = /*#__PURE__*/ new GeoMetadata$Type();

class PersistentUserDefinedTypeMetadata$Type extends MessageType<PersistentUserDefinedTypeMetadata> {
    constructor() {
        super("cockroach.sql.sem.types.PersistentUserDefinedTypeMetadata", [
            { no: 2, name: "array_type_oid", kind: "scalar", opt: true, T: 13  }
        ]);
    }
    create(value?: PartialMessage<PersistentUserDefinedTypeMetadata>): PersistentUserDefinedTypeMetadata {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PersistentUserDefinedTypeMetadata>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PersistentUserDefinedTypeMetadata): PersistentUserDefinedTypeMetadata {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.arrayTypeOid = reader.uint32();
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

export const PersistentUserDefinedTypeMetadata = /*#__PURE__*/ new PersistentUserDefinedTypeMetadata$Type();

// CRDB never actually writes types.T, it writes the fields of types.InternalType when a field is of type T.
class T$Type extends MessageType<InternalType> {
    constructor() {
        super("cockroach.sql.sem.types.T", []);
    }
    create(value?: PartialMessage<InternalType>): InternalType {
        return InternalType.create(value);
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InternalType): InternalType {
        return InternalType.internalBinaryRead(reader, length, options, target);
    }
}

export const T = /*#__PURE__*/ new T$Type();

class InternalType$Type extends MessageType<InternalType> {
    constructor() {
        super("cockroach.sql.sem.types.InternalType", [
            { no: 1, name: "family", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.types.Family", Family] },
            { no: 2, name: "width", kind: "scalar", opt: true, T: 5  },
            { no: 3, name: "precision", kind: "scalar", opt: true, T: 5  },
            { no: 4, name: "array_dimensions", kind: "scalar", repeat: 2 , T: 5  },
            { no: 5, name: "locale", kind: "scalar", opt: true, T: 9  },
            { no: 6, name: "visible_type", kind: "scalar", opt: true, T: 5  },
            { no: 7, name: "array_elem_type", kind: "enum", opt: true, T: () => ["cockroach.sql.sem.types.Family", Family] },
            { no: 8, name: "tuple_contents", kind: "message", repeat: 2 , T: () => InternalType },
            { no: 9, name: "tuple_labels", kind: "scalar", repeat: 2 , T: 9  },
            { no: 10, name: "oid", kind: "scalar", opt: true, T: 13  },
            { no: 11, name: "array_contents", kind: "message", T: () => InternalType },
            { no: 12, name: "time_precision_is_set", kind: "scalar", opt: true, T: 8  },
            { no: 13, name: "interval_duration_field", kind: "message", T: () => IntervalDurationField },
            { no: 14, name: "geo_metadata", kind: "message", T: () => GeoMetadata },
            { no: 15, name: "udt_metadata", kind: "message", T: () => PersistentUserDefinedTypeMetadata }
        ]);
    }
    create(value?: PartialMessage<InternalType>): InternalType {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.arrayDimensions = [];
        message.tupleContents = [];
        message.tupleLabels = [];
        if (value !== undefined)
            reflectionMergePartial<InternalType>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: InternalType): InternalType {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.family = reader.int32();
                    break;
                case  2:
                    message.width = reader.int32();
                    break;
                case  3:
                    message.precision = reader.int32();
                    break;
                case  4:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.arrayDimensions.push(reader.int32());
                    else
                        message.arrayDimensions.push(reader.int32());
                    break;
                case  5:
                    message.locale = reader.string();
                    break;
                case  6:
                    message.visibleType = reader.int32();
                    break;
                case  7:
                    message.arrayElemType = reader.int32();
                    break;
                case  8:
                    message.tupleContents.push(InternalType.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  9:
                    message.tupleLabels.push(reader.string());
                    break;
                case  10:
                    message.oid = reader.uint32();
                    break;
                case  11:
                    message.arrayContents = InternalType.internalBinaryRead(reader, reader.uint32(), options, message.arrayContents);
                    break;
                case  12:
                    message.timePrecisionIsSet = reader.bool();
                    break;
                case  13:
                    message.intervalDurationField = IntervalDurationField.internalBinaryRead(reader, reader.uint32(), options, message.intervalDurationField);
                    break;
                case  14:
                    message.geoMetadata = GeoMetadata.internalBinaryRead(reader, reader.uint32(), options, message.geoMetadata);
                    break;
                case  15:
                    message.udtMetadata = PersistentUserDefinedTypeMetadata.internalBinaryRead(reader, reader.uint32(), options, message.udtMetadata);
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

export const InternalType = /*#__PURE__*/ new InternalType$Type();
