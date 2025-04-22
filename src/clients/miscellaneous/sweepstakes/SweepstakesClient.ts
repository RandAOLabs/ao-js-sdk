import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

import { Tags } from "../../../core";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "../../../utils";
import { ISweepstakesClient, SweepstakesClientConfig, SweepstakesPull, ViewSweepstakesPullsResponse, ViewSweepstakesEntrantsResponse, ViewSweepstakesOwnersResponse } from "./abstract";
import { ViewPullError } from "./SweepstakesClientError";
import { SweepstakesProcessError } from "./SweepstakesProcessError";
import { BaseClient } from "../../../core/ao/BaseClient";
import { ARIOService } from "../../../services";
import { DOMAIN } from "../../../services/ario/domains";
import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { ClientBuilder } from "../../common";
import { PROCESS_IDS } from "../../../process-ids";
import { ClientError } from "../../common/ClientError";
import { TokenClient, TokenClientConfig } from "../../ao";
import { TokenInterfacingClientBuilder } from "../../common/TokenInterfacingClientBuilder";
import { IClassBuilder } from "../../../utils/class-interfaces/IClientBuilder";

/**
 * @category Miscellaneous
 * @see {@link https://github.com/RandAOLabs/Sweepstakes-Process | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
@staticImplements<IClassBuilder>()

export class SweepstakesClient extends BaseClient implements ISweepstakesClient {
	
	readonly tokenClient: TokenClient;
	// TODO 
	public constructor(sweepstakesConfig: SweepstakesClientConfig) {
		super(sweepstakesConfig);
		const tokenConfig: TokenClientConfig = {
			processId: sweepstakesConfig.tokenProcessId,
			wallet: sweepstakesConfig.wallet,
			aoConfig: sweepstakesConfig.aoConfig,
			retriesEnabled: sweepstakesConfig.retriesEnabled
		}
		this.tokenClient = new TokenClient(tokenConfig);
	}

	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static async autoConfiguration(): Promise<SweepstakesClient> {
		const builder = await SweepstakesClient.defaultBuilder();

		return builder
			.build()
	}

	public static builder(): TokenInterfacingClientBuilder<SweepstakesClient> {
		return new TokenInterfacingClientBuilder(SweepstakesClient)
	}

	/** 
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder} 
	 */
	public static async defaultBuilder(): Promise<TokenInterfacingClientBuilder<SweepstakesClient>> {
		const sweepstakesProcessId = PROCESS_IDS.MISCELLANEOUS.SWEEPSTAKES
		return SweepstakesClient.builder()
			.withProcessId(sweepstakesProcessId)
			.withTokenProcessId(PROCESS_IDS.MISCELLANEOUS.SWEEPSTAKES_TOKEN)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
	}

	async registerSweepstakes(entrants: string[]): Promise<boolean> {
		try {
			const paymentAmount = "100000000000"; // TODO: Determine payment amount dynamically if needed
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
				{ name: "Action", value: "Pull-Sweepstakes" },
			];
			const result = await this.messageResult(undefined, tags);
			return true
		} catch (error: any) {
			throw new ClientError(this, this.pullSweepstakes, null, error);
		}
	}

	async viewSweepstakesEntrants(userId: string): Promise<ViewSweepstakesEntrantsResponse> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "View-Entrants" },
				{ name: "UserId", value: userId },
			];
			const result = await this.dryrun(undefined, tags);
			this.checkResultForErrors(result);
			return ResultUtils.getFirstMessageDataJson(result);
		} catch (error: any) {
			throw new ClientError(this, this.viewSweepstakesEntrants, { userId }, error);
		}
	}

	async viewUserSweepstakesPull(userId: string, pullId: string): Promise<SweepstakesPull> {
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
			throw new ClientError(this, this.viewUserSweepstakesPull, { userId, pullId }, error);
		}
	}

	async viewUserSweepstakesPulls(_userId?: string): Promise<ViewSweepstakesPullsResponse> {
		const userId: string = _userId ? _userId : await this.getCallingWalletAddress();
		try {
			const tags: Tags = [
				{ name: "Action", value: "Get-Sweepstakes" },
				{ name: "UserId", value: userId },
			];

			const result = await this.dryrun(undefined, tags);
			this.checkResultForErrors(result);
			const pulls = ResultUtils.getFirstMessageDataJson(result) as SweepstakesPull[];
			return { pulls };
		} catch (error: any) {
			throw new ClientError(this, this.viewUserSweepstakesPulls, { _userId, userId }, error);
		}
	}

	async viewSweepstakesOwners(): Promise<ViewSweepstakesOwnersResponse> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "View-Sweepstakes-Whitelist" },
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
