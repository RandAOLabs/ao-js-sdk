import { ANTClient } from "src/clients/ario/ant";
import { ANTRecord, ANTRecords } from "src/clients/ario/ant/types";
import { GetRecordsError, GetRecordError } from "src/clients/ario/ant/ANTClientError";

describe("ANTClient", () => {
    let client: ANTClient;
    const mockRecords: ANTRecords = {
        "@": {
            name: "@",
            transactionId: "test-transaction-id",
            metadata: { test: "data" }
        },
        "test": {
            name: "test",
            transactionId: "test-transaction-id-2",
            metadata: { test: "data-2" }
        }
    };

    beforeEach(() => {
        client = new ANTClient("test-process-id");
        // Mock the dryrun method
        (client as any).dryrun = jest.fn().mockResolvedValue({
            Messages: [{
                Data: JSON.stringify(mockRecords)
            }]
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getRecords", () => {
        it("should return all ANT records", async () => {
            const records = await client.getRecords();
            expect(records).toEqual(mockRecords);
            expect((client as any).dryrun).toHaveBeenCalledWith("", [
                { name: "Action", value: "GetRecords" }
            ]);
        });

        it("should throw GetRecordsError on failure", async () => {
            (client as any).dryrun = jest.fn().mockRejectedValue(new Error("Network error"));
            await expect(client.getRecords()).rejects.toThrow(GetRecordsError);
        });
    });

    describe("getRecord", () => {
        it("should return a specific ANT record", async () => {
            const record = await client.getRecord("@");
            expect(record).toEqual(mockRecords["@"]);
        });

        it("should return undefined for non-existent record", async () => {
            const record = await client.getRecord("non-existent");
            expect(record).toBeUndefined();
        });

        it("should throw GetRecordError on failure", async () => {
            (client as any).dryrun = jest.fn().mockRejectedValue(new Error("Network error"));
            await expect(client.getRecord("@")).rejects.toThrow(GetRecordError);
        });
    });


});
