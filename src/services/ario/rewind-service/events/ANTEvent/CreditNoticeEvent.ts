import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { CreditNoticeTransactionData } from "../../../ant-data-service/abstract/transaction-data/CreditNoticeTransactionData";
import { ICreditNoticeEvent } from "./abstract/ICreditNoticeEvent";
import { ANTEvent } from "./ANTEvent";

export class CreditNoticeEvent extends ANTEvent implements ICreditNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
}
