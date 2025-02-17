import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { ANTClient } from "src/clients/ario/ant/ANTClient";
import { BaseClient } from "src/core/ao/BaseClient";
import { ANTRecord, ANTRecords } from "src/clients/ario/ant/abstract/types";

// Mock BaseClient methods
jest.spyOn(BaseClient.prototype, 'message').mockResolvedValue("test-message-id");
const messageResult: MessageResult = {
    Output: undefined,
    Messages: [{ Data: "200: Success", Tags: [] }],
    Spawns: []
}
jest.spyOn(BaseClient.prototype, 'result').mockResolvedValue(messageResult);

// Mock sample data
const mockANTRecords: ANTRecords = {
    '@': {
        name: '@',
        transactionId: 'tx-1'
    },
    'test': {
        name: 'test',
        transactionId: 'tx-2'
    }
};

const mockANTRecord: ANTRecord = {
    name: 'test',
    transactionId: 'tx-2'
};

describe("ANTClient Unit Test", () => {
    let client: ANTClient;
    const mockProcessId = "test-process-id";

    beforeAll(() => {
        // Initialize the ANTClient
        client = new ANTClient(mockProcessId);
    });

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Set up default dryrun mock
        const dryRunResult: DryRunResult = {
            Output: undefined,
            Messages: [{ Data: JSON.stringify(mockANTRecords), Tags: [] }],
            Spawns: []
        }
        jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValue(dryRunResult);
    });

    describe("getRecords()", () => {
        it("should fetch ANT records without throwing an error", async () => {
            await expect(client.getRecords()).resolves.not.toThrow();
        });

        it("should return ANT records", async () => {
            const records = await client.getRecords();
            expect(records).toEqual(mockANTRecords);
        });

        it("should call dryrun with correct parameters", async () => {
            await client.getRecords();
            expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Records" }
            ]);
        });
    });

    describe("getRecord()", () => {
        beforeEach(() => {
            // Set up dryrun mock for single record
            const dryRunResult: DryRunResult = {
                Output: undefined,
                Messages: [{ Data: JSON.stringify(mockANTRecord), Tags: [] }],
                Spawns: []
            }
            jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValue(dryRunResult);
        });

        it("should fetch a specific ANT record without throwing an error", async () => {
            await expect(client.getRecord("test")).resolves.not.toThrow();
        });

        it("should return a specific ANT record", async () => {
            const record = await client.getRecord("test");
            expect(record).toEqual(mockANTRecord);
        });

        it("should call dryrun with correct parameters", async () => {
            const undername = "test";
            await client.getRecord(undername);
            expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
                { name: "Sub-Domain", value: undername },
                { name: "Action", value: "Record" }
            ]);
        });
    });
});
