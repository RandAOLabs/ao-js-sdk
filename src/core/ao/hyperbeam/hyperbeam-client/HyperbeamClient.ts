/**
 * @categoryDescription Core
 * Core Functionality for interacting with Arweave/AO
 * @showCategories
 * @module
 */

import { IHttpClient } from '../../../../utils/http/abstract/IHttpClient';
import { AxiosHttpClient } from '../../../../utils/http/implementations/AxiosHttpClient';
import { staticImplements } from '../../../../utils/decorators/staticImplements';
import { ClientErrorHandler } from '../../../../utils/decorators/clientErrorHandler';
import { IAutoconfiguration } from '../../../../utils/class-interfaces/IAutoconfiguration';
import { IHyperbeamClient } from './abstract/IHyperbeamClient';
import { HyperbeamClientConfig } from './abstract/HyperbeamClientConfig';
import { ProcessEndpoint } from './abstract/types';
import { AOCorePathBuilder } from './constants';
import { HyperBeamNodes } from './HyperBeamNodes';

/**
 * HyperBEAM client implementation for accessing AO-Core process state
 */
@staticImplements<IAutoconfiguration>()
export class HyperbeamClient implements IHyperbeamClient {
	private readonly httpClient: IHttpClient;
	private readonly nodeUrl: string;

	public constructor(config: HyperbeamClientConfig) {
		this.nodeUrl = config.nodeUrl.endsWith('/')
			? config.nodeUrl.slice(0, -1)
			: config.nodeUrl;

		this.httpClient = config.httpClient || new AxiosHttpClient({
			baseURL: this.nodeUrl,
			timeout: 30000,
			headers: {
				Accept: '*/*' // avoid strict JSON negotiation
			}
		});
	}

	public static autoConfiguration(): HyperbeamClient {
		return new HyperbeamClient({
			nodeUrl: HyperBeamNodes.FORWARD_RESEARCH
		});
	}

	@ClientErrorHandler
	public async getProcessState(
		processId: string,
		endpoint: ProcessEndpoint,
		additionalPath?: string
	): Promise<any> {
		const path = AOCorePathBuilder.buildProcessStatePath(processId, endpoint, additionalPath);
		const response = await this.httpClient.get(path);
		return response;
	}

	@ClientErrorHandler
	public async compute(processId: string, additionalPath?: string): Promise<any> {
		return this.getProcessState(processId, ProcessEndpoint.COMPUTE, additionalPath);
	}
}
