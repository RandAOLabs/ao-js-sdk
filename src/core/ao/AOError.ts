import { AOJsError } from "../../common";
import { StringFormatting, Logger } from "../../utils";

export class AOError extends AOJsError {
	private static readonly AO_ERROR_MAX_LINE_LENGTH = 60;
	public constructor(
		public readonly explanation?: string,
		public readonly originalError?: Error,
	) {
		const message: string = `Error in interacting with AO\nThis error can be explained by: ${explanation ? explanation : "No known cause."}\n${originalError ? `Error was caused by: ${originalError.message}` : `Cause not specified`}`
		const formattedMessage = StringFormatting.wrapMessageInBox(message, AOError.AO_ERROR_MAX_LINE_LENGTH)
		super({ message: formattedMessage, originalError });
		if (originalError) {
			this.stack += '\nCaused by: ' + originalError.stack;
		}
		Logger.error(formattedMessage)
	}
}

export class AOMessageIdMissingError extends AOError {
	public constructor() {
		super("AO Did not return a message Id")
		this.name = "AOMessageIdMissingError"
	}
}
