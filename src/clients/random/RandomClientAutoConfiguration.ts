import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { getTokenClientAutoConfiguration } from "../token";
import { RandomClientConfig } from "./abstract/RandomClientConfig";

export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RANDOM_PROCESS_ID,
    tokenProcessId: RNG_TOKEN_PROCESS_ID,
});