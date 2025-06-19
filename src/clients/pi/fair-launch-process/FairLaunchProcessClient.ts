import { BaseClient } from "../../../core/ao/BaseClient";
import { ClientBuilder } from "../../common";
import { IFairLaunchProcessClient } from "./abstract/IFairLaunchProcessClient";

import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { FairLaunchInfo } from "./types";
import { ClientError } from "../../common/ClientError";
import TagUtils from "../../../core/common/TagUtils";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";


/**
 * Client for interacting with a Fair Launch Process.
 * @category Autonomous Finance
 */
export class FairLaunchProcessClient extends BaseClient implements IFairLaunchProcessClient {
	/**@constructor */
	public static from(processId: string): FairLaunchProcessClient {
		return new ClientBuilder(FairLaunchProcessClient)
			.withProcessId(processId)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
			.build()
	}



    /**
     * Gets information about the Fair Launch Process.
     * @returns Promise resolving to FairLaunchInfo with process information
     */
    public async getInfo(): Promise<FairLaunchInfo> {
        try {
            const result = await this.dryrun('', [
                { name: "Action", value: "Info" }
            ]);
            
            return this.extractFairLaunchInfoFromTags(result);
			
        } catch (error: any) {
            throw new ClientError(this, this.getInfo, {}, error);
        }
    }
        /**
     * Extracts Fair Launch Process information from tags
     * @param result The DryRun result containing tags
     * @returns FairLaunchInfo object with extracted tag values
     * @private
     */
    private extractFairLaunchInfoFromTags(result: DryRunResult): FairLaunchInfo {
        if (!result.Messages || result.Messages.length === 0) {
            throw new Error("No messages found in result");
        }
        
        const tags = result.Messages[0].Tags;
        
        return {
            action: TagUtils.getTagValue(tags, "Action") || "",
            owner: TagUtils.getTagValue(tags, "Owner") || "",
            flpFactory: TagUtils.getTagValue(tags, "FLP_FACTORY") || "",
            flpName: TagUtils.getTagValue(tags, "Flp-Name") || "",
            flpShortDescription: "", // Not in tags
            flpLongDescription: "", // Not in tags
            startsAtTimestamp: TagUtils.getTagValue(tags, "Starts-At-Timestamp") || "",
            endsAtTimestamp: undefined, // Not in tags
            deployer: TagUtils.getTagValue(tags, "Deployer") || "",
            treasury: TagUtils.getTagValue(tags, "Treasury") || "",
            tokenProcess: TagUtils.getTagValue(tags, "Token-Process") || "",
            tokenName: TagUtils.getTagValue(tags, "Token-Name") || "",
            tokenTicker: TagUtils.getTagValue(tags, "Token-Ticker") || "",
            tokenDenomination: TagUtils.getTagValue(tags, "Token-Denomination") || "",
            tokenLogo: TagUtils.getTagValue(tags, "Token-Logo") || "",
            tokenDisclaimer: TagUtils.getTagValue(tags, "Token-Disclaimer") || "",
            tokenUnlockTimestamp: TagUtils.getTagValue(tags, "Token-Unlock-Timestamp"),
            totalDistributionTicks: TagUtils.getTagValue(tags, "Total-Distribution-Ticks") || "",
            tokenSupplyToUse: TagUtils.getTagValue(tags, "Token-Supply-To-Use") || "",
            totalTokenSupplyAtCreation: TagUtils.getTagValue(tags, "Total-Token-Supply-At-Creation") || "",
            socials: TagUtils.getTagValue(tags, "Socials") || "",
            decayFactor: TagUtils.getTagValue(tags, "Decay-Factor") || "",
            lastDayDistribution: "", // Not in tags
            status: TagUtils.getTagValue(tags, "Status") || "",
            distributedQuantity: TagUtils.getTagValue(tags, "Distributed-Quantity") || "",
            accumulatedQuantity: TagUtils.getTagValue(tags, "Accumulated-Quantity") || "",
            withdrawnQuantity: TagUtils.getTagValue(tags, "Withdrawn-Quantity") || "",
            accumulatedPiQuantity: TagUtils.getTagValue(tags, "Accumulated-Pi-Quantity") || "",
            exchangedForPiQuantity: TagUtils.getTagValue(tags, "Exchanged-For-Pi-Quantity") || "",
            withdrawnPiQuantity: TagUtils.getTagValue(tags, "Withdrawn-Pi-Quantity") || "",
            distributionTick: TagUtils.getTagValue(tags, "Distribution-Tick") || "",
            yieldCycle: TagUtils.getTagValue(tags, "Yield-Cycle"),
            aoToken: TagUtils.getTagValue(tags, "AO-Token") || "",
            delegationOracle: TagUtils.getTagValue(tags, "Delegation-Oracle") || "",
            piProcess: TagUtils.getTagValue(tags, "PI-Process") || "",
            piTokenProcess: TagUtils.getTagValue(tags, "PI-Token-Process") || "",
            mintReporter: TagUtils.getTagValue(tags, "Mint-Reporter") || "",
            areGeneralWithdrawalsEnabled: TagUtils.getTagValue(tags, "Are-General-Withdrawals-Enabled") || "",
            areBatchTransfersPossible: TagUtils.getTagValue(tags, "Are-Batch-Transfers-Possible") || ""
        };
    }
}
