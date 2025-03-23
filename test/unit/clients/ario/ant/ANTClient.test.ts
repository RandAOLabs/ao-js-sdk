import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { ANTClient } from "src/clients/ario/ant/ANTClient";
import { BaseClient } from "src/core/ao/BaseClient";
import { ANTRecord, ANTRecords } from "src/clients/ario/ant/abstract/types";
import { DryRunCachingClientConfigBuilder } from "src/core/ao/configuration/builder";
import { ClientError } from "src/clients/common/ClientError";

// Mock BaseClient methods
jest.spyOn(BaseClient.prototype, 'message').mockResolvedValue("test-message-id");
const messageResult: MessageResult = {
    Output: undefined,
    Messages: [{ Data: "200: Success", Tags: [] }],
    Spawns: []
}
jest.spyOn(BaseClient.prototype, 'result').mockResolvedValue(messageResult);

const mockAntRecord: ANTRecord = {
    transactionId: "test-tx-id",
    name: "test",
    metadata: {
        owner: "test-owner",
        controller: "test-controller"
    }
};

const mockAntRecords: ANTRecords = {
    "test": mockAntRecord,
    "test2": {
        transactionId: "test-tx-id-2",
        name: "test2",
        metadata: {
            owner: "test-owner-2",
            controller: "test-controller-2"
        }
    }
};

// Create different dryrun results for different methods
const dryRunResultSingle: DryRunResult = {
    Output: undefined,
    Messages: [{ Data: JSON.stringify(mockAntRecord), Tags: [] }],
    Spawns: []
};

const dryRunResultMultiple: DryRunResult = {
    Output: undefined,
    Messages: [{ Data: JSON.stringify(mockAntRecords), Tags: [] }],
    Spawns: []
};

describe("ANTClient Unit Test", () => {
    let client: ANTClient;

    beforeAll(() => {
        const config = new DryRunCachingClientConfigBuilder()
            .withProcessId("test-process-id")
            .build()

        client = new ANTClient(config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getRecords()", () => {
        it("should retrieve all ANT records successfully", async () => {
            jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValueOnce(dryRunResultMultiple);

            const records = await client.getRecords();

            expect(records).toEqual(mockAntRecords);
            expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
                { name: "Action", value: "Records" }
            ]);
        });

        it("should throw GetRecordsError when dryrun fails", async () => {
            const error = new Error("Dryrun failed");
            jest.spyOn(BaseClient.prototype, 'dryrun').mockRejectedValueOnce(error);

            await expect(client.getRecords()).rejects.toThrow(ClientError);
        });
    });

    describe("getRecord()", () => {
        it("should retrieve a single ANT record successfully", async () => {
            jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValueOnce(dryRunResultSingle);

            const undername = "test";
            const record = await client.getRecord(undername);

            expect(record).toEqual(mockAntRecord);
            expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
                { name: "Sub-Domain", value: undername },
                { name: "Action", value: "Record" }
            ]);
        });

        it("should throw GetRecordError when dryrun fails", async () => {
            const undername = "test";
            const error = new Error("Dryrun failed");
            jest.spyOn(BaseClient.prototype, 'dryrun').mockRejectedValueOnce(error);

            await expect(client.getRecord(undername)).rejects.toThrow(ClientError);
        });
    });
});
