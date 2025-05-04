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
     * Gets yield tick history information.
     * @returns Promise resolving to tick history data as a string
     */
    public async getTickHistory(): Promise<string> {
        try {
            const response = await this.dryrun('', [
                { name: "Action", value: ACTION_GET_YIELD_TICK_HISTORY }
            ]);
            
            // Extract data from response
            const dataString = response.Messages[0].Data;
            return dataString;
        } catch (error: any) {
            throw new ClientError(this, this.getTickHistory, {}, error);
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
            const response = await this.dryrun('', [
                { name: "Action", value: ACTION_GET_CLAIMABLE_BALANCE }
            ]);
            
            // Extract data from response
            return response.Messages[0].Data;
        } catch (error: any) {
            throw new ClientError(this, this.getClaimableBalance, {}, error);
        }
    }
}
