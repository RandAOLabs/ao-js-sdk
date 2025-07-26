import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { ReassignNameNoticeANTTransactionData } from "../../../ant-data-service/abstract/transaction-data/ReassignNameNoticeTransactionData";
import { IReassignNameNoticeEvent } from "./abstract/IReassignNameNoticeEvent";
import { ANTEvent } from "./ANTEvent";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class ReassignNameNoticeEvent extends ANTTransactionDataEvent<ReassignNameNoticeANTTransactionData> implements IReassignNameNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
}
