import { DryRunResult, MessageResult } from "../../../core/ao/abstract";


export class FaucetProcessError extends Error {
	constructor(message: string, result?: MessageResult | DryRunResult) {
		super(message);
		this.name = 'FaucetProcessError';
		if (result) {
			this.stack += '\nResult: ' + JSON.stringify(result);
		}
	}
}
