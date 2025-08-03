import { TagUtils } from "../../../../../core";
import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { ANT_INITIATOR_TAG_NAME } from "../../../../../models";
import { IReleaseNameNoticeEvent } from "./abstract/IReleaseNameNoticeEvent";
import { ANTEvent } from "./ANTEvent";

export class ReleaseNameNoticeEvent extends ANTEvent implements IReleaseNameNoticeEvent {
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
