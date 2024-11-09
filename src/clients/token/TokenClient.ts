import { BaseClient } from "../../core/BaseClient";
import { Tags } from "../../core/abstract/types";
import { ITokenClient } from "./abstract/ITokenClient";

export class TokenClient extends BaseClient implements ITokenClient {
    balance(identifier: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    balances(limit?: number, cursor?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    transfer(recipient: string, quantity: string, forwardedTags?: Tags): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getInfo(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    mint(quantity: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}