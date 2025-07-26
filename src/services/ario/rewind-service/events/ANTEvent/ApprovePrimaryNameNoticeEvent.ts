import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { ApprovePrimaryNameNoticeTransactionData } from "../../../ant-data-service/abstract/transaction-data/ApprovePrimaryNameNoticeTransactionData";
import { IApprovePrimaryNameNoticeEvent } from "./abstract/IApprovePrimaryNameNoticeEvent";
import { ANTEvent } from "./ANTEvent";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class ApprovePrimaryNameNoticeEvent extends ANTTransactionDataEvent<ApprovePrimaryNameNoticeTransactionData> implements IApprovePrimaryNameNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
}
