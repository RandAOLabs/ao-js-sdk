import { NftSaleClient } from "../../../src/clients/nft-sale";
import { Logger } from "../../../src/utils";
import { CollectionClient } from "../../../src/clients/collection";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe("NftSaleClient Integration Tests", () => {
    let nftSaleClient: NftSaleClient;
    let collectionClient: CollectionClient;
    let testNftIds: string[];

    beforeAll(async () => {
        // Initialize clients with auto configuration
        nftSaleClient = await NftSaleClient.createAutoConfigured();
        collectionClient = CollectionClient.autoConfiguration();
        nftSaleClient.setDryRunAsMessage(true);

        // Mint initial tokens
        const tokenClient = nftSaleClient.getTokenClient();
        await tokenClient.mint("1000000");

        // Get NFT IDs from collection
        const collectionInfo = await collectionClient.getInfo();
        testNftIds = collectionInfo.Assets.slice(0, 13); // Only use first 5 NFTs

        Logger.info(`Wallet Address: ${await nftSaleClient.getCallingWalletAddress()}`);
        Logger.info(`Using ${testNftIds.length} NFTs from collection for testing`);
    });

    afterAll(() => {
        Logger.info("NFT Sale integration tests complete.");
    });

    it("should successfully add NFT to sale", async () => {
        await sleep(1000);
        // Add test NFTs to the sale process
        for (const nftProcessId of testNftIds) {
            const success = await nftSaleClient.addNft(nftProcessId);
            expect(success).toBe(true);
        }
    });

    it("should query available count", async () => {
        await sleep(1000);
        // Get initial NFT count
        nftSaleClient.setDryRunAsMessage(true)
        const initialCount = await nftSaleClient.queryNFTCount();
        expect(initialCount).toBeGreaterThan(0);
    });

    it("should successfully purchase NFT", async () => {
        await sleep(1000);
        // Purchase an NFT
        const purchaseSuccess = await nftSaleClient.purchaseNft();
        expect(purchaseSuccess).toBe(true);
    });

    it("should get NFT sale info", async () => {
        await sleep(1000);
        // Get sale info
        const info = await nftSaleClient.getInfo();
        expect(info).toBeDefined();
    });

    // it("should successfully return NFTs to specified recipient", async () => {
    //     await sleep(1000);
    //     // Set dry run as message to ensure we can test the functionality
    //     nftSaleClient.setDryRunAsMessage(true);

    //     // Get recipient address
    //     await nftSaleClient.getCallingWalletAddress();

    //     // Return NFTs
    //     const returnSuccess = await nftSaleClient.returnNFTs();
    //     expect(returnSuccess).toBe(true);
    // });
});
