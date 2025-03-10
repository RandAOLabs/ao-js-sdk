/**
 * Error thrown when attempting write operations on a read-only AO client.
 */
export class AOReadOnlyClientError extends Error {
    constructor() {
        super('This client only supports reading operations. Please instantiate with a signer/wallet to support writing operations(messages).');
        this.name = 'AOReadOnlyClientError';
    }
}
