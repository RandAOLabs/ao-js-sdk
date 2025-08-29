import { Observable, from, mergeMap, map, distinct, switchMap, toArray, of, merge, scan, catchError } from 'rxjs';
import { IEternalPassPurchaseDataService } from './abstract/IEternalPassPurchaseDataService';
import { ITokenBalance } from '../../../models/token-balance/abstract/ITokenBalance';
import { TokenBalance } from '../../../models/token-balance/TokenBalance';
import { CurrencyAmount } from '../../../models/currency/CurrencyAmount';
import { Logger } from '../../../utils/logger/logger';
import { ReactiveCreditNoticeService, CreditNotice } from '../../credit-notices';
import { TokenClient, TokenInfo } from '../../../clients/ao';
import { ClientBuilder } from '../../../clients/common';
import { IReactiveCreditNoticeService } from '../../credit-notices/reactive-credit-notice-service/abstract';
import { IAutoconfiguration, staticImplements } from '../../../utils';
import { RUNEREALM } from '../../../constants/processIds/rune_realm';
import { IService } from '../../common/abstract/IService';
import { ServiceErrorHandler } from '../../../utils/decorators/serviceErrorHandler';
import { SYSTEM_TAGS } from '../../../constants/tags/systemtags';
import { PurchaseOption, getTokenConfigForPurchaseOption } from './purchase-options';
import { GetAllCreditNoticesParams, GetLatestCreditNoticesParams } from '../../credit-notices/abstract/types';
import { TokenConfig } from '../../../models/token-balance';

/**
 * @category Rune Realm
 * @inheritdoc
 */
@staticImplements<IAutoconfiguration>()
export class EternalPassPurchaseDataService implements IEternalPassPurchaseDataService, IService {
	constructor(
		private readonly reactiveCreditNoticeService: IReactiveCreditNoticeService
	) { }

	/**
	 * Creates a pre-configured instance of EternalPassPurchaseDataService
	 * @returns A pre-configured EternalPassPurchaseDataService instance
	 */
	public static autoConfiguration(): IEternalPassPurchaseDataService {
		return new EternalPassPurchaseDataService(
			ReactiveCreditNoticeService.autoConfiguration()
		);
	}


	public getServiceName(): string {
		return 'EternalPassPurchaseDataService';
	}

	@ServiceErrorHandler
	public getPurchaseDataFromProcess$(purchaseOption: PurchaseOption): Observable<ITokenBalance[]> {
		Logger.info(`${this.getServiceName()}: Getting purchase data for option: ${PurchaseOption[purchaseOption]}`);

		// Get the token config for the purchase option
		const tokenConfig: TokenConfig = getTokenConfigForPurchaseOption(purchaseOption);

		// Stream and flatten credit notices, then convert to token balances
		return this.streamAndFlattenCreditNotices$(tokenConfig).pipe(
			// Convert credit notices to token balances
			map((creditNotice: CreditNotice) => this.convertCreditNoticeToTokenBalance(creditNotice, tokenConfig)),
			// Collect all token balances into an array
			toArray(),
			// Handle errors gracefully
			catchError((error) => {
				Logger.error(`${this.getServiceName()}: Error getting purchase data for ${PurchaseOption[purchaseOption]}:`, error);
				return of([]); // Return empty array on error
			})
		);
	}

	/**
	 * Streams credit notices from the service and flattens them into individual notices
	 * @param tokenConfig The token configuration to query for
	 * @returns Observable of individual credit notices
	 */
	private streamAndFlattenCreditNotices$(tokenConfig: TokenConfig): Observable<CreditNotice> {
		// Ensure tokenProcessId is defined
		if (!tokenConfig.tokenProcessId) {
			Logger.error(`${this.getServiceName()}: Token process ID is undefined for token config:`, tokenConfig);
			return of(); // Return empty observable if no process ID
		}

		// Stream credit notices and flatten them
		return this.reactiveCreditNoticeService.streamCreditNoticesBetween$(tokenConfig.tokenProcessId, RUNEREALM.PAYMENTS).pipe(
			// Flatten the array of credit notices
			mergeMap((creditNotices: CreditNotice[]) => from(creditNotices))
		);
	}

	/**
	 * Converts a credit notice to a token balance using the provided token configuration
	 * @param creditNotice The credit notice to convert
	 * @param tokenConfig The token configuration for the balance
	 * @returns A new TokenBalance instance
	 */
	private convertCreditNoticeToTokenBalance(creditNotice: CreditNotice, tokenConfig: TokenConfig): ITokenBalance {
		Logger.debug(`${this.getServiceName()}: Processing credit notice from ${creditNotice.fromProcess} with quantity ${creditNotice.quantity}`);

		// Use the static method from TokenBalance to create from credit notice
		return TokenBalance.fromCreditNotice(creditNotice, tokenConfig);
	}

}
