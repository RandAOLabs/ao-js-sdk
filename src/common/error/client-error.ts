import { AOJsError } from "../../common/error";
import { StringFormatting } from "../../utils";

export class ClientError<T extends Object, P = any> extends AOJsError {
	protected static readonly CLIENT_ERROR_MAX_LINE_LENGTH = 100;

	constructor(
		public readonly client: T,
		public readonly func: Function,
		public readonly clientFunctionParams: P,
		public readonly originalError?: Error,
		public readonly additionalInfo?: string,
	) {
		const clientErrorString = `Client Error in ${client.constructor.name}`
		const functionOccurrenceString = `Occurred while executing function: ${func.name}`;
		const paramsString = `With parameters: ${JSON.stringify(clientFunctionParams, null, 2)}`
		const additionalInfoString = `${additionalInfo ? `\nAdditional Info:\n${additionalInfo}` : '\nNo Additional Info Provided.'}`

		const errorMessage = `${clientErrorString}\n${functionOccurrenceString}\n${paramsString}\n${additionalInfoString}`;

		const fullMessage = StringFormatting.wrapMessageInBox(errorMessage, ClientError.CLIENT_ERROR_MAX_LINE_LENGTH);

		super({ message: fullMessage, originalError: originalError });
		this.client = client
		this.name = `${client.constructor.name} Error`;
	}
}
