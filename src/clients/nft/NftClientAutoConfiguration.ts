import { TokenClientConfig } from "src/clients/token";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { RNG_TOKEN_PROCESS_ID } from "src/processes_ids";

export const getNftClientAutoConfiguration = (): TokenClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RNG_TOKEN_PROCESS_ID,
});
