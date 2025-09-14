import { GameFLPDataService, Logger, LogLevel, PROCESS_IDS } from "../../../../../src";
import { IFLPDataService } from "../../../../../src/services/autonomous-finance/flp-data-service/abstract/IFLPDataService";

describe("FLP DataService Integration Tests", () => {
	let service: IFLPDataService;

	beforeAll(() => {
		Logger.setLogLevel(LogLevel.DEBUG);
		service = GameFLPDataService;
	});

	it("should get most recent distributions with timing analysis", async () => {
		console.log("\n=== Testing getMostRecentDistributions with caching ===");

		// First query (should be slower - no cache)
		const startTime1 = Date.now();
		const result1 = await service.getMostRecentDistributions();
		const endTime1 = Date.now();
		const firstQueryTime = endTime1 - startTime1;

		console.log(`First query time: ${firstQueryTime}ms`);
		console.log("First query result count:", result1.length);

		// Second query (should be faster - cached)
		const startTime2 = Date.now();
		const result2 = await service.getMostRecentDistributions();
		const endTime2 = Date.now();
		const secondQueryTime = endTime2 - startTime2;

		console.log(`Second query time: ${secondQueryTime}ms`);
		console.log("Second query result count:", result2.length);

		// Performance analysis
		const speedImprovement = firstQueryTime / secondQueryTime;
		console.log(`Speed improvement: ${speedImprovement.toFixed(2)}x faster`);
		console.log(`Time saved: ${firstQueryTime - secondQueryTime}ms`);

		// Verify results are identical
		expect(result1).toEqual(result2);
		expect(result1.length).toBeGreaterThan(0);

		// Cache should make second query significantly faster
		expect(secondQueryTime).toBeLessThan(firstQueryTime);
	}, 30000);

	it("should get user's most recent distribution with timing analysis", async () => {
		console.log("\n=== Testing getUsersMostRecentDistributions with caching ===");

		const testAddress = "BaNVhZoSVna0uE_wqV1_wnaO7dwEO9Br1f6Ccc5N_lM";

		// First query (should be slower - no cache)
		const startTime1 = Date.now();
		const result1 = await service.getUsersMostRecentDistributions(testAddress);
		const endTime1 = Date.now();
		const firstQueryTime = endTime1 - startTime1;

		console.log(`First query time: ${firstQueryTime}ms`);
		console.log("First query result:", result1);

		// Second query (should be faster - cached)
		const startTime2 = Date.now();
		const result2 = await service.getUsersMostRecentDistributions(testAddress);
		const endTime2 = Date.now();
		const secondQueryTime = endTime2 - startTime2;

		console.log(`Second query time: ${secondQueryTime}ms`);
		console.log("Second query result:", result2);

		// Performance analysis
		const speedImprovement = firstQueryTime / secondQueryTime;
		console.log(`Speed improvement: ${speedImprovement.toFixed(2)}x faster`);
		console.log(`Time saved: ${firstQueryTime - secondQueryTime}ms`);

		// Verify results are identical
		expect(result1).toEqual(result2);

		// Cache should make second query significantly faster
		expect(secondQueryTime).toBeLessThan(firstQueryTime);
	}, 30000);

	it("should get number of delegators with timing analysis", async () => {
		console.log("\n=== Testing getNumDelegators with caching ===");

		// First query (should be slower - no cache)
		const startTime1 = Date.now();
		const result1 = await service.getNumDelegators();
		const endTime1 = Date.now();
		const firstQueryTime = endTime1 - startTime1;

		console.log(`First query time: ${firstQueryTime}ms`);
		console.log("Number of delegators:", result1);

		// Second query (should be faster - cached)
		const startTime2 = Date.now();
		const result2 = await service.getNumDelegators();
		const endTime2 = Date.now();
		const secondQueryTime = endTime2 - startTime2;

		console.log(`Second query time: ${secondQueryTime}ms`);
		console.log("Number of delegators (cached):", result2);

		// Performance analysis
		const speedImprovement = firstQueryTime / secondQueryTime;
		console.log(`Speed improvement: ${speedImprovement.toFixed(2)}x faster`);
		console.log(`Time saved: ${firstQueryTime - secondQueryTime}ms`);

		// Verify results are identical
		expect(result1).toBe(result2);
		expect(result1).toBeGreaterThan(0);

		// Cache should make second query significantly faster
		expect(secondQueryTime).toBeLessThan(firstQueryTime);
	}, 30000);
});
