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
     * Gets delegation information.
     * @returns Promise resolving to delegation information details
     */
    public async getDelegation(): Promise<string> {
        try {
            const response = await this.dryrun('', [
                { name: "Action", value: ACTION_GET_DELEGATIONS }
            ]);
            
            // Extract data from response
            const dataString = response.Messages[0].Data;
            return dataString;
        } catch (error: any) {
            throw new ClientError(this, this.getDelegation, {}, error);
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
