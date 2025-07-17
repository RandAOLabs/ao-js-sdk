
import { Logger, StringFormatting } from "../../../utils";
import { DryRunResult, MessageResult } from "../../ao/abstract";

export class ProcessError extends Error {
	constructor(
		public readonly result: MessageResult | DryRunResult
	) {
		const errorDetails = result.Error || 'Unknown error';
		const baseMessage = `Error Originating in Process\n${errorDetails}`
		const message = StringFormatting.wrapMessageInBox(errorDetails, 80);
		Logger.error(`\n${message}\n`);
		super(message);
	}
}
