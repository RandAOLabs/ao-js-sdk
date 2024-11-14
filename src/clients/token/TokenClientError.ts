// TokenClientError.ts

export class TokenClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'TokenClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class BalanceError extends TokenClientError {
    constructor(identifier: string, originalError?: Error) {
        super(`Error fetching balance for identifier ${identifier}`, originalError);
        this.name = 'BalanceError';
    }
}

export class BalancesError extends TokenClientError {
    constructor(originalError?: Error) {
        super('Error fetching balances', originalError);
        this.name = 'BalancesError';
    }
}

export class TransferError extends TokenClientError {
    constructor(recipient: string, quantity: string, originalError?: Error) {
        super(`Error transferring ${quantity} to recipient ${recipient}`, originalError);
        this.name = 'TransferError';
    }
}

export class GetInfoError extends TokenClientError {
    constructor(token: string, originalError?: Error) {
        super(`Error fetching info for token ${token}`, originalError);
        this.name = 'GetInfoError';
    }
}

export class MintError extends TokenClientError {
    constructor(quantity: string, originalError?: Error) {
        super(`Error minting quantity ${quantity}`, originalError);
        this.name = 'MintError';
    }
}
