import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { SetTickerNoticeTransactionData } from "../../../ant-data-service";
import { ISetTickerNoticeEvent } from "./abstract";
import { ANTTransactionDataEvent } from "./ANTTransactionDataEvent";

export class SetTickerNoticeEvent extends ANTTransactionDataEvent<SetTickerNoticeTransactionData> implements ISetTickerNoticeEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}

	async getTicker(): Promise<string> {
		const noticeData = await this.getNoticeData();
		return noticeData.Ticker;
	}
}
