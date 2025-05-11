import { ArweaveDataService, IArweaveDataService, Logger, LogLevel } from "../../../../src";



describe('IArweaveDataService Integration Tests', () => {
	let service: IArweaveDataService;

	beforeEach(() => {
		service = ArweaveDataService.autoConfiguration()
	});

	it('getTransactionData', async () => {
		const result = service.getTransactionData("ZcRZJnNrPogSaCqiS0l_Vc0M7erYT9zEMMbqoMdcq1Q")
		Logger.info(result)
	}, 100000);

});
