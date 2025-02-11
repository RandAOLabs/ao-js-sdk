export class StakingClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'StakingClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class StakeError extends StakingClientError {
    constructor(quantity: string, originalError?: Error) {
        super(`Error staking ${quantity} tokens`, originalError);
        this.name = 'StakeError';
    }
}

export class GetStakeError extends StakingClientError {
    constructor(providerId: string, originalError?: Error) {
        super(`Error getting stake for provider ${providerId}`, originalError);
        this.name = 'GetStakeError';
    }
}

export class UnstakeError extends StakingClientError {
    constructor(providerId: string, originalError?: Error) {
        super(`Error unstaking for provider ${providerId}`, originalError);
        this.name = 'UnstakeError';
    }
}
