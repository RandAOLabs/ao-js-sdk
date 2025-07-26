import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { ReleaseNameNoticeTransactionData } from "../../../ant-data-service/abstract/transaction-data/ReleaseNameNoticeTransactionData";
import { IReleaseNameNoticeEvent } from "./abstract/IReleaseNameNoticeEvent";
import { ANTEvent } from "./ANTEvent";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class ReleaseNameNoticeEvent extends ANTTransactionDataEvent<ReleaseNameNoticeTransactionData> implements IReleaseNameNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
}
