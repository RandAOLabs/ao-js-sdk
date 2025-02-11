import { CollectionClientConfig } from "./abstract/CollectionClientConfig";
import { getBaseClientAutoConfiguration } from "../../../core/ao/BaseClientAutoConfiguration";
import { ARCAO_TEST_NFT_COLLECTION } from "../../../processes_ids";

export const getCollectionClientAutoConfiguration = (): CollectionClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: ARCAO_TEST_NFT_COLLECTION,
});
