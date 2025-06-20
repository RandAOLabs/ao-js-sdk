// Integration test for the getInfo function in TokenClient

import { TokenClient, Logger, GameToken, LogLevel } from "src";

describe("TokenClient Integration Test", () => {
	let client: TokenClient;

	beforeAll(() => {
		// Initialize the TokenClient with actual configuration for integration testing
		client = GameToken
	});

	afterAll(() => {
		// Optionally clean up resources or reset configurations
		Logger.info("Integration tests complete.");
	});

	describe("getInfo()", () => {
		it("should fetch token info without throwing an error", async () => {
			const info = await client.getInfo()
			Logger.setLogLevel(LogLevel.DEBUG)
			Logger.debug(info)
		});
	});


});
