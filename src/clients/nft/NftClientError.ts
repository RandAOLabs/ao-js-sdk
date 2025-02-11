import { TokenClientError } from "src/clients/token";

export class NftClientError extends TokenClientError {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'NftClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class NftTransferError extends NftClientError {
    constructor(recipient: string, originalError?: Error) {
        super(`Error transferring NFT to recipient ${recipient}`, originalError);
        this.name = 'NftTransferError';
    }
}
