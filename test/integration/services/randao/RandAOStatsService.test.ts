import { RandAOStatsService } from "../../../../src/services/randao/RandAOStatsService";
import { Logger, LogLevel } from "../../../../src/utils";

describe("RandAOStatsService Integration Tests", () => {
    it("should fetch and print monthly response counts", async () => {
		Logger.setLogLevel(LogLevel.DEBUG)
        // Create service instance
        const statsService = await RandAOStatsService.autoConfiguration();

        // Get monthly stats
        const monthlyStats = await statsService.getMonthlyResponseCounts();

        // Print results
        Logger.info("\nMonthly Random Response Statistics:");
        Logger.info("=================================");
        monthlyStats.forEach(stat => {
            Logger.info(`${stat.month}: ${stat.numResponses} responses`);
        });
        Logger.info("=================================\n");

        // Basic validation
        expect(Array.isArray(monthlyStats)).toBe(true);
        monthlyStats.forEach(stat => {
            expect(stat).toHaveProperty("month");
            expect(stat).toHaveProperty("numResponses");
            expect(typeof stat.month).toBe("string");
            expect(typeof stat.numResponses).toBe("number");
            // Validate YYYY-MM format
            expect(stat.month).toMatch(/^\d{4}-\d{2}$/);
        });
    });
});
