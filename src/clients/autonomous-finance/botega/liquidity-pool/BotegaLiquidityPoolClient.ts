import { IBotegaLiquidityPoolClient } from "./abstract";
import { LPInfo } from "./abstract/types";
import { DryRunCachingClient } from "src/core/ao/client-variants";
import { TokenClient } from "src/clients/ao/token/TokenClient";
import { Logger } from "src/utils/index";
import TagUtils from "src/core/common/TagUtils";
import { ArweaveTransaction } from "src/core/arweave/abstract/types";
import { ITokenClient } from "src/clients/ao";
import { Tags } from "src/core/common/types";
import {
    GetLPInfoError,
    GetPriceError,
    GetTokenAError,
    GetTokenBError,
    GetPriceOfTokenAInTokenBError,
    GetPriceOfTokenBInTokenAError
} from "./BotegaLiquidityPoolClientError";
import { BaseClientConfigBuilder, DryRunCachingClientConfigBuilder } from "src/core/ao/configuration/builder";

/**
 * @category Autonomous Finance
 */
export class BotegaLiquidityPoolClient extends DryRunCachingClient implements IBotegaLiquidityPoolClient {
    private processInfo?: ArweaveTransaction;
    private tokenAClient?: ITokenClient;
    private tokenBClient?: ITokenClient;

    constructor(processId: string) {
        const builder = new DryRunCachingClientConfigBuilder()
        const config = builder
            .withProcessId(processId)
            .build()
        super(config);
    }

    /* Core Liquidity Pool Functions */
    public async getLPInfo(): Promise<LPInfo> {
        try {
            // Get process info if not already cached
            if (!this.processInfo) {
                this.processInfo = await this.getProcessInfo();
            }
            // Extract required tags
            const tags = this.processInfo?.tags || [];
            return {
                tokenA: TagUtils.getTagValue(tags, "Token-A") || "",
                tokenATicker: TagUtils.getTagValue(tags, "Token-A-Ticker") || "",
                tokenB: TagUtils.getTagValue(tags, "Token-B") || "",
                tokenBTicker: TagUtils.getTagValue(tags, "Token-B-Ticker") || "",
                name: TagUtils.getTagValue(tags, "Name") || ""
            };
        } catch (error: any) {
            Logger.error(`Error fetching liquidity pool info: ${error.message}`);
            throw new GetLPInfoError(error);
        }
    }

    public async getPrice(quantity: number | string, tokenId: string): Promise<number> {
        try {
            const result = await this.dryrun('', [
                { name: "Action", value: "Get-Price" },
                { name: "Token", value: tokenId },
                { name: "Quantity", value: quantity.toString() }
            ]);

            const price = TagUtils.getTagValue(result.Messages[0].Tags as Tags, "Price");
            if (!price) {
                throw new Error("Price tag not found in response");
            }

            return Number(price);
        } catch (error: any) {
            Logger.error(`Error getting price for token ${tokenId}: ${error.message}`);
            throw new GetPriceError(tokenId, quantity, error);
        }
    }

    public async getTokenA(): Promise<ITokenClient> {
        if (!this.tokenAClient) {
            try {
                const lpInfo = await this.getLPInfo();
                const builder = new BaseClientConfigBuilder()
                const config = builder
                    .withProcessId(lpInfo.tokenA)
                    .build()
                this.tokenAClient = new TokenClient(config);
            } catch (error: any) {
                Logger.error(`Error initializing token A client: ${error.message}`);
                throw new GetTokenAError(error);
            }
        }
        return this.tokenAClient;
    }

    public async getTokenB(): Promise<ITokenClient> {
        if (!this.tokenBClient) {
            try {
                const lpInfo = await this.getLPInfo();
                const builder = new BaseClientConfigBuilder()
                const config = builder
                    .withProcessId(lpInfo.tokenB)
                    .build()
                this.tokenBClient = new TokenClient(config);
            } catch (error: any) {
                Logger.error(`Error initializing token B client: ${error.message}`);
                throw new GetTokenBError(error);
            }
        }
        return this.tokenBClient;
    }

    public async getPriceOfTokenAInTokenB(quantity: number | string): Promise<number> {
        try {
            const lpInfo = await this.getLPInfo();
            return this.getPrice(Number(quantity), lpInfo.tokenA);
        } catch (error: any) {
            Logger.error(`Error getting price of token A in token B: ${error.message}`);
            throw new GetPriceOfTokenAInTokenBError(quantity, error);
        }
    }

    public async getPriceOfTokenBInTokenA(quantity: number | string): Promise<number> {
        try {
            const lpInfo = await this.getLPInfo();
            return this.getPrice(Number(quantity), lpInfo.tokenB);
        } catch (error: any) {
            Logger.error(`Error getting price of token B in token A: ${error.message}`);
            throw new GetPriceOfTokenBInTokenAError(quantity, error);
        }
    }
}
