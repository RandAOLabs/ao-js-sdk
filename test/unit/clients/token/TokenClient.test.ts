
import { dryrun } from "@permaweb/aoconnect";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { Tags } from "src/core";
import { BaseClient } from "src/core/ao/BaseClient";
import { BaseClientConfigBuilder } from "src/core/ao/configuration/builder";
import { TokenClient } from "src/index";


// Mock the functions from '@permaweb/aoconnect'


//mocks
jest.mock('@permaweb/aoconnect', () => ({
    message: jest.fn(),
    results: jest.fn(),
    result: jest.fn(),
    dryrun: jest.fn(),
    createDataItemSigner: jest.fn(), // Create a Jest mock function here
}));
/*
* Mocks the logger for tests to suppress log outputs.
* Logs a warning that logging has been disabled for the current test suite.
*/
jest.mock('src/utils/logger/logger', () => {
    const actualLogger = jest.requireActual('src/utils/logger/logger');
    return {
        ...actualLogger,
        Logger: {
            ...actualLogger.Logger,
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            log: jest.fn(),
        },
    };
});
describe("TokenClient", () => {
    let client: TokenClient;

    beforeEach(() => {
        // Create a new TokenClient instance using autoConfiguration
        const config = new BaseClientConfigBuilder()
            .withProcessId("test-process-id")
            .build()

        client = new TokenClient(config);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset all mocks after each test
    });

    /**
     * Test case: Fetching balance for an identifier
     */
    describe("balance()", () => {
        it("should fetch balance with correct parameters", async () => {
            // Arrange
            const identifier = "test-identifier";
            const mockResponse = { Messages: [{ Data: "10" }] };
            (dryrun as jest.Mock).mockResolvedValueOnce(mockResponse);

            // Act
            const response = await client.balance(identifier);

            // Assert
            expect(dryrun).toHaveBeenCalled();
            expect(response).toEqual("10");
        });
    });

    /**
     * Test case: Fetching multiple balances
     */
    describe("balances()", () => {
        it("should fetch balances with correct parameters", async () => {
            // Arrange
            const limit = 500;
            const cursor = "test-cursor";
            (dryrun as jest.Mock).mockResolvedValueOnce({});

            // Act
            await client.balances(limit, cursor);

            // Assert
            expect(dryrun).toHaveBeenCalled();
        });
    });

    /**
     * Test case: Transferring tokens to a recipient
     */
    describe("transfer()", () => {
        it("should transfer tokens with correct parameters", async () => {
            // Arrange
            const recipient = "test-recipient";
            const quantity = "50";
            const forwardedTags: Tags = [
                { name: "Tag1", value: "Value1" },
                { name: "Tag2", value: "Value2" },
            ];


            const messageResult: MessageResult = {
                Output: undefined,
                Messages: [{ Data: "You transferred", Tags: [] }],
                Spawns: []
            }
            jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValue(messageResult);

            // Act
            const transfered = await client.transfer(recipient, quantity, forwardedTags);

            // Assert
            expect(transfered).toBeTruthy();
        });
    });

    /**
     * Test case: Fetching token info
     */
    describe("getInfo()", () => {
        it("should fetch token info with correct parameters", async () => {
            // Arrange
            const token = "test-token";
            (dryrun as jest.Mock).mockResolvedValueOnce({ Messages: [{ Data: "10" }] });

            // Act
            await client.getInfo(token);

            // Assert
            expect(dryrun).toHaveBeenCalled();
        });
    });

    /**
     * Test case: Minting tokens
     */
    describe("mint()", () => {
        it("should mint tokens and return true on success", async () => {
            // Arrange
            const quantity = "1000";
            const messageResult: MessageResult = {
                Output: undefined,
                Messages: [{ Tags: [{ name: "Action", value: "Mint-Error" }] }],
                Spawns: []
            }
            jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValue(messageResult);

            // Act
            const response = await client.mint(quantity);

            // Assert
            expect(response).toBe(false);
        });
    });

    /**
     * Test case: Granting tokens
     */
    describe("grant()", () => {
        it("should grant tokens with correct parameters and return true on success", async () => {
            // Arrange
            const quantity = "1000";
            const recipient = "test-recipient";
            const messageResult: MessageResult = {
                Output: undefined,
                Messages: [{ Tags: [{ name: "Action", value: "Success" }] }],
                Spawns: []
            }
            jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValue(messageResult);

            // Act
            const response = await client.grant(quantity, recipient);

            // Assert
            expect(response).toBe(true);
        });

        it("should grant tokens to calling wallet when no recipient specified", async () => {
            // Arrange
            const quantity = "1000";
            const callingWallet = "default-wallet";
            const messageResult: MessageResult = {
                Output: undefined,
                Messages: [{ Tags: [{ name: "Action", value: "Success" }] }],
                Spawns: []
            }
            jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValue(messageResult);
            jest.spyOn(BaseClient.prototype, 'getCallingWalletAddress').mockResolvedValue(callingWallet);

            // Act
            const response = await client.grant(quantity);

            // Assert
            expect(response).toBe(true);
        });

        it("should return false on grant error", async () => {
            // Arrange
            const quantity = "1000";
            const recipient = "test-recipient";
            const messageResult: MessageResult = {
                Output: undefined,
                Messages: [{ Tags: [{ name: "Action", value: "Grant-Error" }] }],
                Spawns: []
            }
            jest.spyOn(BaseClient.prototype, 'messageResult').mockResolvedValue(messageResult);

            // Act
            const response = await client.grant(quantity, recipient);

            // Assert
            expect(response).toBe(false);
        });

        it("should throw GrantError on failure", async () => {
            // Arrange
            const quantity = "1000";
            const recipient = "test-recipient";
            jest.spyOn(BaseClient.prototype, 'messageResult').mockRejectedValue(new Error("Network error"));

            // Act & Assert
            await expect(client.grant(quantity, recipient)).rejects.toThrow("Failed to grant 1000 tokens to test-recipient");
        });
    });
});
