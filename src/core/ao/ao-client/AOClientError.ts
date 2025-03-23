import { IAOClient } from "src/core/ao/ao-client/abstract";
import { Logger } from "src/utils";

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


export class AOSuspectedRateLimitingError extends Error {
    constructor(originalError: Error, details?: any) {
        super(`It appears you are being ratelimited...possibly. Try waiting or using another entry point to ao? The original Error was: ${originalError.name}, ${originalError.message} | Dryrun details: ${JSON.stringify(details)}`);
        this.name = 'AOSuspectedRateLimitingError';
    }
}



export class AOClientError<T extends IAOClient, P = any> extends Error {
    private constructor(
        public readonly client: T,
        public readonly func: Function,
        public readonly params: P,
        public readonly walletAddress?: string,
        public readonly originalError?: Error
    ) {
        const functionName = func.name;
        const paramsString = JSON.stringify(params, null, 2);

        const fullMessage: string = `
            | Error in ${client.constructor.name} |
            | Occured During ${functionName} |
            | With parameters: ${paramsString} |
            | Wallet Address: ${walletAddress ? walletAddress : "No wallet associated with this client"} |
            | ${originalError ? `Error was caused by: ${originalError.message}` : `Cause not specified`} |
        `
        super(fullMessage);
        this.client = client
        this.name = `${client.constructor.name} Error`;
        Logger.error(fullMessage)

        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }

    public static async create<T extends IAOClient, P = any>(
        client: T,
        func: Function,
        params: P,
        originalError?: Error
    ) {
        const walletAddress = await client.getCallingWalletAddress()
        return new AOClientError(client, func, params, walletAddress, originalError)
    }
}
