import { ProviderDetails } from "src/clients/randao/provider-profile";
import { IProviderStakingClient } from "src/clients/randao/provider-staking/abstract/IProviderStakingClient";
import { ProviderStakeInfo } from "src/clients/randao/provider-staking/abstract/types";
import { getProviderStakingClientAutoConfiguration } from "src/clients/randao/provider-staking/ProviderStakingClientAutoConfiguration";
import { GetStakeError, ProviderUnstakeError, StakeWithDetailsError } from "src/clients/randao/provider-staking/ProviderStakingError";
import { StakingClient } from "src/clients/staking";
import { SyncInitClient, Tags } from "src/core";
import { Logger } from "src/utils";

/**
 * @category Clients
 */
export class ProviderStakingClient extends StakingClient implements IProviderStakingClient, SyncInitClient {
    public static autoConfiguration(): ProviderStakingClient {
        return new ProviderStakingClient(getProviderStakingClientAutoConfiguration());
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
            Logger.debug(result)
            const stakeStringJson = this.getFirstMessageDataString(result);
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
