
import { Logger, StringFormatting } from "../../../utils";
import { MessageResult, DryRunResult } from "../../ao/abstract";

export class ResultReadingError extends Error {
	private static readonly MAX_LINE_LENGTH = 80;

	constructor(result: MessageResult | DryRunResult, detailMessage?: string, originalError?: Error) {
		const errorMessage = `Error Reading ${typeof result}: ${JSON.stringify(result)}\n${detailMessage ? detailMessage : "Unknown Error"}\nCaused by: ${originalError ? JSON.stringify(originalError) : "No upstream error"}`;
		const message = StringFormatting.wrapMessageInBox(errorMessage, ResultReadingError.MAX_LINE_LENGTH);
		super(message);
		this.name = 'ResultReadingError';
		if (originalError) {
			this.stack += '\nCaused by: ' + originalError.stack;
		}
		Logger.error(message)
	}
}

export class JsonParsingError extends ResultReadingError {
	constructor(result: MessageResult | DryRunResult, index: number, originalError?: Error) {
		super(result, `Error parsing JSON data at index ${index}: ${result.Messages[index]?.Data}`, originalError);
		this.name = 'JsonParsingError';
	}
}

export class MessageOutOfBoundsError extends ResultReadingError {
	constructor(result: MessageResult | DryRunResult, index: number) {
		super(result, `Index out of bounds: ${index}. Total messages available: ${result.Messages.length}`);
		this.name = 'MessageOutOfBoundsError';
	}
}

export class MessagesMissingError extends ResultReadingError {
	constructor(result: MessageResult | DryRunResult) {
		super(result, "Result contains no messages, however messages were expected.");
		this.name = 'MessagesMissingError';
	}
}
