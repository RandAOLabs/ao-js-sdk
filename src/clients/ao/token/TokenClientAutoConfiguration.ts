import { TokenClientConfig } from "src/clients";
import { getBaseClientAutoConfiguration, } from "src/core/ao/BaseClientAutoConfiguration";
import { RNG_TOKEN_PROCESS_ID } from "src/processes_ids";

export const getTokenClientAutoConfiguration = (): TokenClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RNG_TOKEN_PROCESS_ID,
});