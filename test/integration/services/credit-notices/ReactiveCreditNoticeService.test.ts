import { PortfolioService } from "src/services/portfolio-service/PortfolioService";
import { IPortfolioService } from "src/services/portfolio-service/abstract/IPortfolioService";
import { Logger, LogLevel } from "src/utils/logger";
import { lastValueFrom, timeout } from "rxjs";
import { IReactiveCreditNoticeService, ReactiveCreditNoticeService } from "../../../../src";

describe("IReactiveCreditNoticeService Integration Tests", () => {
	let service: IReactiveCreditNoticeService;

	beforeEach(() => {
		service = ReactiveCreditNoticeService.autoConfiguration();
	});

	it("should get tokens for an entity and print results", async () => {
		// Test entity ID - you can replace this with a real entity ID
		const testEntityId = "rxxU4g-7tUHGvF28W2l53hxarpbaFR4NaSnOaxx6MIE";

		Logger.info(`Testing getTokens$ for entity: ${testEntityId}`);

		const tokens$ = service.streamCreditNoticesReceivedById$({
			recipientId: testEntityId
		});
		const result = await lastValueFrom(tokens$.pipe(timeout(300000)));

		Logger.info(`Number of tokens found: ${result.length}`);

		// Loop through all results and print their details
		// for (let i = 0; i < result.length; i++) {
		// 	result.
		// }
	}, 500000);

});
