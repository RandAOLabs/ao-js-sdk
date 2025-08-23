import { IProcessClient } from "../../../core/ao/abstract";
import { ProcessClientError } from "../../common/ProcessClientError";

/**
 * Error class for PI Token Client errors.
 */
export class PITokenClientError<T extends IProcessClient = IProcessClient, P = any> extends ProcessClientError<T, P> {
	name: string = 'PITokenClientError';

	constructor(client: T, method: any, params: P, error: any) {
		super(client, method, params, error);
	}
}
