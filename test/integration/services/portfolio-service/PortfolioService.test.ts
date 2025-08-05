import { PortfolioService } from "src/services/portfolio-service/PortfolioService";
import { IPortfolioService } from "src/services/portfolio-service/abstract/IPortfolioService";
import { Logger, LogLevel } from "src/utils/logger";
import { timeout } from "rxjs";
import { TokenBalance } from "../../../../src";

describe("PortfolioService Integration Tests", () => {
	let service: IPortfolioService;

	beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG);
		service = PortfolioService.autoConfiguration();
		Logger.debug("PortfolioService test initialized");
	});

	it("should get tokens for an entity and print results", (done) => {
		// Test entity ID - you can replace this with a real entity ID
		const testEntityId = "rxxU4g-7tUHGvF28W2l53hxarpbaFR4NaSnOaxx6MIE";

		Logger.info(`Testing getTokens$ for entity: ${testEntityId}`);

		const tokens$ = service.getTokens$(testEntityId);

		tokens$.pipe(timeout(300000)).subscribe({
			next: (result) => {
				Logger.info(`Observable emitted - Number of tokens found: ${result.length}`);

				// Loop through and log each token
				result.forEach((token, index: number) => {
					Logger.info(token);
				});
			},
			error: (error) => {
				Logger.error('Error in observable:', error);
				done(error);
			},
			complete: () => {
				Logger.info('Observable completed');
				done();
			}
		});

	}, 500000);

});
