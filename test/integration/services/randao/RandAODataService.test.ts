import { Logger, LogLevel } from "src/utils";
import { RandAODataService } from "../../../../src/services/randao/RandAODataService/RandAODataService";
import { IRandAODataService } from "src/services";

jest.setTimeout(6000000);
describe("RandAODataService Integration Tests", () => {
	let service: IRandAODataService;

	beforeAll(async () => {
		Logger.setLogLevel(LogLevel.DEBUG);
		service = await RandAODataService.autoConfiguration();
	});

	describe("getTotalRandomResponses", () => {
		it("should return total count of random responses", async () => {
			Logger.info("----------------------");
			const result = await service.getTotalRandomResponses();
			Logger.info(`Total random responses: ${result}`);
			Logger.info("----------------------");

			expect(typeof result).toBe("number");
			expect(result).toBeGreaterThanOrEqual(0);
		});
	});
});
