export class ProfileRegistryClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'RegistryClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class GetProfilesError extends ProfileRegistryClientError {
    constructor(walletAddress: string, originalError?: Error) {
        super(`Error fetching profiles for wallet address ${walletAddress}`, originalError);
        this.name = 'GetProfilesError';
    }
}
