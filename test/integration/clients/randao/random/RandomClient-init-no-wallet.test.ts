import { RandomClient, RandomClientConfig, RandomClientConfigBuilder } from "src/clients";
import { getEnvironmentVariable, Logger, LogLevel, sleep } from "src/utils";

// Integration test for all functions in RandomClient
jest.setTimeout(600000); // Set timeout to 60 seconds for all tests// Integration test for all functions in RandomClient
describe("RandomClient Integration Test", () => {
    let client: RandomClient;


    beforeAll(async () => {
        Logger.setLogLevel(LogLevel.DEBUG)

        // Initialize the RandomClient with actual configuration for integration testing
        const RANDOM_CONFIG: RandomClientConfig = await new RandomClientConfigBuilder()
            .withWallet(JSON.parse(getEnvironmentVariable("REQUEST_WALLET_JSON")))
            .build()
        client = new RandomClient(RANDOM_CONFIG)
    });

    afterAll(() => {
        // Optionally clean up resources or reset configurations
        Logger.info("Integration tests complete.");
    });
    describe("getAllProviderActivity()", () => {
        it("getAllProviderActivity", async () => {
            const response = await client.getAllProviderActivity();
            Logger.debug(response)
        });
    });
});
