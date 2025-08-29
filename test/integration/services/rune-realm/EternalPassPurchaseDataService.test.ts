import { Logger } from "src/utils/logger";
import { lastValueFrom, timeout } from "rxjs";
import { EternalPassPurchaseDataService } from "../../../../src/services/rune-realm/eternal-pass-purchase-data/EternalPassPurchaseDataService";
import { IEternalPassPurchaseDataService } from "../../../../src/services/rune-realm/eternal-pass-purchase-data/abstract/IEternalPassPurchaseDataService";
import { PurchaseOption } from "../../../../src/services/rune-realm/eternal-pass-purchase-data/purchase-options";

describe("EternalPassPurchaseDataService Integration Tests", () => {
	let service: IEternalPassPurchaseDataService;

	beforeEach(() => {
		service = EternalPassPurchaseDataService.autoConfiguration();
	});

	it("should get purchase data for AO token and print results", async () => {
		Logger.info(`Testing getPurchaseDataFromProcess$ for AO token`);

		const purchaseData$ = service.getPurchaseDataFromProcess$(PurchaseOption.AO);
		const result = await lastValueFrom(purchaseData$.pipe(timeout(300000)));

		Logger.info(`Number of purchase records found for AO: ${result.length}`);

		// Print details of first few results
		for (let i = 0; i < Math.min(result.length, 5); i++) {
			const tokenBalance = result[i];
			Logger.info(`Purchase ${i + 1}:`);
			Logger.info(`  Token: ${tokenBalance.getTokenConfig().name}`);
			Logger.info(`  Amount: ${tokenBalance.getCurrencyAmount().toString()}`);
			Logger.info(`  Process ID: ${tokenBalance.getTokenConfig().tokenProcessId}`);
		}
	}, 500000);

	it("should get purchase data for TRUNK token and print results", async () => {
		Logger.info(`Testing getPurchaseDataFromProcess$ for TRUNK token`);

		const purchaseData$ = service.getPurchaseDataFromProcess$(PurchaseOption.TRUNK);
		const result = await lastValueFrom(purchaseData$.pipe(timeout(300000)));

		Logger.info(`Number of purchase records found for TRUNK: ${result.length}`);

		// Print details of first few results
		for (let i = 0; i < Math.min(result.length, 5); i++) {
			const tokenBalance = result[i];
			Logger.info(`Purchase ${i + 1}:`);
			Logger.info(`  Token: ${tokenBalance.getTokenConfig().name}`);
			Logger.info(`  Amount: ${tokenBalance.getCurrencyAmount().toString()}`);
			Logger.info(`  Process ID: ${tokenBalance.getTokenConfig().tokenProcessId}`);
		}
	}, 500000);

	it("should get purchase data for WAR token and print results", async () => {
		Logger.info(`Testing getPurchaseDataFromProcess$ for WAR token`);

		const purchaseData$ = service.getPurchaseDataFromProcess$(PurchaseOption.WAR);
		const result = await lastValueFrom(purchaseData$.pipe(timeout(300000)));

		Logger.info(`Number of purchase records found for WAR: ${result.length}`);

		// Print details of first few results
		for (let i = 0; i < Math.min(result.length, 5); i++) {
			const tokenBalance = result[i];
			Logger.info(`Purchase ${i + 1}:`);
			Logger.info(`  Token: ${tokenBalance.getTokenConfig().name}`);
			Logger.info(`  Amount: ${tokenBalance.getCurrencyAmount().toString()}`);
			Logger.info(`  Process ID: ${tokenBalance.getTokenConfig().tokenProcessId}`);
		}
	}, 500000);

	it("should test all purchase options and print summary", async () => {
		Logger.info(`Testing all purchase options`);

		const purchaseOptions = [
			PurchaseOption.AO,
			PurchaseOption.TRUNK,
			PurchaseOption.WAR,
			PurchaseOption.GAME,
			PurchaseOption.NAB
		];

		for (const option of purchaseOptions) {
			try {
				Logger.info(`\n--- Testing ${PurchaseOption[option]} ---`);

				const purchaseData$ = service.getPurchaseDataFromProcess$(option);
				const result = await lastValueFrom(purchaseData$.pipe(timeout(300000)));

				Logger.info(`${PurchaseOption[option]}: ${result.length} purchase records found`);

				if (result.length > 0) {
					const firstRecord = result[0];
					Logger.info(`  Sample record - Amount: ${firstRecord.getCurrencyAmount().toString()}`);
					Logger.info(`  Token Config: ${JSON.stringify(firstRecord.getTokenConfig(), null, 2)}`);
				}
			} catch (error) {
				Logger.error(`Error testing ${PurchaseOption[option]}:`, error);
			}
		}
	}, 500000);

});
