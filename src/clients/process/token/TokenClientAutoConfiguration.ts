import { TokenClientConfig } from "./abstract/TokenClientConfig";
import { getBaseClientAutoConfiguration, } from "../../../core/ao/BaseClientAutoConfiguration";
import { RNG_TOKEN_PROCESS_ID } from "../../../processes_ids";

export const getTokenClientAutoConfiguration = (): TokenClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RNG_TOKEN_PROCESS_ID,
});