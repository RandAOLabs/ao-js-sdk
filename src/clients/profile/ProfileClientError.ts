export class ProfileClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'ProfileClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class NoProfileFoundError extends ProfileClientError {
    constructor(address: string) {
        super(`No profile found for wallet address ${address}`);
        this.name = 'NoProfileFoundError';
    }
}

export class GetProfileError extends ProfileClientError {
    constructor(address: string, originalError?: Error) {
        super(`Error fetching profile for address ${address}`, originalError);
        this.name = 'GetProfileError';
    }
}

export class ProfileTransferError extends ProfileClientError {
    constructor(target: string, recipient: string, quantity: string, originalError?: Error) {
        super(`Error transferring ${quantity} from ${target} to ${recipient}`, originalError);
        this.name = 'TransferError';
    }
}
