import { Logger, LogLevel } from "src/utils";
import { RandAOService } from "../../../../src/services/randao/RandAOService";
import { time } from "console";

describe("RandAOService Integration Tests", () => {
    let service: RandAOService;

    beforeAll(async () => {
        Logger.setLogLevel(LogLevel.DEBUG)
        service = await RandAOService.autoConfiguration();
    });

    describe("getAllProviderInfo", () => {
        it("should return an array of provider info", async () => {
            Logger.info("----------------------")
            const result = await service.getAllProviderInfo();
            Logger.info(result)
            Logger.info(`Found ${result.length} providers`);
            Logger.info("----------------------")

            expect(result).toBeInstanceOf(Array);
        });
    });
});
