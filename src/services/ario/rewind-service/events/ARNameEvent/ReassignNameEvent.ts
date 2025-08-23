import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { CurrencyAmount } from "../../../../../models/currency/CurrencyAmount";
import { ReassignNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/ReassignNameNoticeTransactionData";
import { IReassignNameEvent } from "./abstract/IReassignNameEvent";
import { ARIO_TOKEN } from "../../../../../constants/maps/currencies";
import { ARNameTransactionDataEvent } from "./ARNameTransactionDataEvent";

export class ReassignNameEvent extends ARNameTransactionDataEvent<ReassignNameNoticeTransactionData> implements IReassignNameEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}

	async getReassignedProcessId(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.processId;
	}

	async getPurchasePrice(): Promise<CurrencyAmount> {
		const notice = await this.getNoticeData();
		return new CurrencyAmount(BigInt(notice.purchasePrice), ARIO_TOKEN.decimals);
	}

	async getType(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.type;
	}

	async getStartTime(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.startTimestamp;
	}

	async getEndTime(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.endTimestamp;
	}

	async getUndernameLimit(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.undernameLimit;
	}
}
