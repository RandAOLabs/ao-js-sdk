import { Logger, LogLevel } from "src/utils/logger";
import { IAmmFinderService, AmmFinderService } from "../../../../src/services";
import { BotegaAmmFinderService } from "../../../../src/services/autonomous-finance/botega-amm-finder-service/BotegaAmmFinderService";

describe("IAmmFinderService Integration Tests", () => {
	let service: IAmmFinderService;

	beforeEach(() => {
		Logger.setLogLevel(LogLevel.DEBUG);
		service = BotegaAmmFinderService.autoConfiguration();
	});

	it("should find AMMs for token pairs and print results", async () => {
		// Test token process IDs - you can replace these with real token process IDs
		const tokenProcessIdA = "s6jcB3ctSbiDNwR-paJgy5iOAhahXahLul8exSLHbGE";
		const tokenProcessIdB = "0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc";

		Logger.info(`Testing findAmm for token pair: ${tokenProcessIdA} <-> ${tokenProcessIdB}`);

		const amms = await service.findAmms(tokenProcessIdA, tokenProcessIdB);

		Logger.info(`Number of AMMs found: ${amms.length}`);

		// Loop through all results and print their details
		for (let i = 0; i < amms.length; i++) {
			const amm = amms[i];
			Logger.info(`AMM ${i + 1}:`);
			Logger.info(`  Process ID: ${amm.getProcess().getId()}`);
		}
	}, 500000);

});
