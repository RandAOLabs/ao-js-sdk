import { ANTClient, BaseClientConfig, Logger, LogLevel } from "../../../../../src";

describe("BotegaLiquidityPoolClient Integration Tests", () => {
	let client: ANTClient;

	beforeAll(async () => {
		Logger.setLogLevel(LogLevel.DEBUG)
		const clientConfig: BaseClientConfig = {
			processId: "RAYZTOwekImmk9YawBDkzQHSXmJXxjsJ-QuWHRqAgLY",//RANDAO
			wallet: undefined
		}
		client = new ANTClient(clientConfig)
	});

	describe("get record", () => {
		it("should return record", async () => {
			const response = await client.getRecord("providers")
			Logger.debug(response)
		});

	});

	describe("getState", () => {
		it("should return state", async () => {
			const response = await client.getState()
			Logger.debug(response)
		});

	});
});


