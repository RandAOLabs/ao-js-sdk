import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IRemovePrimaryNamesNoticeEvent } from "./abstract/IRemovePrimaryNamesNoticeEvent";
import { ANTEvent } from "./ANTEvent";

export class RemovePrimaryNamesNoticeEvent extends ANTEvent implements IRemovePrimaryNamesNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
}
