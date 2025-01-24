import { Logger } from "../../../src/utils/index";
import { getWallet } from "../../../src/utils/wallet";
import Permaweb from "@permaweb/libs";
import Arweave from "arweave";
import { connect } from "@permaweb/aoconnect";
import { createDataItemSigner } from "@permaweb/aoconnect";

/**
 * Handles deployment and management of test collections and assets
 */
export class CollectionDeployer {
    private collectionId: string | null = null;
    private assetIds: string[] = [];
    private permaweb!: ReturnType<typeof Permaweb.init>;
    private profileId: string | null = null;
    private initialized = false;

    constructor(private readonly walletAddress: string) {
        Logger.info("Creating CollectionDeployer for test collection");
    }

    private async initialize() {
        if (this.initialized) return;

        Logger.info("Initializing CollectionDeployer");

        const wallet = getWallet();
        if (!wallet) {
            throw new Error("Wallet not found. Make sure PATH_TO_WALLET environment variable is set.");
        }

        const arweave = Arweave.init({
            host: "arweave.net",
            port: 443,
            protocol: "https"
        });

        this.permaweb = Permaweb.init({
            signer: createDataItemSigner(wallet),
            ao: connect(),
            arweave,
        });

        this.initialized = true;
        Logger.info("Permaweb initialized with wallet");
    }

    /**
     * Gets the profile ID for test operations
     * @private
     */
    private async getProfileId(): Promise<string> {
        Logger.info(`Getting profile ID...`);

        // Comment out actual profile lookup and use hardcoded value
        /*
        Logger.info(`Checking for profile with wallet address: ${this.walletAddress}`);
        const profile = await this.permaweb.getProfileByWalletAddress(this.walletAddress);
        if (!profile || !profile.id) {
            throw new Error(
                `No profile found for wallet address: ${this.walletAddress}.\n\n` +
                `Please create a profile at https://bazar.arweave.net/#/`
            );
        }
        return profile.id;
        */

        // Use hardcoded value instead
        const profileId = "Z11o-F2kTQ6FBMp2eLdsYLvfhHJUG6_FLOASM_Ek9eQ";
        Logger.warn(`Using hardcoded profile ID: ${profileId}`);
        return profileId;
    }

    /**
     * Get the deployed collection details
     * @returns Collection ID and asset IDs
     * @throws Error if collection hasn't been deployed
     */
    get deployedCollection(): { collectionId: string; assetIds: string[] } {
        if (!this.collectionId) {
            throw new Error("Collection has not been deployed yet");
        }
        return {
            collectionId: this.collectionId,
            assetIds: [...this.assetIds]
        };
    }

    /**
     * Creates a test collection for lootbox assets
     * @private
     */
    private async createCollection(): Promise<void> {
        Logger.info("Creating test collection...");

        if (!this.profileId) {
            throw new Error("Profile ID not set. Call deploy() first.");
        }

        const response = await this.permaweb.createCollection({
            title: "Test Lootbox Collection",
            description: "A collection of test assets for lootbox integration tests",
            creator: this.profileId,
            banner: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", // 1x1 transparent PNG
            thumbnail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" // 1x1 transparent PNG
        });

        if (!response) {
            throw new Error("Failed to create collection - received null response");
        }

        this.collectionId = response;
        Logger.info(`Test collection created with ID: ${this.collectionId}`);
    }

    /**
     * Creates a test atomic asset
     * @private
     * @param index Asset index for unique identification
     */
    private async createAsset(index: number): Promise<void> {
        Logger.info(`Creating test asset ${index + 1}...`);

        if (!this.profileId) {
            throw new Error("Profile ID not set. Call deploy() first.");
        }

        const response = await this.permaweb.createAtomicAsset({
            creator: this.profileId,
            name: `Test Asset ${index + 1}`,
            title: `Test Asset ${index + 1}`,
            description: `Test asset ${index + 1} for lootbox integration tests`,
            type: "Test Atomic Asset",
            topics: ["test", "lootbox", "integration"],
            contentType: "text/plain",
            data: `Test asset data ${index + 1}`
        });

        if (!response) {
            throw new Error(`Failed to create asset ${index + 1} - received null response`);
        }

        const assetId = response;
        this.assetIds.push(assetId);
        Logger.info(`Test asset ${index + 1} created with ID: ${assetId}`);
    }

    /**
     * Adds assets to the collection
     * @private
     */
    private async addAssetsToCollection(): Promise<void> {
        if (!this.collectionId) {
            throw new Error("Collection ID not set");
        }
        if (!this.profileId) {
            throw new Error("Profile ID not set. Call deploy() first.");
        }

        Logger.info(`Adding ${this.assetIds.length} assets to collection ${this.collectionId}...`);

        const response = await this.permaweb.updateCollectionAssets({
            collectionId: this.collectionId,
            assetIds: this.assetIds,
            creator: this.profileId,
            updateType: "Add"
        });

        if (!response) {
            throw new Error("Failed to update collection assets - received null response");
        }

        Logger.info(`Assets successfully added to collection. Update ID: ${response}`);
    }

    /**
     * Deploys a complete test collection with assets
     * @param numberOfAssets Number of test assets to create
     */
    async deploy(numberOfAssets: number = 3): Promise<void> {
        await this.initialize();

        Logger.info(`Starting deployment of test collection with ${numberOfAssets} assets...`);

        // Get profile ID
        this.profileId = await this.getProfileId();

        await this.createCollection();

        for (let i = 0; i < numberOfAssets; i++) {
            await this.createAsset(i);
        }

        await this.addAssetsToCollection();

        Logger.info("Test collection deployment complete");
        Logger.info(`Collection ID: ${this.collectionId}`);
        Logger.info(`Asset IDs: ${JSON.stringify(this.assetIds, null, 2)}`);
    }
}
