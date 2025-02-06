export class NftSaleClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'NftSaleClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class PurchaseNftError extends NftSaleClientError {
    constructor(amount: string, originalError?: Error) {
        super(`Error purchasing NFT for ${amount} tokens`, originalError);
        this.name = 'PurchaseNftError';
    }
}

export class QueryNFTCountError extends NftSaleClientError {
    constructor(originalError?: Error) {
        super('Error querying NFT count', originalError);
        this.name = 'QueryNFTCountError';
    }
}

export class AddNftError extends NftSaleClientError {
    constructor(nftProcessId: string, originalError?: Error) {
        super(`Error adding NFT from process ${nftProcessId}`, originalError);
        this.name = 'AddNftError';
    }
}
