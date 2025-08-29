import { Observable, map } from 'rxjs';
import { IReactiveCreditNoticeService } from './abstract/IReactiveCreditNoticeService';
import { CreditNotice, GetLatestCreditNoticesParams, GetAllCreditNoticesParams } from '../abstract/types';
import { CREDIT_NOTICE_ACTION_TAG, FROM_PROCESS_TAG_NAME } from '../constants';
import { ReactiveMessageService } from '../../messages/reactive-message-service/ReactiveMessageService';
import { IAutoconfiguration } from '../../../utils/class-interfaces/IAutoconfiguration';
import { staticImplements } from '../../../utils/decorators/staticImplements';
import { Logger } from '../../../utils/logger/logger';
import CreditNoticeConverter from '../CreditNoticeConverter';
import { GetLatestMessagesParams, GetAllMessagesParams } from '../../messages/message-service/abstract/types';
import { IReactiveMessageService } from '../../messages';
import { IService } from '../../common';
import { ServiceErrorHandler } from '../../../utils';

/**
 * Reactive service for credit notice operations that provides RxJS Observable streams
 */
@staticImplements<IAutoconfiguration>()
export class ReactiveCreditNoticeService implements IReactiveCreditNoticeService, IService {
	constructor(
		private readonly reactiveMessageService: IReactiveMessageService
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


	public getServiceName(): string {
		return 'ReactiveCreditNoticeService';
	}

	@ServiceErrorHandler
	public streamCreditNoticesReceivedById$(params: GetLatestMessagesParams): Observable<CreditNotice[]> {
		try {
			// Add the Credit Notice action tag
			const tags = [
				CREDIT_NOTICE_ACTION_TAG,
				...(params.tags || [])
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

	@ServiceErrorHandler
	public streamAllCreditNoticesReceivedById$(params: GetAllMessagesParams): Observable<CreditNotice[]> {
		// Add the Credit Notice action tag
		const tags = [
			CREDIT_NOTICE_ACTION_TAG,
			...(params.tags || [])
		];

		const messageQueryParams: GetAllMessagesParams = {
			...params,
			tags
		};

		// Stream all messages using pagination and convert them to credit notices
		return this.reactiveMessageService.streamAllMessages(messageQueryParams).pipe(
			map(transactions => transactions.map(tx => CreditNoticeConverter.convert(tx)))
		);
	}

	@ServiceErrorHandler
	public streamCreditNoticesBetween$(fromEntityId: string, toEntityId: string): Observable<CreditNotice[]> {
		Logger.info(`Getting credit notices between ${fromEntityId} and ${toEntityId}`);

		// Use the existing streamAllCreditNoticesReceivedById$ method with additional filtering
		return this.streamAllCreditNoticesReceivedById$({
			recipient: toEntityId,
			tags: [
				{ name: FROM_PROCESS_TAG_NAME, value: fromEntityId }
			]
		});

	}
}
