import { ProviderActivity, ProviderInfo } from "../../../../clients/randao";


export interface ProviderInfoAggregate {
	providerId: string;
	owner: string;
	providerInfo?: ProviderInfo;
	providerActivity?: ProviderActivity;
	totalFullfullilled?: number;
}
