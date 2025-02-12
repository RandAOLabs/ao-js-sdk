import { ANTCachingService } from "src/services/ario/ANTCachingService";
import { Logger } from "src/utils/logger";

describe("ANTCachingService Integration Tests", () => {
    let service: ANTCachingService;
    const processId = "byaUfQzuojukjWPIQd9-qpGPrO9Nrlqqfib4879LyCE";

    beforeEach(() => {
        service = new ANTCachingService(processId);
    });

    it("should get rng undername record", async () => {
        const result = await service.getRecord("rng");
        Logger.info(`ANT record for 'rng': ${JSON.stringify(result)}`);
        expect(result).toBeDefined();
        expect(result?.transactionId).toBeDefined();
    });
});
