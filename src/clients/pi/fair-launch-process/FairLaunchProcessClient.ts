import { BaseClient } from "../../../core/ao/BaseClient";
import { ClientBuilder } from "../../common";
import { IFairLaunchProcessClient } from "./abstract/IFairLaunchProcessClient";

import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import { FairLaunchInfo, ProceedsData } from "./types";
import { ProcessClientError } from "../../common/ProcessClientError";
import TagUtils from "../../../core/common/TagUtils";
import { DryRunResult } from "../../../core/ao/abstract";
import { Logger } from "../../../utils/logger";


/**
 * Client for interacting with a Fair Launch Process.
 * @category Autonomous Finance
 */
export class FairLaunchProcessClient extends BaseClient implements IFairLaunchProcessClient {
	/**@constructor */
	public static from(processId: string, wallet?: any): FairLaunchProcessClient {
		return new ClientBuilder(FairLaunchProcessClient)
			.withProcessId(processId)
			.withAOConfig(AO_CONFIGURATIONS.FORWARD_RESEARCH)
			.withWallet(wallet)
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
			throw new ProcessClientError(this, this.getInfo, {}, error);
		}
	}

	/**
	 * Gets the withdrawable AO amount for a specific time.
	 * @param time Optional timestamp to check withdrawable amount at (defaults to current time)
	 * @returns Promise resolving to withdrawable AO amount as string
	 */
	public async getWithdrawableAo(time?: number): Promise<string> {
		try {
			const tags = [
				{ name: "Action", value: "Get-Withdrawable-AO" }
			];

			if (time !== undefined) {
				tags.push({ name: "Time", value: time.toString() });
			}

			const result = await this.dryrun('', tags);

			if (!result.Messages || result.Messages.length === 0) {
				throw new Error("No messages found in result");
			}

			const withdrawableAmount = result.Messages[0].Data || "0";
			Logger.debug(`getWithdrawableAo result: ${withdrawableAmount}`, { time, result });

			return withdrawableAmount;

		} catch (error: any) {
			throw new ProcessClientError(this, this.getWithdrawableAo, { time }, error);
		}
	}

	/**
	 * Gets the withdrawable PI amount for a specific time.
	 * @param time Optional timestamp to check withdrawable amount at (defaults to current time)
	 * @returns Promise resolving to withdrawable PI amount as string
	 */
	public async getWithdrawablePi(time?: number): Promise<string> {
		try {
			const tags = [
				{ name: "Action", value: "Get-Withdrawable-PI" }
			];

			if (time !== undefined) {
				tags.push({ name: "Time", value: time.toString() });
			}

			const result = await this.dryrun('', tags);

			if (!result.Messages || result.Messages.length === 0) {
				throw new Error("No messages found in result");
			}

			const withdrawableAmount = result.Messages[0].Data || "0";
			Logger.debug(`getWithdrawablePi result: ${withdrawableAmount}`, { time, result });

			return withdrawableAmount;

		} catch (error: any) {
			throw new ProcessClientError(this, this.getWithdrawablePi, { time }, error);
		}
	}

	/**
	 * Withdraws available AO tokens to the treasury.
	 * Only the deployer can perform this action.
	 * @returns Promise resolving to the withdrawal result
	 */
	public async withdrawAo(): Promise<any> {
		try {
			const tags = [
				{ name: "Action", value: "Withdraw-AO" }
			];

			const result = await this.messageResult('', tags);
			Logger.debug(`withdrawAo result:`, result);

			return result;

		} catch (error: any) {
			throw new ProcessClientError(this, this.withdrawAo, {}, error);
		}
	}

	/**
	 * Withdraws available PI tokens to the treasury.
	 * Only the deployer can perform this action.
	 * @returns Promise resolving to the withdrawal result
	 */
	public async withdrawPi(): Promise<any> {
		try {
			const tags = [
				{ name: "Action", value: "Withdraw-PI" }
			];

			const result = await this.messageResult('', tags);
			Logger.debug(`withdrawPi result:`, result);

			return result;

		} catch (error: any) {
			throw new ProcessClientError(this, this.withdrawPi, {}, error);
		}
	}

	/**
	 * Gets AO proceeds data for all yield cycles.
	 * @returns Promise resolving to proceeds data indexed by yield cycle
	 */
	public async getAoProceeds(): Promise<ProceedsData> {
		try {
			const tags = [
				{ name: "Action", value: "Get-AO-Proceeds" }
			];

			const result = await this.dryrun('', tags);

			if (!result.Messages || result.Messages.length === 0) {
				throw new Error("No messages found in result");
			}

			const proceedsData = this.parseProceedsData(result.Messages[0].Data || "{}");
			Logger.debug(`getAoProceeds result:`, proceedsData);

			return proceedsData;

		} catch (error: any) {
			throw new ProcessClientError(this, this.getAoProceeds, {}, error);
		}
	}

	/**
	 * Gets PI proceeds data for all yield cycles.
	 * @returns Promise resolving to proceeds data indexed by yield cycle
	 */
	public async getPiProceeds(): Promise<ProceedsData> {
		try {
			const tags = [
				{ name: "Action", value: "Get-PI-Proceeds" }
			];

			const result = await this.dryrun('', tags);

			if (!result.Messages || result.Messages.length === 0) {
				throw new Error("No messages found in result");
			}

			const proceedsData = this.parseProceedsData(result.Messages[0].Data || "{}");
			Logger.debug(`getPiProceeds result:`, proceedsData);

			return proceedsData;

		} catch (error: any) {
			throw new ProcessClientError(this, this.getPiProceeds, {}, error);
		}
	}

	/**
	 * Parses proceeds data from JSON string to ProceedsData object
	 * @param data JSON string containing proceeds data
	 * @returns Parsed proceeds data
	 * @private
	 */
	private parseProceedsData(data: string): ProceedsData {
		try {
			return JSON.parse(data);
		} catch (error) {
			Logger.debug(`Failed to parse proceeds data: ${data}`, error);
			return {};
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
