// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { ElementProto } from "./elements";

export interface Target {

    elementProto?: ElementProto;

    metadata?: TargetMetadata;

    targetStatus: Status;
}

export interface TargetMetadata {

    subWorkId: number;

    sourceElementId: number;

    statementId: number;
}

export interface TargetState {

    targets: Target[];

    statements: Statement[];

    authorization?: Authorization;

    nameMappings: NameMapping[];
}

export interface Statement {

    statement: string;

    redactedStatement: string;

    statementTag: string;
}

export interface Authorization {

    userName: string;

    appName: string;
}

export interface NameMapping {

    id: number;

    name: string;

    columns: {
        [key: number]: string;
    };

    families: {
        [key: number]: string;
    };

    indexes: {
        [key: number]: string;
    };

    constraints: {
        [key: number]: string;
    };
}

export interface DescriptorState {

    jobId: bigint;

    revertible: boolean;

    inRollback: boolean;

    targets: Target[];

    currentStatuses: Status[];

    targetRanks: number[];

    relevantStatements: DescriptorState_Statement[];

    authorization?: Authorization;

    nameMapping?: NameMapping;
}

export interface DescriptorState_Statement {

    statement?: Statement;

    statementRank: number;
}

export interface CorpusState {

    name: string;

    targetState?: TargetState;

    status: Status[];

    revertible: boolean;

    inRollback: boolean;
}

export interface CorpusDisk {

    corpusArray: CorpusState[];
}

export enum Status {

    UNKNOWN = 0,

    OFFLINE = 15,

    ABSENT = 1,

    PUBLIC = 2,

    TRANSIENT_ABSENT = 3,

    DROPPED = 5,

    TXN_DROPPED = 4,

    WRITE_ONLY = 6,

    DELETE_ONLY = 7,

    VALIDATED = 8,

    MERGED = 9,

    MERGE_ONLY = 10,

    BACKFILLED = 11,

    BACKFILL_ONLY = 12,

    TRANSIENT_DELETE_ONLY = 13,

    TRANSIENT_WRITE_ONLY = 14,

    TRANSIENT_BACKFILL_ONLY = 16,

    TRANSIENT_BACKFILLED = 17,

    TRANSIENT_MERGE_ONLY = 18,

    TRANSIENT_MERGED = 19,

    TRANSIENT_VALIDATED = 20,

    TRANSIENT_PUBLIC = 21,

    TRANSIENT_DROPPED = 22,

    DESCRIPTOR_ADDED = 23
}

class Target$Type extends MessageType<Target> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Target", [
            { no: 1, name: "element_proto", kind: "message", T: () => ElementProto },
            { no: 2, name: "metadata", kind: "message", T: () => TargetMetadata },
            { no: 3, name: "target_status", kind: "enum", T: () => ["cockroach.sql.schemachanger.scpb.Status", Status] }
        ]);
    }
    create(value?: PartialMessage<Target>): Target {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.targetStatus = 0;
        if (value !== undefined)
            reflectionMergePartial<Target>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Target): Target {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.elementProto = ElementProto.internalBinaryRead(reader, reader.uint32(), options, message.elementProto);
                    break;
                case  2:
                    message.metadata = TargetMetadata.internalBinaryRead(reader, reader.uint32(), options, message.metadata);
                    break;
                case  3:
                    message.targetStatus = reader.int32();
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

export const Target = /*#__PURE__*/ new Target$Type();

class TargetMetadata$Type extends MessageType<TargetMetadata> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TargetMetadata", [
            { no: 1, name: "sub_work_id", kind: "scalar", T: 13  },
            { no: 2, name: "source_element_id", kind: "scalar", T: 13  },
            { no: 3, name: "statement_id", kind: "scalar", T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<TargetMetadata>): TargetMetadata {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.subWorkId = 0;
        message.sourceElementId = 0;
        message.statementId = 0;
        if (value !== undefined)
            reflectionMergePartial<TargetMetadata>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TargetMetadata): TargetMetadata {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.subWorkId = reader.uint32();
                    break;
                case  2:
                    message.sourceElementId = reader.uint32();
                    break;
                case  3:
                    message.statementId = reader.uint32();
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

export const TargetMetadata = /*#__PURE__*/ new TargetMetadata$Type();

class TargetState$Type extends MessageType<TargetState> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.TargetState", [
            { no: 1, name: "targets", kind: "message", repeat: 2 , T: () => Target },
            { no: 2, name: "statements", kind: "message", repeat: 2 , T: () => Statement },
            { no: 3, name: "authorization", kind: "message", T: () => Authorization },
            { no: 4, name: "name_mappings", kind: "message", repeat: 2 , T: () => NameMapping }
        ]);
    }
    create(value?: PartialMessage<TargetState>): TargetState {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.targets = [];
        message.statements = [];
        message.nameMappings = [];
        if (value !== undefined)
            reflectionMergePartial<TargetState>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TargetState): TargetState {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.targets.push(Target.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.statements.push(Statement.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.authorization = Authorization.internalBinaryRead(reader, reader.uint32(), options, message.authorization);
                    break;
                case  4:
                    message.nameMappings.push(NameMapping.internalBinaryRead(reader, reader.uint32(), options));
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

export const TargetState = /*#__PURE__*/ new TargetState$Type();

class Statement$Type extends MessageType<Statement> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Statement", [
            { no: 1, name: "statement", kind: "scalar", T: 9  },
            { no: 2, name: "redacted_statement", kind: "scalar", T: 9  },
            { no: 3, name: "statement_tag", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<Statement>): Statement {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.statement = "";
        message.redactedStatement = "";
        message.statementTag = "";
        if (value !== undefined)
            reflectionMergePartial<Statement>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Statement): Statement {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.statement = reader.string();
                    break;
                case  2:
                    message.redactedStatement = reader.string();
                    break;
                case  3:
                    message.statementTag = reader.string();
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

export const Statement = /*#__PURE__*/ new Statement$Type();

class Authorization$Type extends MessageType<Authorization> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.Authorization", [
            { no: 1, name: "user_name", kind: "scalar", T: 9  },
            { no: 2, name: "app_name", kind: "scalar", T: 9  }
        ]);
    }
    create(value?: PartialMessage<Authorization>): Authorization {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.userName = "";
        message.appName = "";
        if (value !== undefined)
            reflectionMergePartial<Authorization>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Authorization): Authorization {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.userName = reader.string();
                    break;
                case  2:
                    message.appName = reader.string();
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

export const Authorization = /*#__PURE__*/ new Authorization$Type();

class NameMapping$Type extends MessageType<NameMapping> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.NameMapping", [
            { no: 1, name: "id", kind: "scalar", T: 13  },
            { no: 2, name: "name", kind: "scalar", T: 9  },
            { no: 10, name: "columns", kind: "map", K: 13 , V: { kind: "scalar", T: 9  } },
            { no: 11, name: "families", kind: "map", K: 13 , V: { kind: "scalar", T: 9  } },
            { no: 12, name: "indexes", kind: "map", K: 13 , V: { kind: "scalar", T: 9  } },
            { no: 13, name: "constraints", kind: "map", K: 13 , V: { kind: "scalar", T: 9  } }
        ]);
    }
    create(value?: PartialMessage<NameMapping>): NameMapping {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0;
        message.name = "";
        message.columns = {};
        message.families = {};
        message.indexes = {};
        message.constraints = {};
        if (value !== undefined)
            reflectionMergePartial<NameMapping>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NameMapping): NameMapping {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.id = reader.uint32();
                    break;
                case  2:
                    message.name = reader.string();
                    break;
                case  10:
                    this.binaryReadMap10(message.columns, reader, options);
                    break;
                case  11:
                    this.binaryReadMap11(message.families, reader, options);
                    break;
                case  12:
                    this.binaryReadMap12(message.indexes, reader, options);
                    break;
                case  13:
                    this.binaryReadMap13(message.constraints, reader, options);
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
    private binaryReadMap10(map: NameMapping["columns"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof NameMapping["columns"] | undefined, val: NameMapping["columns"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint32();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.schemachanger.scpb.NameMapping.columns");
            }
        }
        map[key ?? 0] = val ?? "";
    }
    private binaryReadMap11(map: NameMapping["families"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof NameMapping["families"] | undefined, val: NameMapping["families"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint32();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.schemachanger.scpb.NameMapping.families");
            }
        }
        map[key ?? 0] = val ?? "";
    }
    private binaryReadMap12(map: NameMapping["indexes"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof NameMapping["indexes"] | undefined, val: NameMapping["indexes"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint32();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.schemachanger.scpb.NameMapping.indexes");
            }
        }
        map[key ?? 0] = val ?? "";
    }
    private binaryReadMap13(map: NameMapping["constraints"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof NameMapping["constraints"] | undefined, val: NameMapping["constraints"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint32();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.schemachanger.scpb.NameMapping.constraints");
            }
        }
        map[key ?? 0] = val ?? "";
    }

}

export const NameMapping = /*#__PURE__*/ new NameMapping$Type();

class DescriptorState$Type extends MessageType<DescriptorState> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.DescriptorState", [
            { no: 5, name: "job_id", kind: "scalar", T: 3 , L: 0  },
            { no: 7, name: "revertible", kind: "scalar", T: 8  },
            { no: 8, name: "in_rollback", kind: "scalar", T: 8  },
            { no: 1, name: "targets", kind: "message", repeat: 2 , T: () => Target },
            { no: 4, name: "current_statuses", kind: "enum", repeat: 1 , T: () => ["cockroach.sql.schemachanger.scpb.Status", Status] },
            { no: 6, name: "target_ranks", kind: "scalar", repeat: 1 , T: 13  },
            { no: 2, name: "relevant_statements", kind: "message", repeat: 2 , T: () => DescriptorState_Statement },
            { no: 3, name: "authorization", kind: "message", T: () => Authorization },
            { no: 9, name: "name_mapping", kind: "message", T: () => NameMapping }
        ]);
    }
    create(value?: PartialMessage<DescriptorState>): DescriptorState {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.jobId = 0n;
        message.revertible = false;
        message.inRollback = false;
        message.targets = [];
        message.currentStatuses = [];
        message.targetRanks = [];
        message.relevantStatements = [];
        if (value !== undefined)
            reflectionMergePartial<DescriptorState>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DescriptorState): DescriptorState {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  5:
                    message.jobId = reader.int64().toBigInt();
                    break;
                case  7:
                    message.revertible = reader.bool();
                    break;
                case  8:
                    message.inRollback = reader.bool();
                    break;
                case  1:
                    message.targets.push(Target.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  4:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.currentStatuses.push(reader.int32());
                    else
                        message.currentStatuses.push(reader.int32());
                    break;
                case  6:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.targetRanks.push(reader.uint32());
                    else
                        message.targetRanks.push(reader.uint32());
                    break;
                case  2:
                    message.relevantStatements.push(DescriptorState_Statement.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  3:
                    message.authorization = Authorization.internalBinaryRead(reader, reader.uint32(), options, message.authorization);
                    break;
                case  9:
                    message.nameMapping = NameMapping.internalBinaryRead(reader, reader.uint32(), options, message.nameMapping);
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

export const DescriptorState = /*#__PURE__*/ new DescriptorState$Type();

class DescriptorState_Statement$Type extends MessageType<DescriptorState_Statement> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.DescriptorState.Statement", [
            { no: 1, name: "statement", kind: "message", T: () => Statement },
            { no: 2, name: "statement_rank", kind: "scalar", T: 13  }
        ]);
    }
    create(value?: PartialMessage<DescriptorState_Statement>): DescriptorState_Statement {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.statementRank = 0;
        if (value !== undefined)
            reflectionMergePartial<DescriptorState_Statement>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DescriptorState_Statement): DescriptorState_Statement {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.statement = Statement.internalBinaryRead(reader, reader.uint32(), options, message.statement);
                    break;
                case  2:
                    message.statementRank = reader.uint32();
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

export const DescriptorState_Statement = /*#__PURE__*/ new DescriptorState_Statement$Type();

class CorpusState$Type extends MessageType<CorpusState> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.CorpusState", [
            { no: 1, name: "name", kind: "scalar", T: 9  },
            { no: 2, name: "target_state", kind: "message", T: () => TargetState },
            { no: 3, name: "status", kind: "enum", repeat: 1 , T: () => ["cockroach.sql.schemachanger.scpb.Status", Status] },
            { no: 4, name: "revertible", kind: "scalar", T: 8  },
            { no: 5, name: "in_rollback", kind: "scalar", T: 8  }
        ]);
    }
    create(value?: PartialMessage<CorpusState>): CorpusState {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        message.status = [];
        message.revertible = false;
        message.inRollback = false;
        if (value !== undefined)
            reflectionMergePartial<CorpusState>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CorpusState): CorpusState {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.name = reader.string();
                    break;
                case  2:
                    message.targetState = TargetState.internalBinaryRead(reader, reader.uint32(), options, message.targetState);
                    break;
                case  3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.status.push(reader.int32());
                    else
                        message.status.push(reader.int32());
                    break;
                case  4:
                    message.revertible = reader.bool();
                    break;
                case  5:
                    message.inRollback = reader.bool();
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

export const CorpusState = /*#__PURE__*/ new CorpusState$Type();

class CorpusDisk$Type extends MessageType<CorpusDisk> {
    constructor() {
        super("cockroach.sql.schemachanger.scpb.CorpusDisk", [
            { no: 1, name: "corpus_array", kind: "message", repeat: 2 , T: () => CorpusState }
        ]);
    }
    create(value?: PartialMessage<CorpusDisk>): CorpusDisk {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.corpusArray = [];
        if (value !== undefined)
            reflectionMergePartial<CorpusDisk>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CorpusDisk): CorpusDisk {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.corpusArray.push(CorpusState.internalBinaryRead(reader, reader.uint32(), options));
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

export const CorpusDisk = /*#__PURE__*/ new CorpusDisk$Type();
