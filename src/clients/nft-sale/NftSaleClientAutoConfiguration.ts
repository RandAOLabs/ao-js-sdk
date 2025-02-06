import { getBaseClientAutoConfiguration } from "../../core/BaseClientAutoConfiguration";
import { NftSaleClientConfig } from "./abstract/NftSaleClientConfig";
import { NFT_SALE_PROCESS_ID, ARCAO_TEST_TOKEN_PROCESS_ID } from "../../processes_ids";

const DEFAULT_PURCHASE_AMOUNT = "1000000"; // 1 token with 18 decimals

export const getNftSaleClientAutoConfiguration = (): NftSaleClientConfig => ({
    ...getBaseClientAutoConfiguration(),
    processId: NFT_SALE_PROCESS_ID,
    tokenProcessId: ARCAO_TEST_TOKEN_PROCESS_ID,
    purchaseAmount: DEFAULT_PURCHASE_AMOUNT,
});
