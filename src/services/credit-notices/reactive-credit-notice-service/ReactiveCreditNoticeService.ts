import { Observable, map } from 'rxjs';
import { IReactiveCreditNoticeService } from './abstract/IReactiveCreditNoticeService';
import { CreditNotice, GetLatestCreditNoticesParams } from '../abstract/types';
import { CREDIT_NOTICE_ACTION_TAG } from '../constants';
import { ReactiveMessageService } from '../../messages/reactive-message-service/ReactiveMessageService';
import { IAutoconfiguration } from '../../../utils/class-interfaces/IAutoconfiguration';
import { staticImplements } from '../../../utils/decorators/staticImplements';
import { Logger } from '../../../utils/logger/logger';
import CreditNoticeConverter from '../CreditNoticeConverter';
import { GetLatestMessagesParams } from '../../messages/message-service/abstract/types';

/**
 * Reactive service for credit notice operations that provides RxJS Observable streams
 */
@staticImplements<IAutoconfiguration>()
export class ReactiveCreditNoticeService implements IReactiveCreditNoticeService {
	constructor(
		private readonly reactiveMessageService: ReactiveMessageService
	) { }

	/**
	 * Creates a pre-configured instance of ReactiveCreditNoticeService
	 * @returns A pre-configured ReactiveCreditNoticeService instance
	 */
	public static autoConfiguration(): ReactiveCreditNoticeService {
		return new ReactiveCreditNoticeService(
			ReactiveMessageService.autoConfiguration()
		);
	}

	/**
	 * Streams all credit notices received by a specific ID
	 * @param params Parameters for retrieving credit notices
	 * @returns Observable that emits arrays of credit notices as they are fetched
	 */
	streamCreditNoticesReceivedById$(params: GetLatestCreditNoticesParams): Observable<CreditNotice[]> {
		try {
			// Add the Credit Notice action tag
			const tags = [
				CREDIT_NOTICE_ACTION_TAG,
				...(params.additionalTags || [])
			];

			const messageQueryParams: GetLatestMessagesParams = {
				...params,
				tags
			};

			// Stream messages and convert them to credit notices
			return this.reactiveMessageService.getMessages$(messageQueryParams).pipe(
				map(transactions => transactions.messages.map(tx => CreditNoticeConverter.convert(tx)))
			);
		} catch (error: any) {
			Logger.error(`Error streaming credit notices: ${error.message}`);
			throw error;
		}
	}
}
