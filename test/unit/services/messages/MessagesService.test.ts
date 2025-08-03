
// Create a proper mock response object
const mockApiPost = jest.fn().mockResolvedValue({
	data: {
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
	}
});

// Mock the ArweaveNodeFactory
jest.mock("../../../../src/core/arweave/graphql-nodes/ArweaveNodeFactory", () => ({
	ArweaveNodeFactory: {
		getInstance: jest.fn(() => ({
			getNodeClient: jest.fn(() => ({
				api: {
					post: mockApiPost
				}
			}))
		}))
	}
}));

// Mock the HTTP client
jest.mock("../../../../src/core/arweave/http-nodes/arweave-dot-net-http-client", () => ({
	getArweaveDotNetHttpClient: jest.fn(() => ({}))
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
			expect(mockApiPost).toHaveBeenCalledWith('/graphql', expect.objectContaining({
				query: expect.stringMatching(/Data-Protocol.*ao/)
			}));
		});
	});

	describe("getLatestMessagesSentBy", () => {
		it("should return messages sent by an address", async () => {
			const result = await client.getLatestMessagesSentBy({ id: "sender" });
			expect(result).toBeDefined();
			expect(result.messages).toBeDefined();
			// Verify the GraphQL query was called with correct parameters
			expect(mockApiPost).toHaveBeenCalledWith('/graphql', expect.objectContaining({
				query: expect.stringContaining('owners: ["sender"]')
			}));
		});
	});

	describe("getLatestMessagesReceivedBy", () => {
		it("should return messages received by an address", async () => {
			const result = await client.getLatestMessagesReceivedBy({ recipientId: "recipient" });
			expect(result).toBeDefined();
			expect(result.messages).toBeDefined();
			// Verify the GraphQL query was called with correct parameters
			expect(mockApiPost).toHaveBeenCalledWith('/graphql', expect.objectContaining({
				query: expect.stringContaining('recipients')
			}));
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
			// Verify the GraphQL query was called with correct parameters
			expect(mockApiPost).toHaveBeenCalledWith('/graphql', expect.objectContaining({
				query: expect.stringContaining('owners: ["sender"]')
			}));
		});
	});

	describe("getAllMessagesReceivedBy", () => {
		it("should return all messages received by an address", async () => {
			const result = await client.getAllMessagesReceivedBy({ recipientId: "recipient" });
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			// Verify the GraphQL query was called with correct parameters
			expect(mockApiPost).toHaveBeenCalledWith('/graphql', expect.objectContaining({
				query: expect.stringContaining('recipients')
			}));
		});
	});
});
