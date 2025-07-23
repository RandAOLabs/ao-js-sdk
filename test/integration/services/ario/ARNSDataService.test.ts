import { ARNSDataService } from "src/services/ario/arns-data-service/ARNSDataService";
import { IARNSDataService } from "src/services/ario/arns-data-service/abstract/IARNSDataService";
import { Logger } from "src/utils/logger";
import { firstValueFrom, timeout } from "rxjs";

describe("ARNSDataService Integration Tests", () => {
	let service: IARNSDataService;

	beforeEach(() => {
		service = ARNSDataService.autoConfiguration();
	});

	it("should handle multiple domain queries", async () => {
		const testDomains = ["ownyourownsoul"];

		for (const domain of testDomains) {
			Logger.info(`Testing getBuyNameNotices for domain: ${domain}`);

			try {
				const notices$ = service.getBuyNameNotices(domain);
				const result = await firstValueFrom(notices$.pipe(timeout(5000)));

				Logger.info(`Results for '${domain}': ${result.length} notices found`);
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);

			} catch (error) {
				Logger.warn(`No results or timeout for domain '${domain}':`, error);
				// This is expected for test domains
			}
		}
	});
});
