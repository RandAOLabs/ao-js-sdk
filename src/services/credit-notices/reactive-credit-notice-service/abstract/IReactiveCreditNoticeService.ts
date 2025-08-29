import { Observable } from 'rxjs';
import { CreditNotice } from '../../abstract/types';
import { GetAllMessagesParams, GetLatestMessagesParams } from '../../../..';

/**
 * Reactive interface for credit notice service operations that provides RxJS Observable streams
 */
export interface IReactiveCreditNoticeService {
	/**
	 * Streams all credit notices received by a specific ID
	 * @param params Parameters for retrieving credit notices
	 * @returns Observable that emits arrays of credit notices as they are fetched
	 */
	streamCreditNoticesReceivedById$(params: GetLatestMessagesParams): Observable<CreditNotice[]>;

	/**
	 * Streams all credit notices received by a specific recipient ID using pagination
	 * @param params Parameters for retrieving all credit notices
	 * @returns Observable that emits arrays of credit notices as they are fetched through pagination
	 */
	streamAllCreditNoticesReceivedById$(params: GetAllMessagesParams): Observable<CreditNotice[]>;

	/**
	 * Streams all credit notices between two entities (from one process to another)
	 * @param fromEntityId The entity ID that sent the credit notices
	 * @param toEntityId The entity ID that received the credit notices
	 * @returns Observable that emits arrays of credit notices sent from fromEntityId to toEntityId
	 */
	streamCreditNoticesBetween$(fromEntityId: string, toEntityId: string): Observable<CreditNotice[]>;
}
