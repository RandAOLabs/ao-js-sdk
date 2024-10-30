// src/IBaseClient.ts

import { Tags } from "./types";

export interface IBaseClient {
    message(data?: string, tags?: Tags, anchor?: string): Promise<void>;

    results(from?: string, to?: string, limit?: number, sort?: string): Promise<any[]>;

    result(messageId: string): Promise<any>;
}