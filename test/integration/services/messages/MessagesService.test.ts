import { GetAllMessagesParams, MessagesService, IMessagesService } from "src/services/messages";
import { Logger, LogLevel } from "src/utils";
import { ArweaveDataService } from "src/core/arweave/ArweaveDataService";

// Mock the ArweaveDataService
const mockQuery = jest.fn();
const mockArweaveDataService = {
	query: mockQuery
};

// Mock ArweaveDataService.autoConfiguration
jest.mock('src/core/arweave/ArweaveDataService', () => {
	class MockArweaveDataService {
		query = mockQuery;
		static autoConfiguration() {
			return new MockArweaveDataService();
		}
	}
	return {
		ArweaveDataService: MockArweaveDataService
	};
});

// Mock the ArweaveGraphQLNodeClientFactory (since ArweaveDataService depends on it)
jest.mock('src/core/arweave/graphql-nodes/ArweaveGraphQLNodeClientFactory', () => ({
	ArweaveGraphQLNodeClientFactory: {
		getInstance: jest.fn(() => ({
			getNode: jest.fn(() => ({
				graphqlQuery: jest.fn()
			}))
		}))
	}
}));

// Mock the HTTP client
jest.mock('src/core/arweave/http-nodes/arweave-dot-net-http-client', () => ({
	getArweaveDotNetHttpClient: jest.fn(() => ({}))
}));

// Mock the logger
jest.mock('src/utils/logger/logger', () => ({
	Logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
		setLogLevel: jest.fn()
	},
}));

describe('MessagesService Integration Tests', () => {
	let client: IMessagesService;

	beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG);
		// Clear all mocks before each test
		jest.clearAllMocks();
		client = MessagesService.autoConfiguration();
	});

	// it('should get latest AO messages with pagination', async () => {
	//     const result = await client.getLatestMessages({
	//         limit: 5 // Small limit for testing
	//     });

	//     // Log the result for inspection
	//     Logger.info(`Latest messages: ${JSON.stringify(result, null, 2)}`);

	//     // Just check if we got results
	//     expect(result).toBeDefined();
	//     expect(result.messages.length).toBeGreaterThan(0);
	// }, 30000);

	// it('should get all AO messages', async () => {
	//     const result = await client.getAllMessages({
	//         // No limit needed since getAllMessages handles pagination
	//         tags: [{ name: "App-Name", value: "TestApp" }] // Optional: filter by tag
	//     });

	//     // Log the result for inspection
	//     Logger.info(`All messages count: ${result.length}`);
	//     Logger.info(`First few messages: ${JSON.stringify(result.slice(0, 2), null, 2)}`);

	//     // Just check if we got results
	//     expect(result).toBeDefined();
	//     expect(result).toBeInstanceOf(Array);
	// }, 60000); // Longer timeout since it fetches all messages

	// it('should get all messages sent by an address', async () => {
	//     // First get any message to use its owner as a test address
	//     const initialResult = await client.getLatestMessages({ limit: 1 });
	//     const testAddress = initialResult.messages[0]?.owner?.address;

	//     if (testAddress) {
	//         const result = await client.getAllMessagesSentBy({
	//             id: testAddress
	//         });

	//         // Log the result for inspection
	//         Logger.info(`Messages sent by ${testAddress}: ${result.length}`);
	//         Logger.info(`First message: ${JSON.stringify(result[0], null, 2)}`);

	//         // Just check if we got results
	//         expect(result).toBeDefined();
	//         expect(result).toBeInstanceOf(Array);
	//     }
	// }, 60000);

	// it('should get all messages received by an address', async () => {
	//     // First get any message to use its recipient as a test address
	//     const testAddress = "9U_MDLfzf-sdww7d7ydaApDiQz3nyHJ4kTS2-9K4AGA"

	//     if (testAddress) {
	//         const result = await client.getAllMessagesReceivedBy({
	//             recipientId: testAddress
	//         });

	//         // Log the result for inspection
	//         Logger.info(`Messages received by ${testAddress}: ${result.length}`);
	//         Logger.info(`First message: ${JSON.stringify(result[0], null, 2)}`);

	//         // Just check if we got results
	//         expect(result).toBeDefined();
	//         expect(result).toBeInstanceOf(Array);
	//     }
	// }, 60000);

	it('should get count messages', async () => {
		// Mock the response for countAllMessages
		const mockCountResponse = {
			data: {
				transactions: {
					count: 42
				}
			}
		};

		mockQuery.mockResolvedValueOnce(mockCountResponse);

		const params: GetAllMessagesParams = {
			owner: "N90q65iT59dCo01-gtZRUlLMX0w6_ylFHv2uHaSUFNk",
			recipient: "1dnDvaDRQ7Ao6o1ohTr7NNrN5mp1CpsXFrWm3JJFEs8",
			tags: [{ name: "Action", value: "Post-VDF-Output-And-Proof" }]
		}

		const result = await client.countAllMessages(params);

		// Verify the mock was called
		expect(mockQuery).toHaveBeenCalledWith(expect.any(Object));

		// Verify the result
		expect(result).toBeDefined();
		expect(result).toBe(42);
		expect(typeof result).toBe('number');

	}, 60000);
});
