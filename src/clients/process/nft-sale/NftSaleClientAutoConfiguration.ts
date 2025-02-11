import { getBaseClientAutoConfiguration } from "../../../core/ao/BaseClientAutoConfiguration";
import { NftSaleClientConfig } from "./abstract/NftSaleClientConfig";
import { NFT_SALE_PROCESS_ID, ARCAO_TEST_TOKEN_PROCESS_ID } from "../../../processes_ids";

export const getNftSaleClientAutoConfiguration = (): NftSaleClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: NFT_SALE_PROCESS_ID,
    tokenProcessId: ARCAO_TEST_TOKEN_PROCESS_ID,
});
