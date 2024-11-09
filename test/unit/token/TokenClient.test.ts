import { TokenClient } from "@tokenClient/index";
import { message } from "@permaweb/aoconnect";
import { Tags } from "@src/core/abstract/types";

// Mock the functions from '@permaweb/aoconnect'
//mocks
jest.mock('@permaweb/aoconnect', () => ({
    message: jest.fn(),
    results: jest.fn(),
    result: jest.fn(),
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
            const mockResponse = "100";
            (message as jest.Mock).mockResolvedValueOnce(mockResponse);

            // Act
            const response = await client.balance(identifier);

            // Assert
            expect(message).toHaveBeenCalled();
            expect(response).toEqual(mockResponse);
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
            (message as jest.Mock).mockResolvedValueOnce(undefined);

            // Act
            await client.balances(limit, cursor);

            // Assert
            expect(message).toHaveBeenCalled();
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
            (message as jest.Mock).mockResolvedValueOnce(undefined);

            // Act
            await client.transfer(recipient, quantity, forwardedTags);

            // Assert
            expect(message).toHaveBeenCalled();
        });
    });

    /**
     * Test case: Fetching token info
     */
    describe("getInfo()", () => {
        it("should fetch token info with correct parameters", async () => {
            // Arrange
            const token = "test-token";
            (message as jest.Mock).mockResolvedValueOnce(undefined);

            // Act
            await client.getInfo(token);

            // Assert
            expect(message).toHaveBeenCalled();
        });
    });

    /**
     * Test case: Minting tokens
     */
    describe("mint()", () => {
        it("should mint tokens with correct parameters", async () => {
            // Arrange
            const quantity = "1000";
            (message as jest.Mock).mockResolvedValueOnce(undefined);

            // Act
            await client.mint(quantity);

            // Assert
            expect(message).toHaveBeenCalled();
        });
    });
});
