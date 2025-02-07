import { BaseClientError } from "../../core";

export class PurchaseNftError extends BaseClientError {
    constructor(amount: string, cause?: Error) {
        super(`Failed to purchase NFT for ${amount} tokens`, cause);
    }
}

export class QueryNFTCountError extends BaseClientError {
    constructor(cause?: Error) {
        super("Failed to query NFT count", cause);
    }
}

export class AddNftError extends BaseClientError {
    constructor(nftProcessId: string, cause?: Error) {
        super(`Failed to add NFT from process ${nftProcessId}`, cause);
    }
}

export class ReturnNFTsError extends BaseClientError {
    constructor(recipient: string, cause?: Error) {
        super(`Failed to return NFTs to recipient ${recipient}`, cause);
    }
}
