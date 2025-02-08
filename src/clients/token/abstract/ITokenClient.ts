// src/ITokenClient.ts
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { Tags } from "../../../core/ao/abstract/types";

/** @see {@link https://cookbook_ao.g8way.io/references/token.html | specification} */
export interface ITokenClient {
    balance(identifier: string): Promise<string>;
    balances(limit?: number, cursor?: string): Promise<DryRunResult>;// If ever used should refactor to return the balances in a list format
    transfer(recipient: string, quantity: string, forwardedTags?: Tags): Promise<boolean>;
    getInfo(token: string): Promise<void>;
    mint(quantity: string): Promise<boolean>;
}
