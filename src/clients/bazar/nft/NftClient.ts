
import { TokenClient, TokenClientConfig } from "src/clients/ao";
import { INftClient } from "src/clients/bazar/nft/abstract/INftClient";
import { NFT_QUANTITY } from "src/clients/bazar/nft/constants";
import { NftTransferError } from "src/clients/bazar/nft/NftClientError";
import { BaseClientConfigBuilder, Tags } from "src/core";

import { Logger } from "src/utils/index";

/**
 * @category Bazar
 */
export class NftClient extends TokenClient implements INftClient {
    /* Constructors */
    public constructor(configOrProcessId: TokenClientConfig | string) {
        let config;
        if (typeof configOrProcessId === 'string') {
            config = new BaseClientConfigBuilder()
                .withProcessId(configOrProcessId)
                .build()
        } else {
            config = configOrProcessId
        }
        super(config);
    }

    /* Constructors */

    /* Core NFT Functions */
    public async transfer(recipient: string, quantity: string = NFT_QUANTITY, forwardedTags?: Tags): Promise<boolean> {
        try {
            return await super.transfer(recipient, quantity, forwardedTags);
        } catch (error: any) {
            Logger.error(`Error transferring NFT to ${recipient}: ${error.message}`);
            throw new NftTransferError(recipient, error);
        }
    }
    /* Core NFT Functions */
}
