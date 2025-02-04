import { Tags, BaseClient } from "../../core";
import { Logger } from "../../utils";
import { INftSaleClient } from "./abstract/INftSaleClient";
import { NftSaleClientConfig } from "./abstract/NftSaleClientConfig";
import { PurchaseNftError, QueryNFTCountError, AddNftError } from "./NftSaleClientError";
import { TokenClient } from "../token";
import { TokenClientConfig } from "../token/abstract/TokenClientConfig";
import { NftClient } from "../nft";
import { getNftSaleClientAutoConfiguration } from "./NftSaleClientAutoConfiguration";

export class NftSaleClient extends BaseClient implements INftSaleClient {
    /* Fields */
    readonly tokenClient: TokenClient;
    readonly purchaseAmount: string;
    /* Fields */

    /* Constructors */
    public constructor(config: NftSaleClientConfig) {
        super(config);
        const tokenConfig: TokenClientConfig = {
            processId: config.tokenProcessId,
            wallet: config.wallet,
            environment: config.environment
        };
        this.tokenClient = new TokenClient(tokenConfig);
        this.purchaseAmount = config.purchaseAmount;
    }

    public static autoConfiguration(): NftSaleClient {
        return new NftSaleClient(getNftSaleClientAutoConfiguration());
    }
    /* Constructors */

    /* Core NFT Sale Functions */
    public async purchaseNft(): Promise<boolean> {
        try {
            const success = await this.tokenClient.transfer(this.getProcessId(), this.purchaseAmount);
            if (!success) {
                throw new Error("Token transfer failed");
            }
            return true;
        } catch (error: any) {
            Logger.error(`Error purchasing NFT: ${error.message}`);
            throw new PurchaseNftError(this.purchaseAmount, error);
        }
    }

    public async queryNFTCount(): Promise<number> {
        try {
            const result = await this.dryrun('', [
                { name: "Action", value: "Query-NFT-Count" }
            ]);

            const count = parseInt(this.getFirstMessageDataString(result));
            if (isNaN(count)) {
                throw new Error("Invalid NFT count response");
            }

            return count;
        } catch (error: any) {
            Logger.error(`Error querying NFT count: ${error.message}`);
            throw new QueryNFTCountError(error);
        }
    }
    /* Core NFT Sale Functions */

    public async addNft(nftProcessId: string): Promise<boolean> {
        try {
            // Create NFT client from the process ID
            const nftClient = new NftClient({
                processId: nftProcessId,
                wallet: this.baseConfig.wallet,
                environment: this.baseConfig.environment
            });

            // Transfer NFT to the sale process
            const success = await nftClient.transfer(this.getProcessId());
            if (!success) {
                throw new Error("NFT transfer failed");
            }

            return true;
        } catch (error: any) {
            Logger.error(`Error adding NFT from process ${nftProcessId}: ${error.message}`);
            throw new AddNftError(nftProcessId, error);
        }
    }
}
