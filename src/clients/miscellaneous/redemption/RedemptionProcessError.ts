import { DryRunResult, MessageResult } from "../../../core/ao/abstract";


export class RedemptionProcessError extends Error {
	constructor(message: string, result?: MessageResult | DryRunResult) {
		super(message);
		this.name = 'RedemptionProcessError';
		if (result) {
			this.stack += '\nResult: ' + JSON.stringify(result);
		}
	}
}
