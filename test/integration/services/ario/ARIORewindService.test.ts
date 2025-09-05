import { ARIORewindService } from "src/services/ario/rewind-service/ARIORewindService";
import { IARIORewindService } from "src/services/ario/rewind-service/abstract/IARIORewindService";
import { Logger, LogLevel } from "src/utils/logger";
import { lastValueFrom, timeout } from "rxjs";

describe("ARIORewindService Integration Tests", () => {
	let service: IARIORewindService;

	beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG)
		service = ARIORewindService.autoConfiguration()
		Logger.debug("0-20f2-f9j09jf9023jf0293jf2039fj2390fj3290jf")
	});

	it("should get event history for a domain and print results", async () => {
		// const testDomainName = "ownyourownbank";
		// const testDomainName = "randao";
		const testDomainName = "game";
		// const testDomainName = "hoodrats";


		Logger.info(`Testing getEventHistory for domain: ${testDomainName}`);

		const eventHistory$ = service.getEventHistory$(testDomainName);
		const result = await lastValueFrom(eventHistory$.pipe(timeout(300000)));

		Logger.info(`Number of events found: ${result.length}`);

		// Loop through all results and print their toString() output
		for (let i = 0; i < result.length; i++) {
			Logger.info(`Event ${i + 1}: ${result[i].toString()}`);
		}
	}, 500000);

	describe("getAntDetail()", () => {
		it("return ant details", async () => {
			const domain = "randao"
			const details = await service.getAntDetail(domain)
			Logger.debug(details)
		});
	});


	describe("getMainnetInitialState()", () => {
		it("return getMainnetInitialState", () => {
			const domain = "randao"
			const details = service.getMainnetInitialState(domain)
			Logger.debug(details)
		});
	});


	describe("getEventHistory()", () => {
		it("return ant details", async () => {
			const domain = "randao"
			const history = await service.getEventHistory(domain)
			for (let i = 0; i < history.length; i++) {
				Logger.info(`Event ${i + 1}: ${history[i].toString()}`);
			}
			// Logger.debug(history.length)
		});
	});

});
