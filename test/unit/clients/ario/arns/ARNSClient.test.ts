import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { ARNSClient } from "src/clients/ario/arns/ARNSClient";
import { BaseClient } from "src/core/ao/BaseClient";
import { ARNSRecord } from "src/clients/ario/arns/abstract/types";
import { InvalidDomainError } from "src/clients/ario/arns/ARNSClientError";

// Mock BaseClient methods
jest.spyOn(BaseClient.prototype, 'message').mockResolvedValue("test-message-id");
const messageResult: MessageResult = {
    Output: undefined,
    Messages: [{ Data: "200: Success", Tags: [] }],
    Spawns: []
}
jest.spyOn(BaseClient.prototype, 'result').mockResolvedValue(messageResult);

// Mock sample data
const mockARNSRecord: ARNSRecord = {
    name: 'test_domain',
    processId: 'arns-process-id',
    metadata: {}
};

describe("ARNSClient Unit Test", () => {
    let client: ARNSClient;

    beforeAll(() => {
        // Initialize the ARNSClient using autoConfiguration
        client = ARNSClient.autoConfiguration();
    });

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Set up default dryrun mock
        const dryRunResult: DryRunResult = {
            Output: undefined,
            Messages: [{ Data: JSON.stringify(mockARNSRecord), Tags: [] }],
            Spawns: []
        }
        jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValue(dryRunResult);
    });

    describe("autoConfiguration()", () => {
        it("should return an ARNSClient instance", () => {
            const instance = ARNSClient.autoConfiguration();
            expect(instance).toBeInstanceOf(ARNSClient);
        });
    });

    describe("getRecord()", () => {
        it("should fetch an ARNS record without throwing an error", async () => {
            await expect(client.getRecord("test_domain")).resolves.not.toThrow();
        });

        it("should return an ARNS record", async () => {
            const record = await client.getRecord("test_domain");
            expect(record).toEqual(mockARNSRecord);
        });

        it("should call dryrun with correct parameters", async () => {
            const name = "test_domain";
            await client.getRecord(name);
            expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Record" },
                { name: "Name", value: name }
            ]);
        });

        it("should throw InvalidDomainError for empty domain", async () => {
            await expect(client.getRecord("")).rejects.toThrow(InvalidDomainError);
        });

        it("should throw InvalidDomainError for malformed domain with missing parts", async () => {
            await expect(client.getRecord("test_")).rejects.toThrow(InvalidDomainError);
        });

        it("should throw InvalidDomainError for domain with multiple separators", async () => {
            await expect(client.getRecord("test_domain_extra")).rejects.toThrow(InvalidDomainError);
        });
    });

    describe("getProcessId()", () => {
        it("should return the process ID", () => {
            const processId = client.getProcessId();
            expect(typeof processId).toBe("string");
        });
    });
});
