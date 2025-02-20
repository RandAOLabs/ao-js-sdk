import { INftClient } from "src/clients/nft/abstract/INftClient";
import { NFT_QUANTITY } from "src/clients/nft/constants";
import { getNftClientAutoConfiguration } from "src/clients/nft/NftClientAutoConfiguration";
import { NftTransferError } from "src/clients/nft/NftClientError";
import { TokenClient, TokenClientConfig } from "src/clients/token";
import { Tags } from "src/core";

import { Logger } from "src/utils/index";

/**
 * @category Clients
 */
export class NftClient extends TokenClient implements INftClient {
    /* Constructors */
    public constructor(configOrProcessId: TokenClientConfig | string) {
        const config = getNftClientAutoConfiguration();

        if (typeof configOrProcessId === 'string') {
            config.processId = configOrProcessId;
        } else {
            Object.assign(config, configOrProcessId);
        }

        super(config);
    }

    public static autoConfiguration(): NftClient {
        return new NftClient(getNftClientAutoConfiguration());
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
