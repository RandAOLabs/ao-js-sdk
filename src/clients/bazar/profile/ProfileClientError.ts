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