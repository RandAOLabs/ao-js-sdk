import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { IPIClient } from "./abstract";
import { 
    ACTION_BALANCE,
    ACTION_GET_CLAIMABLE_BALANCE,
    ACTION_GET_DELEGATIONS, 
    ACTION_GET_FLPS, 
    ACTION_GET_YIELD_TICK_HISTORY, 
    ACTION_INFO,
    DELEGATION_ORACLE_PROCESS_ID, 
    PI_DELEGATE_PROCESS_ID, 
    PI_TOKEN_PROCESS_ID
} from "./constants";
import { ClientError } from "../common/ClientError";
import { Tags, TagUtils } from "../../core";
import { BaseClient } from "../../core/ao/BaseClient";
import ResultUtils from "../../core/common/result-utils/ResultUtils";
import { DelegationInfo, PIToken, TickHistoryEntry } from "./abstract/types";

/**
 * Client for interacting with PI processes.
 */
export class PIClient extends BaseClient implements IPIClient {
    /**
     * Gets information about the default PI token process.
     * @returns Promise resolving to a DryRunResult with token information
     */
    public async getInfo(): Promise<DryRunResult> {
        try {
            return await this.dryrun('', [
                { name: "Action", value: ACTION_INFO }
            ]);
        } catch (error: any) {
            throw new ClientError(this, this.getInfo, {}, error);
        }
    }
    
    /**
     * Gets information specifically from the PI token process.
     * @returns Promise resolving to a DryRunResult with token information
     */
    public async getPITokenInfo(): Promise<DryRunResult> {
        try {
            // Save current process ID
            const currentProcessId = this.baseConfig.processId;
            // Set process ID to PI token process
            this.baseConfig.processId = PI_TOKEN_PROCESS_ID;

            const result = await this.dryrun('', [
                { name: "Action", value: ACTION_INFO }
            ]);
            
            // Restore original process ID
            this.baseConfig.processId = currentProcessId;
            
            return result;
        } catch (error: any) {
            throw new ClientError(this, this.getPITokenInfo, {}, error);
        }
    }
    
    /**
     * Gets information specifically from the delegate process.
     * @returns Promise resolving to a DryRunResult with delegation information
     */
    public async getDelegateInfo(): Promise<DryRunResult> {
        try {
            // Save current process ID
            const currentProcessId = this.baseConfig.processId;
            // Set process ID to delegate process
            this.baseConfig.processId = PI_DELEGATE_PROCESS_ID;

            const result = await this.dryrun('', [
                { name: "Action", value: ACTION_INFO }
            ]);
            
            // Restore original process ID
            this.baseConfig.processId = currentProcessId;
            
            return result;
        } catch (error: any) {
            throw new ClientError(this, this.getDelegateInfo, {}, error);
        }
    }

    /**
     * Gets delegation information.
     * @returns Promise resolving to delegation information as a string
     */
    public async getDelegation(): Promise<string> {
        try {
            // Save current process ID
            const currentProcessId = this.baseConfig.processId;
            // Set process ID to delegate process
            this.baseConfig.processId = PI_DELEGATE_PROCESS_ID;
            
            const response = await this.dryrun('', [
                { name: "Action", value: ACTION_GET_DELEGATIONS }
            ]);
            
            // Restore original process ID
            this.baseConfig.processId = currentProcessId;
            
            // Extract data from response
            const dataString = response.Messages[0].Data;
            return dataString;
        } catch (error: any) {
            throw new ClientError(this, this.getDelegation, {}, error);
        }
    }
    
    /**
     * Gets yield tick history information.
     * @returns Promise resolving to tick history data as a string
     */
    public async getTickHistory(): Promise<string> {
        try {
            // Save current process ID
            const currentProcessId = this.baseConfig.processId;
            // Set process ID to PI token process
            this.baseConfig.processId = PI_TOKEN_PROCESS_ID;
            
            const response = await this.dryrun('', [
                { name: "Action", value: ACTION_GET_YIELD_TICK_HISTORY }
            ]);
            
            // Restore original process ID
            this.baseConfig.processId = currentProcessId;
            
            // Extract data from response
            const dataString = response.Messages[0].Data;
            return dataString;
        } catch (error: any) {
            throw new ClientError(this, this.getTickHistory, {}, error);
        }
    }
    
    /**
     * Gets available PI tokens from the delegation oracle.
     * @returns Promise resolving to a list of PI tokens as a string
     */
    public async getPITokens(): Promise<string> {
        try {
            // Save current process ID
            const currentProcessId = this.baseConfig.processId;
            // Set process ID to delegation oracle process
            this.baseConfig.processId = DELEGATION_ORACLE_PROCESS_ID;
            
            const response = await this.dryrun('', [
                { name: "Action", value: ACTION_GET_FLPS }
            ]);
            
            // Restore original process ID
            this.baseConfig.processId = currentProcessId;
            
            // Extract data from response
            const dataString = response.Messages[0].Data;
            return dataString;
        } catch (error: any) {
            throw new ClientError(this, this.getPITokens, {}, error);
        }
    }

    /**
     * Parse the raw delegation info string into a structured object
     * @param delegationData Raw delegation data string
     * @returns Parsed delegation information
     */
    public parseDelegationInfo(delegationData: string): DelegationInfo {
        try {
            return JSON.parse(delegationData);
        } catch (error) {
            throw new Error(`Failed to parse delegation data: ${error}`);
        }
    }
    
    /**
     * Parse the raw tick history string into a structured array
     * @param tickHistoryData Raw tick history data string
     * @returns Parsed tick history entries
     */
    public parseTickHistory(tickHistoryData: string): TickHistoryEntry[] {
        try {
            return JSON.parse(tickHistoryData);
        } catch (error) {
            throw new Error(`Failed to parse tick history data: ${error}`);
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
     * Gets the balance from the PI token process.
     * @param target Optional target wallet address. If not provided, uses the calling wallet address.
     * @returns Promise resolving to the balance as a string
     */
    public async getBalance(target?: string): Promise<string> {
        try {
            // Save current process ID
            const currentProcessId = this.baseConfig.processId;
            // Set process ID to PI token process
            this.baseConfig.processId = PI_TOKEN_PROCESS_ID;
            
            const tags: Tags = [{ name: "Action", value: ACTION_BALANCE }];
            
            // Add target if provided, otherwise the process will use the calling wallet
            if (target) {
                tags.push({ name: "Target", value: target });
            }
            
            const response = await this.dryrun('', tags);
            
            // Restore original process ID
            this.baseConfig.processId = currentProcessId;
            
            // Extract data from response
            return response.Messages[0].Data;
        } catch (error: any) {
            throw new ClientError(this, this.getBalance, { target }, error);
        }
    }
    
    /**
     * Gets the claimable balance from the PI token process.
     * @returns Promise resolving to the claimable balance as a string
     */
    public async getClaimableBalance(): Promise<string> {
        try {
            // Save current process ID
            const currentProcessId = this.baseConfig.processId;
            // Set process ID to PI token process
            this.baseConfig.processId = PI_TOKEN_PROCESS_ID;
            
            const response = await this.dryrun('', [
                { name: "Action", value: ACTION_GET_CLAIMABLE_BALANCE }
            ]);
            
            // Restore original process ID
            this.baseConfig.processId = currentProcessId;
            
            // Extract data from response
            return response.Messages[0].Data;
        } catch (error: any) {
            throw new ClientError(this, this.getClaimableBalance, {}, error);
        }
    }
    
    /**
     * Creates a new PIClient instance with the specified token process ID
     * @param tokenProcessId The token process ID to use for the new client
     * @returns A new PIClient instance configured with the specified token process ID
     */
    public createTokenClient(tokenProcessId: string): PIClient {
        // Clone the current config but change the process ID
        const newConfig = {...this.baseConfig};
        newConfig.processId = tokenProcessId;
        
        // Create a new client with the modified config
        return new PIClient(newConfig);
    }
    
    /**
     * Fetches all PI tokens from the delegation oracle and creates client instances for each token
     * @returns A map of token ticker symbols to PIClient instances configured for each token's process ID
     */
    public async createTokenClients(): Promise<Map<string, PIClient>> {
        try {
            // Get all PI tokens
            const tokensData = await this.getPITokens();
            const tokens = this.parsePITokens(tokensData);
            
            // Create a client for each token process
            const tokenClients = new Map<string, PIClient>();
            
            for (const token of tokens) {
                // Only create clients for tokens with valid process IDs and tickers
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
     * Gets a map of all PI tokens with their token process IDs and other details
     * @returns A map of token ticker to token details
     */
    public async getTokensMap(): Promise<Map<string, PIToken>> {
        const tokensData = await this.getPITokens();
        const tokens = this.parsePITokens(tokensData);
        
        const tokensMap = new Map<string, PIToken>();
        for (const token of tokens) {
            if (token.flp_token_ticker) {
                tokensMap.set(token.flp_token_ticker, token);
            }
        }
        
        return tokensMap;
    }
}
