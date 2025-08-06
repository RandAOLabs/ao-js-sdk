import { ITokenBalance } from '../../models/token-balance/abstract/ITokenBalance';
import { IAutoconfiguration, staticImplements } from '../../utils';
import { IMessagesService, MessagesService } from '../messages';
import { ITokenConversionsService } from './abstract/ITokenConversionsService';

/**
 * Implementation of token conversion service that handles converting token balances.
 */
@staticImplements<IAutoconfiguration>()
export class TokenConversionsService implements ITokenConversionsService {
	constructor(
		private readonly messageService: IMessagesService,
	) { }
	/**
	 * Creates a pre-configured instance of PortfolioService
	 * @returns A pre-configured PortfolioService instance
	 */
	public static autoConfiguration(): ITokenConversionsService {
		return new TokenConversionsService(
			MessagesService.autoConfiguration()
		);
	}
	async convert(tokenBalance: ITokenBalance, tokenProcessId: string): Promise<ITokenBalance> {
		// TODO: Implement token conversion logic
		throw new Error('Method not implemented.');
	}
}
