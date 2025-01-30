import { ProviderDetails } from './types';

export interface IStakingClient {
    /**
     * Updates provider details
     * @param providerDetails Details about the provider
     * @returns Promise resolving to the message ID
     */
    updateDetails(providerDetails: ProviderDetails): Promise<string>;

    /**
     * Stakes tokens by transferring them with an X-Stake tag
     * @param quantity Amount of tokens to stake
     * @returns Promise resolving to the boolean representation of staking success
     */
    stake(quantity: string, providerDetails?: ProviderDetails): Promise<boolean>;

    /**
     * Gets the current stake for a provider
     * @param providerId The ID of the provider to check stake for
     * @returns Promise resolving to the stake information
     */
    getStake(providerId: string): Promise<any>;

    /**
     * Unstakes tokens for a provider
     * @param providerId The ID of the provider to unstake for
     * @returns Promise resolving to the message ID of the unstake transaction
     */
    unstake(providerId: string): Promise<string>;
}
