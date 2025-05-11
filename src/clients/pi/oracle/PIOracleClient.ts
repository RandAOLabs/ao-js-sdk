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
import { AOToken } from "../../tokens/AOTokenClient";
import { TokenClient } from "../../ao";
import { ClientBuilder } from "../../common";

/**
 * Client for interacting with the PI Oracle process.
 * The Oracle provides information about all available PI tokens.
 * @category Autonomous Finance
 */
export class PIOracleClient extends BaseClient implements IPIOracleClient {
    private readonly TIMEOUT_MS = 15000; // 15 second timeout for operations
	
	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static autoConfiguration(): PIOracleClient {
		return PIOracleClient.defaultBuilder()
			.build()
	}

	/** 
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder} 
	 */
	public static defaultBuilder(): ClientBuilder<PIOracleClient> {
		return new ClientBuilder(PIOracleClient)
			.withProcessId(DELEGATION_ORACLE_PROCESS_ID)
	}

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
            const parsed = JSON.parse(piTokensData);
            
            let tokens: PIToken[];
            
            // Handle the new format - each token is an array with [ticker, data]
            if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
                // Transform the array format to object format
                tokens = parsed.map(item => {
                    const [ticker, data] = item;
                    // Make sure data has the ticker property
                    if (typeof data === 'object' && data !== null) {
                        return {
                            ...data,
                            ticker: data.ticker || ticker
                        } as PIToken;
                    }
                    return null;
                }).filter(Boolean) as PIToken[];
            } else {
                // Handle the old format (array of objects)
                tokens = parsed;
            }
            
            // Add custom token that the oracle doesn't include
            const customTokenId = "rxxU4g-7tUHGvF28W2l53hxarpbaFR4NaSnOaxx6MIE";
            
            // Check if the token is already in the list
            const exists = tokens.some(token => 
                token.id === customTokenId || 
                token.process === customTokenId || 
                token.flp_token_process === customTokenId
            );
            
            if (!exists) {
                // Add the custom token with basic information
                tokens.push({
                    id: customTokenId,
                    process: customTokenId,
                    ticker: "CUSTOM",
                    status: "active"
                } as PIToken);
                
                console.log("Added custom token: rxxU4g-7tUHGvF28W2l53hxarpbaFR4NaSnOaxx6MIE");
            }
            
            return tokens;
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
     * @deprecated Use createTokenClientPairsArray instead
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
                // Support both old and new formats
                const processId = token.flp_token_process || token.process;
                if (processId) {
                    const client = this.createTokenClient(processId);
                    tokenClients.push(client);
                }
            }
            
            return tokenClients;
        } catch (error: any) {
            throw new ClientError(this, this.createTokenClientsArray, {}, error);
        }
    }
    
    /**
     * Creates token client pairs for all available PI tokens
     * The first item is a PITokenClient created with the id field
     * The second item is a BaseToken client created with the process field
     * @returns A map of token ticker to [PITokenClient, TokenClient] tuples
     */
    public async createTokenClientPairs(): Promise<Map<string, [PITokenClient, TokenClient]>> {
        try {
            // Get token data from oracle
            const tokensData = await this.getPITokens();
            const tokens = this.parsePITokens(tokensData);
            
            // Map to store token client pairs
            const tokenClientPairs = new Map<string, [PITokenClient, TokenClient]>();
            
            // Create client pairs for each token
            for (const token of tokens) {
                const ticker = token.ticker || token.flp_token_ticker;
                const id = token.id;
                const processId = token.process || token.flp_token_process;
                
                // Only create clients if we have both ID and process
                if (ticker && id && processId) {
                    // Create PITokenClient using the ID field
                    const piTokenClient = new PITokenClient({
                        ...this.baseConfig,
                        processId: id
                    });
                    
                    // Create AOToken using the process field and propagate AO config
                    const baseTokenClient = AOToken.defaultBuilder()
                        .withProcessId(processId)
                        .withAOConfig(this.baseConfig.aoConfig)
                        .build();
                    
                    // Add the pair to the map
                    tokenClientPairs.set(ticker, [piTokenClient, baseTokenClient]);
                }
            }
            
            return tokenClientPairs;
        } catch (error: any) {
            throw new ClientError(this, this.createTokenClientPairs, {}, error);
        }
    }
    
    /**
     * Creates an array of token client pairs for all available PI tokens
     * Each pair contains a PITokenClient created with the id field and a BaseToken client created with the process field
     * @returns An array of [PITokenClient, TokenClient] tuples
     */
    public async createTokenClientPairsArray(): Promise<[PITokenClient, TokenClient][]> {
        try {
            // Get token data from oracle
            const tokensData = await this.getPITokens();
            const tokens = this.parsePITokens(tokensData);
            
            // Array to store token client pairs
            const tokenClientPairs: [PITokenClient, TokenClient][] = [];
            
            // Create client pairs for each token
            for (const token of tokens) {
                const id = token.id;
                const processId = token.process || token.flp_token_process;
                
                // Only create clients if we have both ID and process
                if (id && processId) {
                    // Create PITokenClient using the ID field
                    const piTokenClient = new PITokenClient({
                        ...this.baseConfig,
                        processId: id
                    });
                    
                    // Create AOToken using the process field and propagate AO config
                    const baseTokenClient = AOToken.defaultBuilder()
                        .withProcessId(processId)
                        .withAOConfig(this.baseConfig.aoConfig)
                        .build();
                    
                    // Add the pair to the array
                    tokenClientPairs.push([piTokenClient, baseTokenClient]);
                }
            }
            
            return tokenClientPairs;
        } catch (error: any) {
            throw new ClientError(this, this.createTokenClientPairsArray, {}, error);
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
