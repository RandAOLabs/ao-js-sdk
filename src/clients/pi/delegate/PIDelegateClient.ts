import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { BaseClient } from "../../../core/ao/BaseClient";
import { Tags } from "../../../core/common";
import { IPIDelegateClient, DelegationInfo, SetDelegationOptions } from "./abstract/IPIDelegateClient";
import {
	ACTION_GET_DELEGATIONS,
	ACTION_INFO,
	ACTION_SET_DELEGATION,
	PI_DELEGATE_PROCESS_ID,
} from "../constants";
import { PIDelegateClientError } from "./PIDelegateClientError";
import { PIDelegateProcessError } from "./PIDelegateProcessError";
import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "../../../utils";
import { ClientBuilder } from "../../common";
import { IClassBuilder } from "../../../utils/class-interfaces/IClientBuilder";

/**
 * Client for interacting with the PI delegate process.
 * @category Autonomous Finance
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
@staticImplements<IClassBuilder>()
export class PIDelegateClient extends BaseClient implements IPIDelegateClient {

	/**
     * Gets information from the delegate process.
     * @returns Promise resolving to a DryRunResult with delegation information
     */
    public async getInfo(): Promise<DryRunResult> {
        try {
            return await this.dryrun('', [
                { name: "Action", value: ACTION_INFO }
            ]);
        } catch (error: any) {
            throw new PIDelegateClientError(this, this.getInfo, {}, error);
        }
    }

    /**
     * Gets delegation information for the specified wallet.
     * @param walletAddress Optional wallet address to get delegations for. If not provided, uses the wallet specified in the configuration.
     * @returns Promise resolving to delegation information details
     */
    public async getDelegation(walletAddress?: string): Promise<string> {
        try {
            // Prepare tags for the request
            const tags = [
                { name: "Action", value: ACTION_GET_DELEGATIONS }
            ];
            
            // Add wallet address tag if provided
            if (walletAddress) {
                tags.push({ name: "Wallet", value: walletAddress });
            }
            
            const response = await this.dryrun('', tags);
            
            // Extract data from response with robust error handling
            if (response?.Messages?.[0]?.Data) {
                return response.Messages[0].Data;
            }
            
            // Return empty response if no data found
            return '{"totalFactor":"0","delegationPrefs":[],"lastUpdate":0,"wallet":"unknown"}';
        } catch (error: any) {
            console.error(`[PIDelegateClient] Error in getDelegation:`, error);
            // Return empty response in case of error
            return '{"totalFactor":"0","delegationPrefs":[],"lastUpdate":0,"wallet":"unknown"}';
        }
    }
    
    /**
     * Sets a single delegation preference from one wallet to another.
     * @param options Options including walletFrom, walletTo, and factor
     * @returns Promise resolving to a string with the result of the operation
     */
    public async setDelegation(options: SetDelegationOptions): Promise<string> {
        try {
            const { walletFrom, walletTo, factor } = options;
            
            if (!walletFrom) {
                throw new Error('Source wallet address (walletFrom) is required');
            }
            
            if (!walletTo) {
                throw new Error('Destination wallet address (walletTo) is required');
            }
            
            if (factor === undefined || factor < 0) {
                throw new Error('Factor must be a non-negative number');
            }
            
            // Create the delegation data object with the correct format
            const delegationData = {
                walletFrom,
                walletTo,
                factor
            };
            
            console.log(`Setting delegation: ${factor} from ${walletFrom} to ${walletTo}`);
            
            // Send the message with the delegation data
            const tags = [{ name: "Action", value: ACTION_SET_DELEGATION }];
            
            // Use messageResult method to get the full result object with Output data
            const response = await this.messageResult(JSON.stringify(delegationData), tags);
            
            // Process the response
            if (response && typeof response === 'object' && response.Output && response.Output.data) {
                console.log('Delegation set response:', response.Output.data);
                return response.Output.data;
            }
            
            return JSON.stringify({ success: true, message: 'Delegation preference updated' });
        } catch (error: any) {
            console.error(`[PIDelegateClient] Error in setDelegation:`, error);
            throw new PIDelegateClientError(
                this, 
                this.setDelegation, 
                { walletFrom: options.walletFrom, walletTo: options.walletTo }, 
                new Error(`Failed to set delegation: ${error.message}`)
            );
        }
    }
    
    /**
     * Parse the raw delegation info string into a structured object
     * @param delegationData Raw delegation data string
     * @returns Parsed delegation information
     */
    public parseDelegationInfo(delegationData: string): DelegationInfo {
        try {
            // Handle cases where the data might be a JSON string already or a string containing JSON
            if (typeof delegationData === 'string') {
                return JSON.parse(delegationData);
            } else if (typeof delegationData === 'object') {
                return delegationData as DelegationInfo;
            }
            throw new Error('Invalid delegation data format');
        } catch (error) {
            console.error(`[PIDelegateClient] Error parsing delegation data:`, error);
            // Return a default empty delegation info object
            return {
                totalFactor: "0",
                delegationPrefs: [],
                lastUpdate: 0,
                wallet: "unknown"
            };
        }
    }

    /**
     * Check if the result contains any error tags from the process
     * @param result The result to check for errors
     * @private
     */
    private checkResultForErrors(result: DryRunResult) {
        for (let msg of result.Messages) {
            const tags: Tags = msg.Tags;
            for (let tag of tags) {
                if (tag.name == "Error") {
                    throw new PIDelegateProcessError(`Error originating in process: ${this.getProcessId()}`)
                }
            }
        }
    }

    /**
     * {@inheritdoc IAutoconfiguration.autoConfiguration}
     * @see {@link IAutoconfiguration.autoConfiguration} 
     */
    public static async autoConfiguration(): Promise<PIDelegateClient> {
        const builder = await PIDelegateClient.defaultBuilder();
        return builder.build();
    }

    /**
     * Create a new builder instance for PIDelegateClient
     * @returns A new builder instance
     */
    public static builder(): ClientBuilder<PIDelegateClient> {
        return new ClientBuilder(PIDelegateClient);
    }

    /** 
     * {@inheritdoc IDefaultBuilder.defaultBuilder}
     * @see {@link IDefaultBuilder.defaultBuilder} 
     */
    public static async defaultBuilder(): Promise<ClientBuilder<PIDelegateClient>> {
        return PIDelegateClient.builder()
            .withProcessId(PI_DELEGATE_PROCESS_ID)
            .withAOConfig(AO_CONFIGURATIONS.RANDAO);
    }

    /**
     * Static method to easily build a default Delegate client
     * @param cuUrl Optional Compute Unit URL to override the default
     * @returns A configured PIDelegateClient instance
     */
    public static build(cuUrl?: string): PIDelegateClient {
        const builder = PIDelegateClient.builder()
            .withProcessId(PI_DELEGATE_PROCESS_ID);
        
        // Override the CU URL if provided
        if (cuUrl) {
            builder.withAOConfig({
                MODE: 'legacy',
                CU_URL: cuUrl
            });
        }
        
        return builder.build();
    }
}
