

import { Tags } from "../../../core";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "../../../utils";
import { IRaffleClient, RafflePull, ViewPullsResponse, ViewEntrantsResponse, ViewRaffleOwnersResponse } from "../..";
import { ViewPullError } from "./RaffleClientError";
import { RaffleProcessError } from "./RaffleProcessError";
import { BaseClient } from "../../../core/ao/BaseClient";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { ClientBuilder } from "../../common";
import { PROCESS_IDS } from "../../../constants/processIds";
import { ProcessClientError } from "../../common/ProcessClientError";
import { DryRunResult, MessageResult } from "../../../core/ao/abstract";

/**
 * @category Miscellaneous
 * @see {@link https://github.com/RandAOLabs/Raffle-Process | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class RaffleClient extends BaseClient implements IRaffleClient {
	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): RaffleClient {
		return RaffleClient.defaultBuilder()
			.build()
	}

	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
	public static defaultBuilder(): ClientBuilder<RaffleClient> {
		return new ClientBuilder(RaffleClient)
			.withProcessId(PROCESS_IDS.MISCELLANEOUS.RAFFLE)
	}

	/* Core Raffle Functions */
	async setRaffleEntrants(entrants: string[]): Promise<boolean> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Update-Raffle-Entry-List" },
			];
			const data = JSON.stringify(entrants);
			const result = await this.messageResult(data, tags);
			this.checkResultForErrors(result)
			return true
		} catch (error: any) {
			throw new ProcessClientError(this, this.setRaffleEntrants, { entrants }, error);
		}
	}

	async pullRaffle(): Promise<boolean> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Raffle" },
			];
			const result = await this.messageResult(undefined, tags);
			return true
		} catch (error: any) {
			throw new ProcessClientError(this, this.pullRaffle, null, error);
		}
	}

	async viewEntrants(userId: string): Promise<ViewEntrantsResponse> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "View-Entrants" },
				{ name: "UserId", value: userId },
			];
			const result = await this.dryrun(undefined, tags);
			this.checkResultForErrors(result);
			return ResultUtils.getFirstMessageDataJson(result);
		} catch (error: any) {
			throw new ProcessClientError(this, this.viewEntrants, { userId }, error);
		}
	}

	async viewUserPull(userId: string, pullId: string): Promise<RafflePull> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "View-Pull" },
				{ name: "UserId", value: userId },
				{ name: "PullId", value: pullId },
			];
			const result = await this.dryrun(undefined, tags);
			this.checkResultForErrors(result);
			return ResultUtils.getFirstMessageDataJson(result);
		} catch (error: any) {
			throw new ProcessClientError(this, this.viewUserPull, { userId, pullId }, error);
		}
	}

	async viewUserPulls(_userId?: string): Promise<ViewPullsResponse> {
		const userId: string = _userId ? _userId : await this.getCallingWalletAddress();
		try {
			const tags: Tags = [
				{ name: "Action", value: "View-Pulls" },
				{ name: "UserId", value: userId },
			];

			const result = await this.dryrun(undefined, tags);
			this.checkResultForErrors(result);
			const pulls = ResultUtils.getFirstMessageDataJson(result) as RafflePull[];
			return { pulls };
		} catch (error: any) {
			throw new ProcessClientError(this, this.viewUserPulls, { _userId, userId }, error);
		}
	}

	async viewRaffleOwners(): Promise<ViewRaffleOwnersResponse> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "View-Raffle-Owners" },
			];
			const result = await this.dryrun(undefined, tags);
			this.checkResultForErrors(result);
			return ResultUtils.getFirstMessageDataJson(result);
		} catch (error: any) {
			throw new ProcessClientError(this, this.viewRaffleOwners, null, error);
		}
	}

	/* Core Raffle Functions */

	/* Utilities */
	async viewMostRecentPull(): Promise<RafflePull> {
		try {
			const { pulls } = await this.viewUserPulls();
			if (pulls.length === 0) {
				throw new ViewPullError(new Error("No pulls found"));
			}
			// Find pull with highest ID
			const mostRecent = pulls.reduce((max, current) =>
				current.Id > max.Id ? current : max
			);
			return mostRecent;
		} catch (error: any) {
			throw new ProcessClientError(this, this.viewMostRecentPull, null, error);
		}
	}
	/* Utilities */
	/* Private */
	private checkResultForErrors(result: MessageResult | DryRunResult) {
		for (let msg of result.Messages) {
			const tags: Tags = msg.Tags;
			for (let tag of tags) {
				if (tag.name == "Error") {
					throw new RaffleProcessError(`Error originating in process: ${this.getProcessId()}`)
				}
			}
		}
	}
	/* Private */

}
