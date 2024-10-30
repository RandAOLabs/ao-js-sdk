import { IBaseClient } from "./IBaseClient";
import { Tags } from "./types";

export class BaseClient implements IBaseClient {
    message(data?: string, tags?: Tags, anchor?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    results(from?: string, to?: string, limit?: number, sort?: string): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    result(messageId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}