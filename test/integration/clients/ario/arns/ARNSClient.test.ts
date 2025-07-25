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

});
