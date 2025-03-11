import { ProviderInfoAggregate } from "src/services/randao";

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

}
