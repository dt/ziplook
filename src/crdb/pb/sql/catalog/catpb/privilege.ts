// @ts-nocheck

import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";

export interface UserPrivileges {

    userProto?: string;

    privileges?: bigint;

    withGrantOption?: bigint;
}

export interface PrivilegeDescriptor {

    users: UserPrivileges[];

    ownerProto?: string;

    version?: number;
}

export interface DefaultPrivilegesForRole {

    role: {
        oneofKind: "explicitRole";

        explicitRole: DefaultPrivilegesForRole_ExplicitRole;
    } | {
        oneofKind: "forAllRoles";

        forAllRoles: DefaultPrivilegesForRole_ForAllRolesPseudoRole;
    } | {
        oneofKind: undefined;
    };

    defaultPrivilegesPerObject: {
        [key: number]: PrivilegeDescriptor;
    };
}

export interface DefaultPrivilegesForRole_ExplicitRole {

    userProto?: string;

    publicHasUsageOnTypes?: boolean;

    roleHasAllPrivilegesOnTables?: boolean;

    roleHasAllPrivilegesOnSequences?: boolean;

    roleHasAllPrivilegesOnSchemas?: boolean;

    roleHasAllPrivilegesOnTypes?: boolean;

    roleHasAllPrivilegesOnFunctions?: boolean;

    publicHasExecuteOnFunctions?: boolean;
}

export interface DefaultPrivilegesForRole_ForAllRolesPseudoRole {

    publicHasUsageOnTypes?: boolean;

    publicHasExecuteOnFunctions?: boolean;
}

export interface DefaultPrivilegeDescriptor {

    defaultPrivilegesPerRole: DefaultPrivilegesForRole[];

    type?: DefaultPrivilegeDescriptor_DefaultPrivilegeDescriptorType;
}

export enum DefaultPrivilegeDescriptor_DefaultPrivilegeDescriptorType {

    DATABASE = 0,

    SCHEMA = 1
}

class UserPrivileges$Type extends MessageType<UserPrivileges> {
    constructor() {
        super("cockroach.sql.sqlbase.UserPrivileges", [
            { no: 1, name: "user_proto", kind: "scalar", opt: true, T: 9  },
            { no: 2, name: "privileges", kind: "scalar", opt: true, T: 4 , L: 0  },
            { no: 3, name: "with_grant_option", kind: "scalar", opt: true, T: 4 , L: 0  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<UserPrivileges>): UserPrivileges {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<UserPrivileges>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UserPrivileges): UserPrivileges {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.userProto = reader.string();
                    break;
                case  2:
                    message.privileges = reader.uint64().toBigInt();
                    break;
                case  3:
                    message.withGrantOption = reader.uint64().toBigInt();
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

export const UserPrivileges = /*#__PURE__*/ new UserPrivileges$Type();

class PrivilegeDescriptor$Type extends MessageType<PrivilegeDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.PrivilegeDescriptor", [
            { no: 1, name: "users", kind: "message", repeat: 2 , T: () => UserPrivileges },
            { no: 2, name: "owner_proto", kind: "scalar", opt: true, T: 9  },
            { no: 3, name: "version", kind: "scalar", opt: true, T: 13  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<PrivilegeDescriptor>): PrivilegeDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.users = [];
        if (value !== undefined)
            reflectionMergePartial<PrivilegeDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PrivilegeDescriptor): PrivilegeDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.users.push(UserPrivileges.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.ownerProto = reader.string();
                    break;
                case  3:
                    message.version = reader.uint32();
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

export const PrivilegeDescriptor = /*#__PURE__*/ new PrivilegeDescriptor$Type();

class DefaultPrivilegesForRole$Type extends MessageType<DefaultPrivilegesForRole> {
    constructor() {
        super("cockroach.sql.sqlbase.DefaultPrivilegesForRole", [
            { no: 12, name: "explicit_role", kind: "message", oneof: "role", T: () => DefaultPrivilegesForRole_ExplicitRole },
            { no: 13, name: "for_all_roles", kind: "message", oneof: "role", T: () => DefaultPrivilegesForRole_ForAllRolesPseudoRole },
            { no: 14, name: "default_privileges_per_object", kind: "map", K: 13 , V: { kind: "message", T: () => PrivilegeDescriptor } }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<DefaultPrivilegesForRole>): DefaultPrivilegesForRole {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.role = { oneofKind: undefined };
        message.defaultPrivilegesPerObject = {};
        if (value !== undefined)
            reflectionMergePartial<DefaultPrivilegesForRole>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DefaultPrivilegesForRole): DefaultPrivilegesForRole {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  12:
                    message.role = {
                        oneofKind: "explicitRole",
                        explicitRole: DefaultPrivilegesForRole_ExplicitRole.internalBinaryRead(reader, reader.uint32(), options, (message.role as any).explicitRole)
                    };
                    break;
                case  13:
                    message.role = {
                        oneofKind: "forAllRoles",
                        forAllRoles: DefaultPrivilegesForRole_ForAllRolesPseudoRole.internalBinaryRead(reader, reader.uint32(), options, (message.role as any).forAllRoles)
                    };
                    break;
                case  14:
                    this.binaryReadMap14(message.defaultPrivilegesPerObject, reader, options);
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
    private binaryReadMap14(map: DefaultPrivilegesForRole["defaultPrivilegesPerObject"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof DefaultPrivilegesForRole["defaultPrivilegesPerObject"] | undefined, val: DefaultPrivilegesForRole["defaultPrivilegesPerObject"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.uint32();
                    break;
                case 2:
                    val = PrivilegeDescriptor.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for cockroach.sql.sqlbase.DefaultPrivilegesForRole.default_privileges_per_object");
            }
        }
        map[key ?? 0] = val ?? PrivilegeDescriptor.create();
    }

}

export const DefaultPrivilegesForRole = /*#__PURE__*/ new DefaultPrivilegesForRole$Type();

class DefaultPrivilegesForRole_ExplicitRole$Type extends MessageType<DefaultPrivilegesForRole_ExplicitRole> {
    constructor() {
        super("cockroach.sql.sqlbase.DefaultPrivilegesForRole.ExplicitRole", [
            { no: 1, name: "user_proto", kind: "scalar", opt: true, T: 9  },
            { no: 4, name: "public_has_usage_on_types", kind: "scalar", opt: true, T: 8  },
            { no: 5, name: "role_has_all_privileges_on_tables", kind: "scalar", opt: true, T: 8  },
            { no: 6, name: "role_has_all_privileges_on_sequences", kind: "scalar", opt: true, T: 8  },
            { no: 7, name: "role_has_all_privileges_on_schemas", kind: "scalar", opt: true, T: 8  },
            { no: 8, name: "role_has_all_privileges_on_types", kind: "scalar", opt: true, T: 8  },
            { no: 9, name: "role_has_all_privileges_on_functions", kind: "scalar", opt: true, T: 8  },
            { no: 10, name: "public_has_execute_on_functions", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<DefaultPrivilegesForRole_ExplicitRole>): DefaultPrivilegesForRole_ExplicitRole {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<DefaultPrivilegesForRole_ExplicitRole>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DefaultPrivilegesForRole_ExplicitRole): DefaultPrivilegesForRole_ExplicitRole {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.userProto = reader.string();
                    break;
                case  4:
                    message.publicHasUsageOnTypes = reader.bool();
                    break;
                case  5:
                    message.roleHasAllPrivilegesOnTables = reader.bool();
                    break;
                case  6:
                    message.roleHasAllPrivilegesOnSequences = reader.bool();
                    break;
                case  7:
                    message.roleHasAllPrivilegesOnSchemas = reader.bool();
                    break;
                case  8:
                    message.roleHasAllPrivilegesOnTypes = reader.bool();
                    break;
                case  9:
                    message.roleHasAllPrivilegesOnFunctions = reader.bool();
                    break;
                case  10:
                    message.publicHasExecuteOnFunctions = reader.bool();
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

export const DefaultPrivilegesForRole_ExplicitRole = /*#__PURE__*/ new DefaultPrivilegesForRole_ExplicitRole$Type();

class DefaultPrivilegesForRole_ForAllRolesPseudoRole$Type extends MessageType<DefaultPrivilegesForRole_ForAllRolesPseudoRole> {
    constructor() {
        super("cockroach.sql.sqlbase.DefaultPrivilegesForRole.ForAllRolesPseudoRole", [
            { no: 11, name: "public_has_usage_on_types", kind: "scalar", opt: true, T: 8  },
            { no: 12, name: "public_has_execute_on_functions", kind: "scalar", opt: true, T: 8  }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<DefaultPrivilegesForRole_ForAllRolesPseudoRole>): DefaultPrivilegesForRole_ForAllRolesPseudoRole {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<DefaultPrivilegesForRole_ForAllRolesPseudoRole>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DefaultPrivilegesForRole_ForAllRolesPseudoRole): DefaultPrivilegesForRole_ForAllRolesPseudoRole {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  11:
                    message.publicHasUsageOnTypes = reader.bool();
                    break;
                case  12:
                    message.publicHasExecuteOnFunctions = reader.bool();
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

export const DefaultPrivilegesForRole_ForAllRolesPseudoRole = /*#__PURE__*/ new DefaultPrivilegesForRole_ForAllRolesPseudoRole$Type();

class DefaultPrivilegeDescriptor$Type extends MessageType<DefaultPrivilegeDescriptor> {
    constructor() {
        super("cockroach.sql.sqlbase.DefaultPrivilegeDescriptor", [
            { no: 1, name: "default_privileges_per_role", kind: "message", repeat: 2 , T: () => DefaultPrivilegesForRole },
            { no: 2, name: "type", kind: "enum", opt: true, T: () => ["cockroach.sql.sqlbase.DefaultPrivilegeDescriptor.DefaultPrivilegeDescriptorType", DefaultPrivilegeDescriptor_DefaultPrivilegeDescriptorType] }
        ], { "gogoproto.equal": true });
    }
    create(value?: PartialMessage<DefaultPrivilegeDescriptor>): DefaultPrivilegeDescriptor {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.defaultPrivilegesPerRole = [];
        if (value !== undefined)
            reflectionMergePartial<DefaultPrivilegeDescriptor>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DefaultPrivilegeDescriptor): DefaultPrivilegeDescriptor {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case  1:
                    message.defaultPrivilegesPerRole.push(DefaultPrivilegesForRole.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case  2:
                    message.type = reader.int32();
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

export const DefaultPrivilegeDescriptor = /*#__PURE__*/ new DefaultPrivilegeDescriptor$Type();
