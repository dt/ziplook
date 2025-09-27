// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface SpatialObject {

    type: SpatialObjectType;

    ewkb: Uint8Array;

    srid: number;

    shapeType: ShapeType;

    boundingBox?: BoundingBox;
}

export interface BoundingBox {

    loX: number;

    hiX: number;

    loY: number;

    hiY: number;
}

export enum ShapeType {

    Unset = 0,

    Point = 1,

    LineString = 2,

    Polygon = 3,

    MultiPoint = 4,

    MultiLineString = 5,

    MultiPolygon = 6,

    Geometry = 7,

    GeometryCollection = 8,

    PointM = 536870913,

    LineStringM = 536870914,

    PolygonM = 536870915,

    MultiPointM = 536870916,

    MultiLineStringM = 536870917,

    MultiPolygonM = 536870918,

    GeometryM = 536870919,

    GeometryCollectionM = 536870920,

    PointZ = 1073741825,

    LineStringZ = 1073741826,

    PolygonZ = 1073741827,

    MultiPointZ = 1073741828,

    MultiLineStringZ = 1073741829,

    MultiPolygonZ = 1073741830,

    GeometryZ = 1073741831,

    GeometryCollectionZ = 1073741832,

    PointZM = 1610612737,

    LineStringZM = 1610612738,

    PolygonZM = 1610612739,

    MultiPointZM = 1610612740,

    MultiLineStringZM = 1610612741,

    MultiPolygonZM = 1610612742,

    GeometryZM = 1610612743,

    GeometryCollectionZM = 1610612744
}

export enum SpatialObjectType {

    Unknown = 0,

    GeographyType = 1,

    GeometryType = 2
}

class SpatialObject$Type extends MessageType<SpatialObject> {
    constructor() {
        super("cockroach.geopb.SpatialObject", [
            { no: 1, name: "type", kind: "enum", T: () => ["cockroach.geopb.SpatialObjectType", SpatialObjectType] },
            { no: 2, name: "ewkb", kind: "scalar", T: 12  },
            { no: 3, name: "srid", kind: "scalar", T: 5  },
            { no: 4, name: "shape_type", kind: "enum", T: () => ["cockroach.geopb.ShapeType", ShapeType] },
            { no: 5, name: "bounding_box", kind: "message", T: () => BoundingBox }
        ]);
    }
    create(value?: PartialMessage<SpatialObject>): SpatialObject {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.type = 0;
        message.ewkb = new Uint8Array(0);
        message.srid = 0;
        message.shapeType = 0;
        if (value !== undefined)
            reflectionMergePartial<SpatialObject>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SpatialObject): SpatialObject {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.type = reader.int32();
                    break;
                case  2:
                    message.ewkb = reader.bytes();
                    break;
                case  3:
                    message.srid = reader.int32();
                    break;
                case  4:
                    message.shapeType = reader.int32();
                    break;
                case  5:
                    message.boundingBox = BoundingBox.internalBinaryRead(reader, reader.uint32(), options, message.boundingBox);
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

export const SpatialObject = /*#__PURE__*/ new SpatialObject$Type();

class BoundingBox$Type extends MessageType<BoundingBox> {
    constructor() {
        super("cockroach.geopb.BoundingBox", [
            { no: 1, name: "lo_x", kind: "scalar", T: 1  },
            { no: 2, name: "hi_x", kind: "scalar", T: 1  },
            { no: 3, name: "lo_y", kind: "scalar", T: 1  },
            { no: 4, name: "hi_y", kind: "scalar", T: 1  }
        ]);
    }
    create(value?: PartialMessage<BoundingBox>): BoundingBox {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.loX = 0;
        message.hiX = 0;
        message.loY = 0;
        message.hiY = 0;
        if (value !== undefined)
            reflectionMergePartial<BoundingBox>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: BoundingBox): BoundingBox {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.loX = reader.double();
                    break;
                case  2:
                    message.hiX = reader.double();
                    break;
                case  3:
                    message.loY = reader.double();
                    break;
                case  4:
                    message.hiY = reader.double();
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

export const BoundingBox = /*#__PURE__*/ new BoundingBox$Type();
