import { LootboxClient } from "../../../src/clients/lootbox";
import { TokenClient } from "../../../src/clients/token";
import { InsufficientTokensError, OpenLootboxError } from "../../../src/clients/lootbox";
import { LOOTBOX_COST } from "../../../src/clients/lootbox";
import { Logger } from "../../../src/utils";

// Mock TokenClient
const mockTokenClientInstance = {
    balance: jest.fn(),
    transfer: jest.fn()
};

jest.mock("../../../src/clients/token", () => ({
    TokenClient: jest.fn().mockImplementation(() => mockTokenClientInstance)
}));

// Mock Logger
jest.mock("../../../src/utils", () => ({
    Logger: {
        error: jest.fn()
    }
}));

describe("LootboxClient", () => {
    let client: LootboxClient;
    let mockPaymentTokenClient: jest.Mocked<TokenClient>;

    beforeEach(() => {
        // Create a new LootboxClient instance using autoConfiguration
        client = LootboxClient.autoConfiguration();
        // Get the mocked TokenClient instance for payments
        mockPaymentTokenClient = (client as any).paymentTokenClient;
        // Reset TokenClient constructor mock
        (TokenClient as unknown as jest.Mock).mockClear();
        // Reset instance methods
        mockTokenClientInstance.balance.mockReset();
        mockTokenClientInstance.transfer.mockReset();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("openLootbox()", () => {
        it("should throw InsufficientTokensError when balance is too low", async () => {
            // Arrange
            const lowBalance = "500"; // Less than LOOTBOX_COST
            mockPaymentTokenClient.balance.mockResolvedValueOnce(lowBalance);

            // Act & Assert
            await expect(client.openLootbox())
                .rejects
                .toThrow(InsufficientTokensError);

            // Verify balance was checked but transfer was not attempted
            expect(mockPaymentTokenClient.balance).toHaveBeenCalled();
            expect(mockPaymentTokenClient.transfer).not.toHaveBeenCalled();
        });

        it("should throw OpenLootboxError when transfer fails", async () => {
            // Arrange
            const sufficientBalance = "2000"; // More than LOOTBOX_COST
            mockPaymentTokenClient.balance.mockResolvedValueOnce(sufficientBalance);
            mockPaymentTokenClient.transfer.mockResolvedValueOnce(false); // Transfer fails

            // Act & Assert
            await expect(client.openLootbox())
                .rejects
                .toThrow(OpenLootboxError);

            // Verify both balance check and transfer were attempted
            expect(mockPaymentTokenClient.balance).toHaveBeenCalled();
            expect(mockPaymentTokenClient.transfer).toHaveBeenCalledWith(
                expect.any(String), // processId
                LOOTBOX_COST
            );
        });

        it("should return true when lootbox is successfully opened", async () => {
            // Arrange
            const sufficientBalance = "2000"; // More than LOOTBOX_COST
            mockPaymentTokenClient.balance.mockResolvedValueOnce(sufficientBalance);
            mockPaymentTokenClient.transfer.mockResolvedValueOnce(true); // Transfer succeeds

            // Act
            const result = await client.openLootbox();

            // Assert
            expect(result).toBe(true);
            expect(mockPaymentTokenClient.balance).toHaveBeenCalled();
            expect(mockPaymentTokenClient.transfer).toHaveBeenCalledWith(
                expect.any(String), // processId
                LOOTBOX_COST
            );
        });
    });

    describe("addPrize()", () => {
        const mockPrizeTokenProcessId = "prize-token-process-id";
        let mockPrizeTokenClient: jest.Mocked<TokenClient>;

        beforeEach(() => {
            // Create a mock for the prize token client
            mockPrizeTokenClient = {
                balance: jest.fn(),
                transfer: jest.fn()
            } as any;

            // Make TokenClient constructor return our mock for prize token
            (TokenClient as unknown as jest.Mock).mockImplementationOnce(() => mockPrizeTokenClient);
        });

        it("should throw OpenLootboxError when transfer fails", async () => {
            // Arrange
            mockPrizeTokenClient.transfer.mockResolvedValueOnce(false); // Transfer fails

            // Act & Assert
            await expect(client.addPrize(mockPrizeTokenProcessId))
                .rejects
                .toThrow(OpenLootboxError);

            // Verify transfer was attempted with correct parameters
            expect(mockPrizeTokenClient.transfer).toHaveBeenCalledWith(
                expect.any(String), // processId
                "1" // Atomic assets are singular
            );

            // Verify TokenClient was instantiated with correct process ID
            expect(TokenClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    processId: mockPrizeTokenProcessId
                })
            );
        });

        it("should return true when prize is successfully added", async () => {
            // Arrange
            mockPrizeTokenClient.transfer.mockResolvedValueOnce(true); // Transfer succeeds

            // Act
            const result = await client.addPrize(mockPrizeTokenProcessId);

            // Assert
            expect(result).toBe(true);
            expect(mockPrizeTokenClient.transfer).toHaveBeenCalledWith(
                expect.any(String), // processId
                "1" // Atomic assets are singular
            );

            // Verify TokenClient was instantiated with correct process ID
            expect(TokenClient).toHaveBeenCalledWith(
                expect.objectContaining({
                    processId: mockPrizeTokenProcessId
                })
            );
        });
    });
});
