import { Tags } from "../../../../core/ao";
import { ITokenClient } from "../../token/abstract/ITokenClient";

export interface INftClient extends ITokenClient {
    /**
     * Transfer an NFT to a recipient. If no quantity is specified, defaults to 1.
     * @param recipient The recipient's address
     * @param quantity Optional quantity to transfer (defaults to 1)
     * @param forwardedTags Optional tags to forward with the transfer
     */
    transfer(recipient: string, quantity?: string, forwardedTags?: Tags): Promise<boolean>;
}
