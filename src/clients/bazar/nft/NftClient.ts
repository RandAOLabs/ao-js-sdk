
import { TokenClient } from "../../ao/token/TokenClient";
import { INftClient } from "./abstract/INftClient";
import { NFT_QUANTITY } from "./constants";
import { ProcessClientError } from "../../common/ProcessClientError";
import { Tags } from "../../../core";

import { Logger } from "../../../utils/index";
import { TokenClientConfig } from "../../ao/token/abstract";

/**
 * @category Bazar
 */
export class NftClient extends TokenClient implements INftClient {
	/* Constructors */
	public constructor(configOrProcessId: TokenClientConfig) {
		super(configOrProcessId);
	}

	/* Constructors */

	/* Core NFT Functions */
	public async transfer(recipient: string, quantity: string = NFT_QUANTITY, forwardedTags?: Tags): Promise<boolean> {
		try {
			return await super.transfer(recipient, quantity, forwardedTags);
		} catch (error: any) {
			Logger.error(`Error transferring NFT to ${recipient}: ${error.message}`);
			throw new ProcessClientError(this, this.transfer, { recipient, quantity, forwardedTags }, error);
		}
	}
	/* Core NFT Functions */
}
