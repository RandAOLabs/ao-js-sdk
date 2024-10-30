import { Tags } from "../../core/types";

// src/ITokenClient.ts
export interface ITokenClient {
    balance(identifier: string): Promise<void>;
    balances(limit?: number, cursor?: string): Promise<void>;
    transfer(recipient: string, quantity: string, forwardedTags?: Tags): Promise<void>;
    getInfo(token: string): Promise<void>;
    mint(quantity: string): Promise<void>;
}
