import { ARNSClient } from "src/clients/ario/arns";
import { ARNSRecord } from "src/clients/ario/arns/types";
import { GetRecordError, InvalidDomainError } from "src/clients/ario/arns/ARNSClientError";

describe("ARNSClient", () => {
    let client: ARNSClient;
    const mockRecord: ARNSRecord = {
        name: "test_domain",
        processId: "test-process-id",
        metadata: { test: "data" }
    };

    beforeEach(() => {
        client = ARNSClient.autoConfiguration();
        // Mock the dryrun method
        (client as any).dryrun = jest.fn().mockResolvedValue({
            Messages: [{
                Data: JSON.stringify(mockRecord)
            }]
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getRecord", () => {
        it("should return an ARNS record", async () => {
            const record = await client.getRecord("test_domain");
            expect(record).toEqual(mockRecord);
            expect((client as any).dryrun).toHaveBeenCalledWith("", [
                { name: "Action", value: "GetRecord" },
                { name: "Name", value: "test_domain" }
            ]);
        });

        it("should use cached record when available", async () => {
            // First call to populate cache
            await client.getRecord("test_domain");
            // Second call should use cache
            await client.getRecord("test_domain");
            expect((client as any).dryrun).toHaveBeenCalledTimes(1);
        });

        it("should throw GetRecordError on failure", async () => {
            (client as any).dryrun = jest.fn().mockRejectedValue(new Error("Network error"));
            await expect(client.getRecord("test_domain")).rejects.toThrow(GetRecordError);
        });

        it("should throw InvalidDomainError for empty domain", async () => {
            await expect(client.getRecord("")).rejects.toThrow(InvalidDomainError);
        });

        it("should throw InvalidDomainError for invalid domain format", async () => {
            await expect(client.getRecord("invalid_domain_with_multiple_underscores_")).rejects.toThrow(InvalidDomainError);
        });

        it("should throw InvalidDomainError for incomplete compound domain", async () => {
            await expect(client.getRecord("_")).rejects.toThrow(InvalidDomainError);
        });
    });

    describe("getProcessId", () => {
        it("should return the client process ID", () => {
            const processId = client.getProcessId();
            expect(processId).toBeDefined();
            expect(typeof processId).toBe("string");
        });
    });
});
