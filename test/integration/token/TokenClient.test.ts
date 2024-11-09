import { TokenClient } from "@tokenClient/index";
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
            const response = await client.balance();

            expect(response).toBeDefined();
            expect(response).not.toEqual("");

        });
    });
});
