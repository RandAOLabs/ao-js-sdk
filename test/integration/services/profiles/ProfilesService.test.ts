import { ProfilesService } from "src/services/profiles";
import { ProfileInfo } from "src/clients/profile/abstract/types";
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
                "9U_MDLfzf-sdww7d7ydaApDiQz3nyHJ4kTS2-9K4AGA",
                "HjI3WoGLPIEM6GYFlnmrUg5vhj_Qf5OIfmqDgqKJVDY",
                "w8qJRq87az9enOSVrCLAS6R1BAgbA9u6y14Fo1fMdWQ"
            ];

            const results = await service.getProfileInfosByWalletAddress(addresses);

            Logger.info(`retrieved ${results.length} profiles`)
        }, 30000); // Increased timeout for network calls
    });
});
