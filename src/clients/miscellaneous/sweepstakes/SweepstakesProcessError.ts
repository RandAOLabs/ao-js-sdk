import { DryRunResult, MessageResult } from "../../../core/ao/abstract";


export class SweepstakesProcessError extends Error {
	constructor(message: string, result?: MessageResult | DryRunResult) {
		super(message);
		this.name = 'SweepstakesProcessError';
		if (result) {
			this.stack += '\nResult: ' + JSON.stringify(result);
		}
	}
}
