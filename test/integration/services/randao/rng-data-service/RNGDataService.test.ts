import { RNGDataService } from "../../../../../src";
import { Logger, LogLevel } from "../../../../../src/utils/logger";
import { take } from "rxjs";

describe("RNGDataService Integration Tests", () => {
	it("should get RNG Beta AO sales stream", async () => {
		Logger.setLogLevel(LogLevel.DEBUG);
		const service = RNGDataService.autoConfiguration();

		// Create a promise to handle the observable
		const result = await new Promise((resolve, reject) => {
			const creditNotices: any[] = [];

			service.getRNGFaucetSales()
				.pipe(take(10)) // Take first 10 credit notices
				.subscribe({
					next: (creditNotice) => {
						creditNotices.push(creditNotice);
					},
					complete: () => {
						resolve(creditNotices);
					},
					error: (error) => {
						reject(error);
					}
				});
		});

		Logger.debug(`Number of results: ${(result as any[]).length}`);
		if ((result as any[]).length > 0) {
			Logger.debug("First result:", (result as any[])[0]);
		}

		expect(Array.isArray(result)).toBe(true);
	}, 30000);
});
