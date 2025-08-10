import { AOJsError } from "../../common/error";
import { IProcessClient } from "../../core/ao/abstract";
import { StringFormatting } from "../../utils";

export class ClientError<T extends IProcessClient, P = any> extends AOJsError {
	protected static readonly CLIENT_ERROR_MAX_LINE_LENGTH = 100;

	constructor(
		public readonly client: T,
		public readonly func: Function,
		public readonly clinetFunctionParams: P,
		public readonly originalError?: Error,
	) {
		const functionName = func.name;
		const paramsString = JSON.stringify(clinetFunctionParams, null, 2);

		const errorMessage = `Client Error in ${client.constructor.name}\nOccurred while executing function: ${functionName}\nWith parameters: ${paramsString}\nProcess Id: ${client.getProcessId()}\nReadOnly: ${client.isReadOnly()}`;

		const fullMessage = StringFormatting.wrapMessageInBox(errorMessage, ClientError.CLIENT_ERROR_MAX_LINE_LENGTH);

		super({ message: fullMessage, originalError: originalError });
		this.client = client
		this.name = `${client.constructor.name} Error`;
	}
}
