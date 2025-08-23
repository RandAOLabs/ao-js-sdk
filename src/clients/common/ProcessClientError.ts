import { ClientError } from "../../common/error/client-error";
import { IProcessClient } from "../../core/ao/abstract";

export class ProcessClientError<T extends IProcessClient, P = any> extends ClientError<T, P> {
	constructor(
		public readonly client: T,
		public readonly func: Function,
		public readonly clientFunctionParams: P,
		public readonly originalError?: Error,
	) {
		const additionalInfo = `Process Id: ${client.getProcessId()}\nReadOnly: ${client.isReadOnly()}`;


		super(client, func, clientFunctionParams, originalError, additionalInfo);
		this.client = client
		this.name = `${client.constructor.name} Error`;
	}
}
