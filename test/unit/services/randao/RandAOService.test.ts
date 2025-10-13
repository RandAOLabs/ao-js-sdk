
// Mock dependencies
jest.mock("../../../../src/clients/randao");
jest.mock("../../../../src/clients/randao/provider-profile/ProviderProfileClient");
jest.mock("../../../../src/services/randao/RandAODataService/RandAODataService");
jest.mock("../../../../src/services/randao/RandAODataService/ProviderInfoDataAggregator");

import { ProviderProfileClient } from "../../../../src/clients/randao/provider-profile/ProviderProfileClient";

import { ProviderInfoDataAggregator } from "../../../../src/services/randao/RandAODataService/ProviderInfoDataAggregator";
import { RandAODataService } from "../../../../src/services/randao/RandAODataService/RandAODataService";
import { ProviderInfoAggregate } from "../../../../src/services/randao/RandAODataService";
import { RandomClient } from "../../../../src/clients/randao/random";
import { RandAOService } from "../../../../src/services/randao/RandAOService/RandAOService";




describe("RandAOService", () => {
	let mockRandomClient: jest.Mocked<RandomClient>;
	let mockProviderProfileClient: jest.Mocked<ProviderProfileClient>;
	let mockRandAODataService: jest.Mocked<RandAODataService>;
	let mockProviderInfoDataAggregator: jest.Mocked<ProviderInfoDataAggregator>;

	beforeEach(() => {
		// Clear all mocks
		jest.clearAllMocks();

		// Create mock instances
		mockRandomClient = {
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

		mockProviderProfileClient = {
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

		mockRandAODataService = {
			getTotalRandomResponses: jest.fn().mockResolvedValue(100),
			getProviderTotalFullfilledCount: jest.fn().mockResolvedValue(50),
			getMostRecentRandomResponse: jest.fn().mockResolvedValue({
				id: "test-tx-id",
				data: { entropy: "test-entropy-string" },
				tags: [{ name: "Action", value: "Random-Response" }]
			})
		} as unknown as jest.Mocked<RandAODataService>;

		mockProviderInfoDataAggregator = {
			updateProviderData: jest.fn().mockResolvedValue(undefined),
			getAggregatedData: jest.fn().mockReturnValue([])
		} as unknown as jest.Mocked<ProviderInfoDataAggregator>;

		// Mock static methods
		RandomClient.autoConfiguration = jest.fn().mockResolvedValue(mockRandomClient);
		ProviderProfileClient.autoConfiguration = jest.fn().mockReturnValue(mockProviderProfileClient);
		RandAODataService.autoConfiguration = jest.fn().mockResolvedValue(mockRandAODataService);
		ProviderInfoDataAggregator.autoConfiguration = jest.fn().mockResolvedValue(mockProviderInfoDataAggregator);
	});

	describe("getAllProviderInfo", () => {
		it("should process provider data and return aggregated results", async () => {
			// Arrange
			const service = new RandAOService(mockRandomClient, mockProviderProfileClient, mockRandAODataService);
			const mockAggregatedData: ProviderInfoAggregate[] = [];
			mockProviderInfoDataAggregator.getAggregatedData.mockReturnValue(mockAggregatedData);

			// Act
			const result = await service.getAllProviderInfo();

			// Assert
			expect(mockRandomClient.getAllProviderActivity).toHaveBeenCalled();
			expect(mockProviderProfileClient.getAllProvidersInfo).toHaveBeenCalled();
			expect(mockProviderInfoDataAggregator.getAggregatedData).toHaveBeenCalled();
			expect(result).toBe(mockAggregatedData);
		});
	});

	describe("getAllInfoForProvider", () => {
		const providerId = "test-provider";
		const mockProviderData: ProviderInfoAggregate = {
			providerId,
			owner: "test-owner",
			providerInfo: {
				provider_id: providerId,
				created_at: Date.now(),
				stake: {
					timestamp: Date.now(),
					status: "active",
					amount: "1000",
					token: "test-token",
					provider_id: providerId
				}
			},
			providerActivity: {
				provider_id: providerId,
				owner_id: "test-owner",
				active: 1,
				created_at: Date.now(),
				random_balance: 100,
				fulfillment_rewards: 0,
				staked: 1,
				active_challenge_requests: { request_ids: [] },
				active_output_requests: { request_ids: [] }
			}
		};

		it("should process provider data and return aggregated results for a specific provider", async () => {
			// Arrange
			const service = new RandAOService(mockRandomClient, mockProviderProfileClient, mockRandAODataService);
			mockProviderInfoDataAggregator.getAggregatedData.mockReturnValue([mockProviderData]);

			// Act
			const result = await service.getAllInfoForProvider(providerId);

			// Assert
			expect(mockRandomClient.getProviderActivity).toHaveBeenCalledWith(providerId);
			expect(mockProviderProfileClient.getProviderInfo).toHaveBeenCalledWith(providerId);
			expect(mockProviderInfoDataAggregator.getAggregatedData).toHaveBeenCalled();
			expect(result).toEqual(mockProviderData);
		});

		it("should return only providerId when RandomClient throws an error", async () => {
			// Arrange
			const service = new RandAOService(mockRandomClient, mockProviderProfileClient, mockRandAODataService);

			// Mock implementation that throws an error
			mockRandomClient.getProviderActivity = jest.fn().mockImplementation(() => {
				throw new Error("Random client error");
			});

			// Act
			const result = await service.getAllInfoForProvider(providerId);

			// Assert
			expect(result).toEqual({ providerId, owner: '' });
		});

		it("should return only providerId when ProviderProfileClient throws an error", async () => {
			// Arrange
			const service = new RandAOService(mockRandomClient, mockProviderProfileClient, mockRandAODataService);

			// Mock implementation that throws an error
			mockProviderProfileClient.getProviderInfo = jest.fn().mockImplementation(() => {
				throw new Error("Profile client error");
			});

			// Act
			const result = await service.getAllInfoForProvider(providerId);

			// Assert
			expect(result).toEqual({ providerId, owner: '' });
		});
	});

	describe("getMostRecentEntropy", () => {
		it("should return entropy from the most recent random response data field", async () => {
			// Arrange
			const service = new RandAOService(mockRandomClient, mockProviderProfileClient, mockRandAODataService);
			const expectedEntropy = "test-entropy-string";
			mockRandAODataService.getMostRecentRandomResponse.mockResolvedValue({
				id: "test-tx-id",
				data: { entropy: expectedEntropy },
				tags: []
			});

			// Act
			const result = await service.getMostRecentEntropy();

			// Assert
			expect(mockRandAODataService.getMostRecentRandomResponse).toHaveBeenCalled();
			expect(result).toBe(expectedEntropy);
		});

		it("should return entropy from tags when not in data field", async () => {
			// Arrange
			const service = new RandAOService(mockRandomClient, mockProviderProfileClient, mockRandAODataService);
			const expectedEntropy = "entropy-from-tags";
			mockRandAODataService.getMostRecentRandomResponse.mockResolvedValue({
				id: "test-tx-id",
				data: {},
				tags: [{ name: "Entropy", value: expectedEntropy }]
			});

			// Act
			const result = await service.getMostRecentEntropy();

			// Assert
			expect(result).toBe(expectedEntropy);
		});

		it("should return transaction ID as fallback when no entropy found", async () => {
			// Arrange
			const service = new RandAOService(mockRandomClient, mockProviderProfileClient, mockRandAODataService);
			const expectedId = "fallback-tx-id";
			mockRandAODataService.getMostRecentRandomResponse.mockResolvedValue({
				id: expectedId,
				data: {},
				tags: []
			});

			// Act
			const result = await service.getMostRecentEntropy();

			// Assert
			expect(result).toBe(expectedId);
		});

		it("should throw error when no random response found", async () => {
			// Arrange
			const service = new RandAOService(mockRandomClient, mockProviderProfileClient, mockRandAODataService);
			mockRandAODataService.getMostRecentRandomResponse.mockResolvedValue(null);

			// Act & Assert
			await expect(service.getMostRecentEntropy()).rejects.toThrow('Failed to get most recent entropy: No random response found');
		});

		it("should throw error when RandAODataService fails", async () => {
			// Arrange
			const service = new RandAOService(mockRandomClient, mockProviderProfileClient, mockRandAODataService);
			const errorMessage = "Data service error";
			mockRandAODataService.getMostRecentRandomResponse.mockRejectedValue(new Error(errorMessage));

			// Act & Assert
			await expect(service.getMostRecentEntropy()).rejects.toThrow(`Failed to get most recent entropy: ${errorMessage}`);
		});
	});
});
