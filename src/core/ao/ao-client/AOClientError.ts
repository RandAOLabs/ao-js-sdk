import { ClientError } from "../../../common/error/client-error";
import { IReadOnlyAOClient } from "./interfaces/IReadOnlyAOClient";


export class AOClientError<T extends IReadOnlyAOClient, P = any> extends ClientError<T, P> {
	public constructor(
		public readonly client: T,
		public readonly func: Function,
		public readonly clientFunctionParams: P,
		public readonly walletAddress?: string,
		public readonly originalError?: Error,
		public readonly explanation?: string,
		public readonly _name?: string
	) {
		const additionalInfo: string = `This error can be explained by: ${explanation ? explanation : "No known cause."}\nWallet Address: ${walletAddress ? walletAddress : "No wallet associated with this client"}\nActive AO Configuration:${JSON.stringify(client.getActiveConfig())}`
		super(client, func, clientFunctionParams, originalError, additionalInfo)
		//super(formattedMessage);
		this.name = _name ? _name : `${client.constructor.name} Error`;
	}
}

export class AORateLimitingError<T extends IReadOnlyAOClient, P = any> extends AOClientError<T, P> {
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
export class AOReadOnlyClientError<T extends IReadOnlyAOClient, P = any> extends AOClientError<T, P> {
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


export class AOAllConfigsFailedError<T extends IReadOnlyAOClient, P = any> extends AOClientError<T, P> {
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
