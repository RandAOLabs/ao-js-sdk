import { ProviderInfo } from "src/clients/randao/provider-profile/abstract/types";
import { ProviderActivity } from "src/clients/randao/random/abstract/types";

export interface ProviderInfoAggregate {
    providerId: string;
    providerInfo?: ProviderInfo;
    providerActivity?: ProviderActivity;
    totalFullfullilled?: number;
}
