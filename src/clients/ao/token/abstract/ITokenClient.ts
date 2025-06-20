// src/ITokenClient.ts
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { Tags } from "../../../../core";
import { TokenInfo } from "./types";

/** 
 * Interface for interacting with ao token processes.
 * Implements the standard token interface specification for managing transferable assets.
 * @see {@link https://cookbook_ao.g8way.io/references/token.html | specification}
 */
export interface ITokenClient {
    /**
     * Gets the balance of a specific identifier (address) in the token ledger.
     * This is a read-only operation that queries the current state of the ledger.
     * @param identifier The address to check the balance for
     * @returns Promise resolving to the current balance as a string
     */
    balance(identifier: string): Promise<string>;

    /**
     * Gets a paginated list of all balances in the token ledger.
     * This is a read-only operation that returns all ledger/account balances.
     * @param limit Optional maximum number of balances to return per page
     * @param cursor Optional pagination cursor for fetching subsequent pages
     * @returns Promise resolving to the dry run result containing the balances
     * @remarks If ever used should refactor to return the balances in a list format
     */
    balances(limit?: number, cursor?: string): Promise<DryRunResult>;

    /**
     * Transfers tokens from the caller's balance to one or more target addresses.
     * This operation modifies the ledger state by updating balances.
     * @param recipient The target address to receive the tokens
     * @param quantity The amount of tokens to transfer
     * @param forwardedTags Optional tags to include with the transfer message for additional metadata or notifications
     * @returns Promise resolving to true if the transfer was successful
     */
    transfer(recipient: string, quantity: string, forwardedTags?: Tags): Promise<boolean>;

    /**
     * Gets information about a token process including name, ticker, logo, and denomination.
     * These are immutable parameters set when the token process was spawned.
     * @param token Optional token process ID to get information for. If not provided, uses the current process ID.
     * @returns Promise resolving to TokenInfo with token information
     */
    getInfo(token?: string): Promise<TokenInfo>;

    /**
     * Mints new tokens, increasing the total supply.
     * This operation can only be performed on the root token process.
     * @param quantity The amount of new tokens to create
     * @returns Promise resolving to true if minting was successful
     */
    mint(quantity: string): Promise<boolean>;
}
