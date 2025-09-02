import { ProviderInfo } from "../../../clients/randao/provider-profile/abstract/types";
import { ProviderActivity } from "../../../clients/randao/random/abstract/types";

export interface ProviderInfoAggregate {
    providerId: string;
    owner: string;
    providerInfo?: ProviderInfo;
    providerActivity?: ProviderActivity;
    totalFullfullilled?: number;
}
