import { NftSaleClientConfig } from "src/clients/nft-sale/abstract";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { NFT_SALE_PROCESS_ID, ARCAO_TEST_TOKEN_PROCESS_ID } from "src/processes_ids";

export const getNftSaleClientAutoConfiguration = (): NftSaleClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: NFT_SALE_PROCESS_ID,
    tokenProcessId: ARCAO_TEST_TOKEN_PROCESS_ID,
});
