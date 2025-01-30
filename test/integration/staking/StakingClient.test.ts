import { StakingClient, RandomClient } from "../../../src/index";
import { Logger } from "../../../src/utils/index";

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
        it("should unstake tokens without throwing an error", async () => {
            const response = await client.unstake(providerId);
            expect(response).toBeDefined();
        });
    });
});
