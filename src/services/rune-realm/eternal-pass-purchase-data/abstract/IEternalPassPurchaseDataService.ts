import { Observable } from 'rxjs';
import { ITokenBalance } from '../../../../models/token-balance/abstract/ITokenBalance';
import { PurchaseOption } from '../purchase-options';

/**
 * Service for managing and retrieving eternal pass purchase data.
 */
export interface IEternalPassPurchaseDataService {


	/**
	 * Gets purchase data for receiving from a specific process
	 * @param processId The process ID to query purchase data for
	 * @returns Observable of token balances representing purchase data from the specified process
	 */
	getPurchaseDataFromProcess$(purchaseOption: PurchaseOption): Observable<ITokenBalance[]>;
}
