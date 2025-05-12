import { ArweaveDataService, IArweaveDataService, Logger, LogLevel } from "../../../../src";



describe('IArweaveDataService Integration Tests', () => {
	let service: IArweaveDataService;

	beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG)
		service = ArweaveDataService.autoConfiguration()
	});

	it('getTransactionData', async () => {
		const result = await service.getTransactionData("ZcRZJnNrPogSaCqiS0l_Vc0M7erYT9zEMMbqoMdcq1Q")
		Logger.info(result)
	}, 100000);

	it('getWalletBalance', async () => {
		// Using a known Arweave wallet address for testing
		const address = 'NlNd_PcajvxAkOweo7rZHJKiIJ7vW1WXt9vb6CzGmC0';
		const balance = await service.getWalletBalance(address);
		
		expect(typeof balance).toBe('number');
		expect(balance).toBeGreaterThanOrEqual(0);
		
		// Log both Winston and AR values
		Logger.info(`Balance in Winston: ${balance}`);
		Logger.info(`Balance in AR: ${balance / 1000000000000}`);
	}, 100000);

});
