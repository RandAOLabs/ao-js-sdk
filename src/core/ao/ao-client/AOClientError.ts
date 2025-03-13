/**
 * Error thrown when attempting write operations on a read-only AO client.
 */
export class AOReadOnlyClientError extends Error {
    constructor() {
        super('This client only supports reading operations. Please instantiate with a signer/wallet to support writing operations(messages).');
        this.name = 'AOReadOnlyClientError';
    }
}


export class AOAllConfigsFailedError extends Error {
    constructor(params: any, errors: Error[]) {
        const message = `All available compute units failed to resolve the request.\nParameters: ${JSON.stringify(params, null, 2)}\nErrors encountered:\n${errors.map((e, i) => `[CU ${i + 1}] ${e.message}`).join('\n')}`;
        super(message);
        this.name = 'AOAllConfigsFailedError';
        Object.setPrototypeOf(this, AOAllConfigsFailedError.prototype);
    }
}
