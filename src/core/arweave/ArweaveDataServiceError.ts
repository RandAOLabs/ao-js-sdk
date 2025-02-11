export class ArweaveBaseClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'ArweaveBaseClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class ArweaveGraphQLError extends ArweaveBaseClientError {
    constructor(query: string, originalError?: Error) {
        super(`Error executing GraphQL query: ${query}`, originalError);
        this.name = 'ArweaveGraphQLError';
    }
}

export class ArweaveInitializationError extends ArweaveBaseClientError {
    constructor(originalError?: Error) {
        super('Error initializing Arweave instance', originalError);
        this.name = 'ArweaveInitializationError';
    }
}
