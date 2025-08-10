import { Logger, StringFormatting } from "../../utils";
import { AoJsErrorParams } from "./params";

export class AOJsError extends Error {
	protected static readonly MAX_LINE_LENGTH = 110;

	constructor(
		public readonly params: AoJsErrorParams
	) {
		const errorMessage = `AO.js Detected an Error\n${params.message}\n${params.originalError ? `Error was caused by: ${params.originalError.name}: ${params.originalError.message}` : `Cause not specified`}`

		const fullMessage = StringFormatting.wrapMessageInBox(errorMessage, AOJsError.MAX_LINE_LENGTH);
		super(fullMessage);
		this.name = `AOJsError Error`;

		Logger.error(`\n${fullMessage}`)
		if (params.originalError) {
			this.stack += '\nCaused by original error: ' + params.originalError.stack;
		}
	}

}
