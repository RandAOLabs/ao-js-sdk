import { CollectionInfo, UpdateAssetsRequest } from "src/clients/bazar/collection/abstract/types";

export interface ICollectionClient {
    /**
     * Get collection information
     */
    getInfo(): Promise<CollectionInfo>;

    /**
     * Update collection assets (add or remove)
     * @param request The update request containing asset IDs and update type
     */
    updateAssets(request: UpdateAssetsRequest): Promise<boolean>;

    /**
     * Add collection to a profile
     * @param profileProcessId The profile process ID
     */
    addToProfile(profileProcessId: string): Promise<void>;

    /**
     * Transfer all NFTs in the collection to a recipient
     * Creates an NFT client instance for each asset process ID and transfers them
     * @param recipient The recipient's address to transfer all NFTs to
     * @throws TransferAllAssetsError if any transfers fail
     */
    transferAllAssets(recipient: string): Promise<void>;
}
