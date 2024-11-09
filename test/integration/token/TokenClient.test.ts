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


    describe("balances()", () => {
        it("should fetch balances without throwing an error", async () => {
            await expect(client.balances()).resolves.not.toThrow();
        });

        it("should fetch balances with a limit and cursor without throwing an error", async () => {
            const limit = 5;
            await expect(client.balances(limit)).resolves.not.toThrow();
        });
    });

    describe("getInfo()", () => {
        it("should fetch token info without throwing an error", async () => {
            const token = "TRUNK";
            await expect(client.getInfo(token)).resolves.not.toThrow();
        });
    });
});
