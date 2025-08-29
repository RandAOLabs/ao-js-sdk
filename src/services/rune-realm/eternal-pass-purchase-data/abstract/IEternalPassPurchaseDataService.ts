import { Observable } from 'rxjs';
import { ICredit } from '../../../../models/financial/credit/abstract/ICredit';
import { PurchaseOption } from '../purchase-options';

/**
 * Service for managing and retrieving eternal pass purchase data.
 */
export interface IEternalPassPurchaseDataService {


	/**
	 * Gets purchase data for receiving from a specific process
	 * @param purchaseOption The purchase option to query purchase data for
	 * @returns Observable of credits representing purchase data from the specified process
	 */
	getPurchaseDataFromProcess$(purchaseOption: PurchaseOption): Observable<ICredit[]>;
}
