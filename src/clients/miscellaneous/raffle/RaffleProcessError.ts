import { DryRunResult, MessageResult } from "../../../core/ao/abstract";


export class RaffleProcessError extends Error {
	constructor(message: string, result?: MessageResult | DryRunResult) {
		super(message);
		this.name = 'RaffleProcessError';
		if (result) {
			this.stack += '\nResult: ' + JSON.stringify(result);
		}
	}
}
