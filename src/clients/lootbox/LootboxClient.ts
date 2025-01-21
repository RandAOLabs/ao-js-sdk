import { BaseClient } from "../../core";
import { Logger } from "../../utils";
import { ILootboxClient } from "./abstract/ILootboxClient";
import { LootboxClientConfig } from "./abstract/LootboxClientConfig";
import { getLootboxClientAutoConfiguration } from "./LootboxClientAutoConfiguration";
import { InsufficientTokensError, OpenLootboxError } from "./LootboxClientError";
import { LOOTBOX_COST, SUCCESS_MESSAGE } from "./constants";
import { TokenClient } from "../token";

export class LootboxClient extends BaseClient implements ILootboxClient {
    private readonly paymentTokenClient: TokenClient;

    /* Constructors */
    constructor(config: LootboxClientConfig) {
        super(config);
        this.paymentTokenClient = new TokenClient({
            ...config,
            processId: config.paymentTokenProcessId
        });
    }

    public static autoConfiguration(): LootboxClient {
        return new LootboxClient(getLootboxClientAutoConfiguration());
    }
    /* Constructors */

    public async openLootbox(): Promise<boolean> {
        // Check if user has enough tokens
        const balance = await this.paymentTokenClient.balance();
        if (parseInt(balance) < parseInt(LOOTBOX_COST)) {
            throw new InsufficientTokensError(balance, LOOTBOX_COST);
        }

        try {
            // Transfer tokens to the lootbox process
            const result = await this.paymentTokenClient.transfer(
                this.baseConfig.processId, // The lootbox process that will receive the tokens
                LOOTBOX_COST
            );

            // Check if transfer was successful
            if (!result) {
                throw new OpenLootboxError();
            }

            return true;
        } catch (error: any) {
            Logger.error(`Error opening lootbox: ${error.message}`);
            throw new OpenLootboxError(error);
        }
    }

    public async addPrize(prizeTokenProcessId: string): Promise<boolean> {
        try {
            // Create a new token client instance for the prize token
            const prizeTokenClient = new TokenClient({
                ...this.baseConfig,
                processId: prizeTokenProcessId
            });

            // Transfer the prize token to the lootbox process
            const result = await prizeTokenClient.transfer(
                this.baseConfig.processId, // The lootbox process that will receive the token
                "1" // Atomic assets are singular
            );

            // Check if transfer was successful
            if (!result) {
                throw new OpenLootboxError();
            }

            return true;
        } catch (error: any) {
            Logger.error(`Error adding prize: ${error.message}`);
            throw new OpenLootboxError(error);
        }
    }
}
