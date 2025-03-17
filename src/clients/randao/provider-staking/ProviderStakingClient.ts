import { StakingClient } from "src/clients/ao";
import { TokenInterfacingClientBuilder } from "src/clients/common/TokenInterfacingClientBuilder";
import { ProviderDetails } from "src/clients/randao/provider-profile";
import { IProviderStakingClient } from "src/clients/randao/provider-staking/abstract/IProviderStakingClient";
import { ProviderStakeInfo } from "src/clients/randao/provider-staking/abstract/types";
import { GetStakeError, ProviderUnstakeError, StakeWithDetailsError } from "src/clients/randao/provider-staking/ProviderStakingError";
import { Tags } from "src/core";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { RANDAO_PROFILE_PROCESS_ID, RANDAO_STAKING_TOKEN_PROCESS_ID } from "src/processes_ids";
import { IAutoconfiguration, IDefaultBuilder, Logger, staticImplements } from "src/utils";

/**
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>() 
@staticImplements<IDefaultBuilder>()
export class ProviderStakingClient extends StakingClient implements IProviderStakingClient {
    public static autoConfiguration(): ProviderStakingClient {
        return ProviderStakingClient.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): TokenInterfacingClientBuilder<ProviderStakingClient> {
        return new TokenInterfacingClientBuilder(ProviderStakingClient)
            .withProcessId(RANDAO_PROFILE_PROCESS_ID)
            .withTokenProcessId(RANDAO_STAKING_TOKEN_PROCESS_ID)
    }

    public async stakeWithDetails(quantity: string, providerDetails?: ProviderDetails): Promise<boolean> {
        try {

            const additionaForwardedlTags = providerDetails
                ? [{
                    name: "ProviderDetails",
                    value: JSON.stringify(providerDetails)
                }]
                : undefined
            const success = await super.stake(quantity, additionaForwardedlTags);
            return success
        } catch (error: any) {
            Logger.error(`Error staking with provider details ${quantity} tokens: ${error.message}`);
            throw new StakeWithDetailsError(error, providerDetails);
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
            Logger.error(`Error getting stake for provider ${providerId}: ${error.message}`);
            throw new GetStakeError(providerId, error);
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
            Logger.error(`Provider Error unstaking for: ${error.message}`);
            throw new ProviderUnstakeError(error);
        }
    }
}
