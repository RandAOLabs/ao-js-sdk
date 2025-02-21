import { IStakingClient } from "src/clients";
import { ProviderDetails } from "src/clients/randao/provider-profile";

export interface IProviderStakingClient extends IStakingClient {
    /**
     * Stakes tokens by transferring them with an X-Stake tag
     * @param quantity Amount of tokens to stake
     * @returns Promise resolving to the boolean representation of staking success
     */
    stakeWithDetails(quantity: string, providerDetails?: ProviderDetails): Promise<boolean>;

    /**
     * Gets the current stake for a provider
     * @param providerId The ID of the provider to check stake for
     * @returns Promise resolving to the stake information
     */
    getStake(providerId: string): Promise<any>;
}
