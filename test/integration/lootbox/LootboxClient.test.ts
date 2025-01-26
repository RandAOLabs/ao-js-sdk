import { LootboxClient } from "../../../src/index";
import { Logger } from "../../../src/utils/index";
import { CollectionDeployer } from "../helpers/CollectionDeployer";
import { InsufficientTokensError, LootboxClientError, OpenLootboxError } from "../../../src/clients/lootbox/LootboxClientError";
import { TokenClient } from "../../../src/clients/token";
import { LOOTBOX_COST } from "../../../src/clients/lootbox/constants";

// Integration test for all functions in LootboxClient
jest.setTimeout(60000); // Set timeout to 60 seconds for all tests

describe("LootboxClient Integration Test", () => {
    let client: LootboxClient;
    let deployer: CollectionDeployer;
    let walletAddress: string;
    let paymentTokenClient: TokenClient;

    beforeAll(async () => {
        // Initialize the LootboxClient with actual configuration for integration testing
        client = LootboxClient.autoConfiguration();

        // Get wallet address from client
        walletAddress = await client.getCallingWalletAddress();
        Logger.info(`Using wallet address: ${walletAddress}`);

        // Get payment token client from lootbox client
        paymentTokenClient = client.paymentToken;

        // Grant tokens to self for testing
        Logger.info("Granting payment tokens for testing...");
        await paymentTokenClient.mint("100000");
        const balance = await paymentTokenClient.balance();
        Logger.info(`Payment token balance: ${balance}`);

        // Initialize collection deployer with wallet address
        deployer = new CollectionDeployer(walletAddress);

        // Deploy test collection and assets
        await deployer.deploy(3);

        // Wait for 10 seconds to ensure everything is properly initialized
        Logger.info("Waiting 10 seconds for initialization...");
        await new Promise(resolve => setTimeout(resolve, 10000));
        Logger.info("Initialization wait complete");
    });

    afterAll(() => {
        Logger.info("Integration tests complete.");
    });

    describe("addPrize()", () => {
        it("should successfully add 3 prizes to the lootbox", async () => {
            const { assetIds } = deployer.deployedCollection;

            // Add all 3 prizes
            for (const assetId of assetIds) {
                const result = await client.addPrize(assetId);
                expect(result).toBeTruthy();
            }
        });

        it("should fail to add invalid prize token", async () => {
            const invalidTokenId = "invalid-token-id";

            await expect(client.addPrize(invalidTokenId))
                .rejects
                .toThrow();
        });
    });

    describe("listPrizes()", () => {
        it("should show 3 prizes after adding them", async () => {
            const prizes = await client.listPrizes();
            expect(prizes).toHaveLength(3);
            expect(prizes).toEqual(expect.arrayContaining(deployer.deployedCollection.assetIds));
            Logger.info("Verified 3 prizes are available");
        });
    });

    describe("openLootbox()", () => {
        it("should succeed for first 3 lootboxes and fail for 4th due to insufficient prizes", async () => {
            // First 3 lootboxes should succeed
            for (let i = 0; i < 3; i++) {
                const result = await client.openLootbox();
                expect(result).toBeTruthy();
                Logger.info(`Lootbox ${i + 1} opened successfully`);
            }

            // 4th lootbox should fail
            await expect(client.openLootbox())
                .rejects
                .toThrow(OpenLootboxError);
            Logger.info("4th lootbox failed as expected due to no remaining prizes");

            // Verify no prizes are left
            const remainingPrizes = await client.listPrizes();
            expect(remainingPrizes).toHaveLength(0);
            Logger.info("Verified no prizes remain");
        });
    });
});
