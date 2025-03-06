import { NftSaleClientConfig } from "src/clients";
import { TokenInterfacingClientConfigBuilder } from "src/clients/common/TokenInterfacingClientConfigBuilder";
import { NFT_SALE_PROCESS_ID, ARCAO_TEST_TOKEN_PROCESS_ID } from "src/processes_ids";

export const getNftSaleClientAutoConfiguration = (): NftSaleClientConfig => {
    const builder = new TokenInterfacingClientConfigBuilder()
    return builder
        .withProcessId(NFT_SALE_PROCESS_ID)
        .withTokenProcessId(ARCAO_TEST_TOKEN_PROCESS_ID)
        .build()
};
