import { ClientError } from "../../common/error/client-error";
import { IProcessClient } from "../../core/ao/abstract";

export class ProcessClientError<T extends IProcessClient, P = any> extends ClientError<T, P> {
	constructor(
		public readonly client: T,
		public readonly func: Function,
		public readonly clientFunctionParams: P,
		public readonly originalError?: Error,
	) {
		const aoClient = client.getAOClient();
		const aoConfig = aoClient.getActiveConfig();
		let additionalInfo = `Process Id: ${client.getProcessId()}\nReadOnly: ${client.isReadOnly()}\nAO Config: ${JSON.stringify(aoConfig, null, 2)}`;

		if (!client.isReadOnly()) {
			const wallet = client.getWalletAddressSync();
			additionalInfo += `\nWallet: ${wallet}`;
		}

		super(client, func, clientFunctionParams, originalError, additionalInfo);
		this.name = `${client.constructor.name} Error`;
	}
}
