import { lastValueFrom, timeout } from "rxjs";
import { Logger, LogLevel } from "../../../../../src/utils/logger";
import { ARIORewindService, IARIORewindService } from "../../../../../src/services/ario/rewind-service";


describe("ARIORewindService Integration Tests", () => {
	let service: IARIORewindService;

	beforeEach(async () => {
		Logger.setLogLevel(LogLevel.INFO)
		service = await ARIORewindService.autoConfiguration()
	});

	it("should get event history for an expired domain and print results", async () => {
		const testDomainName = "joose"
		// const testDomainName = "wheelgen" // non expired domain
		Logger.info(`Testing getEventHistory for domain: ${testDomainName}`);

		const eventHistory$ = service.getEventHistory$(testDomainName);
		const result = await lastValueFrom(eventHistory$.pipe(timeout(300000)));

		Logger.info(`Number of events found: ${result.length}`);

		// Loop through all results and print their toString() output
		for (let i = 0; i < result.length; i++) {
			Logger.info(`Event ${i + 1}: ${result[i].toString()}`);
		}
	}, 500000);
});
