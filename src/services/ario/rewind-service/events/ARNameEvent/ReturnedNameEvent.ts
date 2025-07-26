import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { ReturnedNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/ReturnedNameNoticeTransactionData";
import { IReturnedNameEvent } from "./abstract/IReturnedNameEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARNameTransactionDataEvent } from "./ARNameTransactionDataEvent";

export class ReturnedNameEvent extends ARNameTransactionDataEvent<ReturnedNameNoticeTransactionData> implements IReturnedNameEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}

	async getInitiator(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.initiator;
	}

	async getStartTime(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.startTimestamp;
	}

	async getEndTime(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.endTimestamp;
	}

	async getName(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.name;
	}
}
