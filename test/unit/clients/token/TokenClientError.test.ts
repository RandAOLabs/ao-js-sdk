// Create mock functions that will be shared between direct imports and connect() return value
const message = jest.fn();
const results = jest.fn();
const result = jest.fn();
const dryrun = jest.fn();
const mockCreateDataItemSigner = jest.fn();

jest.mock('@permaweb/aoconnect', () => ({
    // Direct exports
    createDataItemSigner: mockCreateDataItemSigner,
    // connect function that returns the same mock functions
    connect: jest.fn().mockReturnValue({
        message: message,
        results: results,
        result: result,
        dryrun: dryrun,
        createDataItemSigner: mockCreateDataItemSigner
    })
}));

import { TokenClient, BalanceError, Logger, BalancesError, GetInfoError, MintError } from "src";
import { BaseClientConfigBuilder } from "src/core/ao/configuration/builder";


describe("TokenClient Error Handling", () => {
    let client: TokenClient;

    beforeEach(() => {
        const config = new BaseClientConfigBuilder()
            .withProcessId("test-process-id")
            .build()
        client = new TokenClient(config)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test case: Error handling when fetching balance
     */
    describe("balance() error handling", () => {
        it("should throw BalanceError and log an error when fetching balance fails", async () => {
            // Arrange
            const identifier = "test-identifier";
            const errorMessage = "Failed to fetch balance";
            (dryrun as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

            // Act & Assert
            await expect(client.balance(identifier)).rejects.toThrow(BalanceError);
        });
    });

    /**
     * Test case: Error handling when fetching multiple balances
     */
    describe("balances() error handling", () => {
        it("should throw BalancesError and log an error when fetching balances fails", async () => {
            // Arrange
            (dryrun as jest.Mock).mockRejectedValue(new Error());
            const limit = 500;
            const cursor = "test-cursor";

            // Act & Assert
            await expect(client.balances(limit, cursor)).rejects.toThrow(BalancesError);
        });
    });

    /**
     * Test case: Error handling when transferring tokens
     */
    describe("transfer() error handling", () => {
        it("should throw TransferError and log an error when transferring tokens fails", async () => {
            // Arrange
            const recipient = "test-recipient";
            const quantity = "50";
            (message as jest.Mock).mockRejectedValueOnce(new Error());

            // Act & Assert
            await expect(client.transfer(recipient, quantity)).rejects.toThrow(Error);
        });
    });

    /**
     * Test case: Error handling when fetching token info
     */
    describe("getInfo() error handling", () => {
        it("should throw GetInfoError and log an error when fetching token info fails", async () => {
            // Arrange
            const token = "test-token";
            const errorMessage = "Failed to fetch token info";
            (dryrun as jest.Mock).mockRejectedValue(new Error(errorMessage));

            // Act & Assert
            await expect(client.getInfo(token)).rejects.toThrow(GetInfoError);
        });
    });

    /**
     * Test case: Error handling when minting tokens
     */
    describe("mint() error handling", () => {
        it("should throw MintError and log an error when minting tokens fails", async () => {
            // Arrange
            const quantity = "1000";
            const errorMessage = "Failed to mint tokens";
            (message as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

            // Act & Assert
            await expect(client.mint(quantity)).rejects.toThrow(MintError);
        });
    });
});
