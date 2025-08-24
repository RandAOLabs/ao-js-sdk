import { ClientError } from "../../../common/error/client-error";
import { IArweaveGraphQLNodeClient } from "./abstract";

export class ArweaveNodeClientError<T extends IArweaveGraphQLNodeClient, P = any> extends ClientError<T, P> {
	constructor(
		public readonly client: T,
		public readonly func: Function,
		public readonly clientFunctionParams: P,
		public readonly originalError?: Error,
	) {
		const additionalInfo = `NodeType: ${client.getNodeType()}`;
		super(client, func, clientFunctionParams, originalError, additionalInfo);
		this.client = client
		this.name = `${client.constructor.name} Error`;
	}
}


export class MalformedArweaveNodeResponseError<T extends IArweaveGraphQLNodeClient, P = any> extends ClientError<T, P> {
	constructor(
		public readonly client: T,
		public readonly func: Function,
		public readonly clientFunctionParams: P,
		public readonly response?: any,
	) {
		const additionalInfo = `NodeType: ${client.getNodeType()}\nUnexpected response: ${JSON.stringify(response, null, 2)}`;
		super(client, func, clientFunctionParams, undefined, additionalInfo);
		this.client = client
		this.name = `${client.constructor.name} Error`;
	}
}
