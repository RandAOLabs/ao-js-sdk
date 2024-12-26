import { TokenClient } from "../../../src/index";
import { Logger } from "../../../src/index";

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

    describe("grant()", () => {
        it("should increase balance after granting tokens", async () => {
            const initialBalance = await client.balance();
            const grantAmount = "100";
            
            await client.grant(grantAmount);
            
            // Wait a bit for the grant to process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const finalBalance = await client.balance();
            const initialNum = BigInt(initialBalance);
            const finalNum = BigInt(finalBalance);
            const difference = finalNum - initialNum;
            
            expect(difference).toBe(BigInt(grantAmount));
        });

        it("should grant tokens to a specified recipient", async () => {
            const quantity = "100";
            const recipient = "recipient-address";
            const result = await client.grant(quantity, recipient);
            expect(result).toBe(true);
        });

        it("should handle errors when granting tokens", async () => {
            const quantity = "-100"; // Invalid quantity
            const recipient = "recipient-address";
            await expect(client.grant(quantity, recipient))
                .rejects
                .toThrow();
        });
    });
});
