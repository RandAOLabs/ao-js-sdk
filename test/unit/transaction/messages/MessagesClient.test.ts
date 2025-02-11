import { MessagesClient } from "../../../../src/clients/transaction/messages";
import { ArweaveGQLBuilder } from "../../../../src/core/arweave/gql";
import { ArweaveGQLResponse } from "../../../../src/core/arweave/abstract/types";

// Mock ArweaveBaseClient's query method
jest.mock("../../../../src/core/arweave/ArweaveBaseClient", () => {
    return {
        ArweaveBaseClient: jest.fn().mockImplementation(() => ({
            query: jest.fn().mockResolvedValue({
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
            } as ArweaveGQLResponse)
        }))
    };
});

describe("MessagesClient", () => {
    let client: MessagesClient;

    beforeEach(() => {
        client = new MessagesClient();
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
            // Get the mock instance
            const baseClient = (client as any).__proto__;
            const queryCall = baseClient.query.mock.calls[0][0];
            expect(queryCall.build().query).toContain('Data-Protocol');
            expect(queryCall.build().query).toContain('ao');
        });
    });

    describe("getLatestMessagesSentBy", () => {
        it("should return messages sent by an address", async () => {
            const result = await client.getLatestMessagesSentBy({ id: "sender" });
            expect(result).toBeDefined();
            expect(result.messages).toBeDefined();
            // Verify owner filter was set
            const baseClient = (client as any).__proto__;
            const queryCall = baseClient.query.mock.calls[0][0];
            expect(queryCall.build().query).toContain('owners: ["sender"]');
        });
    });

    describe("getLatestMessagesReceivedBy", () => {
        it("should return messages received by an address", async () => {
            const result = await client.getLatestMessagesReceivedBy({ id: "recipient" });
            expect(result).toBeDefined();
            expect(result.messages).toBeDefined();
            // Verify recipient tag was set
            const baseClient = (client as any).__proto__;
            const queryCall = baseClient.query.mock.calls[0][0];
            expect(queryCall.build().query).toContain('Recipient');
            expect(queryCall.build().query).toContain('recipient');
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
            // Verify owner filter was set
            const baseClient = (client as any).__proto__;
            const queryCall = baseClient.query.mock.calls[0][0];
            expect(queryCall.build().query).toContain('owners: ["sender"]');
        });
    });

    describe("getAllMessagesReceivedBy", () => {
        it("should return all messages received by an address", async () => {
            const result = await client.getAllMessagesReceivedBy({ id: "recipient" });
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            // Verify recipient tag was set
            const baseClient = (client as any).__proto__;
            const queryCall = baseClient.query.mock.calls[0][0];
            expect(queryCall.build().query).toContain('Recipient');
            expect(queryCall.build().query).toContain('recipient');
        });
    });
});
