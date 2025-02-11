import { CollectionClientConfig } from "src/clients/collection/abstract";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { ARCAO_TEST_NFT_COLLECTION } from "src/processes_ids";

export const getCollectionClientAutoConfiguration = (): CollectionClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: ARCAO_TEST_NFT_COLLECTION,
});
