import { IProcessClient } from "../../../core/ao/abstract";
import { ProcessClientError } from "../../common/ProcessClientError";

/**
 * Error class for Delegation Historian Client errors.
 */
export class DelegationHistorianClientError<T extends IProcessClient = IProcessClient, P = any> extends ProcessClientError<T, P> {
	name: string = 'DelegationHistorianClientError';

	constructor(client: T, method: any, params: P, error: any) {
		super(client, method, params, error);
	}
}
