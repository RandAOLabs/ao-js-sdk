import { Tags } from "src/core/common";

export enum SortOrder {
    ASCENDING = 'ASC',
    DESCENDING = 'DESC'
}

export interface DryRunParams {
    process: string;
    data?: any;
    tags?: Tags;
    anchor?: string;
    id?: string;
    owner?: string;
}
