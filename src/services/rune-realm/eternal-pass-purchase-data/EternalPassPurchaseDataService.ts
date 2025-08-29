import { Observable, from, mergeMap, map, toArray, of, catchError } from 'rxjs';
import { IEternalPassPurchaseDataService } from './abstract/IEternalPassPurchaseDataService';
import { ICredit } from '../../../models/financial/credit/abstract/ICredit';
import { Credit } from '../../../models/financial/credit/Credit';
import { Logger } from '../../../utils/logger/logger';
import { ReactiveCreditNoticeService, CreditNotice } from '../../credit-notices';
import { IReactiveCreditNoticeService } from '../../credit-notices/reactive-credit-notice-service/abstract';
import { IAutoconfiguration, staticImplements } from '../../../utils';
import { RUNEREALM } from '../../../constants/processIds/rune_realm';
import { IService } from '../../common/abstract/IService';
import { ServiceErrorHandler } from '../../../utils/decorators/serviceErrorHandler';
import { PurchaseOption, getTokenConfigForPurchaseOption } from './purchase-options';
import { TokenConfig } from '../../../models/financial/token-balance';

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
	public getPurchaseDataFromProcess$(purchaseOption: PurchaseOption): Observable<ICredit[]> {
		Logger.info(`${this.getServiceName()}: Getting purchase data for option: ${PurchaseOption[purchaseOption]}`);

		// Get the token config for the purchase option
		const tokenConfig: TokenConfig = getTokenConfigForPurchaseOption(purchaseOption);

		// Stream and flatten credit notices, then convert to credits
		return this.streamAndFlattenCreditNotices$(tokenConfig).pipe(
			// Convert credit notices to credits
			map((creditNotice: CreditNotice) => this.convertCreditNoticeToCredit(creditNotice, tokenConfig)),
			// Collect all credits into an array
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
	 * Converts a credit notice to a credit using the provided token configuration
	 * @param creditNotice The credit notice to convert
	 * @param tokenConfig The token configuration for the credit
	 * @returns A new Credit instance
	 */
	private convertCreditNoticeToCredit(creditNotice: CreditNotice, tokenConfig: TokenConfig): ICredit {
		Logger.debug(`${this.getServiceName()}: Processing credit notice from ${creditNotice.fromProcess} with quantity ${creditNotice.quantity}`);

		// Use the static method from Credit to create from credit notice
		return Credit.fromCreditNotice(creditNotice, tokenConfig);
	}

}
