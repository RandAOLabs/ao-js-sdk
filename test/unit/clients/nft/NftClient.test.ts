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

import { NftClient, TokenClient } from "src";
import { NFT_QUANTITY } from "src/clients/bazar/nft/constants";

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
