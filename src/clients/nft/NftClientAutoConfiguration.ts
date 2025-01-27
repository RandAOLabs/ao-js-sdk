import { TokenClientConfig } from "../token/abstract/TokenClientConfig";
import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { RNG_TOKEN_PROCESS_ID } from "../../processes_ids";

export const getNftClientAutoConfiguration = (): TokenClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: RNG_TOKEN_PROCESS_ID,
});
