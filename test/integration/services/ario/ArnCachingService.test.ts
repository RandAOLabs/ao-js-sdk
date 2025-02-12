import { ArnsCashingService } from "src/services/ario/ARNCachingService";
import { Logger } from "src/utils/logger";

describe("ArnCachingService Integration Tests", () => {
    let arnService: ArnsCashingService;

    beforeEach(() => {
        arnService = new ArnsCashingService();
    });

    it("should successfully retrieve and log ArNS name for 'randao'", async () => {
        const name = "game";
        const result = await arnService.getArNSRecord({ name });

        // Log the result
        Logger.info(`ArNS lookup result for '${name}':`)
        Logger.info(result);

        // Verify response
        expect(result).toBeDefined();
    });
});
