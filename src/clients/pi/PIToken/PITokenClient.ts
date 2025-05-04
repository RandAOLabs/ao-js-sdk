import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { BaseClient } from "../../../core/ao/BaseClient";
import { Tags } from "../../../core/common";
import { ClientError } from "../../common/ClientError";
import { 
    ACTION_BALANCE,
    ACTION_GET_CLAIMABLE_BALANCE,
    ACTION_GET_YIELD_TICK_HISTORY,
    ACTION_INFO,
} from "../constants";
import { IPITokenClient, TickHistoryEntry } from "./abstract/IPITokenClient";

/**
 * Client for interacting with a specific PI token process.
 */
export class PITokenClient extends BaseClient implements IPITokenClient {
    /**
     * Gets information about the PI token process.
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
     * Gets the tick history from the PI token process.
     * @returns Promise resolving to the tick history data as a string
     */
    public async getTickHistory(): Promise<string> {
        try {
            const response = await this.dryrun('', [
                { name: "Action", value: ACTION_GET_YIELD_TICK_HISTORY }
            ]);
            
            // Robust response checking
            try {
                // First check if Data exists in the first message
                if (response?.Messages?.[0]?.Data) {
                    console.log(`[PITokenClient] Found tick history data in Messages[0].Data`);
                    return response.Messages[0].Data;
                }
                
                // Look for tags with tick history data
                if (response?.Messages?.[0]?.Tags?.length > 0) {
                    const tickHistoryTag = response.Messages[0].Tags.find((tag: { name: string, value: string }) => 
                        tag.name === 'Tick-History' || tag.name === 'History');
                        
                    if (tickHistoryTag) {
                        console.log(`[PITokenClient] Found tick history data in tag: ${tickHistoryTag.name}`);
                        return tickHistoryTag.value;
                    }
                    
                    // Look for a specific Action response tag
                    const actionTag = response.Messages[0].Tags.find((tag: { name: string, value: string }) => 
                        tag.name === 'Action' && tag.value === 'Resp-Get-Yield-Tick-History');
                    
                    if (actionTag) {
                        console.log(`[PITokenClient] Found Resp-Get-Yield-Tick-History action tag, but no data`);
                        // In this case, it's a valid response but with no data
                        return '[]';
                    }
                }
            } catch (parseError) {
                console.error(`[PITokenClient] Error parsing tick history response:`, parseError);
                // Continue to fallback handling
            }
            
            // Check if it's a specific error response we can handle
            // Use optional chaining with any type for state object since it's not in the type definition
            if ((response as any)?.State?.error) {
                console.warn(`[PITokenClient] State error in response: ${(response as any).State.error}`);
                // Process might not support this action
                return '[]';
            }
            
            // Return empty array if no data found - will be parsed as empty array
            console.warn(`[PITokenClient] No tick history data found in response, returning empty array`);
            return '[]';
        } catch (error: any) {
            console.error(`[PITokenClient] Error in getTickHistory:`, error);
            // Instead of throwing, return an empty array
            return '[]';
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
     * Gets the balance from the PI token process.
     * @param target Optional target wallet address. If not provided, uses the calling wallet address.
     * @returns Promise resolving to the balance as a string
     */
    public async getBalance(target?: string): Promise<string> {
        try {
            const tags: Tags = [{ name: "Action", value: ACTION_BALANCE }];
            
            // Add target if provided, otherwise the process will use the calling wallet
            if (target) {
                tags.push({ name: "Target", value: target });
            }
            
            const response = await this.dryrun('', tags);
            
            // Robust response checking
            try {
                // First check if Data exists in the first message
                if (response?.Messages?.[0]?.Data) {
                    console.log(`[PITokenClient] Found balance in Messages[0].Data: ${response.Messages[0].Data}`);
                    return response.Messages[0].Data;
                }
                
                // Look for tags with balance data
                if (response?.Messages?.[0]?.Tags?.length > 0) {
                    // Look for Balance tag which contains the balance value
                    const balanceTag = response.Messages[0].Tags.find((tag: { name: string, value: string }) => 
                        tag.name === 'Balance');
                    
                    if (balanceTag) {
                        console.log(`[PITokenClient] Found balance in Balance tag: ${balanceTag.value}`);
                        return balanceTag.value;
                    }
                    
                    // Look for an Account tag which often appears with balance info
                    const accountTag = response.Messages[0].Tags.find((tag: { name: string, value: string }) => 
                        tag.name === 'Account');
                    
                    if (accountTag) {
                        console.log(`[PITokenClient] Found Account tag: ${accountTag.value}`);
                        // When we have an account tag, the balance is likely in another tag nearby
                    }
                }
            } catch (parseError) {
                console.error(`[PITokenClient] Error parsing balance response:`, parseError);
                // Continue to fallback handling
            }
            
            // Check if it's a specific error response we can handle
            // Note: State property is not in DryRunResult type but can exist in runtime
            if ((response as any)?.State?.error) {
                console.warn(`[PITokenClient] State error in response: ${(response as any).State.error}`);
                // Process might not support this action
                return '0';
            }
            
            // Default to 0 if no balance found
            console.warn(`[PITokenClient] No balance data found in response, returning 0`);
            return '0';
        } catch (error: any) {
            console.error(`[PITokenClient] Error in getBalance:`, error);
            // Instead of throwing, return zero
            return '0';
        }
    }
    
    /**
     * Gets the claimable balance from the PI token process.
     * @returns Promise resolving to the claimable balance as a string
     */
    public async getClaimableBalance(): Promise<string> {
        try {
            const response = await this.dryrun('', [
                { name: "Action", value: ACTION_GET_CLAIMABLE_BALANCE }
            ]);
            
            // Robust response checking
            try {
                // First check if Data exists in the first message
                if (response?.Messages?.[0]?.Data) {
                    console.log(`[PITokenClient] Found claimable balance in Messages[0].Data: ${response.Messages[0].Data}`);
                    return response.Messages[0].Data;
                }
                
                // Look for tags with balance data
                if (response?.Messages?.[0]?.Tags?.length > 0) {
                    // Look for Balance tag which contains the claimable balance value
                    const balanceTag = response.Messages[0].Tags.find((tag: { name: string, value: string }) => 
                        tag.name === 'Balance');
                    
                    if (balanceTag) {
                        console.log(`[PITokenClient] Found claimable balance in Balance tag: ${balanceTag.value}`);
                        return balanceTag.value;
                    }
                    
                    // Look for a specific Action response tag
                    const actionTag = response.Messages[0].Tags.find((tag: { name: string, value: string }) => 
                        tag.name === 'Action' && tag.value === 'Resp-Get-Claimable-Balance');
                    
                    if (actionTag) {
                        console.log(`[PITokenClient] Found Resp-Get-Claimable-Balance action tag, looking for balance info`);
                        // When this tag is present, we should have a balance somewhere
                        const forAccountTag = response.Messages[0].Tags.find((tag: { name: string, value: string }) => 
                            tag.name === 'For-Account');
                            
                        if (forAccountTag) {
                            console.log(`[PITokenClient] Found For-Account tag: ${forAccountTag.value}`);
                            // This is likely a valid response
                        }
                    }
                }
            } catch (parseError) {
                console.error(`[PITokenClient] Error parsing claimable balance response:`, parseError);
                // Continue to fallback handling
            }
            
            // Check if it's a specific error response we can handle
            // Note: State property is not in DryRunResult type but can exist in runtime
            if ((response as any)?.State?.error) {
                console.warn(`[PITokenClient] State error in response: ${(response as any).State.error}`);
                // Process might not support this action
                return '0';
            }
            
            // Default to 0 if no balance found
            console.warn(`[PITokenClient] No claimable balance data found in response, returning 0`);
            return '0';
        } catch (error: any) {
            console.error(`[PITokenClient] Error in getClaimableBalance:`, error);
            // Instead of throwing, return zero
            return '0';
        }
    }
}
