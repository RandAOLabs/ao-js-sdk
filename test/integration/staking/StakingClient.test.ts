import { StakingClient, RandomClient } from "../../../src/index";
import { Logger } from "../../../src/utils/index";
import { ProviderDetails } from "../../../src/clients/staking/abstract/types";

// Integration test for all functions in StakingClient
jest.setTimeout(60000); // Set timeout to 60 seconds for all tests

describe("StakingClient Integration Test", () => {
    let client: StakingClient;
    let randomClient: RandomClient;
    let providerId: string;
    const stakeAmount = "1000000000000000000000"; // 100 tokens

    beforeAll(async () => {
        // Initialize the clients with actual configuration for integration testing
        client = StakingClient.autoConfiguration();
        randomClient = RandomClient.autoConfiguration();
        providerId = await client.getCallingWalletAddress();
    });

    afterAll(() => {
        // Optionally clean up resources or reset configurations
        Logger.info("Integration tests complete.");
    });

    describe("stake()", () => {
        it("should stake tokens without throwing an error", async () => {
            const response = await client.stake(stakeAmount);
            expect(response).toBeDefined()
        });
    });

    describe("getStake()", () => {
        it("should fetch stake information without throwing an error", async () => {
            const response = await client.getStake(providerId);
            expect(response).toBeDefined();
        });
    });

    describe("unstake()", () => {

        it("should return true/false", async () => {
            // Try to unstake with an invalid provider ID to trigger failure
            const invalidProviderId = "invalid_provider_id";
            const response = await client.unstake(invalidProviderId);
            expect(response).toBeDefined();
        });
    });

    describe("provider info", () => {
        const testDetails: ProviderDetails = {
            name: "Test Provider",
            commission: 10,
            description: "Test provider for integration tests"
        };

        it("should update details and retrieve provider info with explicit providerId", async () => {
            // Update provider details
            await client.updateDetails(testDetails);

            // Get the info back with explicit providerId
            const info = await client.getProviderInfo(providerId);
            expect(info.provider_details).toBeDefined();
        });

        it("should retrieve provider info without providerId (using calling wallet)", async () => {
            // Get the info without providing an ID
            const info = await client.getProviderInfo();
            expect(info.provider_details).toBeDefined();
        });

        it("should get all providers info", async () => {
            const allProviders = await client.getAllProvidersInfo();
            expect(allProviders).toBeDefined();
            expect(Array.isArray(allProviders)).toBe(true);
            expect(allProviders.length).toBeGreaterThan(0);

            // Verify the structure of the first provider
            const firstProvider = allProviders[0];
            expect(firstProvider.stake).toBeDefined();
        });
    });
});
