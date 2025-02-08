import { Tags } from "../../core/ao/index";
import { TokenClient } from "../token/TokenClient";
import { TokenClientConfig } from "../token/abstract/TokenClientConfig";
import { INftClient } from "./abstract/INftClient";
import { getNftClientAutoConfiguration } from "./NftClientAutoConfiguration";
import { NftTransferError } from "./NftClientError";
import { NFT_QUANTITY } from "./constants";
import { Logger } from "../../utils/index";

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
        return new TokenClient(getNftClientAutoConfiguration());
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
