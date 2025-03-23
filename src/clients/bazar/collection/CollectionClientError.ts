export class CollectionClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'CollectionClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}





export class AuthorizationError extends CollectionClientError {
    constructor(message: string) {
        super(`Authorization error: ${message}`);
        this.name = 'AuthorizationError';
    }
}

export class InputValidationError extends CollectionClientError {
    constructor(message: string) {
        super(`Input validation error: ${message}`);
        this.name = 'InputValidationError';
    }
}

export class TransferAllAssetsError extends CollectionClientError {
    constructor(failedTransfers: { processId: string, error: Error }[]) {
        const failedIds = failedTransfers.map(f => f.processId).join(', ');
        super(`Failed to transfer some NFTs: ${failedIds}`);
        this.name = 'TransferAllAssetsError';
    }
}
