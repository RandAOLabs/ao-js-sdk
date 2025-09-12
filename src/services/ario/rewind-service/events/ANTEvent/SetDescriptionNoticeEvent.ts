import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { SetDescriptionNoticeTransactionData } from "../../../ant-data-service";
import { ISetDescriptionNoticeEvent } from "./abstract";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class SetDescriptionNoticeEvent extends ANTTransactionDataEvent<SetDescriptionNoticeTransactionData> implements ISetDescriptionNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}

	async getDescription(): Promise<string> {
		const noticeData = await this.getNoticeData();
		return noticeData.Description;
	}
}
