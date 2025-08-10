import { Observable, from, map, filter, switchMap } from 'rxjs';
import { IRNGDataService } from './abstract/IRNGDataService';
import { IReactiveMessageService, ReactiveMessageService } from '../../messages';
import { IAutoconfiguration } from '../../../utils/class-interfaces/IAutoconfiguration';
import { staticImplements } from '../../../utils/decorators/staticImplements';
import { Logger } from '../../../utils/logger/logger';
import { MISCELLANEOUS } from '../../../constants/processIds/miscellaneous';
import { AO } from '../../../constants/processIds/ao';
import { CREDIT_NOTICE_ACTION_TAG, FROM_PROCESS_TAG_NAME } from '../../credit-notices/constants';
import { Tags } from '../../../core/common/types';
import CreditNoticeConverter from '../../credit-notices/CreditNoticeConverter';
import { CreditNotice } from '../../credit-notices/abstract/types';

/**
 * Implementation of the RNG Data Service that provides streaming data capabilities
 */
@staticImplements<IAutoconfiguration>()
export class RNGDataService implements IRNGDataService {
	constructor(
		private readonly messageService: IReactiveMessageService,
	) { }

	/**
	 * Creates a pre-configured instance of RNGDataService
	 * @returns A pre-configured RNGDataService instance
	 */
	public static autoConfiguration(): RNGDataService {
		return new RNGDataService(
			ReactiveMessageService.autoConfiguration(),
		);
	}


	/**
	 * @returns Stream of RNG Beta AO sales data as credit notices
	 */
	public getRNGFaucetSales(): Observable<CreditNotice> {

		// Define tags to filter credit notices from AO process
		const tags: Tags = [
			CREDIT_NOTICE_ACTION_TAG,
			{
				name: FROM_PROCESS_TAG_NAME,
				value: AO
			}
		];

		// Stream messages to the Faucet with credit notice tags
		return this.messageService.streamAllMessages({
			recipient: MISCELLANEOUS.FAUCET,
			tags: tags
		}).pipe(
			// Flatten the arrays of messages
			switchMap(messages => from(messages)),
			// Filter out messages without required data and convert to credit notices
			map(message => {
				try {
					return CreditNoticeConverter.convert(message);
				} catch (error) {
					Logger.debug('Failed to convert message to credit notice', { messageId: message.id, error });
					return null;
				}
			}),
			// Filter out failed conversions
			filter((creditNotice): creditNotice is CreditNotice => creditNotice !== null)
		);
	}
}
