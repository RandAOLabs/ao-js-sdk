import { Logger } from "src/utils/logger";
import { IAmmFinderService, AmmFinderService } from "../../../../src/services";

describe("IAmmFinderService Integration Tests", () => {
	let service: IAmmFinderService;

	beforeEach(() => {
		service = AmmFinderService.autoConfiguration();
	});

	it("should find AMMs for token pairs and print results", async () => {
		// Test token process IDs - you can replace these with real token process IDs
		const tokenProcessIdA = "Va_tHWVZFjk-TOlxRmFGeNmhn_lqv1bzlm6rnAp9Fsw";
		const tokenProcessIdB = "lgE3_BQw3ZJwsYUrt_pTMGVcnrCwuvNh8kSHa6E8sl8";

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
