import { ProviderInfoAggregate } from "..";

/**
 * Interface for the RandAO Service
 */
export interface IRandAOService {
    /**
     * Retrieves all known provider data on all providers.
     * @returns An array of all known provider data on all providers.
     * Sourced from the random process, staking process, onchain transaction data.
     */
    getAllProviderInfo(): Promise<ProviderInfoAggregate[]>;

    /**
     * Retrieves all known provider data for a single provider.
     * @param address the address of the provider which you would like the data for.
     * @returns An object of all known provider data on the given provider.
     * Sourced from the random process, staking process, onchain transaction data.
     */
    getAllInfoForProvider(providerId: string): Promise<ProviderInfoAggregate>;

}
