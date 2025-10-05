import { ProviderActivity, ProviderInfo } from "../../../../src";
import { ARIOService } from "../../../../src/services/ario/ario-service";
import { MessagesService } from "../../../../src/services/messages/message-service";
import { IRandAODataService, ProviderInfoDataAggregator, RandAODataService } from "../../../../src/services/randao/RandAODataService";


// Mock dependencies
jest.mock("src/services/messages");
jest.mock("src/services/ario");
jest.mock("src/services/randao/RandAODataService");

describe("ProviderInfoDataAggregator", () => {
	let mockMessagesService: jest.Mocked<MessagesService>;
	let mockArioService: jest.Mocked<ARIOService>;
	let mockRandAODataService: jest.Mocked<IRandAODataService>;
	let aggregator: ProviderInfoDataAggregator;

	beforeEach(async () => {
		// Clear all mocks
		jest.clearAllMocks();

		// Setup mock implementations
		mockMessagesService = {
			countAllMessages: jest.fn().mockResolvedValue(5),
			getLatestMessages: jest.fn().mockResolvedValue({ messages: [] }),
			getLatestMessagesSentBy: jest.fn().mockResolvedValue({ messages: [] }),
			getLatestMessagesReceivedBy: jest.fn().mockResolvedValue({ messages: [] }),
			getAllMessages: jest.fn().mockResolvedValue({ messages: [] }),
			getMessageById: jest.fn().mockResolvedValue(null),
			getMessagesByIds: jest.fn().mockResolvedValue({ messages: [] })
		} as unknown as jest.Mocked<MessagesService>;

		mockArioService = {
			getProcessIdForDomain: jest.fn().mockResolvedValue("test-process-id"),
			getInstance: jest.fn()
		} as unknown as jest.Mocked<ARIOService>;

		mockRandAODataService = {
			getProviderTotalFullfilledCount: jest.fn().mockResolvedValue(10)
		} as unknown as jest.Mocked<IRandAODataService>;

		// Mock static methods
		(ARIOService.getInstance as jest.Mock).mockReturnValue(mockArioService);
		(MessagesService as unknown as jest.Mock).mockImplementation(() => mockMessagesService);
		(RandAODataService.autoConfiguration as jest.Mock).mockResolvedValue(mockRandAODataService);

		// Create aggregator instance
		aggregator = await ProviderInfoDataAggregator.autoConfiguration();
	});

	describe("data aggregation", () => {
		it("should aggregate data from multiple providers", async () => {
			// Arrange
			const providerActivity: ProviderActivity = {
				provider_id: "provider1",
				active_challenge_requests: { request_ids: [] },
				active_output_requests: { request_ids: [] },
				active: 1,
				created_at: Date.now(),
				random_balance: 0,
				fulfillment_rewards: 0,
				staked: 1
			};
			const providerInfo: ProviderInfo = {
				provider_id: "provider2",
				created_at: Date.now(),
				stake: {
					timestamp: Date.now(),
					status: "active",
					amount: "100",
					token: "test-token",
					provider_id: "provider2"
				}
			};

			// Act
			await aggregator.updateProviderData(providerActivity);
			await aggregator.updateProviderData(providerInfo);

			// Assert
			const result = aggregator.getAggregatedData();
			expect(result).toHaveLength(2);
		});

		it("should deduplicate data by provider ID", async () => {
			// Arrange
			const providerId = "provider1";
			const activity: ProviderActivity = {
				provider_id: providerId,
				active_challenge_requests: { request_ids: [] },
				active_output_requests: { request_ids: [] },
				active: 1,
				created_at: Date.now(),
				random_balance: 0,
				fulfillment_rewards: 0,
				staked: 1
			};
			const info: ProviderInfo = {
				provider_id: providerId,
				created_at: Date.now(),
				stake: {
					timestamp: Date.now(),
					status: "active",
					amount: "100",
					token: "test-token",
					provider_id: providerId
				}
			};

			// Act
			await aggregator.updateProviderData(activity);
			await aggregator.updateProviderData(info);

			// Assert
			const result = aggregator.getAggregatedData();
			expect(result).toHaveLength(1);
			expect(result[0].providerId).toBe(providerId);
			expect(result[0].providerActivity).toBeDefined();
			expect(result[0].providerInfo).toBeDefined();
		});

		it("should only count messages once per provider", async () => {
			// Arrange
			const providerId = "provider1";
			const activity: ProviderActivity = {
				provider_id: providerId,
				active_challenge_requests: { request_ids: [] },
				active_output_requests: { request_ids: [] },
				active: 1,
				created_at: Date.now(),
				random_balance: 0,
				fulfillment_rewards: 0,
				staked: 1
			};

			// Act
			await aggregator.updateProviderData(activity);
			await aggregator.updateProviderData(activity);

			// Assert
			expect(mockRandAODataService.getProviderTotalFullfilledCount).toHaveBeenCalledTimes(1);
		});
	});
});
