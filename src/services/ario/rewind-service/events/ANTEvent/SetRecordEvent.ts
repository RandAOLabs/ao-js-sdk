import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import TagUtils from "../../../../../core/common/TagUtils";
import { ANT_QUERY_TAGS, ANT_SUB_DOMAIN_TAG_NAME, ARNS_QUERY_TAGS, ARNS_RESPONSE_TAGS } from "../../../../../models";
import { Logger } from "../../../../../utils";
import { FROM_PROCESS_TAG_NAME } from "../../../../credit-notices/constants";
import { IMessagesService, MessagesService } from "../../../../messages";
import { SetRecordNoticeTransactionData } from "../../../ant-data-service";
import { ISetRecordEvent } from "./abstract";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class SetRecordEvent extends ANTTransactionDataEvent<SetRecordNoticeTransactionData> implements ISetRecordEvent {
	private initiateSetRecordTransaction: Promise<ArweaveTransaction>;
	private messageService: IMessagesService
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
		this.messageService = MessagesService.autoConfiguration()
		this.initiateSetRecordTransaction = this.postInitQuery()
	}

	protected async postInitQuery(): Promise<ArweaveTransaction> {
		const notice = await this.getNoticeData();
		const messages = (await this.messageService.getLatestMessages({
			recipient: TagUtils.getTagValue(this.arweaveTransaction.tags!, FROM_PROCESS_TAG_NAME),
			tags: [
				ANT_QUERY_TAGS.TRANSACTION_ID(notice.transactionId)
			]
		})).messages

		const targetTimestamp = this.arweaveTransaction.block?.timestamp;
		if (!targetTimestamp) {
			throw new Error('Arweave transaction block timestamp is not available');
		}

		// Sort messages by distance from target timestamp and return the closest one
		const sortedMessages = messages.sort((a, b) => {
			const distanceA = Math.abs((a.block?.timestamp || 0) - targetTimestamp);
			const distanceB = Math.abs((b.block?.timestamp || 0) - targetTimestamp);
			return distanceA - distanceB;
		});

		if (sortedMessages.length === 0) {
			throw new Error('No messages found');
		}

		return sortedMessages[0];
	}
	async getTransactionId(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.transactionId
	}
	async getTtlSeconds(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.ttlSeconds
	}
	async getSubDomain(): Promise<string> {
		const transaction = await this.getInitiateSetRecordTransaction()
		return TagUtils.getTagValue(transaction.tags!, ANT_SUB_DOMAIN_TAG_NAME)!
	}

	protected async getInitiateSetRecordTransaction(): Promise<ArweaveTransaction> {
		return this.initiateSetRecordTransaction
	}
}
