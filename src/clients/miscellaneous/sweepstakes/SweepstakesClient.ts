import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

import { Tags } from "../../../core";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "../../../utils";
import { ISweepstakesClient, SweepstakesPull, ViewPullsResponse, ViewEntrantsResponse, ViewSweepstakesOwnersResponse } from "../..";
import { ViewPullError } from "./SweepstakesClientError";
import { SweepstakesProcessError } from "./SweepstakesProcessError";
import { BaseClient } from "../../../core/ao/BaseClient";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { ClientBuilder } from "../../common";
import { PROCESS_IDS } from "../../../process-ids";
import { ClientError } from "../../common/ClientError";
import { TokenClient, TokenClientConfig } from "../../ao";

/**
 * @category Miscellaneous
 * @see {@link https://github.com/RandAOLabs/Sweepstakes-Process | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class SweepstakesClient extends BaseClient implements ISweepstakesClient {
	
	readonly tokenClient: TokenClient;

	public constructor(config: TokenClientConfig) {
		super(config);
		this.tokenClient = new TokenClient(config);
	}

	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static autoConfiguration(): SweepstakesClient {
		return SweepstakesClient.defaultBuilder()
			.build()
	}

	/** 
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder} 
	 */
	public static defaultBuilder(): ClientBuilder<SweepstakesClient> {
		return new ClientBuilder(SweepstakesClient)
			.withProcessId(PROCESS_IDS.MISCELLANEOUS.RAFFLE)
	}

	async registerSweepstakes(entrants: string[]): Promise<boolean> {
		try {
			const paymentAmount = "100"; // TODO: Determine payment amount dynamically if needed
			const tags: Tags = [
				{ name: "X-Entrants", value: JSON.stringify({ entrants }) },
			];

			return await this.tokenClient.transfer(this.getProcessId(), paymentAmount, tags);
		} catch (error: any) {
			throw new ClientError(this, this.registerSweepstakes, { entrants }, error);
		}
	}

	/* Core Sweepstakes Functions */
	async setSweepstakesEntrants(entrants: string[]): Promise<boolean> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Update-Sweepstakes-Entry-List" },
			];
			const data = JSON.stringify(entrants);
			const result = await this.messageResult(data, tags);
			this.checkResultForErrors(result)
			return true
		} catch (error: any) {
			throw new ClientError(this, this.setSweepstakesEntrants, { entrants }, error);
		}
	}

	async pullSweepstakes(): Promise<boolean> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Sweepstakes" },
			];
			const result = await this.messageResult(undefined, tags);
			return true
		} catch (error: any) {
			throw new ClientError(this, this.pullSweepstakes, null, error);
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
			throw new ClientError(this, this.viewEntrants, { userId }, error);
		}
	}

	async viewUserPull(userId: string, pullId: string): Promise<SweepstakesPull> {
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
			throw new ClientError(this, this.viewUserPull, { userId, pullId }, error);
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
			const pulls = ResultUtils.getFirstMessageDataJson(result) as SweepstakesPull[];
			return { pulls };
		} catch (error: any) {
			throw new ClientError(this, this.viewUserPulls, { _userId, userId }, error);
		}
	}

	async viewSweepstakesOwners(): Promise<ViewSweepstakesOwnersResponse> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "View-Sweepstakes-Owners" },
			];
			const result = await this.dryrun(undefined, tags);
			this.checkResultForErrors(result);
			return ResultUtils.getFirstMessageDataJson(result);
		} catch (error: any) {
			throw new ClientError(this, this.viewSweepstakesOwners, null, error);
		}
	}

	/* Core Sweepstakes Functions */

	/* Utilities */
	async viewMostRecentPull(): Promise<SweepstakesPull> {
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
			throw new ClientError(this, this.viewMostRecentPull, null, error);
		}
	}
	/* Utilities */
	/* Private */
	private checkResultForErrors(result: MessageResult | DryRunResult) {
		for (let msg of result.Messages) {
			const tags: Tags = msg.Tags;
			for (let tag of tags) {
				if (tag.name == "Error") {
					throw new SweepstakesProcessError(`Error originating in process: ${this.getProcessId()}`)
				}
			}
		}
	}
	/* Private */

}
