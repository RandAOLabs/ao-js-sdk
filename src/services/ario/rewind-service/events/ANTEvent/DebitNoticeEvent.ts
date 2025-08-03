import { TagUtils } from "../../../../../core";
import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { ANT_QUANTITY_TAG_NAME, ANT_RECIPIENT_TAG_NAME } from "../../../../../models";
import { IDebitNoticeEvent } from "./abstract/IDebitNoticeEvent";
import { ANTEvent } from "./ANTEvent";

export class DebitNoticeEvent extends ANTEvent implements IDebitNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
	public getRecipient(): string {
		return TagUtils.getTagValue(this.arweaveTransaction.tags!, ANT_RECIPIENT_TAG_NAME)!
	}

	public getSender(): string {
		return this.getNotified()
	}

	public getQuantity(): string {
		return TagUtils.getTagValue(this.arweaveTransaction.tags!, ANT_QUANTITY_TAG_NAME)!
	}
}
