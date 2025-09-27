// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { TenantID } from "../../../roachpb/data";
import { Timestamp } from "../../../util/hlc/timestamp";
import { IndexColumn_Direction } from "../catenumpb/index";
import { T } from "../../types/types";
import { Config } from "../../../geo/geopb/config";

export interface IndexFetchSpec {

    version?: number;

    tableId?: number;

    tableName?: string;

    indexId?: number;

    indexName?: string;

    isSecondaryIndex?: boolean;

    isUniqueIndex?: boolean;

    geoConfig?: Config;

    encodingType?: number;

    numKeySuffixColumns?: number;

    maxKeysPerRow?: number;

    keyPrefixLength?: number;

    maxFamilyId?: number;

    familyDefaultColumns: IndexFetchSpec_FamilyDefaultColumn[];

    keyAndSuffixColumns: IndexFetchSpec_KeyColumn[];

    fetchedColumns: IndexFetchSpec_Column[];

    external?: IndexFetchSpec_ExternalRowData;
}

export interface IndexFetchSpec_Column {

    columnId?: number;

    name?: string;

    type?: T;

    isNonNullable?: boolean;
}

export interface IndexFetchSpec_KeyColumn {

    column?: IndexFetchSpec_Column;

    direction?: IndexColumn_Direction;

    isComposite?: boolean;

    isInverted?: boolean;
}

export interface IndexFetchSpec_FamilyDefaultColumn {

    familyId?: number;

    defaultColumnId?: number;
}

export interface IndexFetchSpec_ExternalRowData {

    asOf?: Timestamp;

    tenantId?: TenantID;

    tableId?: number;
}

class IndexFetchSpec$Type extends MessageType<IndexFetchSpec> {
    constructor() {
        super("cockroach.sql.sqlbase.IndexFetchSpec", [
            { no: 1, name: "version", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "table_id", kind: "scalar", opt: true, T: 13  },
            { no: 3, name: "table_name", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "index_id", kind: "scalar", opt: true, T: 13  },
            { no: 5, name: "index_name", kind: "scalar", opt: true, T: 9  },
            { no: 6, name: "is_secondary_index", kind: "scalar", opt: true, T: 8  },
            { no: 7, name: "is_unique_index", kind: "scalar", opt: true, T: 8  },
            { no: 16, name: "geo_config", kind: "message", T: () => Config },
            { no: 8, name: "encoding_type", kind: "scalar", opt: true, T: 13  },
            { no: 9, name: "num_key_suffix_columns", kind: "scalar", opt: true, T: 13  },
            { no: 10, name: "max_keys_per_row", kind: "scalar", opt: true, T: 13  },
            { no: 11, name: "key_prefix_length", kind: "scalar", opt: true, T: 13  },
            { no: 12, name: "max_family_id", kind: "scalar", opt: true, T: 13  },
            { no: 13, name: "family_default_columns", kind: "message", repeat: 2 , T: () => IndexFetchSpec_FamilyDefaultColumn },
            { no: 14, name: "key_and_suffix_columns", kind: "message", repeat: 2 , T: () => IndexFetchSpec_KeyColumn },
            { no: 15, name: "fetched_columns", kind: "message", repeat: 2 , T: () => IndexFetchSpec_Column },
            { no: 17, name: "external", kind: "message", T: () => IndexFetchSpec_ExternalRowData }
        ]);
    }
    create(value?: PartialMessage<IndexFetchSpec>): IndexFetchSpec {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.familyDefaultColumns = [];
        message.keyAndSuffixColumns = [];
        message.fetchedColumns = [];
        if (value !== undefined)
            reflectionMergePartial<IndexFetchSpec>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexFetchSpec): IndexFetchSpec {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.version = reader.uint32();
                    break;
                case  2:
                    message.tableId = reader.uint32();
                    break;
                case  3:
                    message.tableName = reader.string();
                    break;
                case  4:
                    message.indexId = reader.uint32();
                    break;
                case  5:
                    message.indexName = reader.string();
                    break;
                case  6:
                    message.isSecondaryIndex = reader.bool();
                    break;
                case  7:
                    message.isUniqueIndex = reader.bool();
                    break;
                case  16:
                    message.geoConfig = Config.internalBinaryRead(reader, reader.uint32(), options, message.geoConfig);
                    break;
                case  8:
                    message.encodingType = reader.uint32();
                    break;
                case  9:
                    message.numKeySuffixColumns = reader.uint32();
                    break;
                case  10:
                    message.maxKeysPerRow = reader.uint32();
                    break;
                case  11:
                    message.keyPrefixLength = reader.uint32();
                    break;
                case  12:
                    message.maxFamilyId = reader.uint32();
                    break;
                case  13:
                    message.familyDefaultColumns.push(IndexFetchSpec_FamilyDefaultColumn.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  14:
                    message.keyAndSuffixColumns.push(IndexFetchSpec_KeyColumn.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  15:
                    message.fetchedColumns.push(IndexFetchSpec_Column.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  17:
                    message.external = IndexFetchSpec_ExternalRowData.internalBinaryRead(reader, reader.uint32(), options, message.external);
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

export const IndexFetchSpec = /*#__PURE__*/ new IndexFetchSpec$Type();

class IndexFetchSpec_Column$Type extends MessageType<IndexFetchSpec_Column> {
    constructor() {
        super("cockroach.sql.sqlbase.IndexFetchSpec.Column", [
            { no: 1, name: "column_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "name", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "type", kind: "message", T: () => T },
            { no: 4, name: "is_non_nullable", kind: "scalar", opt: true, T: 8  }
        ]);
    }
    create(value?: PartialMessage<IndexFetchSpec_Column>): IndexFetchSpec_Column {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IndexFetchSpec_Column>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexFetchSpec_Column): IndexFetchSpec_Column {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.columnId = reader.uint32();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  3:
                    message.type = T.internalBinaryRead(reader, reader.uint32(), options, message.type);
                    break;
                case  4:
                    message.isNonNullable = reader.bool();
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

export const IndexFetchSpec_Column = /*#__PURE__*/ new IndexFetchSpec_Column$Type();

class IndexFetchSpec_KeyColumn$Type extends MessageType<IndexFetchSpec_KeyColumn> {
    constructor() {
        super("cockroach.sql.sqlbase.IndexFetchSpec.KeyColumn", [
            { no: 1, name: "column", kind: "message", T: () => IndexFetchSpec_Column },
            { no: 2, name: "direction", kind: "enum", opt: true, T: () => ["cockroach.sql.catalog.catpb.IndexColumn.Direction", IndexColumn_Direction] },
            { no: 3, name: "is_composite", kind: "scalar", opt: true, T: 8  },
            { no: 4, name: "is_inverted", kind: "scalar", opt: true, T: 8  }
        ]);
    }
    create(value?: PartialMessage<IndexFetchSpec_KeyColumn>): IndexFetchSpec_KeyColumn {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IndexFetchSpec_KeyColumn>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexFetchSpec_KeyColumn): IndexFetchSpec_KeyColumn {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.column = IndexFetchSpec_Column.internalBinaryRead(reader, reader.uint32(), options, message.column);
                    break;
                case  2:
                    message.direction = reader.int32();
                    break;
                case  3:
                    message.isComposite = reader.bool();
                    break;
                case  4:
                    message.isInverted = reader.bool();
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

export const IndexFetchSpec_KeyColumn = /*#__PURE__*/ new IndexFetchSpec_KeyColumn$Type();

class IndexFetchSpec_FamilyDefaultColumn$Type extends MessageType<IndexFetchSpec_FamilyDefaultColumn> {
    constructor() {
        super("cockroach.sql.sqlbase.IndexFetchSpec.FamilyDefaultColumn", [
            { no: 1, name: "family_id", kind: "scalar", opt: true, T: 13  },
            { no: 2, name: "default_column_id", kind: "scalar", opt: true, T: 13  }
        ]);
    }
    create(value?: PartialMessage<IndexFetchSpec_FamilyDefaultColumn>): IndexFetchSpec_FamilyDefaultColumn {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IndexFetchSpec_FamilyDefaultColumn>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexFetchSpec_FamilyDefaultColumn): IndexFetchSpec_FamilyDefaultColumn {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.familyId = reader.uint32();
                    break;
                case  2:
                    message.defaultColumnId = reader.uint32();
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

export const IndexFetchSpec_FamilyDefaultColumn = /*#__PURE__*/ new IndexFetchSpec_FamilyDefaultColumn$Type();

class IndexFetchSpec_ExternalRowData$Type extends MessageType<IndexFetchSpec_ExternalRowData> {
    constructor() {
        super("cockroach.sql.sqlbase.IndexFetchSpec.ExternalRowData", [
            { no: 1, name: "as_of", kind: "message", T: () => Timestamp },
            { no: 2, name: "tenant_id", kind: "message", T: () => TenantID },
            { no: 3, name: "table_id", kind: "scalar", opt: true, T: 13  }
        ]);
    }
    create(value?: PartialMessage<IndexFetchSpec_ExternalRowData>): IndexFetchSpec_ExternalRowData {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IndexFetchSpec_ExternalRowData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IndexFetchSpec_ExternalRowData): IndexFetchSpec_ExternalRowData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.asOf = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.asOf);
                    break;
                case  2:
                    message.tenantId = TenantID.internalBinaryRead(reader, reader.uint32(), options, message.tenantId);
                    break;
                case  3:
                    message.tableId = reader.uint32();
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

export const IndexFetchSpec_ExternalRowData = /*#__PURE__*/ new IndexFetchSpec_ExternalRowData$Type();
