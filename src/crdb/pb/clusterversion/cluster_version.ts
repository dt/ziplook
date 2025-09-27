// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Version } from "../roachpb/metadata";

export interface ClusterVersion {

    activeVersion?: Version;
}

class ClusterVersion$Type extends MessageType<ClusterVersion> {
    constructor() {
        super("cockroach.clusterversion.ClusterVersion", [
            { no: 2, name: "active_version", kind: "message", T: () => Version }
        ], { "gogoproto.goproto_stringer": false, "gogoproto.equal": true });
    }
    create(value?: PartialMessage<ClusterVersion>): ClusterVersion {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ClusterVersion>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ClusterVersion): ClusterVersion {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  2:
                    message.activeVersion = Version.internalBinaryRead(reader, reader.uint32(), options, message.activeVersion);
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

export const ClusterVersion = /*#__PURE__*/ new ClusterVersion$Type();
