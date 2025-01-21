import { LootboxClientConfig } from "./abstract/LootboxClientConfig";
import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { getTokenClientAutoConfiguration } from "../token/TokenClientAutoConfiguration";

export const getLootboxClientAutoConfiguration = (): LootboxClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "REPLACE_WITH_ACTUAL_PROCESS_ID", // Base process ID is the lootbox process
    paymentTokenProcessId: getTokenClientAutoConfiguration().processId, // Reuse token process ID for payments
});
