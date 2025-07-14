import { GameFLPDataService, Logger, LogLevel, PROCESS_IDS } from "../../../../../src";

describe("FLPDataService Integration Tests", () => {
	it("should get most recent distributions", async () => {
		Logger.setLogLevel(LogLevel.DEBUG)
		const service = GameFLPDataService;
		const result = await service.getMostRecentDistributions();
		console.log("Result:", result);
	}, 30000);

	it("should get user's most recent distribution", async () => {
		const service = GameFLPDataService;
		const result = await service.getUsersMostRecentDistributions("BaNVhZoSVna0uE_wqV1_wnaO7dwEO9Br1f6Ccc5N_lM");
		console.log("User distribution:", result);
	}, 30000);
});
