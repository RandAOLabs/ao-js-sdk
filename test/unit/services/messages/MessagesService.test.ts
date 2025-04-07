import { IMessagesService, MessagesService } from "src";


// Mock ArweaveInstance.getInstance()
jest.mock("../../../../src/core/arweave/arweave", () => {
	const mockArweave = {
		api: {
			post: jest.fn().mockResolvedValue({
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
			})
		}
	};

	return {
		getArweave: jest.fn().mockReturnValue(mockArweave)
	};
});

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
			// Get the mock instance and verify the GraphQL query
			const { getArweave } = require("../../../../src/core/arweave/arweave");
			const mockArweave = getArweave();
			const postCall = mockArweave.api.post.mock.calls[0];
			expect(postCall[0]).toBe('/graphql');
			expect(postCall[1].query).toContain('Data-Protocol');
			expect(postCall[1].query).toContain('ao');
		});
	});

	describe("getLatestMessagesSentBy", () => {
		it("should return messages sent by an address", async () => {
			const result = await client.getLatestMessagesSentBy({ id: "sender" });
			expect(result).toBeDefined();
			expect(result.messages).toBeDefined();
			// Get the mock instance and verify the GraphQL query
			const { getArweave } = require("../../../../src/core/arweave/arweave");
			const mockArweave = getArweave();
			const postCall = mockArweave.api.post.mock.calls[0];
			expect(postCall[0]).toBe('/graphql');
			expect(postCall[1].query).toContain('owners: ["sender"]');
		});
	});

	describe("getLatestMessagesReceivedBy", () => {
		it("should return messages received by an address", async () => {
			const result = await client.getLatestMessagesReceivedBy({ recipientId: "recipient" });
			expect(result).toBeDefined();
			expect(result.messages).toBeDefined();
			// Get the mock instance and verify the GraphQL query
			const { getArweave } = require("../../../../src/core/arweave/arweave");
			const mockArweave = getArweave();
			const postCall = mockArweave.api.post.mock.calls[0];
			expect(postCall[0]).toBe('/graphql');
			expect(postCall[1].query).toContain('recipients');
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
			// Get the mock instance and verify the GraphQL query
			const { getArweave } = require("../../../../src/core/arweave/arweave");
			const mockArweave = getArweave();
			const postCall = mockArweave.api.post.mock.calls[0];
			expect(postCall[0]).toBe('/graphql');
			expect(postCall[1].query).toContain('owners: ["sender"]');
		});
	});

	describe("getAllMessagesReceivedBy", () => {
		it("should return all messages received by an address", async () => {
			const result = await client.getAllMessagesReceivedBy({ recipientId: "recipient" });
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			// Get the mock instance and verify the GraphQL query
			const { getArweave } = require("../../../../src/core/arweave/arweave");
			const mockArweave = getArweave();
			const postCall = mockArweave.api.post.mock.calls[0];
			expect(postCall[0]).toBe('/graphql');
			expect(postCall[1].query).toContain('recipients');
		});
	});
});
