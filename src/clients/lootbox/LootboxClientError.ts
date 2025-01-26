export class LootboxClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'LootboxClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class OpenLootboxError extends LootboxClientError {
    constructor(originalError?: Error) {
        super('Error opening lootbox. Make sure you have enough tokens and the process is available.', originalError);
        this.name = 'OpenLootboxError';
    }
}

export class ListPrizesError extends LootboxClientError {
    constructor(originalError?: Error) {
        super('Error listing lootbox prizes. The process might be unavailable.', originalError);
        this.name = 'ListPrizesError';
    }
}

export class InsufficientTokensError extends LootboxClientError {
    constructor(balance: string, required: string, originalError?: Error) {
        super(`Insufficient tokens to open lootbox. Balance: ${balance}, Required: ${required}`, originalError);
        this.name = 'InsufficientTokensError';
    }
}
