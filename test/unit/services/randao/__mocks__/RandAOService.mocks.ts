import { RandomClient, ProviderProfileClient } from "src/clients";
import { RandAODataService } from "src/services/randao";
import { ProviderInfoDataAggregator } from "src/services/randao/ProviderInfoDataAggregator";

export const createMockRandomClient = (): jest.Mocked<RandomClient> => {
	return {
		getAllProviderActivity: jest.fn().mockResolvedValue([{
			provider_id: "test-provider",
			owner_id: "test-owner",
			active: 1,
			created_at: Date.now(),
			random_balance: 100,
			staked: 1,
			active_challenge_requests: { request_ids: [] },
			active_output_requests: { request_ids: [] }
		}]),
		getProviderActivity: jest.fn().mockResolvedValue({
			provider_id: "test-provider",
			owner_id: "test-owner",
			active: 1,
			created_at: Date.now(),
			random_balance: 100,
			staked: 1,
			active_challenge_requests: { request_ids: [] },
			active_output_requests: { request_ids: [] }
		})
	} as unknown as jest.Mocked<RandomClient>;
};

export const createMockProviderProfileClient = (): jest.Mocked<ProviderProfileClient> => {
	return {
		getAllProvidersInfo: jest.fn().mockResolvedValue([{
			provider_id: "test-provider",
			created_at: Date.now(),
			stake: {
				timestamp: Date.now(),
				status: "active",
				amount: "1000",
				token: "test-token",
				provider_id: "test-provider"
			}
		}]),
		getProviderInfo: jest.fn().mockResolvedValue({
			provider_id: "test-provider",
			created_at: Date.now(),
			stake: {
				timestamp: Date.now(),
				status: "active",
				amount: "1000",
				token: "test-token",
				provider_id: "test-provider"
			}
		})
	} as unknown as jest.Mocked<ProviderProfileClient>;
};

export const createMockRandAODataService = (): jest.Mocked<RandAODataService> => {
	return {
		getTotalRandomResponses: jest.fn().mockResolvedValue(100),
		getProviderTotalFullfilledCount: jest.fn().mockResolvedValue(50),
		getMostRecentRandomResponse: jest.fn().mockResolvedValue({
			id: "test-tx-id",
			data: { entropy: "test-entropy-string" },
			tags: [{ name: "Action", value: "Random-Response" }]
		})
	} as unknown as jest.Mocked<RandAODataService>;
};

export const createMockProviderInfoDataAggregator = (): jest.Mocked<ProviderInfoDataAggregator> => {
	return {
		updateProviderData: jest.fn().mockResolvedValue(undefined),
		getAggregatedData: jest.fn().mockReturnValue([])
	} as unknown as jest.Mocked<ProviderInfoDataAggregator>;
};

// Mock dependencies with static methods
jest.mock("src/clients/randao/random/RandomClient", () => ({
	RandomClient: jest.fn().mockImplementation(() => createMockRandomClient()),
	...jest.requireActual("src/clients/randao/random/RandomClient")
}));

jest.mock("src/clients/randao/provider-profile/ProviderProfileClient", () => ({
	ProviderProfileClient: jest.fn().mockImplementation(() => createMockProviderProfileClient()),
	...jest.requireActual("src/clients/randao/provider-profile/ProviderProfileClient")
}));

jest.mock("src/services/randao/RandAODataService", () => ({
	RandAODataService: jest.fn().mockImplementation(() => createMockRandAODataService()),
	...jest.requireActual("src/services/randao/RandAODataService")
}));

jest.mock("src/services/randao/ProviderInfoDataAggregator", () => ({
	ProviderInfoDataAggregator: jest.fn().mockImplementation(() => createMockProviderInfoDataAggregator()),
	...jest.requireActual("src/services/randao/ProviderInfoDataAggregator")
}));

export const setupMockStaticMethods = (
	mockRandomClient: jest.Mocked<RandomClient>,
	mockProviderProfileClient: jest.Mocked<ProviderProfileClient>,
	mockRandAODataService: jest.Mocked<RandAODataService>,
	mockProviderInfoDataAggregator: jest.Mocked<ProviderInfoDataAggregator>
) => {
	// Mock static methods directly on the imported classes
	RandomClient.autoConfiguration = jest.fn().mockResolvedValue(mockRandomClient);
	ProviderProfileClient.autoConfiguration = jest.fn().mockReturnValue(mockProviderProfileClient);
	RandAODataService.autoConfiguration = jest.fn().mockResolvedValue(mockRandAODataService);
	ProviderInfoDataAggregator.autoConfiguration = jest.fn().mockResolvedValue(mockProviderInfoDataAggregator);
};
