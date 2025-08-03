import { TagUtils } from "../../../../../core";
import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { ANT_QUANTITY_TAG_NAME, ANT_SENDER_TAG_NAME } from "../../../../../models";
import { ICreditNoticeEvent } from "./abstract/ICreditNoticeEvent";
import { ANTEvent } from "./ANTEvent";

export class CreditNoticeEvent extends ANTEvent implements ICreditNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
	
	public getRecipient(): string {
		return this.getNotified()
	}
	
	public getSender(): string {
		return TagUtils.getTagValue(this.arweaveTransaction.tags!, ANT_SENDER_TAG_NAME)!
	}
	
	public getQuantity(): string {
		return TagUtils.getTagValue(this.arweaveTransaction.tags!, ANT_QUANTITY_TAG_NAME)!
	}
}
