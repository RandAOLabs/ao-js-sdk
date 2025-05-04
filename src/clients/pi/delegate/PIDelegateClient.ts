import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { BaseClient } from "../../../core/ao/BaseClient";
import { ClientError } from "../../common/ClientError";
import { IPIDelegateClient, DelegationInfo } from "./abstract/IPIDelegateClient";
import { 
    ACTION_GET_DELEGATIONS,
    ACTION_INFO,
} from "../constants";

/**
 * Client for interacting with the PI delegate process.
 */
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
            throw new ClientError(this, this.getInfo, {}, error);
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
}
