import { NftSaleInfo } from "src/clients/miscellaneous/nft-sale/abstract/types";

export interface INftSaleClient {
    /**
     * Purchase an NFT by sending a fixed amount of tokens to the process
     * @returns boolean indicating if purchase was successful
     */
    purchaseNft(): Promise<boolean>;

    /**
     * Query the current NFT count
     * @returns number of NFTs
     */
    queryNFTCount(): Promise<number>;

    /**
     * Add an NFT to the sale by creating an NFT client from the process ID
     * and transferring the NFT to the sale process
     * @param nftProcessId The process ID of the NFT to add
     * @returns boolean indicating if the NFT was successfully added
     */
    addNft(nftProcessId: string): Promise<boolean>;

    /**
     * Return NFTs to a specified recipient
     * @param recipient The recipient address to return NFTs to
     * @returns boolean indicating if the NFTs were successfully returned
     */
    returnNFTs(recipient: string): Promise<boolean>;

    /**
     * Participate in lucky draw by sending a fixed amount of tokens to the process
     * @returns boolean indicating if lucky draw participation was successful
     */
    luckyDraw(): Promise<boolean>;

    /**
     * Get detailed information about the NFT sale
     * @returns NftSaleInfo containing sale statistics
     */
    getInfo(): Promise<NftSaleInfo>;
}
