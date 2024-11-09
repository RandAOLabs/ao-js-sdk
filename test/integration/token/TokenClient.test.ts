import { TokenClient } from "@tokenClient/index";
import { Tags } from "@src/core/abstract/types";
import { TOKEN_CLIENT_AUTO_CONFIGURATION } from "@tokenClient/TokenClientAutoConfiguration";
import { Logger } from "@utils/index";

// Integration test for the getInfo function in TokenClient

describe("TokenClient Integration Test", () => {
    let client: TokenClient;

    beforeAll(() => {
        // Initialize the TokenClient with actual configuration for integration testing
        client = TokenClient.autoConfiguration()
    });

    afterAll(() => {
        // Optionally clean up resources or reset configurations
        Logger.info("Integration tests complete.");
    });

    describe("balance()", () => {
        it("should fetch balance with correct parameters and return non-empty value", async () => {
            // Arrange
            const identifier = "valid-test-identifier"; // Ensure that this is a valid identifier for testing

            try {
                // Act
                const response = await client.balance("5waCcAi35PC_ptF2MiIhL34Cq55jDew_Gyh2oy2s298");

                // Assert
                expect(response).toBeDefined();
                expect(response).not.toEqual("");
                Logger.info(`Successfully fetched balance for identifier: ${identifier}, Balance: ${response}`);
            } catch (error) {
                if (error instanceof Error) {
                    Logger.error(`Error fetching balance for identifier: ${identifier}, Error: ${error.message}`);
                } else {
                    Logger.error(`Unknown error fetching balance for identifier: ${identifier}`);
                }
                throw error;
            }
        });
    });
});
