import { ANTClient, ARNSClient, BaseClientConfig, Logger, LogLevel } from "../../../../../src";

describe("BotegaLiquidityPoolClient Integration Tests", () => {
	let client: ARNSClient;

	beforeAll(async () => {
		Logger.setLogLevel(LogLevel.DEBUG)

		client = ARNSClient.autoConfiguration()
	});

	describe("get record", () => {
		it("should return record", async () => {
			const response = await client.getRecord("randao")
			Logger.debug(response)
		});

	});

	describe("get ARNS records", () => {
		it("should return paginated records", async () => {
			const response = await client.getArNSRecords()
			Logger.debug("getArNSRecords response:", response)
		});

		it("should return paginated records with limit", async () => {
			const response = await client.getArNSRecords({ limit: 5 })
			Logger.debug("getArNSRecords with limit response:", response)
		});

		it("should return paginated records with cursor", async () => {
			const response = await client.getArNSRecords({ cursor: "test-cursor" })
			Logger.debug("getArNSRecords with cursor response:", response)
		});

	});

});
