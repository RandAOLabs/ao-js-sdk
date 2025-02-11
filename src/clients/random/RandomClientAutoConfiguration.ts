import { RandomClientConfig } from "src/clients/random/abstract";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { RANDOM_PROCESS_ID, RNG_TOKEN_PROCESS_ID } from "src/processes_ids"
export const getRandomClientAutoConfiguration = (): RandomClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RANDOM_PROCESS_ID,
    tokenProcessId: RNG_TOKEN_PROCESS_ID,
});