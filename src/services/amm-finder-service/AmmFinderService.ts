import { IAmm } from '../../adaptors/amm/abstract/IAmm';
import { IAutoconfiguration, staticImplements, ServiceErrorHandler } from '../../utils';
import { IAmmFinderService } from './abstract/IAmmFinderService';
import { BotegaAmmFinderService } from '../autonomous-finance/botega-amm-finder-service/BotegaAmmFinderService';
import { Service } from '../common';

/**
 * Implementation of AMM finder service that locates AMM pools for token pairs.
 */
@staticImplements<IAutoconfiguration>()
export class AmmFinderService implements IAmmFinderService {
	constructor(
		private readonly botegaAmmFinderService: IAmmFinderService,
	) { }

	getServiceName(): string {
		return this.constructor.name
	}


	/**
	 * Creates a pre-configured instance of AmmFinderService
	 * @returns A pre-configured AmmFinderService instance
	 */
	public static autoConfiguration(): IAmmFinderService {
		return new AmmFinderService(
			BotegaAmmFinderService.autoConfiguration()
		);
	}

	@ServiceErrorHandler
	public async findAmms(tokenProcessIdA: string, tokenProcessIdB: string): Promise<IAmm[]> {
		return this.botegaAmmFinderService.findAmms(tokenProcessIdA, tokenProcessIdB);
	}
}
