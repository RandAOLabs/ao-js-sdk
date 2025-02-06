import { NftSaleClient } from "../../../src/clients/nft-sale";
import { AddNftError } from "../../../src/clients/nft-sale/NftSaleClientError";
import { Logger } from "../../../src/utils";
import { CollectionClient } from "../../../src/clients/collection";

describe("NftSaleClient Integration Tests", () => {
    let nftSaleClient: NftSaleClient;
    let collectionClient: CollectionClient;
    let testNftIds: string[];

    beforeAll(async () => {
        // Initialize clients with auto configuration
        nftSaleClient = await NftSaleClient.createAutoConfigured();
        collectionClient = CollectionClient.autoConfiguration();
        
        // Get NFT IDs from collection
        const collectionInfo = await collectionClient.getInfo();
        testNftIds = collectionInfo.Assets.slice(0, 13); // Only use first 5 NFTs
        Logger.debug(testNftIds)
        
        Logger.info(`Wallet Address: ${await nftSaleClient.getCallingWalletAddress()}`);
        Logger.info(`Using ${testNftIds.length} NFTs from collection for testing`);
    });

    afterAll(() => {
        Logger.info("NFT Sale integration tests complete.");
    });

    it("should successfully add NFT to sale", async () => {
        // Add test NFTs to the sale process
        for (const nftProcessId of testNftIds) {
            const success = await nftSaleClient.addNft(nftProcessId);
            expect(success).toBe(true);
        }
    });

    it("should successfully purchase NFT and reduce available count", async () => {
        // Get initial NFT count
        nftSaleClient.setDryRunAsMessage(true)
        const initialCount = await nftSaleClient.queryNFTCount();
        expect(initialCount).toBeGreaterThan(0);

        // Purchase an NFT
        const purchaseSuccess = await nftSaleClient.purchaseNft();
        expect(purchaseSuccess).toBe(true);

        // Get new count and verify it decreased by 1
        const newCount = await nftSaleClient.queryNFTCount();
        expect(newCount).toBe(initialCount - 1);
    });
});
