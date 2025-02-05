import { CollectionClientConfig } from "./abstract/CollectionClientConfig";
import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { COLLECTION_PROCESS_ID } from "../../processes_ids";

export const getCollectionClientAutoConfiguration = (): CollectionClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: COLLECTION_PROCESS_ID,
});
