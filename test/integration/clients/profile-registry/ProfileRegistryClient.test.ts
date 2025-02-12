import { ProfileRegistryClient, ProfileRegistryEntry } from "src/clients";
import { Logger } from "src/utils";

describe("ProfileRegistryClient Integration Test", () => {
    let client: ProfileRegistryClient;

    beforeAll(() => {
        client = ProfileRegistryClient.autoConfiguration();
    });

    afterAll(() => {
        Logger.info("Integration tests complete.");
    });

    describe("getProfileByWalletAddress()", () => {
        it("should fetch at least one profile for calling wallet address", async () => {
            const address = await client.getCallingWalletAddress()
            const profiles: ProfileRegistryEntry[] = await client.getProfileByWalletAddress(address);

            expect(profiles).toBeDefined();
            expect(profiles.length).toBeGreaterThan(0);

            // Verify profile structure
            const profile = profiles[0];
            expect(profile.CallerAddress).toBeDefined();
            expect(profile.ProfileId).toBeDefined();
            expect(profile.Role).toBeDefined();
        });
    });
});
