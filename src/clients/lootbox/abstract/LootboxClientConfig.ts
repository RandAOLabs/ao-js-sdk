import { BaseClientConfig } from "../../../core";

export interface LootboxClientConfig extends BaseClientConfig {
    /**
     * Process ID for the token contract that will be used for payments to open lootboxes
     */
    paymentTokenProcessId: string;
}
