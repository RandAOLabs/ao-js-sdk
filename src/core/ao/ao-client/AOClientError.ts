import { IAOClient } from "./abstract";
import { Logger, StringFormatting } from "../../../utils";


export class AOClientError<T extends IAOClient, P = any> extends Error {
    private static readonly MAX_LINE_LENGTH = 80;
    public constructor(
        public readonly client: T,
        public readonly func: Function,
        public readonly params: P,
        public readonly walletAddress?: string,
        public readonly originalError?: Error,
        public readonly explanation?: string,
        public readonly _name?: string
    ) {
        const functionName = func.name;
        const paramsString = JSON.stringify(params, null, 2);

        const message: string = `Error in ${client.constructor.name}\nThis error can be explained by: ${explanation ? explanation : "No known cause."}\nOccured During ${functionName}\nWith parameters: ${paramsString}\nWallet Address: ${walletAddress ? walletAddress : "No wallet associated with this client"}\nActive AO Configuration:${JSON.stringify(client.getActiveConfig())}\n${originalError ? `Error was caused by: ${originalError.message}` : `Cause not specified`}`
        const formattedMessage = StringFormatting.wrapMessageInBox(message, AOClientError.MAX_LINE_LENGTH)
        super(formattedMessage);
        this.client = client
        this.name = _name ? _name : `${client.constructor.name} Error`;
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
        Logger.error(formattedMessage)
    }
}

export class AORateLimitingError<T extends IAOClient, P = any> extends AOClientError<T, P> {
    public constructor(
        client: T,
        func: Function,
        params: P,
        walletAddress?: string,
        originalError?: Error
    ) {
        const explanation = `You are being ratelimitted by your AO Node.`
        super(client, func, params, walletAddress, originalError, explanation, "AORateLimitingError")
    }
}

/**
 * Error thrown when attempting write operations on a read-only AO client.
 */
export class AOReadOnlyClientError<T extends IAOClient, P = any> extends AOClientError<T, P> {
    public constructor(
        client: T,
        func: Function,
        params: P,
        walletAddress?: string,
        originalError?: Error
    ) {
        const explanation = `This client only supports reading operations. Please instantiate with a signer/wallet to support writing operations(messages).`
        super(client, func, params, walletAddress, originalError, explanation, "AOReadOnlyClientError")
    }
}


export class AOAllConfigsFailedError<T extends IAOClient, P = any> extends AOClientError<T, P> {
    public constructor(
        client: T,
        func: Function,
        params: P,
        errors: Error[],
        walletAddress?: string,
    ) {
        const explanation = `All available compute units failed to resolve the request.\nParameters: ${JSON.stringify(params, null, 2)}\nErrors encountered:\n${errors.map((e, i) => `[CU ${i + 1}] ${e.message}`).join('\n')}`
        super(client, func, params, walletAddress, undefined, explanation, "AOAllConfigsFailedError")
    }
}