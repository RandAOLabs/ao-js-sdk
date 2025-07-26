import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { StateNoticeTransactionData } from "../../../ant-data-service/abstract/transaction-data/StateNoticeTransactionData";
import { IStateNoticeEvent } from "./abstract/IStateNoticeEvent";
import { ANTEvent } from "./ANTEvent";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class StateNoticeEvent extends ANTTransactionDataEvent<StateNoticeTransactionData> implements IStateNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}
}
