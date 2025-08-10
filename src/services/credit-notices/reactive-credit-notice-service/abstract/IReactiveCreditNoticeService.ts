import { Observable } from 'rxjs';
import { CreditNotice, GetLatestCreditNoticesParams } from '../../abstract/types';

/**
 * Reactive interface for credit notice service operations that provides RxJS Observable streams
 */
export interface IReactiveCreditNoticeService {
	/**
	 * Streams all credit notices received by a specific ID
	 * @param params Parameters for retrieving credit notices
	 * @returns Observable that emits arrays of credit notices as they are fetched
	 */
	streamCreditNoticesReceivedById$(params: GetLatestCreditNoticesParams): Observable<CreditNotice[]>;
}
