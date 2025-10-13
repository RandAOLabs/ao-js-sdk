import { ClientError } from '../../../../common/error/client-error';
import { HyperbeamClient } from './HyperbeamClient';

/**
 * Error class for HyperBEAM client operations
 */
export class HyperbeamClientError<P = any> extends ClientError<HyperbeamClient, P> {
	constructor(
		client: HyperbeamClient,
		func: Function,
		clientFunctionParams: P,
		originalError?: Error,
		additionalInfo?: string,
	) {
		super(client, func, clientFunctionParams, originalError, additionalInfo);
	}
}
