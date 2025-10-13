import { IHttpClient } from '../../../../../utils/http/abstract/IHttpClient';

/**
 * Configuration for the HyperBEAM client
 */
export interface HyperbeamClientConfig {
	/**
	 * The HyperBEAM node URL (e.g., 'https://state-2.forward.computer')
	 */
	nodeUrl: string;

	/**
	 * Optional custom HTTP client (defaults to AxiosHttpClient)
	 */
	httpClient?: IHttpClient;
}
