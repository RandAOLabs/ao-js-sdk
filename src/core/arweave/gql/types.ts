export interface ArweaveGQLFilter {
    ids?: string[];
    recipient?: string;
    owner?: {
        address: string;
    };
    tags?: {
        name: string;
        value: string;
    }[];
}

export interface ArweaveGQLOptions {
    first?: number;
    after?: string;
    sort?: ArweaveGQLSortOrder;
}

export interface ArweaveGQLQuery {
    query: string;
}

export interface NodeFields {
    id?: boolean;
    anchor?: boolean;
    signature?: boolean;
    recipient?: boolean;
    owner?: OwnerFields;
    fee?: AmountFields;
    quantity?: AmountFields;
    data?: DataFields;
    tags?: TagFields;
    block?: BlockFields;
    parent?: ParentFields;
}

export interface OwnerFields {
    address?: boolean;
    key?: boolean;
}

export interface AmountFields {
    winston?: boolean;
    ar?: boolean;
}

export interface DataFields {
    size?: boolean;
    type?: boolean;
}

export interface TagFields {
    name?: boolean;
    value?: boolean;
}

export interface BlockFields {
    id?: boolean;
    timestamp?: boolean;
    height?: boolean;
    previous?: boolean;
}

export interface ParentFields {
    id?: boolean;
}

export enum ArweaveGQLSortOrder {
    HEIGHT_ASC = "HEIGHT_ASC",
    HEIGHT_DESC = "HEIGHT_DESC"
}
