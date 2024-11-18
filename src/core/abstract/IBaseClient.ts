// src/IBaseClient.ts

import { ResultsResponse } from "@permaweb/aoconnect/dist/lib/results";
import { Tags } from "./types";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
export abstract class IBaseClient {
    abstract message(data?: string, tags?: Tags, anchor?: string): Promise<string>;
    abstract results(from?: string, to?: string, limit?: number, sort?: string): Promise<ResultsResponse>;
    abstract result(messageId: string): Promise<MessageResult>;
    abstract dryrun(data: any, tags: Tags, anchor?: string, id?: string, owner?: string): Promise<any>;
    public static autoConfiguration(): IBaseClient {
        throw new Error("Method not implemented")
    }
}