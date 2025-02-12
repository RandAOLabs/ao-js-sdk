import { ProfileClient, ProfileInfo } from "src/clients";


describe("ProfileClient Integration Tests", () => {
    let client: ProfileClient;

    beforeAll(async () => {
        client = await ProfileClient.createAutoConfigured();
    });

    describe("getProfileInfo", () => {
        it("should return a defined ProfileInfo object", async () => {
            const profileInfo: ProfileInfo = await client.getProfileInfo();

            // Check that the response is defined and has the expected structure
            expect(profileInfo).toBeDefined();
            expect(profileInfo.Profile).toBeDefined();
            expect(profileInfo.Assets).toBeDefined();
            expect(profileInfo.Collections).toBeDefined();
            expect(profileInfo.Owner).toBeDefined();
        });
    });

    describe("transferAsset", () => {
        const ASSET_ID = "ND9mS61GK2fBXlZU_eVFrXwubHYNBHCTMJd6KdtWbiI";
        const QUANTITY = "1";

        it("should successfully transfer an asset", async () => {
            // Attempt to transfer the asset
            const result = await client.transferAsset(ASSET_ID, client.getProcessId(), QUANTITY);
            expect(result).toBe(true);
        });
    });
});
