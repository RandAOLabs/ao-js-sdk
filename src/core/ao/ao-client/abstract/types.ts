import { Tags } from "src/core/common";

export interface DryRunParams {
    process: string;
    data?: any;
    tags?: Tags;
    anchor?: string;
    id?: string;
    owner?: string;
}
