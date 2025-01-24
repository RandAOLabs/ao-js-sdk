import { LootboxClientConfig } from "./abstract/LootboxClientConfig";
import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { getTokenClientAutoConfiguration } from "../token/TokenClientAutoConfiguration";

export const getLootboxClientAutoConfiguration = (): LootboxClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "8GGJmsRUH2oxNzDdyV6EgysgHdCl-kSyyumC1RpOmkA", // Base process ID is the lootbox process
    paymentTokenProcessId: getTokenClientAutoConfiguration().processId, // Reuse token process ID for payments
});
