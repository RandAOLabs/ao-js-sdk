// src/ITokenClient.ts
import { Tags } from "../../../core/abstract/types";

/** @see {@link https://cookbook_ao.g8way.io/references/token.html | specification} */
export interface ITokenClient {
    balance(identifier: string): Promise<string>;
    balances(limit?: number, cursor?: string): Promise<void>;
    transfer(recipient: string, quantity: string, forwardedTags?: Tags): Promise<void>;
    getInfo(token: string): Promise<void>;
    mint(quantity: string): Promise<void>;
}
