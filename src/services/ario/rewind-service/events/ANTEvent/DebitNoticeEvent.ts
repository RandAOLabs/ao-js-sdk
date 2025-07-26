import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { DebitNoticeTransactionData } from "../../../ant-data-service/abstract/transaction-data/DebitNoticeTransactionData";
import { IDebitNoticeEvent } from "./abstract/IDebitNoticeEvent";
import { ANTEvent } from "./ANTEvent";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class DebitNoticeEvent extends ANTTransactionDataEvent<DebitNoticeTransactionData> implements IDebitNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
}
