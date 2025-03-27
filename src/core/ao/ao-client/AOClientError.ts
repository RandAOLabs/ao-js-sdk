import { IAOClient } from "src/core/ao/ao-client/abstract";
import { Logger, StringFormatting } from "src/utils";

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






export class AOClientError<T extends IAOClient, P = any> extends Error {
    private static readonly MAX_LINE_LENGTH = 80;
    public constructor(
        public readonly client: T,
        public readonly func: Function,
        public readonly params: P,
        public readonly walletAddress?: string,
        public readonly originalError?: Error,
        public readonly explanation?: string
    ) {
        const functionName = func.name;
        const paramsString = JSON.stringify(params, null, 2);

        const message: string = `Error in ${client.constructor.name}\nThis error can be explained by: ${explanation ? explanation : "No known cause."}\nOccured During ${functionName}\nWith parameters: ${paramsString}\nWallet Address: ${walletAddress ? walletAddress : "No wallet associated with this client"}\nActive AO Configuration:${JSON.stringify(client.getActiveConfig())}\n${originalError ? `Error was caused by: ${originalError.message}` : `Cause not specified`}`
        const formattedMessage = StringFormatting.wrapMessageInBox(message, AOClientError.MAX_LINE_LENGTH)
        super(formattedMessage);
        this.client = client
        this.name = `${client.constructor.name} Error`;
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
        Logger.error(message)
    }

    public static async create<T extends IAOClient, P = any>(
        client: T,
        func: Function,
        params: P,
        originalError?: Error,
        explanation?: string
    ) {
        const walletAddress = await client.getCallingWalletAddress()
        return new AOClientError(client, func, params, walletAddress, originalError, explanation)
    }
}

export class AORateLimitingError<T extends IAOClient, P = any> extends AOClientError<T, P> {
    public static async create<T extends IAOClient, P = any>(
        client: T,
        func: Function,
        params: P,
        originalError?: Error

    ): Promise<AORateLimitingError<T, P>> {
        const walletAddress = await client.getCallingWalletAddress()
        const explanation = `You are being ratelimitted by your AO Node.`
        return new AORateLimitingError(client, func, params, walletAddress, originalError, explanation)
    }
}