import { IAmm } from '../../adaptors/amm/abstract/IAmm';
import { IAutoconfiguration, staticImplements } from '../../utils';
import { IAmmFinderService } from './abstract/IAmmFinderService';
import { BotegaAmmFinderService } from '../autonomous-finance/botega-amm-finder-service/BotegaAmmFinderService';

/**
 * Implementation of AMM finder service that locates AMM pools for token pairs.
 */
@staticImplements<IAutoconfiguration>()
export class AmmFinderService implements IAmmFinderService {
	constructor(
		private readonly botegaAmmFinderService: IAmmFinderService,
	) { }


	/**
	 * Creates a pre-configured instance of AmmFinderService
	 * @returns A pre-configured AmmFinderService instance
	 */
	public static autoConfiguration(): IAmmFinderService {
		return new AmmFinderService(
			BotegaAmmFinderService.autoConfiguration()
		);
	}

	async findAmms(tokenProcessIdA: string, tokenProcessIdB: string): Promise<IAmm[]> {
		return this.botegaAmmFinderService.findAmms(tokenProcessIdA, tokenProcessIdB);
	}

	findBestAmm(tokenProcessIdA: string, tokenProcessIdB: string): Promise<IAmm> {
		return this.botegaAmmFinderService.findBestAmm(tokenProcessIdA, tokenProcessIdB);
	}
}
