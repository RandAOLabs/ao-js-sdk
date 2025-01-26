import { TokenClientConfig } from "./abstract/TokenClientConfig";
import { getBaseClientAutoConfiguration, } from "../../core/BaseClientAutoConfiguration";
import { RNG_TOKEN_PROCESS_ID } from "src/processes_ids";

export const getTokenClientAutoConfiguration = (): TokenClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RNG_TOKEN_PROCESS_ID,
});