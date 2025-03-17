import { Logger, LogLevel } from "src/utils";
import { RandAOService } from "../../../../src/services/randao/RandAOService";
import { IRandAOService } from "src/services";
const http = require('http');
const https = require('https');

// Store original request functions
const originalHttpRequest = http.request;
const originalHttpsRequest = https.request;

// Override http.request
http.request = function() {
  console.log('HTTP Request:', arguments[0]);
  return originalHttpRequest.apply(this, arguments);
};

// Override https.request
https.request = function() {
  console.log('HTTPS Request:', arguments[0]);
  return originalHttpsRequest.apply(this, arguments);
};



jest.setTimeout(6000000);
describe("RandAOService Integration Tests", () => {
    let service: IRandAOService;

    beforeAll(async () => {
        Logger.setLogLevel(LogLevel.DEBUG)
        service = await RandAOService.autoConfiguration();
    });

    // describe("getAllProviderInfo", () => {
    //     it("should return an array of provider info", async () => {
    //         Logger.info("----------------------")
    //         const result = await service.getAllProviderInfo();
    //         Logger.info(result)
    //         Logger.info(`Found ${result.length} providers`);
    //         Logger.info("----------------------")

    //         expect(result).toBeInstanceOf(Array);
    //     });
    // });

    describe("getAllProviderInfo", () => {
        it("should return an array of provider info", async () => {
            const testProvider = "iLxq9CAhPpJZMyQYznUCQiswK-iYoKdOgOCOdu-C6M0"
            Logger.info("----------------------")
            const result = await service.getAllInfoForProvider(testProvider);
            Logger.info(result)
            Logger.info(`Found providers ${result}`);
            Logger.info("----------------------")
        });
    });
});
