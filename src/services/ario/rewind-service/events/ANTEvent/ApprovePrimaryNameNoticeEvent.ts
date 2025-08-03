import { TagUtils } from "../../../../../core";
import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { ANT_RECIPIENT_TAG_NAME } from "../../../../../models";
import { IApprovePrimaryNameNoticeEvent } from "./abstract/IApprovePrimaryNameNoticeEvent";
import { ANTEvent } from "./ANTEvent";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class ApprovePrimaryNameNoticeEvent extends ANTEvent implements IApprovePrimaryNameNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
	public getApprovedId(): string {
		return TagUtils.getTagValue(this.arweaveTransaction.tags!, ANT_RECIPIENT_TAG_NAME)!
	}

	/**
	 * @override
	 */
	public getInitiator(): string {
		return this.getApprovedId()
	}
}
