
import { ARNSClient } from "src/clients/ario/arns/ARNSClient";
import { BaseClient } from "src/core/ao/BaseClient";
import { Logger, LogLevel } from "src/utils";
import { ProcessClientError } from "../../../../../src/clients/common/ProcessClientError";
import {
	mockArnsRecord,
	mockArnsRecordsResponse,
	messageResult,
	dryRunResult,
	dryRunResultRecords
} from "./ARNSClient.mocks";

// Mock BaseClient methods
jest.spyOn(BaseClient.prototype, 'message').mockResolvedValue("test-message-id");
jest.spyOn(BaseClient.prototype, 'result').mockResolvedValue(messageResult);
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

			await expect(client.getRecord(name)).rejects.toThrow(ProcessClientError);
		});
	});

	describe("getArNSRecords()", () => {
		beforeEach(() => {
			jest.spyOn(BaseClient.prototype, 'dryrun').mockResolvedValue(dryRunResultRecords);
		});

		it("should retrieve ARNS records successfully with no parameters", async () => {
			const records = await client.getArNSRecords();

			expect(records).toEqual(mockArnsRecordsResponse);
			expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
				{ name: "Action", value: "Paginated-Records" }
			]);
		});

		it("should retrieve ARNS records successfully with cursor parameter", async () => {
			const params = { cursor: "test-cursor" };
			const records = await client.getArNSRecords(params);

			expect(records).toEqual(mockArnsRecordsResponse);
			expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
				{ name: "Action", value: "Paginated-Records" },
				{ name: "Cursor", value: "test-cursor" }
			]);
		});

		it("should retrieve ARNS records successfully with limit parameter", async () => {
			const params = { limit: 50 };
			const records = await client.getArNSRecords(params);

			expect(records).toEqual(mockArnsRecordsResponse);
			expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
				{ name: "Action", value: "Paginated-Records" },
				{ name: "Limit", value: "50" }
			]);
		});

		it("should retrieve ARNS records successfully with both cursor and limit parameters", async () => {
			const params = { cursor: "test-cursor", limit: 25 };
			const records = await client.getArNSRecords(params);

			expect(records).toEqual(mockArnsRecordsResponse);
			expect(BaseClient.prototype.dryrun).toHaveBeenCalledWith('', [
				{ name: "Action", value: "Paginated-Records" },
				{ name: "Cursor", value: "test-cursor" },
				{ name: "Limit", value: "25" }
			]);
		});

		it("should throw ProcessClientError when dryrun fails", async () => {
			const error = new Error("Dryrun failed");
			jest.spyOn(BaseClient.prototype, 'dryrun').mockRejectedValueOnce(error);

			await expect(client.getArNSRecords()).rejects.toThrow(ProcessClientError);
		});
	});

	describe("getProcessId()", () => {
		it("should return process ID", () => {
			const processId = client.getProcessId();
			expect(typeof processId).toBe("string");
		});
	});
});
