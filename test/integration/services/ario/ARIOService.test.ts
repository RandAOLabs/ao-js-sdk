import { Logger } from "src/utils/logger";
import { ARIOService } from "../../../../src";

describe("ARIOService Integration Tests", () => {
	let service: ARIOService;

	beforeEach(() => {
		service = ARIOService.getInstance();
	});

	it("should get process IDs in correct order", async () => {
		// Test simple domain
		const simpleResult = await service.getProcessIdForDomain("randao");
		Logger.info(`Process ID for 'randao': ${simpleResult}`);
		expect(simpleResult).toBeDefined();

		// Test domain with underscore
		const underscoreResult = await service.getProcessIdForDomain("api_randao");
		Logger.info(`Process ID for 'rng_randao': ${underscoreResult}`);
		expect(underscoreResult).toBeDefined();
	});

	it("should get all ARNS records and print total count", async () => {
		const allRecords = await service.getAllARNSRecords();
		Logger.info(`Total number of ARNS names: ${allRecords.length}`);
		expect(allRecords).toBeDefined();
		expect(Array.isArray(allRecords)).toBe(true);
		expect(allRecords.length).toBeGreaterThan(0);
	}, 200000);
});
