import { PortfolioService } from "src/services/portfolio-service/PortfolioService";
import { IPortfolioService } from "src/services/portfolio-service/abstract/IPortfolioService";
import { Logger, LogLevel } from "src/utils/logger";
import { lastValueFrom, Observable, timeout } from "rxjs";
import { Portfolio, TokenBalanceS } from "../../../../src";

describe("PortfolioService Integration Tests", () => {
	let service: IPortfolioService;

	beforeEach(() => {
		Logger.setLogLevel(LogLevel.INFO);
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


	describe("calculatePortfolioWorthUSD()", () => {
		let portfolio$: Observable<Portfolio>;
		it("return the value", (done) => {
			portfolio$ = service.getPortfolio$("rG-b4gQwhfjnbmYhrnvCMDPuXguqmAmYwHZf4y24WYs")

			service.calculatePortfolioWorthAO$(portfolio$).pipe(timeout(300000)).subscribe({
				next: (value) => {
					Logger.info(`Portfolio USD worth update: ${value.toString()}`);
				},
				error: (error) => {
					// Logger.error('Error calculating portfolio USD worth:', error);
					// done(error);
				},
				complete: () => {
					Logger.info('Portfolio USD calculation completed');
					done();
				}
			});
		}, 500000);
	});

});
