import { TokenClientConfig } from "src/clients";
import { BaseClientConfigBuilder } from "src/core/ao/configuration/builder";
import { ARCAO_TEST_NFT_COLLECTION, RNG_TOKEN_PROCESS_ID } from "src/processes_ids";

export const getNftClientAutoConfiguration = (): TokenClientConfig => {
    const builder = new BaseClientConfigBuilder()
    return builder
        .withProcessId(RNG_TOKEN_PROCESS_ID)
        .build()
}