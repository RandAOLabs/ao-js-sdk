import { NftSaleClient } from "../../../src/clients/nft-sale";
import { AddNftError } from "../../../src/clients/nft-sale/NftSaleClientError";
import { Logger } from "../../../src/utils";

describe("NftSaleClient Integration Tests", () => {
    let nftSaleClient: NftSaleClient;
    const testNftIds = [
        "ND9mS61GK2fBXlZU_eVFrXwubHYNBHCTMJd6KdtWbiI",
        "R9vilEqfERNwRw8M94coHfM7B1g-zpRV51BG5vOuWDE",
        "EKbxPhCJfRifSccyeJnApg6fqJ8EFqZhOENWFtCBLxw",
        "3pb1Bt7f9OEU4EXAQKGrdAiF950NuvRzxgjaDmjr7Aw",
        "oi10f-aOyKI0R3Y4QtTSIrA52eCOd7BdV9xu7LFVi28",
        "WzDJaLoGtazFc-M5lj9c-CUttYzhS7Vpjtfn4j9B2JE",
        "BonaQR0Y6wgn831vpYMmGzIKtsCK3vPfP17YQjmKggc",
        "JF9vOqNVxwU_PJUAg7Jc3xNg3WxzYfsJQ8jgBj1ddts",
        "B0Pfw_H6OjS_3PFH_ppBUa4ebMoxywohZEyArvw0NAo",
        "zCyGDe-gyARePupUr8t-kWdA2eIXhPkRmfO1tuzhPjA",
        "tG29nprqDSeo2Z3w0KaSxKBiBy55xZT3hPnMTI9cmVM"
    ];

    beforeAll(async () => {
        // Initialize with auto configuration
        nftSaleClient = NftSaleClient.autoConfiguration();

        // Add test NFTs to the sale process
        for (const nftProcessId of testNftIds) {
            const success = await nftSaleClient.addNft(nftProcessId);
            expect(success).toBe(true);
        }
    });

    afterAll(() => {
        Logger.info("NFT Sale integration tests complete.");
    });

    it("should successfully add NFT to sale", async () => {
        const testNftProcessId = "test-nft-process-id";
        const success = await nftSaleClient.addNft(testNftProcessId);
        expect(success).toBe(true);
    });

    it("should handle errors when adding invalid NFT", async () => {
        const invalidNftProcessId = "";
        await expect(nftSaleClient.addNft(invalidNftProcessId))
            .rejects
            .toThrow(AddNftError);
    });

    it("should successfully purchase NFT and reduce available count", async () => {
        // Get initial NFT count
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
