import { AoJsSdkDataService, IAoJsSdkDataService } from "../../../../src/services/ao-js-sdk";
import { Logger } from "../../../../src/utils/logger";

describe('AoJsSdkDataService Integration Tests', () => {
	let service: IAoJsSdkDataService;

	beforeAll(() => {
		service = AoJsSdkDataService.autoConfiguration();
	});

	describe('getTotalAoJsMessages', () => {
		it('should get total AO JS messages and log the result', async () => {
			const totalMessages = await service.getTotalAoJsMessages();

			Logger.info('Total AO JS SDK messages:', totalMessages);

			expect(typeof totalMessages).toBe('string');
			expect(parseInt(totalMessages)).toBeGreaterThan(0);
		}, 30000); // 30 second timeout for the API call
	});
});
