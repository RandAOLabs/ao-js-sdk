
import { TokenClient, TokenClientConfig } from "../../ao";
import { IRandomClient, RandomClientConfig, GetProviderAvailableValuesResponse, GetOpenRandomRequestsResponse, GetRandomRequestsResponse, ProviderActivity, CommitParams, RevealParams, GetUserInfoResponse, MonitoringData } from "./abstract";
import { Tags } from "../../../core";
import { BaseClient } from "../../../core/ao/BaseClient";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "../../../utils";
import { ARIOService } from "../../../services";
import { TokenInterfacingClientBuilder } from "../../common/TokenInterfacingClientBuilder";
import { DOMAIN } from "../../../services/ario/domains";
import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import { PROCESS_IDS } from "../../../processes/ids";
import { ClientError } from "../../common/ClientError";
import TAGS from "./tags";
import { RandomProcessError } from "./RandomProcessError";
import { IClassBuilder } from "../../../utils/class-interfaces/IClientBuilder";
import { DryRunResult, MessageResult } from "../../../core/ao/abstract";

/**
 * @category RandAO
 * @see {@link https://github.com/RandAOLabs/Random-Process | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
@staticImplements<IClassBuilder>()
export class RandomClient extends BaseClient implements IRandomClient {
	/* Fields */
	readonly tokenClient: TokenClient;
	/* Fields */

	/* Constructors */
	/**
	 * @override
	 */
	public constructor(randomConfig: RandomClientConfig) {
		super(randomConfig)
		const tokenConfig: TokenClientConfig = {
			processId: randomConfig.tokenProcessId,
			wallet: randomConfig.wallet,
			aoConfig: randomConfig.aoConfig,
			retriesEnabled: randomConfig.retriesEnabled
		}
		this.tokenClient = new TokenClient(tokenConfig)
	}

	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static async autoConfiguration(): Promise<RandomClient> {
		const builder = await RandomClient.defaultBuilder()
		return builder
			.build()
	}

	public static builder(): TokenInterfacingClientBuilder<RandomClient> {
		return new TokenInterfacingClientBuilder(RandomClient)
	}

	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
	public static async defaultBuilder(): Promise<TokenInterfacingClientBuilder<RandomClient>> {
		const ario = ARIOService.getInstance()
		const randomProcessId = await ario.getProcessIdForDomain(DOMAIN.RANDAO_API)
		return RandomClient.builder()
			.withProcessId(randomProcessId)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
			.withTokenProcessId(PROCESS_IDS.RANDAO.RNG_TOKEN)
			.withTokenAOConfig(AO_CONFIGURATIONS.RANDAO)
	}
	/* Constructors */

	/* Core Random Functions */
	async crank(): Promise<void> {
		try {
			const tags: Tags = [
				TAGS.ACTION.CRANK
			];
			await this.message(undefined, tags);
		} catch (error: any) {
			throw new ClientError(this, this.crank, {}, error);
		}
	}

	async claimRewards(): Promise<void> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Claim-Fulfillment-Rewards" }
			];
			await this.message(undefined, tags);
		} catch (error: any) {
			throw new ClientError(this, this.claimRewards, {}, error);
		}
	}

	async commit(params: CommitParams): Promise<void> {
		try {
			const tags: Tags = [
				TAGS.ACTION.COMMIT
			];
			const data = JSON.stringify(params);
			await this.message(data, tags);
		} catch (error: any) {
			throw new ClientError(this, this.commit, params, error);
		}
	}

	async reveal(params: RevealParams): Promise<void> {
		try {
			const tags: Tags = [
				TAGS.ACTION.REVEAL
			];
			const data = JSON.stringify(params);
			await this.message(data, tags);
		} catch (error: any) {
			throw new ClientError(this, this.reveal, params, error);
		}
	}

	async getProviderAvailableValues(providerId: string): Promise<GetProviderAvailableValuesResponse> {
		try {
			const tags: Tags = [
				TAGS.ACTION.GET_PROVIDER_RANDOM_BALANCE
			];
			const data = JSON.stringify({ providerId });
			const result = await this.dryrun(data, tags);
			this.checkResultForErrors(result)
			return await ResultUtils.getFirstMessageDataJson(result)
		} catch (error: any) {
			throw new ClientError(this, this.getProviderAvailableValues, { providerId }, error);
		}
	}

	async getUserInfo(userId: string): Promise<GetUserInfoResponse> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Get-User-Info" }
			];
			const data = JSON.stringify({ userId });
			const result = await this.dryrun(data, tags);
			this.checkResultForErrors(result)
			return await ResultUtils.getFirstMessageDataJson(result)
		} catch (error: any) {
			throw new ClientError(this, this.getUserInfo, { userId }, error);
		}
	}

	async getAllUserInfo(): Promise<GetUserInfoResponse[]> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Get-All-User-Info" }
			];

			const result = await this.dryrun(undefined, tags);
			this.checkResultForErrors(result)
			return await ResultUtils.getFirstMessageDataJson(result)
		} catch (error: any) {
			throw new ClientError(this, this.getAllUserInfo, {}, error);
		}
	}

	async redeem(providersIds?: string[], requestedInputs?: number, callbackId?: string): Promise<boolean> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Redeem-Random-Credit" }
			];
			if (providersIds) {
				tags.push({ name: "Providers", value: JSON.stringify({ provider_ids: providersIds }) });
			}
			if (requestedInputs) {
				tags.push({ name: "RequestedInputs", value: JSON.stringify({ requested_inputs: requestedInputs }) });
			}
			if (callbackId) {
				tags.push({ name: "CallbackId", value: callbackId });
			}
			const data = JSON.stringify({ providersIds, requestedInputs, callbackId });
			const result = await this.message(data, tags);
			console.log(result)
			//this.checkResultForErrors(result)
			return true
		} catch (error: any) {
			throw new ClientError(this, this.redeem, { providersIds, requestedInputs, callbackId }, error);
		}
	}

	async updateProviderAvailableValues(availableRandomValues: number, info?: MonitoringData): Promise<boolean> {
		try {
			const tags: Tags = [
				TAGS.ACTION.UPDATE_PROVIDER_RANDOM_BALANCE,
			];
			let data = JSON.stringify({ availableRandomValues });
			if (info) {
				tags.push({ name: "ProviderInfo", value: JSON.stringify(info) });
			}
			const result = await this.messageResult(data, tags);
			this.checkResultForErrors(result)
			return true
		} catch (error: any) {
			throw new ClientError(this, this.updateProviderAvailableValues, { availableRandomValues }, error);
		}
	}

	async getOpenRandomRequests(provider: string): Promise<GetOpenRandomRequestsResponse> {
		try {
			const tags: Tags = [
				TAGS.ACTION.GET_OPEN_RANDOM_REQUESTS
			];
			const data = JSON.stringify({ providerId: provider });
			const result = await this.dryrun(data, tags);
			this.checkResultForErrors(result)
			return ResultUtils.getFirstMessageDataJson(result)
		} catch (error: any) {
			throw new ClientError(this, this.getOpenRandomRequests, { provider }, error);
		}
	}

	async getRandomRequests(randomnessRequestIds: string[]): Promise<GetRandomRequestsResponse> {
		try {
			const tags: Tags = [
				TAGS.ACTION.GET_RANDOM_REQUESTS
			];
			const data = JSON.stringify({ requestIds: randomnessRequestIds });
			const result = await this.dryrun(data, tags);
			this.checkResultForErrors(result)
			return ResultUtils.getFirstMessageDataJson(result)
		} catch (error: any) {
			throw new ClientError(this, this.getRandomRequests, { randomnessRequestIds }, error);
		}
	}

	async getRandomRequestViaCallbackId(callbackId: string): Promise<GetRandomRequestsResponse> {
		try {
			const tags: Tags = [
				TAGS.ACTION.GET_RANDOM_REQUEST_VIA_CALLBACK_ID
			];
			const data = JSON.stringify({ callbackId });
			const result = await this.dryrun(data, tags);
			this.checkResultForErrors(result)
			return ResultUtils.getFirstMessageDataJson(result)
		} catch (error: any) {
			throw new ClientError(this, this.getRandomRequestViaCallbackId, { callbackId }, error);
		}
	}

	async createRequest(provider_ids: string[], requestedInputs?: number, callbackId: string = ''): Promise<boolean> {
		try {
			const paymentAmount = "1000000000"; // TODO: Determine payment amount dynamically if needed
			const tags: Tags = [
				{ name: "Providers", value: JSON.stringify({ provider_ids }) },
				{ name: "CallbackId", value: callbackId },
			];

			if (requestedInputs !== undefined) {
				tags.push({ name: "RequestedInputs", value: JSON.stringify({ requested_inputs: requestedInputs }) });
			}

			return await this.tokenClient.transfer(this.getProcessId(), paymentAmount, tags);
		} catch (error: any) {
			throw new ClientError(this, this.createRequest, { provider_ids, requestedInputs, callbackId }, error);
		}
	}

	async prepay(quantity: number, userId?: string): Promise<boolean> {
		try {
			const paymentAmount = quantity.toString();
			const tags: Tags = [
				{ name: "Prepayment", value: "true" },
			];

			if (userId) {
				tags.push({ name: "PrepaymentUser", value: userId });
			}

			return await this.tokenClient.transfer(this.getProcessId(), paymentAmount, tags);
		} catch (error: any) {
			throw new ClientError(this, this.prepay, { quantity, userId }, error);
		}
	}

	async getAllProviderActivity(): Promise<ProviderActivity[]> {
		try {
			const tags: Tags = [
				TAGS.ACTION.GET_ALL_PROVIDERS
			];
			const result = await this.dryrun(undefined, tags);
			this.checkResultForErrors(result)
			return ResultUtils.getFirstMessageDataJson(result)
		} catch (error: any) {
			throw new ClientError(this, this.getAllProviderActivity, null, error);
		}
	}

	async getProviderActivity(providerId: String): Promise<ProviderActivity> {
		try {
			const tags: Tags = [
				TAGS.ACTION.GET_PROVIDER
			];
			const data = JSON.stringify({ providerId: providerId })
			const result = await this.dryrun(data, tags);
			this.checkResultForErrors(result)
			return ResultUtils.getFirstMessageDataJson(result)
		} catch (error: any) {
			throw new ClientError(this, this.getAllProviderActivity, { providerId }, error);
		}
	}

	/* Core Random Functions */

	/* Utilities */
	private checkResultForErrors(result: MessageResult | DryRunResult) {
		if (result.Messages) {
			for (let msg of result.Messages) {
				const tags: Tags = msg.Tags;
				for (let tag of tags) {
					if (tag.name == "Error") {
						throw new RandomProcessError(`Error originating in process: ${this.getProcessId()}`)
					}
				}
			}
		}
	}
	/* Utilities */
}
