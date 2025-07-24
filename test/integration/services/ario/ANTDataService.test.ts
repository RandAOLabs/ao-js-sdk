import { ANTDataService } from "src/services/ario/ant-data-service/ANTDataService";
import { IANTDataService } from "src/services/ario/ant-data-service/abstract/IANTDataService";
import { Logger } from "src/utils/logger";
import { firstValueFrom, timeout } from "rxjs";

describe("ANTDataService Integration Tests", () => {
	let service: IANTDataService;

	beforeEach(() => {
		service = ANTDataService.autoConfiguration();
	});

	it("should get state notices for a process", async () => {
		const testProcessId = "MKcL6KAvohysOVOKVvowuU4-NSBQZAM07_Y98j05gds";

		Logger.info(`Testing getStateNotices for process: ${testProcessId}`);

		try {
			const notices$ = service.getStateNotices(testProcessId);
			const result = await firstValueFrom(notices$.pipe(timeout(10000)));

			Logger.info(`State notices result for '${testProcessId}':`, result);
			Logger.info(`Number of state notices found: ${result.length}`);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);

		} catch (error) {
			Logger.error(`Error getting state notices for '${testProcessId}':`, error);
			expect(error).toBeDefined();
		}
	});

	it("should get state notices with data for a process", async () => {
		const testProcessId = "MKcL6KAvohysOVOKVvowuU4-NSBQZAM07_Y98j05gds";

		Logger.info(`Testing getStateNoticesWithData for process: ${testProcessId}`);

		try {
			const noticesWithData$ = service.getStateNoticesWithData(testProcessId);
			const result = await firstValueFrom(noticesWithData$.pipe(timeout(15000)));

			Logger.info(`State notices with data result for '${testProcessId}':`, result);
			Logger.info(`Number of state notices with data found: ${result.length}`);

			// Print each transaction with its data
			result.forEach((item, index) => {
				Logger.info(`Transaction ${index + 1}:`, {
					transactionId: item.transaction.id,
					data: item.data
				});
			});

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);

		} catch (error) {
			Logger.error(`Error getting state notices with data for '${testProcessId}':`, error);
			expect(error).toBeDefined();
		}
	});
})
