import { NftClient, TokenClient } from "src";
import { NFT_QUANTITY } from "src/clients/nft/constants";

jest.mock('@permaweb/aoconnect', () => ({
    message: jest.fn(),
    results: jest.fn(),
    result: jest.fn(),
    dryrun: jest.fn(),
    createDataItemSigner: jest.fn(),
}));
/*
* Mocks the logger for tests to suppress log outputs.
* Logs a warning that logging has been disabled for the current test suite.
*/
jest.mock('../../../src/utils/logger/logger', () => {
    const actualLogger = jest.requireActual('../../../src/utils/logger/logger');
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
describe("NftClient", () => {
    let client: NftClient;

    beforeEach(() => {
        client = NftClient.autoConfiguration();
        jest.clearAllMocks();
    });

    describe("transfer()", () => {
        it("should transfer with quantity of 1 by default", async () => {
            // Arrange
            const recipient = "test-recipient";
            const transferSpy = jest.spyOn(TokenClient.prototype, 'transfer')
                .mockResolvedValue(true);

            // Act
            await client.transfer(recipient);

            // Assert
            expect(transferSpy).toHaveBeenCalledWith(recipient, NFT_QUANTITY, undefined);
        });

        it("should wrap errors in NftTransferError", async () => {
            // Arrange
            const recipient = "test-recipient";
            jest.spyOn(TokenClient.prototype, 'transfer')
                .mockRejectedValue(new Error("Network error"));

            // Act & Assert
            await expect(client.transfer(recipient))
                .rejects
                .toThrow("Error transferring NFT to recipient test-recipient");
        });
    });
});
