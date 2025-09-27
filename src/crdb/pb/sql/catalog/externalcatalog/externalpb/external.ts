// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { TypeDescriptor } from "../../descpb/structured";
import { TableDescriptor } from "../../descpb/structured";

export interface ExternalCatalog {

    tables: TableDescriptor[];

    types: TypeDescriptor[];
}

class ExternalCatalog$Type extends MessageType<ExternalCatalog> {
    constructor() {
        super("cockroach.sql.catalog.externalcatalog.externalpb.ExternalCatalog", [
            { no: 1, name: "tables", kind: "message", repeat: 2 , T: () => TableDescriptor },
            { no: 2, name: "types", kind: "message", repeat: 2 , T: () => TypeDescriptor }
        ]);
    }
    create(value?: PartialMessage<ExternalCatalog>): ExternalCatalog {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tables = [];
        message.types = [];
        if (value !== undefined)
            reflectionMergePartial<ExternalCatalog>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExternalCatalog): ExternalCatalog {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.tables.push(TableDescriptor.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.types.push(TypeDescriptor.internalBinaryRead(reader, reader.uint32(), options));
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

export const ExternalCatalog = /*#__PURE__*/ new ExternalCatalog$Type();
