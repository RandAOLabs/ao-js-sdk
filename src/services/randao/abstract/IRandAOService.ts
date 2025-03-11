import { ProviderInfoAggregate } from "src/services/randao";

/**
 * Interface for the RandAO Service
 */
export interface IRandAOService {
    /**
     * Retrieves All info on the random providers
     * @returns An array of {ProviderInfo,ProviderActivity,GraphQlData} linked by address
     */
    getAllProviderInfo(): Promise<ProviderInfoAggregate[]>;

}
