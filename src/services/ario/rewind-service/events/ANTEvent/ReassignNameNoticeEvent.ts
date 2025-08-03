import { TagUtils } from "../../../../../core";
import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { ANT_INITIATOR_TAG_NAME } from "../../../../../models";
import { IReassignNameNoticeEvent } from "./abstract/IReassignNameNoticeEvent";
import { ANTEvent } from "./ANTEvent";

export class ReassignNameNoticeEvent extends ANTEvent implements IReassignNameNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}

	/**
	 * @override
	 */
	public getInitiator(): string {
		return TagUtils.getTagValue(this.arweaveTransaction.tags!, ANT_INITIATOR_TAG_NAME)!
	}
}
