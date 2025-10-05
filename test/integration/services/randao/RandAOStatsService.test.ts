import { Logger, LogLevel } from "src/utils";
import { RandAOStatsService } from "../../../../src/services/randao/randao-stats-service/RandAOStatsService";
import { IRandAOStatsService } from "src/services";
import { lastValueFrom } from "rxjs";

jest.setTimeout(6000000);
describe("RandAOStatsService Integration Tests", () => {
	let service: IRandAOStatsService;

	beforeAll(async () => {
		Logger.setLogLevel(LogLevel.DEBUG);
		service = await RandAOStatsService.autoConfiguration();
	});

	describe("getTotalRandomnessCreated", () => {
		it("should return total count of randomness created", async () => {
			Logger.info("----------------------");
			const result = await service.getTotalRandomnessCreated();
			Logger.info(`Total randomness created: ${result}`);
			Logger.info("----------------------");

			expect(typeof result).toBe("bigint");
			expect(result).toBeGreaterThanOrEqual(BigInt(0));
		});
	});

	describe("getRandomCreatedOverTimeDaily$", () => {
		it("should return daily random creation statistics as accumulating array", async () => {
			Logger.info("----------------------");
			const result = await lastValueFrom(service.getRandomCreatedOverTimeDaily$());
			Logger.info(`Daily stats result (${result.length} entries):`, result);
			Logger.info("----------------------");

			expect(Array.isArray(result)).toBe(true);
			if (result.length > 0) {
				expect(result[0]).toHaveProperty('date');
				expect(result[0]).toHaveProperty('count');
			}
		});
	});

	describe("getRandomCreatedOverTimeWeekly$", () => {
		it("should return weekly random creation statistics as accumulating array", async () => {
			Logger.info("----------------------");
			const result = await lastValueFrom(service.getRandomCreatedOverTimeWeekly$());
			Logger.info(`Weekly stats result (${result.length} entries):`, result);
			Logger.info("----------------------");

			expect(Array.isArray(result)).toBe(true);
			if (result.length > 0) {
				expect(result[0]).toHaveProperty('date');
				expect(result[0]).toHaveProperty('count');
			}
		});
	});

	describe("getRandomCreatedOverTimeMonthly$", () => {
		it("should return monthly random creation statistics as accumulating array", async () => {
			Logger.info("----------------------");
			const result = await lastValueFrom(service.getRandomCreatedOverTimeMonthly$());
			Logger.info(`Monthly stats result (${result.length} entries):`, result);
			Logger.info("----------------------");

			expect(Array.isArray(result)).toBe(true);
			if (result.length > 0) {
				expect(result[0]).toHaveProperty('date');
				expect(result[0]).toHaveProperty('count');
			}
		});
	});

	describe("getRandomCreatedOverTimeYearly$", () => {
		it("should return yearly random creation statistics as accumulating array", async () => {
			Logger.info("----------------------");
			const result = await lastValueFrom(service.getRandomCreatedOverTimeYearly$());
			Logger.info(`Yearly stats result (${result.length} entries):`, result);
			Logger.info("----------------------");

			expect(Array.isArray(result)).toBe(true);
			if (result.length > 0) {
				expect(result[0]).toHaveProperty('date');
				expect(result[0]).toHaveProperty('count');
			}
		});
	});
});
