import { Observable } from 'rxjs';
import { CreditNotice } from '../../../credit-notices/abstract/types';

/**
 * Interface for the RNG Data Service
 */
export interface IRNGDataService {

	/*
	 * @returns Stream of RNG Beta AO sales data as credit notices
	 */
	getRNGFaucetSales(): Observable<CreditNotice>;
}
