
import { ANTClient } from "src/clients/ario/ant/ANTClient";
import { BaseClient } from "src/core/ao/BaseClient";
import { DryRunCachingClientConfigBuilder } from "src/core/ao/configuration/builder";
import { ClientError } from "src/clients/common/ClientError";
import { Logger, LogLevel } from "src/utils";
import { DryRunResult, MessageResult } from "../../../../../src/core/ao/abstract";
import { AntRecord } from "../../../../../src";

// Mock BaseClient methods
jest.spyOn(BaseClient.prototype, 'message').mockResolvedValue("test-message-id");
const messageResult: MessageResult = {
	Output: undefined,
	Messages: [{ Data: "200: Success", Tags: [] }],
	Spawns: []
}
jest.spyOn(BaseClient.prototype, 'result').mockResolvedValue(messageResult);

const mockAntRecord: AntRecord = {
	transactionId: "test-tx-id",
	ttlSeconds: 0
};

const mockAntRecords = {
	"test": mockAntRecord,
	"test2": {
		transactionId: "test-tx-id2",
		ttlSeconds: 1
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
		Logger.setLogLevel(LogLevel.NONE)
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
