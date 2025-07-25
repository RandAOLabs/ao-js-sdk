import { ARIORewindService } from "src/services/ario/rewind-service/ARIORewindService";
import { IARIORewindService } from "src/services/ario/rewind-service/abstract/IARIORewindService";
import { Logger } from "src/utils/logger";
import { firstValueFrom, lastValueFrom, timeout } from "rxjs";
import { ARNSDataService } from "../../../../src";

describe("ARIORewindService Integration Tests", () => {
	let service: IARIORewindService;

	beforeEach(() => {
		service = ARIORewindService.autoConfiguration()
	});

	it("should get event history for a domain and print results", async () => {
		const testDomainName = "ownyourownbank";

		Logger.info(`Testing getEventHistory for domain: ${testDomainName}`);

		const eventHistory$ = service.getEventHistory(testDomainName);
		const result = await lastValueFrom(eventHistory$.pipe(timeout(30000)));

		Logger.info(`Number of events found: ${result.length}`);

		// Loop through all results and print their toString() output
		for (let i = 0; i < result.length; i++) {
			Logger.info(`Event ${i + 1}: ${result[i].toString()}`);
		}



	}, 30000);


});
