import { LootboxClientConfig } from "./abstract/LootboxClientConfig";
import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { getTokenClientAutoConfiguration } from "../token/TokenClientAutoConfiguration";

export const getLootboxClientAutoConfiguration = (): LootboxClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: "FI9do4L2JAJpZ5PCe554vCNriy3ol3yanz8WmWmRXts", // Base process ID is the lootbox process
    paymentTokenProcessId: "MFkhHzNJolksLqLOhRIaHhSPY20GUPi32uRGG0dZWDw",
});
