import { getBaseClientAutoConfiguration } from "../../../core/ao/BaseClientAutoConfiguration";
import { RandomClientConfig } from "./abstract/RandomClientConfig";
import { RANDOM_PROCESS_ID, RNG_TOKEN_PROCESS_ID } from "../../../processes_ids"
export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RANDOM_PROCESS_ID,
    tokenProcessId: RNG_TOKEN_PROCESS_ID,
});