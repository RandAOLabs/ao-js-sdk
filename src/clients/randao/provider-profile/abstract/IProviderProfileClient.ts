import { ProviderDetails, ProviderInfo } from "./types";

export interface IProviderProfileClient {
    /**
     * Updates provider details
     * @param providerDetails Details about the provider
     * @returns Promise resolving to the message ID
     */
    updateDetails(providerDetails: ProviderDetails): Promise<string>;
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
