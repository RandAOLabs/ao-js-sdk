import { Observable } from 'rxjs';
import { ArweaveTransaction } from '../../../core/arweave/abstract/types';
import { IAutoconfiguration } from '../../../utils/class-interfaces/IAutoconfiguration';
import { staticImplements } from '../../../utils/decorators/staticImplements';
import { ReactiveMessageService } from '../reactive-message-service/ReactiveMessageService';
import { CachingMessageService } from '../message-service/CachingMessageService';
import {
	GetAllMessagesParams,
	GetAllMessagesBySenderParams,
	GetAllMessagesByRecipientParams,
	GetLatestMessagesParams,
	GetLatestMessagesResponse
} from '../message-service/abstract/types';
import { IReactiveMessageService } from '../reactive-message-service/abstract/IReactiveMessageService';

/**
 * Caching reactive service for message operations that provides RxJS Observable streams with caching support
 * @category On-chain-data
 */
@staticImplements<IAutoconfiguration>()
export class CachingReactiveMessageService implements IReactiveMessageService {
	private readonly reactiveMessageService: IReactiveMessageService;

	constructor(reactiveMessageService: IReactiveMessageService) {
		this.reactiveMessageService = reactiveMessageService;
	}

	/**
	 * Creates a pre-configured instance of CachingReactiveMessageService with caching support
	 * @returns A pre-configured CachingReactiveMessageService instance
	 */
	public static autoConfiguration(): CachingReactiveMessageService {
		const cachingMessageService = CachingMessageService.autoConfiguration();
		const reactiveMessageService = new ReactiveMessageService(cachingMessageService);
		return new CachingReactiveMessageService(reactiveMessageService);
	}

	streamAllMessages(params: GetAllMessagesParams): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages(params);
	}

	streamAllMessagesSentBy(params: GetAllMessagesBySenderParams): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessagesSentBy(params);
	}

	getLatestMessage(params: GetAllMessagesParams): Observable<ArweaveTransaction | undefined> {
		return this.reactiveMessageService.getLatestMessage(params);
	}

	getMessages$(params: GetLatestMessagesParams): Observable<GetLatestMessagesResponse> {
		return this.reactiveMessageService.getMessages$(params);
	}
}
