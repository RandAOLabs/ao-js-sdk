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

export class UnstakeError extends StakingClientError {
    constructor(originalError?: Error) {
        super(`Error unstaking`, originalError);
        this.name = 'UnstakeError';
    }
}
