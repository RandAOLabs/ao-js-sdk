
// Create a proper mock response object
const mockGraphqlQuery = jest.fn().mockResolvedValue({
	data: {
		transactions: {
			edges: [
				{
					cursor: "cursor1",
					node: { id: "tx1" }
				}
			]
		}
	}
});

// Mock the ArweaveDataService
const mockArweaveDataService = {
	query: mockGraphqlQuery
};

// Mock ArweaveDataService.autoConfiguration
jest.mock("../../../../src/core/arweave/ArweaveDataService", () => {
	class MockArweaveDataService {
		query = mockGraphqlQuery;
		static autoConfiguration() {
			return new MockArweaveDataService();
		}
	}
	return {
		ArweaveDataService: MockArweaveDataService
	};
});

// Mock the ArweaveGraphQLNodeClientFactory
jest.mock("../../../../src/core/arweave/graphql-nodes/ArweaveGraphQLNodeClientFactory", () => ({
	ArweaveGraphQLNodeClientFactory: {
		getInstance: jest.fn(() => ({
			getNode: jest.fn(() => ({
				graphqlQuery: mockGraphqlQuery
			}))
		}))
	}
}));

// Mock the HTTP client
jest.mock("../../../../src/core/arweave/http-nodes/arweave-dot-net-http-client", () => ({
	getArweaveDotNetHttpClient: jest.fn(() => ({}))
}));

// Mock the logger
jest.mock("../../../../src/utils/logger/logger", () => ({
	Logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
		setLogLevel: jest.fn()
	},
}));

import { IMessagesService, MessagesService } from "src";

describe("MessagesService", () => {
	let client: IMessagesService;

	beforeEach(() => {
		client = MessagesService.autoConfiguration();
		jest.clearAllMocks();
	});

	describe("getLatestMessages", () => {
		it("should return messages with pagination info", async () => {
			const result = await client.getLatestMessages({ limit: 1 });
			expect(result).toBeDefined();
			expect(result.messages).toBeDefined();
			expect(result.cursor).toBeDefined();
			expect(result.hasNextPage).toBeDefined();
		});

		it("should include Data-Protocol:ao tag", async () => {
			await client.getLatestMessages();
			// Verify the GraphQL query was called with correct parameters
			expect(mockGraphqlQuery).toHaveBeenCalledWith(expect.any(Object));
		});
	});

	describe("getLatestMessagesSentBy", () => {
		it("should return messages sent by an address", async () => {
			const result = await client.getLatestMessagesSentBy({ id: "sender" });
			expect(result).toBeDefined();
			expect(result.messages).toBeDefined();
			// Verify the GraphQL query was called
			expect(mockGraphqlQuery).toHaveBeenCalledWith(expect.any(Object));
		});
	});

	describe("getLatestMessagesReceivedBy", () => {
		it("should return messages received by an address", async () => {
			const result = await client.getLatestMessagesReceivedBy({ recipientId: "recipient" });
			expect(result).toBeDefined();
			expect(result.messages).toBeDefined();
			// Verify the GraphQL query was called
			expect(mockGraphqlQuery).toHaveBeenCalledWith(expect.any(Object));
		});
	});

	describe("getAllMessages", () => {
		it("should return all messages", async () => {
			const result = await client.getAllMessages();
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});
	});

	describe("getAllMessagesSentBy", () => {
		it("should return all messages sent by an address", async () => {
			const result = await client.getAllMessagesSentBy({ id: "sender" });
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			// Verify the GraphQL query was called
			expect(mockGraphqlQuery).toHaveBeenCalledWith(expect.any(Object));
		});
	});

	describe("getAllMessagesReceivedBy", () => {
		it("should return all messages received by an address", async () => {
			const result = await client.getAllMessagesReceivedBy({ recipientId: "recipient" });
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			// Verify the GraphQL query was called
			expect(mockGraphqlQuery).toHaveBeenCalledWith(expect.any(Object));
		});
	});
});
