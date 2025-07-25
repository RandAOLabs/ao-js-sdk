import { Observable, map, take } from 'rxjs';
import { IMessagesService, MessagesService } from '../message-service';
import { ArweaveTransaction } from '../../../core/arweave/abstract/types';
import { IAutoconfiguration } from '../../../utils/class-interfaces/IAutoconfiguration';
import { staticImplements } from '../../../utils/decorators/staticImplements';
import { Logger } from '../../../utils/logger/logger';
import {
	GetAllMessagesParams,
	GetAllMessagesBySenderParams,
	GetAllMessagesByRecipientParams,
	GetLatestMessagesParams,
	GetLatestMessagesResponse
} from '../message-service/abstract/types';
import { IReactiveMessageService } from './abstract/IReactiveMessageService';

/**
 * Reactive service for message operations that provides RxJS Observable streams
 */
@staticImplements<IAutoconfiguration>()
export class ReactiveMessageService implements IReactiveMessageService {
	constructor(
		private readonly messagesService: IMessagesService
	) { }

	/**
	 * Creates a pre-configured instance of ReactiveMessageService
	 * @returns A pre-configured ReactiveMessageService instance
	 */
	public static autoConfiguration(): ReactiveMessageService {
		return new ReactiveMessageService(
			MessagesService.autoConfiguration()
		);
	}

	streamAllMessages(params: GetAllMessagesParams): Observable<ArweaveTransaction[]> {
		return this.streamMessagesPaginated(params);
	}

	streamAllMessagesSentBy(params: GetAllMessagesBySenderParams): Observable<ArweaveTransaction[]> {
		return this.streamMessagesPaginated({
			...params,
			owner: params.id
		});
	}

	getLatestMessage(params: GetAllMessagesParams): Observable<ArweaveTransaction | undefined> {
		return new Observable<ArweaveTransaction | undefined>(subscriber => {
			(async () => {
				try {
					const response = await this.messagesService.getLatestMessages({
						...params,
						limit: 1
					});
					// Ensure response.messages exists and handle undefined case
					if (!response || !response.messages) {
						subscriber.next(undefined);
					} else {
						subscriber.next(response.messages[0] || undefined);
					}
					subscriber.complete();
				} catch (error: any) {
					Logger.error(`Error fetching latest message: ${error.message}`);
					subscriber.error(error);
				}
			})();

			return () => { };
		});
	}

	/**
	 * Streams messages using pagination, continuously fetching next pages while available.
	 * Uses a while loop to handle pagination with cursor, emitting messages as they arrive.
	 * @param params Parameters for filtering messages
	 * @returns Observable that emits arrays of messages as they are fetched
	 * @private
	 */
	private streamMessagesPaginated(params: GetLatestMessagesParams): Observable<ArweaveTransaction[]> {
		return new Observable<ArweaveTransaction[]>(subscriber => {
			(async () => {
				try {
					let currentCursor: string | undefined;
					let hasMore = true;

					while (hasMore) {
						const response = await this.messagesService.getLatestMessages({
							...params,
							cursor: currentCursor,
							limit: 100
						});

						// Always emit messages array (empty if none found)
						subscriber.next(response.messages);

						// Update pagination state
						hasMore = response.hasNextPage;
						currentCursor = response.cursor;
					}

					subscriber.complete();
				} catch (error: any) {
					Logger.error(`Error fetching messages: ${error.message}`);
					subscriber.error(error);
				}
			})();

			return () => { };
		});
	}
}
