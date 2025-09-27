// @ts-nocheck

export enum SystemColumnKind {

    NONE = 0,

    MVCCTIMESTAMP = 1,

    TABLEOID = 2,

    ORIGINID = 3,

    ORIGINTIMESTAMP = 4
}

export enum InvertedIndexColumnKind {

    DEFAULT = 0,

    TRIGRAM = 1
}

export enum PolicyType {

    POLICYTYPE_UNUSED = 0,

    PERMISSIVE = 1,

    RESTRICTIVE = 2
}

export enum PolicyCommand {

    POLICYCOMMAND_UNUSED = 0,

    ALL = 1,

    SELECT = 2,

    INSERT = 3,

    UPDATE = 4,

    DELETE = 5
}
