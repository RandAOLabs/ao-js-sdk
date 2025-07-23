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
});
