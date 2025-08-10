import { IAmm } from '../../adaptors';
import { ITokenBalance } from '../../models/token-balance/abstract/ITokenBalance';
import { IAutoconfiguration, ServiceErrorHandler, staticImplements } from '../../utils';
import { AmmFinderService, IAmmFinderService } from '../amm-finder-service';
import { Service } from '../common';
import { IMessagesService, MessagesService } from '../messages';
import { ITokenConversionsService } from './abstract/ITokenConversionsService';

/**
 * Implementation of token conversion service that handles converting token balances.
 */
@staticImplements<IAutoconfiguration>()
export class TokenConversionsService extends Service implements ITokenConversionsService {
	constructor(
		private readonly ammFinderService: IAmmFinderService,
	) {
		super()
	}
	/**
	 * Creates a pre-configured instance of PortfolioService
	 * @returns A pre-configured PortfolioService instance
	 */
	public static autoConfiguration(): ITokenConversionsService {
		return new TokenConversionsService(
			AmmFinderService.autoConfiguration()
		);
	}

	@ServiceErrorHandler
	async convert(tokenBalance: ITokenBalance, tokenProcessId: string): Promise<ITokenBalance> {
		const quote = await this.getbestPrice(tokenBalance, tokenProcessId)
		return quote
	}

	private async getbestPrice(tokenBalance: ITokenBalance, tokenProcessId: string): Promise<ITokenBalance> {
		const amms = await this.ammFinderService.findAmms(tokenBalance.getTokenConfig().tokenProcessId!, tokenProcessId)

		const timeout = (ms: number) => new Promise((_, reject) =>
			setTimeout(() => reject(new Error('Timeout')), ms)
		);

		const getQuote = async (amm: IAmm) => {
			try {
				return await Promise.race([amm.getQuote(tokenBalance), timeout(60000)]);
			} catch {
				return null;
			}
		};

		const quotes = (await Promise.all(amms.map(getQuote)))
			.filter((quote): quote is ITokenBalance => quote !== null);

		if (quotes.length === 0) {
			throw new Error('No valid quotes received from any AMM');
		}

		return quotes.reduce((best, current) =>
			current.getCurrencyAmount().greaterThan(best.getCurrencyAmount()) ? current : best
		);
	}
}
