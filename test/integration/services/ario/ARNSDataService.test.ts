import { ARNSDataService } from "src/services/ario/arns-data-service/ARNSDataService";
import { IARNSDataService } from "src/services/ario/arns-data-service/abstract/IARNSDataService";
import { Logger } from "src/utils/logger";
import { firstValueFrom, timeout } from "rxjs";

describe("ARNSDataService Integration Tests", () => {
	let service: IARNSDataService;

	beforeEach(() => {
		service = ARNSDataService.autoConfiguration();
	});

	it("should get buy name notices for a domain", async () => {
		const testDomainName = "flowweave";

		Logger.info(`Testing getBuyNameNotices for domain: ${testDomainName}`);

		try {
			const notices$ = service.getBuyNameNotices(testDomainName);
			const result = await firstValueFrom(notices$.pipe(timeout(10000)));

			Logger.info(`Buy name notices result for '${testDomainName}':`, result);
			Logger.info(`Number of buy name notices found: ${result.length}`);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);

		} catch (error) {
			Logger.error(`Error getting buy name notices for '${testDomainName}':`, error);
			expect(error).toBeDefined();
		}
	});

	it("should get record notices for a domain", async () => {
		const testDomainName = "hoodrats";

		Logger.info(`Testing getRecordNotices for domain: ${testDomainName}`);

		try {
			const notices$ = service.getRecordNotices(testDomainName);
			const result = await firstValueFrom(notices$.pipe(timeout(10000)));

			Logger.info(`Record notices result for '${testDomainName}':`, result);
			Logger.info(`Number of record notices found: ${result.length}`);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);

		} catch (error) {
			Logger.error(`Error getting record notices for '${testDomainName}':`, error);
			expect(error).toBeDefined();
		}
	});

	it("should get upgrade name notices for a domain", async () => {
		const testDomainName = "infinitely";

		Logger.info(`Testing getUpgradeNameNotices for domain: ${testDomainName}`);

		try {
			const notices$ = service.getUpgradeNameNotices(testDomainName);
			const result = await firstValueFrom(notices$.pipe(timeout(10000)));

			Logger.info(`Upgrade name notices result for '${testDomainName}':`, result);
			Logger.info(`Number of upgrade name notices found: ${result.length}`);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);

		} catch (error) {
			Logger.error(`Error getting upgrade name notices for '${testDomainName}':`, error);
			expect(error).toBeDefined();
		}
	});

	it("should get extend lease notices for a domain", async () => {
		const testDomainName = "mulosbron";

		Logger.info(`Testing getExtendLeaseNotices for domain: ${testDomainName}`);

		try {
			const notices$ = service.getExtendLeaseNotices(testDomainName);
			const result = await firstValueFrom(notices$.pipe(timeout(10000)));

			Logger.info(`Extend lease notices result for '${testDomainName}':`, result);
			Logger.info(`Number of extend lease notices found: ${result.length}`);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);

		} catch (error) {
			Logger.error(`Error getting extend lease notices for '${testDomainName}':`, error);
			expect(error).toBeDefined();
		}
	});

	it("should get increase undername notices for a domain", async () => {
		const testDomainName = "captvicky";

		Logger.info(`Testing getIncreaseUndernameNotices for domain: ${testDomainName}`);

		try {
			const notices$ = service.getIncreaseUndernameNotices(testDomainName);
			const result = await firstValueFrom(notices$.pipe(timeout(10000)));

			Logger.info(`Increase undername notices result for '${testDomainName}':`, result);
			Logger.info(`Number of increase undername notices found: ${result.length}`);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);

		} catch (error) {
			Logger.error(`Error getting increase undername notices for '${testDomainName}':`, error);
			expect(error).toBeDefined();
		}
	});

	it("should get reassign name notices for a domain", async () => {
		const testDomainName = "ownyourownbank";

		Logger.info(`Testing getReassignNameNotices for domain: ${testDomainName}`);

		try {
			const notices$ = service.getReassignNameNotices(testDomainName);
			const result = await firstValueFrom(notices$.pipe(timeout(10000)));

			Logger.info(`Reassign name notices result for '${testDomainName}':`, result);
			Logger.info(`Number of reassign name notices found: ${result.length}`);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);

		} catch (error) {
			Logger.error(`Error getting reassign name notices for '${testDomainName}':`, error);
			expect(error).toBeDefined();
		}
	});

	it("should get returned name notices for a domain", async () => {
		const testDomainName = "permaweb-llms-builder";

		Logger.info(`Testing getReturnedNameNotices for domain: ${testDomainName}`);

		try {
			const notices$ = service.getReturnedNameNotices(testDomainName);
			const result = await firstValueFrom(notices$.pipe(timeout(10000)));

			Logger.info(`Returned name notices result for '${testDomainName}':`, result);
			Logger.info(`Number of returned name notices found: ${result.length}`);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);

		} catch (error) {
			Logger.error(`Error getting returned name notices for '${testDomainName}':`, error);
			expect(error).toBeDefined();
		}
	});
});
