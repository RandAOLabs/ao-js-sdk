import { IProcessClient } from "../../../core/ao/abstract";
import { ProcessClientError } from "../../common/ProcessClientError";

/**
 * Error class for PI Oracle Client errors.
 */
export class PIOracleClientError<T extends IProcessClient = IProcessClient, P = any> extends ProcessClientError<T, P> {
	name: string = 'PIOracleClientError';

	constructor(client: T, method: any, params: P, error: any) {
		super(client, method, params, error);
	}
}
