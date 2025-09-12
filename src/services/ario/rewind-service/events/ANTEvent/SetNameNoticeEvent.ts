import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { SetNameNoticeTransactionData } from "../../../ant-data-service";
import { ISetNameNoticeEvent } from "./abstract";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class SetNameNoticeEvent extends ANTTransactionDataEvent<SetNameNoticeTransactionData> implements ISetNameNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}

	async getName(): Promise<string> {
		const noticeData = await this.getNoticeData();
		return noticeData.Name;
	}
}
