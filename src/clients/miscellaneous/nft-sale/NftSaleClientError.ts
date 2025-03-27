
/**
 * @deprecated
 */
export class NftSaleClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'BaseClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class PaymentError extends NftSaleClientError {
    constructor(amount: string, cause?: Error) {
        super(`Failed to process payment of ${amount} tokens`, cause);
    }
}

export class PurchaseNftError extends NftSaleClientError {
    constructor(amount: string, cause?: Error) {
        super(`Failed to purchase NFT for ${amount} tokens`, cause);
    }
}

export class QueryNFTCountError extends NftSaleClientError {
    constructor(cause?: Error) {
        super("Failed to query NFT count", cause);
    }
}

export class AddNftError extends NftSaleClientError {
    constructor(nftProcessId: string, cause?: Error) {
        super(`Failed to add NFT from process ${nftProcessId}`, cause);
    }
}

export class ReturnNFTsError extends NftSaleClientError {
    constructor(recipient: string, cause?: Error) {
        super(`Failed to return NFTs to recipient ${recipient}`, cause);
    }
}

export class LuckyDrawError extends NftSaleClientError {
    constructor(amount: string, cause?: Error) {
        super(`Failed to participate in lucky draw for ${amount} tokens`, cause);
    }
}

export class NftSaleInfoError extends NftSaleClientError {
    constructor(cause?: Error) {
        super("Failed to get NFT sale information", cause);
    }
}
