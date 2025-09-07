import { Observable, from, mergeMap, map, distinct, switchMap, toArray, of, merge, scan, forkJoin } from 'rxjs';
import { IPortfolioService } from './abstract/IPortfolioService';
import { Logger } from '../../utils/logger/logger';
import { ReactiveCreditNoticeService, CreditNotice } from '../credit-notices';
import { TokenClient, TokenInfo } from '../../clients/ao';
import { ClientBuilder } from '../../clients/common';
import { IReactiveCreditNoticeService } from '../credit-notices/reactive-credit-notice-service/abstract';
import { TokenBalance } from '../../models/financial/token-balance';
import { IAutoconfiguration, staticImplements } from '../../utils';
import { ICurrencyAmount, CurrencyAmount } from '../../models/financial/currency';
import { Portfolio } from '../../models/financial/portfolio';
import { ITokenConversionsService, TokenConversionsService } from '../token-conversions-service';
import { PROCESS_IDS } from '../../constants/processIds';

/**
 * @category Portfolio
 * @Beta
 * @inheritdoc
 */
@staticImplements<IAutoconfiguration>()
export class PortfolioService implements IPortfolioService {
	constructor(
		private readonly reactiveCreditNoticeService: IReactiveCreditNoticeService,
		private readonly tokenConversionsService: ITokenConversionsService
	) { }


	/**
	 * Creates a pre-configured instance of PortfolioService
	 * @returns A pre-configured PortfolioService instance
	 */
	public static autoConfiguration(): IPortfolioService {
		return new PortfolioService(
			ReactiveCreditNoticeService.autoConfiguration(),
			TokenConversionsService.autoConfiguration()
		);
	}
	public calculatePortfolioWorthUSD$(portfolio: Observable<Portfolio>): Observable<ICurrencyAmount> {
		return portfolio.pipe(
			switchMap(portfolio => this.convertPortfolioTokensToStream(portfolio)),
			switchMap(token => this.convertTokenToUSD$(token)),
			scan((total: CurrencyAmount, amount: ICurrencyAmount) => {
				return total.add(amount as CurrencyAmount);
			}, CurrencyAmount.None)
		);
	}

	public calculatePortfolioWorthAO$(portfolio: Observable<Portfolio>): Observable<ICurrencyAmount> {
		return portfolio.pipe(
			switchMap(portfolio => this.convertPortfolioTokensToStream(portfolio)),
			switchMap(token => this.convertTokenToAO$(token)),
			scan((total: CurrencyAmount, amount: ICurrencyAmount) => {
				return total.add(amount as CurrencyAmount);
			}, CurrencyAmount.None)
		);
	}


	public getPortfolio$(entityId: string): Observable<Portfolio> {
		return this.getTokens$(entityId).pipe(
			map(tokens => new Portfolio({ entityId, tokens }))
		)
	}

	public getTokens$(entityId: string): Observable<TokenBalance[]> {
		try {
			return this.getTokenIdsInPortfolio$(entityId).pipe(
				toArray(),
				switchMap(processIds => this.createProgressiveTokenStream(processIds, entityId))
			);
		} catch (error: any) {
			Logger.error(`Failed to get tokens for entity ${entityId}: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Creates a progressive token stream that emits empty tokens first, then replaces them with filled tokens as they arrive
	 * @param processIds Array of process IDs to create tokens for
	 * @param entityId The entity ID to get balances for
	 * @returns Observable stream of TokenBalance arrays with progressive updates
	 */
	private createProgressiveTokenStream(processIds: string[], entityId: string): Observable<TokenBalance[]> {
		// Create initial empty token balances
		const initialTokens = processIds.map(processId =>
			new TokenBalance({
				tokenConfig: {
					tokenProcessId: processId
				},
				currencyAmount: CurrencyAmount.None
			})
		);

		// Stream of individual filled token balances as they complete
		const filledTokens$ = from(processIds).pipe(
			mergeMap(processId =>
				from(PortfolioService.getTokenBalanceForProcess(processId, entityId))
			)
		);

		// Merge empty tokens with filled tokens, replacing as they arrive
		return merge(
			of(initialTokens),
			filledTokens$
		).pipe(
			scan((currentTokens: TokenBalance[], newToken: TokenBalance | TokenBalance[]) => {
				// If it's the initial array of empty tokens
				if (Array.isArray(newToken)) {
					return newToken;
				}

				// Replace the empty token with the filled one based on tokenProcessId
				const processId = newToken.getTokenConfig().tokenProcessId;
				const index = currentTokens.findIndex(token =>
					token.getTokenConfig().tokenProcessId === processId
				);

				if (index !== -1) {
					const updatedTokens = [...currentTokens];
					updatedTokens[index] = newToken;
					return updatedTokens;
				}

				return currentTokens;
			}, [])
		);
	}

	/**
	 * Gets token balance for a specific process ID and entity
	 * @param processId The process ID of the token
	 * @param entityId The entity ID to get balance for
	 * @returns Promise resolving to TokenBalance
	 */
	private static async getTokenBalanceForProcess(processId: string, entityId: string): Promise<TokenBalance> {
		const tokenClient = new ClientBuilder(TokenClient)
			.withProcessId(processId)
			// .withAOConfig(FORWARD_RESEARCH_AO_CONFIG)
			.build();
		let info: TokenInfo;
		let balance: string;
		try {
			info = await tokenClient.getInfo()
			balance = await tokenClient.balance(entityId)

		} catch (error: any) {
			return new TokenBalance({
				tokenConfig: {
					logoTxId: '',
					name: '',
					tokenProcessId: processId
				}, currencyAmount: CurrencyAmount.None
			})
		}

		const currencyAmount = new CurrencyAmount(BigInt(balance), Number(info.denomination))
		const tokenConfig = {
			logoTxId: info.logo!,
			name: info.name!,
			tokenProcessId: processId
		}

		return new TokenBalance({
			tokenConfig, currencyAmount
		})
	}


	public getTotalValue$(entityId: string, baseCurrency?: string): Observable<string> {
		try {
			// TODO: Implement getTotalValue logic
			throw new Error('Method not implemented');
		} catch (error: any) {
			Logger.error(`Failed to get total value for entity ${entityId}: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Queries all credit notices received by the specified entity
	 * @param entityId The entity ID to query credit notices for
	 * @returns Observable stream of credit notices
	 */
	public getCreditNotices$(entityId: string): Observable<CreditNotice[]> {
		try {
			return this.reactiveCreditNoticeService.streamCreditNoticesReceivedById$({
				recipient: entityId,
				limit: 1000
			});
		} catch (error: any) {
			Logger.error(`Failed to get credit notices for entity ${entityId}: ${error.message}`);
			throw error;
		}
	}

	private getTokenIdsInPortfolio$(entityId: string): Observable<string> {
		return this.getCreditNotices$(entityId).pipe(
			// Flatten the arrays of credit notices
			mergeMap(creditNotices => from(creditNotices)),
			// Extract the fromProcess value from each credit notice
			map(creditNotice => creditNotice.fromProcess),
			// Get distinct process IDs
			distinct()
		)
	}

	/**
	 * Converts a portfolio's token array into a stream of individual tokens
	 * @param portfolio The portfolio containing tokens
	 * @returns Observable stream of individual TokenBalance objects
	 */
	private convertPortfolioTokensToStream(portfolio: Portfolio): Observable<TokenBalance> {
		return from(portfolio.getTokens());
	}

	/**
	 * Converts a single token to the specified target token process ID
	 * @param token The token to convert
	 * @param targetTokenProcessId The target token process ID to convert to
	 * @returns Observable of the converted currency amount
	 */
	private convertTokenTo$(token: TokenBalance, targetTokenProcessId: string): Observable<ICurrencyAmount> {
		// Skip conversion if token has no balance
		if (token.getCurrencyAmount().isZero()) {
			return of(CurrencyAmount.None);
		}
		Logger.debug(`Converting token ${token.getTokenConfig().tokenProcessId} to ${targetTokenProcessId}`);

		// Create a token with 1 unit to get the conversion rate
		const originalAmount = token.getCurrencyAmount();
		const oneUnitToken = new TokenBalance({
			tokenConfig: token.getTokenConfig(),
			currencyAmount: new CurrencyAmount(BigInt(1), originalAmount.decimals())
		});

		return from(this.tokenConversionsService.convert(oneUnitToken, targetTokenProcessId)).pipe(
			map(convertedToken => {
				const conversionRate = convertedToken.getCurrencyAmount();
				// Multiply the original balance by the conversion rate (convert to number for multiplication)
				return originalAmount.multiply(conversionRate.toNumber());
			}),
			// Handle errors by returning zero amount
			map(amount => amount || CurrencyAmount.None)
		);
	}

	/**
	 * Converts a single token to its USD equivalent using WUSDC
	 * @param token The token to convert
	 * @returns Observable of the converted currency amount
	 */
	private convertTokenToUSD$(token: TokenBalance): Observable<ICurrencyAmount> {
		return this.convertTokenTo$(token, PROCESS_IDS.AOX.WUSDC);
	}

	/**
	 * Converts a single token to its AO equivalent
	 * @param token The token to convert
	 * @returns Observable of the converted currency amount
	 */
	private convertTokenToAO$(token: TokenBalance): Observable<ICurrencyAmount> {
		return this.convertTokenTo$(token, PROCESS_IDS.AO);
	}
}
