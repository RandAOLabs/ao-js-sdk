import { StakingClient } from "../../ao";
import { InputValidationError } from "../../bazar";
import { ProcessClientError } from "../../common/ProcessClientError";
import { TokenInterfacingClientBuilder } from "../../common/TokenInterfacingClientBuilder";
import { ProviderDetails } from "../provider-profile";
import { IProviderStakingClient } from "./abstract/IProviderStakingClient";
import { ProviderStakeInfo } from "./abstract/types";
import { PROVIDER_MINIMUM_STAKE } from "./constants";
import { Tags } from "../../../core";
import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { PROCESS_IDS } from "../../../constants/processIds";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "../../../utils";

/**
 * Global record for updating a provider actor
 */
export interface UpdateProviderActorData {
	actorId: string;
}

/**
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class ProviderStakingClient extends StakingClient implements IProviderStakingClient {
	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): ProviderStakingClient {
		return ProviderStakingClient.defaultBuilder()
			.build()
	}

	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
	public static defaultBuilder(): TokenInterfacingClientBuilder<ProviderStakingClient> {
		return new TokenInterfacingClientBuilder(ProviderStakingClient)
			.withProcessId(PROCESS_IDS.RANDAO.STAKING)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
			.withTokenProcessId(PROCESS_IDS.RANDAO.STAKING_TOKEN)
			.withTokenAOConfig(AO_CONFIGURATIONS.RANDAO)
	}
	/**
	 * @inheritdoc
	 * @override
	 */
	public async stake(quantity: string, additionaForwardedlTags?: Tags, actorId?: string): Promise<boolean> {
		try {
			// Add actor ID to tags if provided
			if (actorId) {
				const actorTags: Tags = [{ name: "X-Actor", value: actorId }];
				additionaForwardedlTags = additionaForwardedlTags 
					? [...additionaForwardedlTags, ...actorTags] 
					: actorTags;
			}
			return super.stake(quantity, additionaForwardedlTags)
		} catch (error: any) {
			throw new ProcessClientError(this, this.stake, { quantity, additionaForwardedlTags, actorId }, error);
		}
	}

	public async stakeWithDetails(quantity: string, providerDetails?: ProviderDetails, actorId?: string): Promise<boolean> {
		try {

			let additionaForwardedlTags: Tags | undefined = undefined;
			
			if (providerDetails) {
				additionaForwardedlTags = [{
					name: "ProviderDetails",
					value: JSON.stringify(providerDetails)
				}];
			}

			// Add actor ID to tags if provided
			if (actorId) {
				const actorTags: Tags = [{ name: "X-Actor", value: actorId }];
				additionaForwardedlTags = additionaForwardedlTags 
					? [...additionaForwardedlTags, ...actorTags] 
					: actorTags;
			}
			
			const success = await super.stake(quantity, additionaForwardedlTags);
			return success
		} catch (error: any) {
			throw new ProcessClientError(this, this.stakeWithDetails, { quantity, providerDetails }, error);
		}
	}

	public async getStake(providerId: string): Promise<ProviderStakeInfo> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Get-Provider-Stake" }
			];
			const requestData = JSON.stringify({ providerId });
			const result = await this.dryrun(requestData, tags);
			const stakeStringJson = ResultUtils.getFirstMessageDataString(result);
			const stake: ProviderStakeInfo = JSON.parse(stakeStringJson)

			return stake;
		} catch (error: any) {
			throw new ProcessClientError(this, this.getStake, { providerId }, error);

		}
	}

	/**
	 * Updates the provider actor for a staker
	 * @param providerId - The ID of the provider
	 * @param actorId - The ID of the actor being authorized
	 * @returns Promise resolving to a boolean indicating success
	 */
	public async updateProviderActor(providerId: string, actorId: string): Promise<boolean> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Update-Provider-Actor" }
			];
			const data: UpdateProviderActorData = { actorId };
			const requestData = JSON.stringify({ providerId, ...data });
			const result = await this.message(requestData, tags);
			return true;
		} catch (error: any) {
			throw new ProcessClientError(this, this.updateProviderActor, { providerId, actorId }, error);
		}
	}

	/** @Override  */
	public async unstake(providerId: string): Promise<boolean> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Unstake" }
			];
			const data = JSON.stringify({ providerId })
			const result = await super.unstake(data)
			return result
		} catch (error: any) {
			throw new ProcessClientError(this, this.unstake, { providerId }, error);
		}
	}
}
