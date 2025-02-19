import { ProviderDetails } from "src/clients/randao/provider-profile";

export class ProviderStakingError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'ProviderStakingError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}


export class StakeWithDetailsError extends ProviderStakingError {
    constructor(originalError: Error, providerDetails?: ProviderDetails) {
        super(`Error Staking With Provider Details ${JSON.stringify(providerDetails)}`);
        this.name = 'NoProfileFoundError';
    }
}

export class GetStakeError extends ProviderStakingError {
    constructor(providerId: string, originalError?: Error) {
        super(`Error getting stake for provider ${providerId}`, originalError);
        this.name = 'GetStakeError';
    }
}

export class ProviderUnstakeError extends ProviderStakingError {
    constructor(originalError: Error, providerId?: String) {
        super(`Error Staking With Provider Id ${providerId}`, originalError);
        this.name = 'NoProfileFoundError';
    }
}