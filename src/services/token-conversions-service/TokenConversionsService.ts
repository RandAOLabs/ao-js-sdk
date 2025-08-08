import { ITokenBalance } from '../../models/token-balance/abstract/ITokenBalance';
import { IAutoconfiguration, staticImplements } from '../../utils';
import { AmmFinderService, IAmmFinderService } from '../amm-finder-service';
import { IMessagesService, MessagesService } from '../messages';
import { ITokenConversionsService } from './abstract/ITokenConversionsService';

/**
 * Implementation of token conversion service that handles converting token balances.
 */
@staticImplements<IAutoconfiguration>()
export class TokenConversionsService implements ITokenConversionsService {
	constructor(
		private readonly ammFinderService: IAmmFinderService,
	) { }
	/**
	 * Creates a pre-configured instance of PortfolioService
	 * @returns A pre-configured PortfolioService instance
	 */
	public static autoConfiguration(): ITokenConversionsService {
		return new TokenConversionsService(
			AmmFinderService.autoConfiguration()
		);
	}
	async convert(tokenBalance: ITokenBalance, tokenProcessId: string): Promise<ITokenBalance> {
		const amm = await this.ammFinderService.findBestAmm(tokenBalance.getTokenConfig().tokenProcessId!, tokenProcessId)
		const quote = await amm.getQuote(tokenBalance)
		return quote
	}
}
