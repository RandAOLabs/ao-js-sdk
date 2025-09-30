import { ProfilesService } from "src/services/profiles";
import { Logger } from "src/utils";

describe("ProfilesService Integration Tests", () => {
	let service: ProfilesService;

	beforeAll(() => {
		service = ProfilesService.getInstance();
		// Silence logger during tests
		jest.spyOn(Logger, "error").mockImplementation(() => { });
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	describe("getProfileInfosByWalletAddress", () => {
		it("should retrieve profile infos for multiple wallet addresses", async () => {
			// Test addresses - replace with real test addresses from your environment
			const addresses = [
				"On6gHkUGWGEV2-RyCC5oxk-f2zkVAc7WcAkdPOsF3YI"
			];

			const results = await service.getProfileInfosByWalletAddress(addresses);

			Logger.info(`retrieved ${results.length} profiles`)
		}, 30000); // Increased timeout for network calls
	});
});
