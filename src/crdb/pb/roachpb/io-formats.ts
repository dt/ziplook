// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface IOFileFormat {

    format?: IOFileFormat_FileFormat;

    csv?: CSVOptions;

    mysqlOut?: MySQLOutfileOptions;

    pgCopy?: PgCopyOptions;

    avro?: AvroOptions;

    parquet?: ParquetOptions;

    compression?: IOFileFormat_Compression;

    saveRejected?: boolean;
}

export enum IOFileFormat_FileFormat {

    Unknown = 0,

    CSV = 1,

    MysqlOutfile = 2,

    PgCopy = 4,

    Avro = 6,

    Parquet = 7
}

export enum IOFileFormat_Compression {

    Auto = 0,

    None = 1,

    Gzip = 2,

    Bzip = 3,

    Snappy = 4
}

export interface CSVOptions {

    comma?: number;

    comment?: number;

    nullEncoding?: string;

    skip?: number;

    strictQuotes?: boolean;

    rowLimit?: bigint;

    allowQuotedNull?: boolean;
}

export interface MySQLOutfileOptions {

    rowSeparator?: number;

    fieldSeparator?: number;

    enclose?: MySQLOutfileOptions_Enclose;

    encloser?: number;

    hasEscape?: boolean;

    escape?: number;

    skip?: number;

    nullEncoding?: string;

    rowLimit?: bigint;
}

export enum MySQLOutfileOptions_Enclose {

    Never = 0,

    Always = 1,

    Optional = 2
}

export interface PgCopyOptions {

    delimiter?: number;

    null?: string;

    maxRowSize?: number;
}

export interface AvroOptions {

    format?: AvroOptions_Format;

    strictMode?: boolean;

    schemaJSON?: string;

    maxRecordSize?: number;

    recordSeparator?: number;

    rowLimit?: bigint;
}

export enum AvroOptions_Format {

    OCF = 0,

    BIN_RECORDS = 1,

    JSON_RECORDS = 2
}

export interface ParquetOptions {

    colNullability: boolean[];
}

class IOFileFormat$Type extends MessageType<IOFileFormat> {
    constructor() {
        super("cockroach.roachpb.IOFileFormat", [
            { no: 1, name: "format", kind: "enum", opt: true, T: () => ["cockroach.roachpb.IOFileFormat.FileFormat", IOFileFormat_FileFormat] },
            { no: 2, name: "csv", kind: "message", T: () => CSVOptions },
            { no: 3, name: "mysql_out", kind: "message", T: () => MySQLOutfileOptions },
            { no: 4, name: "pg_copy", kind: "message", T: () => PgCopyOptions },
            { no: 8, name: "avro", kind: "message", T: () => AvroOptions },
            { no: 10, name: "parquet", kind: "message", T: () => ParquetOptions },
            { no: 5, name: "compression", kind: "enum", opt: true, T: () => ["cockroach.roachpb.IOFileFormat.Compression", IOFileFormat_Compression] },
            { no: 7, name: "save_rejected", kind: "scalar", opt: true, T: 8  }
        ]);
    }
    create(value?: PartialMessage<IOFileFormat>): IOFileFormat {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<IOFileFormat>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IOFileFormat): IOFileFormat {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.format = reader.int32();
                    break;
                case  2:
                    message.csv = CSVOptions.internalBinaryRead(reader, reader.uint32(), options, message.csv);
                    break;
                case  3:
                    message.mysqlOut = MySQLOutfileOptions.internalBinaryRead(reader, reader.uint32(), options, message.mysqlOut);
                    break;
                case  4:
                    message.pgCopy = PgCopyOptions.internalBinaryRead(reader, reader.uint32(), options, message.pgCopy);
                    break;
                case  8:
                    message.avro = AvroOptions.internalBinaryRead(reader, reader.uint32(), options, message.avro);
                    break;
                case  10:
                    message.parquet = ParquetOptions.internalBinaryRead(reader, reader.uint32(), options, message.parquet);
                    break;
                case  5:
                    message.compression = reader.int32();
                    break;
                case  7:
                    message.saveRejected = reader.bool();
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

export const IOFileFormat = /*#__PURE__*/ new IOFileFormat$Type();

class CSVOptions$Type extends MessageType<CSVOptions> {
    constructor() {
        super("cockroach.roachpb.CSVOptions", [
            { no: 1, name: "comma", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "comment", kind: "scalar", opt: true, T: 5  },
            { no: 3, name: "null_encoding", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "skip", kind: "scalar", opt: true, T: 13  },
            { no: 5, name: "strict_quotes", kind: "scalar", opt: true, T: 8  },
            { no: 6, name: "row_limit", kind: "scalar", opt: true, T: 3 , L: 0  },
            { no: 7, name: "allow_quoted_null", kind: "scalar", opt: true, T: 8  }
        ]);
    }
    create(value?: PartialMessage<CSVOptions>): CSVOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<CSVOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CSVOptions): CSVOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.comma = reader.int32();
                    break;
                case  2:
                    message.comment = reader.int32();
                    break;
                case  3:
                    message.nullEncoding = reader.string();
                    break;
                case  4:
                    message.skip = reader.uint32();
                    break;
                case  5:
                    message.strictQuotes = reader.bool();
                    break;
                case  6:
                    message.rowLimit = reader.int64().toBigInt();
                    break;
                case  7:
                    message.allowQuotedNull = reader.bool();
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

export const CSVOptions = /*#__PURE__*/ new CSVOptions$Type();

class MySQLOutfileOptions$Type extends MessageType<MySQLOutfileOptions> {
    constructor() {
        super("cockroach.roachpb.MySQLOutfileOptions", [
            { no: 1, name: "row_separator", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "field_separator", kind: "scalar", opt: true, T: 5  },
            { no: 3, name: "enclose", kind: "enum", opt: true, T: () => ["cockroach.roachpb.MySQLOutfileOptions.Enclose", MySQLOutfileOptions_Enclose] },
            { no: 4, name: "encloser", kind: "scalar", opt: true, T: 5  },
            { no: 5, name: "has_escape", kind: "scalar", opt: true, T: 8  },
            { no: 6, name: "escape", kind: "scalar", opt: true, T: 5  },
            { no: 7, name: "skip", kind: "scalar", opt: true, T: 13  },
            { no: 8, name: "null_encoding", kind: "scalar", opt: true, T: 9  },
            { no: 10, name: "row_limit", kind: "scalar", opt: true, T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<MySQLOutfileOptions>): MySQLOutfileOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<MySQLOutfileOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MySQLOutfileOptions): MySQLOutfileOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.rowSeparator = reader.int32();
                    break;
                case  2:
                    message.fieldSeparator = reader.int32();
                    break;
                case  3:
                    message.enclose = reader.int32();
                    break;
                case  4:
                    message.encloser = reader.int32();
                    break;
                case  5:
                    message.hasEscape = reader.bool();
                    break;
                case  6:
                    message.escape = reader.int32();
                    break;
                case  7:
                    message.skip = reader.uint32();
                    break;
                case  8:
                    message.nullEncoding = reader.string();
                    break;
                case  10:
                    message.rowLimit = reader.int64().toBigInt();
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

export const MySQLOutfileOptions = /*#__PURE__*/ new MySQLOutfileOptions$Type();

class PgCopyOptions$Type extends MessageType<PgCopyOptions> {
    constructor() {
        super("cockroach.roachpb.PgCopyOptions", [
            { no: 1, name: "delimiter", kind: "scalar", opt: true, T: 5  },
            { no: 2, name: "null", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "maxRowSize", kind: "scalar", opt: true, T: 5  }
        ]);
    }
    create(value?: PartialMessage<PgCopyOptions>): PgCopyOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<PgCopyOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PgCopyOptions): PgCopyOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.delimiter = reader.int32();
                    break;
                case  2:
                    message.null = reader.string();
                    break;
                case  3:
                    message.maxRowSize = reader.int32();
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

export const PgCopyOptions = /*#__PURE__*/ new PgCopyOptions$Type();

class AvroOptions$Type extends MessageType<AvroOptions> {
    constructor() {
        super("cockroach.roachpb.AvroOptions", [
            { no: 1, name: "format", kind: "enum", opt: true, T: () => ["cockroach.roachpb.AvroOptions.Format", AvroOptions_Format] },
            { no: 2, name: "strict_mode", kind: "scalar", opt: true, T: 8  },
            { no: 3, name: "schemaJSON", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "max_record_size", kind: "scalar", opt: true, T: 5  },
            { no: 5, name: "record_separator", kind: "scalar", opt: true, T: 5  },
            { no: 6, name: "row_limit", kind: "scalar", opt: true, T: 3 , L: 0  }
        ]);
    }
    create(value?: PartialMessage<AvroOptions>): AvroOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AvroOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AvroOptions): AvroOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.format = reader.int32();
                    break;
                case  2:
                    message.strictMode = reader.bool();
                    break;
                case  3:
                    message.schemaJSON = reader.string();
                    break;
                case  4:
                    message.maxRecordSize = reader.int32();
                    break;
                case  5:
                    message.recordSeparator = reader.int32();
                    break;
                case  6:
                    message.rowLimit = reader.int64().toBigInt();
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

export const AvroOptions = /*#__PURE__*/ new AvroOptions$Type();

class ParquetOptions$Type extends MessageType<ParquetOptions> {
    constructor() {
        super("cockroach.roachpb.ParquetOptions", [
            { no: 1, name: "col_nullability", kind: "scalar", repeat: 2 , T: 8  }
        ]);
    }
    create(value?: PartialMessage<ParquetOptions>): ParquetOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.colNullability = [];
        if (value !== undefined)
            reflectionMergePartial<ParquetOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ParquetOptions): ParquetOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.colNullability.push(reader.bool());
                    else
                        message.colNullability.push(reader.bool());
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

export const ParquetOptions = /*#__PURE__*/ new ParquetOptions$Type();
