import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { RemovePrimaryNamesNoticeTransactionData } from "../../../ant-data-service/abstract/transaction-data/RemovePrimaryNamesNoticeTransactionData";
import { IRemovePrimaryNamesNoticeEvent } from "./abstract/IRemovePrimaryNamesNoticeEvent";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class RemovePrimaryNamesNoticeEvent extends ANTTransactionDataEvent<RemovePrimaryNamesNoticeTransactionData> implements IRemovePrimaryNamesNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
}
