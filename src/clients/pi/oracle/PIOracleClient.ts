import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { BaseClient } from "../../../core/ao/BaseClient";
import { BaseClientConfig } from "../../../core/ao/configuration/BaseClientConfig";
import { ClientError } from "../../common/ClientError";
import { IPIOracleClient, PIToken } from "./abstract/IPIOracleClient";
import { 
    ACTION_GET_FLPS, 
    ACTION_INFO,
    DELEGATION_ORACLE_PROCESS_ID
} from "../constants";
import { PITokenClient } from "../PIToken/PITokenClient";
import { PITokenClientBuilder } from "../PIToken/PITokenClientBuilder";

/**
 * Client for interacting with the PI Oracle process.
 * The Oracle provides information about all available PI tokens.
 */
export class PIOracleClient extends BaseClient implements IPIOracleClient {
    private readonly TIMEOUT_MS = 15000; // 15 second timeout for operations

    /**
     * Gets information about the PI Oracle process.
     * @returns Promise resolving to a DryRunResult with oracle information
     */
    public async getInfo(): Promise<DryRunResult> {
        try {
            const result = await this.withTimeout(
                this.dryrun('', [
                    { name: "Action", value: ACTION_INFO }
                ]),
                this.TIMEOUT_MS,
                'Oracle info request timed out'
            );
            
            return result;
        } catch (error: any) {
            throw new ClientError(this, this.getInfo, {}, error);
        }
    }
    
    /**
     * Gets available PI tokens from the delegation oracle.
     * @returns Promise resolving to a list of PI tokens as a string
     */
    public async getPITokens(): Promise<string> {
        try {
            const response = await this.withTimeout(
                this.dryrun('', [
                    { name: "Action", value: ACTION_GET_FLPS }
                ]),
                this.TIMEOUT_MS,
                'PI tokens request timed out'
            );
            
            // Extract data from response
            const dataString = response.Messages[0].Data;
            return dataString;
        } catch (error: any) {
            throw new ClientError(this, this.getPITokens, {}, error);
        }
    }

    /**
     * Parse the raw PI tokens string into a structured array
     * @param piTokensData Raw PI tokens data string
     * @returns Parsed PI tokens
     */
    public parsePITokens(piTokensData: string): PIToken[] {
        try {
            return JSON.parse(piTokensData);
        } catch (error) {
            throw new Error(`Failed to parse PI tokens data: ${error}`);
        }
    }
    
    /**
     * Gets a map of all PI tokens with their token process IDs and other details
     * @returns A map of token ticker to token details
     */
    public async getTokensMap(): Promise<Map<string, PIToken>> {
        try {
            const tokensData = await this.getPITokens();
            const tokens = this.parsePITokens(tokensData);
            
            const tokensMap = new Map<string, PIToken>();
            for (const token of tokens) {
                if (token.flp_token_ticker) {
                    tokensMap.set(token.flp_token_ticker, token);
                }
            }
            
            return tokensMap;
        } catch (error: any) {
            throw new ClientError(this, this.getTokensMap, {}, error);
        }
    }

    /**
     * Create a PITokenClient for a specific token process ID
     * @param processId The process ID of the token to create a client for
     * @returns A configured PITokenClient
     */
    public createTokenClient(processId: string): PITokenClient {
        // Create a copy of the current config but change the process ID
        const config: BaseClientConfig = {
            ...this.baseConfig,
            processId: processId
        };
        
        // Return a new PITokenClient with the specified token process ID
        return new PITokenClient(config);
    }
    
    /**
     * Creates token clients for all available PI tokens
     * @returns A map of token ticker to PITokenClient instances
     */
    public async createTokenClients(): Promise<Map<string, PITokenClient>> {
        try {
            // Get token data from oracle
            const tokensData = await this.getPITokens();
            const tokens = this.parsePITokens(tokensData);
            
            // Create a map to store the token clients
            const tokenClients = new Map<string, PITokenClient>();
            
            // Create a client for each token with a valid process ID and ticker
            for (const token of tokens) {
                if (token.flp_token_process && token.flp_token_ticker) {
                    const client = this.createTokenClient(token.flp_token_process);
                    tokenClients.set(token.flp_token_ticker, client);
                }
            }
            
            return tokenClients;
        } catch (error: any) {
            throw new ClientError(this, this.createTokenClients, {}, error);
        }
    }

    /**
     * Creates an array of PITokenClient instances for all available PI tokens
     * @returns An array of PITokenClient instances
     */
    public async createTokenClientsArray(): Promise<PITokenClient[]> {
        try {
            // Get token data from oracle
            const tokensData = await this.getPITokens();
            const tokens = this.parsePITokens(tokensData);
            
            // Array to store token clients
            const tokenClients: PITokenClient[] = [];
            
            // Create a client for each token with a valid process ID
            for (const token of tokens) {
                if (token.flp_token_process) {
                    const client = this.createTokenClient(token.flp_token_process);
                    tokenClients.push(client);
                }
            }
            
            return tokenClients;
        } catch (error: any) {
            throw new ClientError(this, this.createTokenClientsArray, {}, error);
        }
    }

    /**
     * Helper method to add timeout to promises
     * @param promise The promise to add a timeout to
     * @param timeoutMs Timeout in milliseconds
     * @param errorMessage Error message if timeout occurs
     * @returns Promise with timeout
     */
    private withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
        return Promise.race([
            promise,
            new Promise<T>((_, reject) => {
                setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
            })
        ]);
    }
}
