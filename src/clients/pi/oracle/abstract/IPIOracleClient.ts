import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { PITokenClient } from "../../PIToken/PITokenClient";

/**
 * Represents a FLP (Farm Liquidity Provider) token
 */
export interface PIToken {
    id: string;
    flp_id: string;
    flp_name: string;
    flp_token_name: string;
    flp_token_ticker: string;
    flp_token_process: string;
    flp_token_denomination: string;
    flp_token_logo: string;
    flp_token_disclaimer?: string;
    flp_short_description?: string;
    flp_long_description?: string;
    deployer: string;
    treasury: string;
    status: string;
    created_at_ts: number;
    starts_at_ts: number;
    ends_at_ts?: number;
    last_updated_at_ts: number;
    stats_updated_at: number;
    last_day_distribution?: string;
    total_token_supply: string;
    token_supply_to_use: string;
    decay_factor: number | string;
    token_unlock_at_ts?: number;
    latest_yield_cycle?: string;
    total_yield_ticks: string;
    distributed_qty: string;
    accumulated_qty: string;
    withdrawn_qty: string;
    accumulated_pi_qty: string;
    withdrawn_pi_qty: string;
    exchanged_for_pi_qty: string;
    website_url?: string;
    twitter_handle?: string;
    telegram_handle?: string;
}

/**
 * Interface for interacting with the PI Oracle process.
 * The Oracle provides information about all available PI tokens.
 */
export interface IPIOracleClient {
    /**
     * Gets information about the PI Oracle process.
     * @returns Promise resolving to a DryRunResult with oracle information
     */
    getInfo(): Promise<DryRunResult>;
    
    /**
     * Gets all available PI tokens from the delegation oracle.
     * @returns Promise resolving to a list of PI tokens as a string
     */
    getPITokens(): Promise<string>;
    
    /**
     * Parse the raw PI tokens string into a structured array
     * @param piTokensData Raw PI tokens data string
     * @returns Parsed PI tokens
     */
    parsePITokens(piTokensData: string): PIToken[];
    
    /**
     * Gets a map of all PI tokens with their token process IDs and other details
     * @returns A map of token ticker to token details
     */
    getTokensMap(): Promise<Map<string, PIToken>>;

    /**
     * Create a PITokenClient for a specific token process ID
     * @param processId The process ID of the token to create a client for
     * @returns A configured PITokenClient
     */
    createTokenClient(processId: string): PITokenClient;

    /**
     * Creates token clients for all available PI tokens
     * @returns A map of token ticker to PITokenClient instances
     */
    createTokenClients(): Promise<Map<string, PITokenClient>>;

    /**
     * Creates an array of PITokenClient instances for all available PI tokens
     * @returns An array of PITokenClient instances
     */
    createTokenClientsArray(): Promise<PITokenClient[]>;
}
