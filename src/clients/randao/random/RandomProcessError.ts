import { DryRunResult, MessageResult } from "../../../core/ao/abstract";


// RandomClientError.ts
export class RandomProcessError extends Error {
	constructor(message: string, result?: MessageResult | DryRunResult) {
		super(message);
		this.name = 'RandomProcessError';
		if (result) {
			this.stack += '\nResult: ' + JSON.stringify(result);
		}
	}
}
