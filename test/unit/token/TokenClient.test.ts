import { TokenClient } from "../../../src/clients/token";
import { dryrun, message } from "@permaweb/aoconnect";
import { Tags } from "../../../src/index";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { BaseClient } from "../../../src/index";

// Mock the functions from '@permaweb/aoconnect'
//mocks
jest.mock('@permaweb/aoconnect', () => ({
    message: jest.fn(),
    results: jest.fn(),
    result: jest.fn(),
    dryrun: jest.fn(),
    createDataItemSigner: jest.fn(), // Create a Jest mock function here
}));

describe("TokenClient", () => {
    let client: TokenClient;

    beforeEach(() => {
        // Create a new TokenClient instance using autoConfiguration
        client = TokenClient.autoConfiguration();
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
});
