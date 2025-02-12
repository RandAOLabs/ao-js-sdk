import { ARIOService } from "src/services/ario/ARIOService";
import { Logger } from "src/utils/logger";

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
});
