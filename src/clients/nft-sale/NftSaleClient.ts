import { Tags, BaseClient } from "../../core";
import { Logger } from "../../utils";
import { INftSaleClient } from "./abstract/INftSaleClient";
import { NftSaleClientConfig } from "./abstract/NftSaleClientConfig";
import { PurchaseNftError, QueryNFTCountError, AddNftError, ReturnNFTsError } from "./NftSaleClientError";
import { TokenClient } from "../token";
import { TokenClientConfig } from "../token/abstract/TokenClientConfig";
import { ProfileClient } from "../profile";
import { getNftSaleClientAutoConfiguration } from "./NftSaleClientAutoConfiguration";

export class NftSaleClient extends BaseClient implements INftSaleClient {
    /* Fields */
    readonly tokenClient: TokenClient;
    readonly profileClient: ProfileClient;
    readonly purchaseAmount: string;
    /* Fields */

    /* Getters */
    public getTokenClient(): TokenClient {
        return this.tokenClient;
    }
    /* Getters */

    /* Constructors */
    public constructor(config: NftSaleClientConfig, profileClient: ProfileClient) {
        super(config);
        const tokenConfig: TokenClientConfig = {
            processId: config.tokenProcessId,
            wallet: config.wallet,
            environment: config.environment
        };
        this.tokenClient = new TokenClient(tokenConfig);
        this.profileClient = profileClient;
        this.purchaseAmount = config.purchaseAmount;
    }

    public static async create(config?: NftSaleClientConfig, profileClient?: ProfileClient): Promise<NftSaleClient> {
        const finalConfig = config ?? getNftSaleClientAutoConfiguration();
        const finalProfileClient = profileClient ?? await ProfileClient.createAutoConfigured();
        return new NftSaleClient(finalConfig, finalProfileClient);
    }

    public static async createAutoConfigured(): Promise<NftSaleClient> {
        const config = getNftSaleClientAutoConfiguration();
        const profileClient = await ProfileClient.createAutoConfigured();
        return new NftSaleClient(config, profileClient);
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

    public async addNft(nftProcessId: string): Promise<boolean> {
        try {
            // Transfer NFT to the sale process using profile client
            const success = await this.profileClient.transferAsset(
                nftProcessId,
                this.getProcessId(),
                "1"
            );
            if (!success) {
                throw new Error("NFT transfer failed");
            }
            return true;
        } catch (error: any) {
            Logger.error(`Error adding NFT from process ${nftProcessId}: ${error.message}`);
            throw new AddNftError(nftProcessId, error);
        }
    }

    public async returnNFTs(recipient?: string): Promise<boolean> {
        if (!recipient) {
            recipient = this.profileClient.getProcessId()
        }
        try {
            const result = await this.messageResult('', [
                { name: "Action", value: "Return-NFTs" },
                { name: "Recipient", value: recipient }
            ]);
            return true;
        } catch (error: any) {
            Logger.error(`Error returning NFTs to recipient ${recipient}: ${error.message}`);
            throw new ReturnNFTsError(recipient, error);
        }
    }
}
