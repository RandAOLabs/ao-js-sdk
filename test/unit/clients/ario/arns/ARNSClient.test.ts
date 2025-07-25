
import { ARNSClient } from "src/clients/ario/arns/ARNSClient";
import { BaseClient } from "src/core/ao/BaseClient";
import { ClientError } from "src/clients/common/ClientError";
import { Logger, LogLevel } from "src/utils";
import { DryRunResult, MessageResult } from "../../../../../src/core/ao/abstract";
import { ARNSRecord } from "../../../../../src/clients/ario/arns/types";

// Mock BaseClient methods
jest.spyOn(BaseClient.prototype, 'message').mockResolvedValue("test-message-id");
const messageResult: MessageResult = {
	Output: undefined,
	Messages: [{ Data: "200: Success", Tags: [] }],
	Spawns: []
}
jest.spyOn(BaseClient.prototype, 'result').mockResolvedValue(messageResult);
const mockArnsRecord: ARNSRecord = {
	name: "test_ant",
	processId: "test-process-id",
	metadata: {
		owner: "test-owner",
		controller: "test-controller"
	}
};
const dryRunResult: DryRunResult = {
	Output: undefined,
	Messages: [{ Data: JSON.stringify(mockArnsRecord), Tags: [] }],
	Spawns: []
}
jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValue(dryRunResult);
jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValue(messageResult);

describe("ARNSClient Unit Test", () => {
	let client: ARNSClient;

	beforeAll(async () => {
		Logger.setLogLevel(LogLevel.NONE)
		client = ARNSClient.autoConfiguration();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getRecord()", () => {
		it("should retrieve ARNS record successfully", async () => {
			const name = "test_ant";
			const record = await client.getRecord(name);

			expect(record).toEqual(mockArnsRecord);
			expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
				{ name: "Action", value: "Record" },
				{ name: "Name", value: name }
			]);
		});

		it("should throw GetRecordError when dryrun fails", async () => {
			const name = "test_ant";
			const error = new Error("Dryrun failed");
			jest.spyOn(BaseClient.prototype, 'dryrun').mockRejectedValueOnce(error);

			await expect(client.getRecord(name)).rejects.toThrow(ClientError);
		});
	});

	describe("getProcessId()", () => {
		it("should return process ID", () => {
			const processId = client.getProcessId();
			expect(typeof processId).toBe("string");
		});
	});
});
