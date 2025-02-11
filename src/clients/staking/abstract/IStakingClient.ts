import { ProviderDetails, ProviderInfo } from "src/clients/staking/abstract/types";

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
     * @returns Promise resolving to true if unstaking was successful, false if it failed
     */
    unstake(providerId: string): Promise<boolean>;

    /**
     * Gets provider info for all providers
     * @returns Promise resolving to an array of provider info objects
     */
    getAllProvidersInfo(): Promise<ProviderInfo[]>;

    /**
     * Gets provider info for a specific provider
     * @param providerId Optional provider ID. If not provided, uses the calling wallet address
     * @returns Promise resolving to the provider info
     */
    getProviderInfo(providerId?: string): Promise<ProviderInfo>;
}
