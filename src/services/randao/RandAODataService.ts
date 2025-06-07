import { IAutoconfiguration, Logger } from "../../utils";
import { staticImplements } from "../../utils/decorators";
import { ARIOService, IARIOService } from "../ario";
import { DOMAIN } from "../ario/domains";
import { IRandAODataService } from "./abstract/IRandAODataService";
import { BlockHeightFilterParams } from "./abstract/params";
import RANDOM_PROCESS_TAGS from "../../clients/randao/random/tags";
import { SYSTEM_TAGS } from "../../core/common/tags";
import { IMessagesService, MessagesService } from "../messages";
import { ReactiveMessageService } from "../messages/reactive-message-service/ReactiveMessageService";
import { Observable, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ArweaveTransaction } from "../../core/arweave/abstract/types";


/**
 * Service for handling RandAO operations
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
export class RandAODataService implements IRandAODataService {
	constructor(
		private readonly arioservice: IARIOService,
		private readonly messagesService: IMessagesService,
		private readonly reactiveMessageService: ReactiveMessageService
	) { }

	/**
	 * Query all messages with specific random process response tags
	 * @param randomProcessId The process ID to query messages for
	 * @returns Observable that emits arrays of messages as they are fetched
	 */
	public queryRandomResponseMessages(randomProcessId: string): Observable<ArweaveTransaction[]> {
		return this.reactiveMessageService.streamAllMessages({
			tags: [
				RANDOM_PROCESS_TAGS.ACTION.RESPONSE,
				SYSTEM_TAGS.FROM_PROCESS(randomProcessId)
			]
		});
	}

	/** 
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration} 
	 */
	public static async autoConfiguration(): Promise<IRandAODataService> {
		return new RandAODataService(
			ARIOService.getInstance(),
			MessagesService.autoConfiguration(),
			ReactiveMessageService.autoConfiguration()
		);
	}

	public streamRandomResponseMessages(): Observable<ArweaveTransaction[]> {
		return from(this.arioservice.getProcessIdForDomain(DOMAIN.RANDAO_API)).pipe(
			switchMap(randomProcessId => this.reactiveMessageService.streamAllMessages({
				tags: [
					RANDOM_PROCESS_TAGS.ACTION.RESPONSE,
					SYSTEM_TAGS.FROM_PROCESS(randomProcessId)
				]
			}))
		);
	}

	async countRandomResponses(params: BlockHeightFilterParams): Promise<number> {
		const randomProcessId = await this.arioservice.getProcessIdForDomain(DOMAIN.RANDAO_API)
		return await this.messagesService.countAllMessages({
			tags: [
				RANDOM_PROCESS_TAGS.ACTION.RESPONSE,
				SYSTEM_TAGS.FROM_PROCESS(randomProcessId)
			],
			minBlockHeight: params.minBlockHeight,
			maxBlockHeight: params.maxBlockHeight
		})
	}

	async getTotalRandomResponses(): Promise<number> {
		const randomProcessId = await this.arioservice.getProcessIdForDomain(DOMAIN.RANDAO_API)
		Logger.debug(randomProcessId)
		return await this.messagesService.countAllMessages({
			tags: [
				RANDOM_PROCESS_TAGS.ACTION.RESPONSE,
				SYSTEM_TAGS.FROM_PROCESS(randomProcessId)
			]
		})
	}

	async getProviderTotalFullfilledCount(providerId: string): Promise<number> {
		try {
			// Create a timeout promise that rejects after 15 seconds
			const timeoutPromise = new Promise<number>((_, reject) => {
				const id = setTimeout(() => {
					clearTimeout(id);
					reject(new Error('Request timed out after 15 seconds'));
				}, 15000);
			});

			// Create the actual query promise
			const queryPromise = async (): Promise<number> => {
				const randomProcessId = await this.arioservice.getProcessIdForDomain(DOMAIN.RANDAO_API);
				return this.messagesService.countAllMessages({
					owner: providerId,
					recipient: randomProcessId,
					tags: [RANDOM_PROCESS_TAGS.ACTION.REVEAL]
				});
			};

			// Race the timeout against the actual query
			return await Promise.race([queryPromise(), timeoutPromise]);
		} catch (error: unknown) {
			// Log the error but return -1 as requested
			const errorMessage = error instanceof Error ? error.message : String(error);
			Logger.warn(`Failed to get provider total fulfilled count for provider ${providerId}: ${errorMessage}`);
			return -1;
		}
	}

}
