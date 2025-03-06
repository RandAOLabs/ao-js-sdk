import { CollectionClientConfig } from "src/clients";
import { BaseClientConfigBuilder } from "src/core/ao/configuration/builder";
import { ARCAO_TEST_NFT_COLLECTION } from "src/processes_ids";

export const getCollectionClientAutoConfiguration = (): CollectionClientConfig => {
    const builder = new BaseClientConfigBuilder()
    return builder
        .withProcessId(ARCAO_TEST_NFT_COLLECTION)
        .build()
}