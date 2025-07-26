import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IReassignNameNoticeEvent } from "./abstract/IReassignNameNoticeEvent";
import { ANTEvent } from "./ANTEvent";

export class ReassignNameNoticeEvent extends ANTEvent implements IReassignNameNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
}
