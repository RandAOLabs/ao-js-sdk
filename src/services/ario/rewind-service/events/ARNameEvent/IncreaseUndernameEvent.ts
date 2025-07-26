import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { CurrencyAmount } from "../../../../../models/currency/CurrencyAmount";
import { IncreaseUndernameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/IncreaseUndernameNoticeTransactionData";
import { IIncreaseUndernameEvent } from "./abstract/IIncreaseUndernameEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARIO_TOKEN } from "../../../../../processes/maps/currencies";
import { ARNameTransactionDataEvent } from "./ARNameTransactionDataEvent";

export class IncreaseUndernameEvent extends ARNameTransactionDataEvent<IncreaseUndernameNoticeTransactionData> implements IIncreaseUndernameEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}

	async getTotalFee(): Promise<CurrencyAmount> {
		const notice = await this.getNoticeData();
		return new CurrencyAmount(BigInt(notice.totalFee), ARIO_TOKEN.decimals);
	}

	async getPayer(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.fundingPlan.address;
	}

	async getType(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.record.type;
	}

	async getStartTime(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.record.startTimestamp;
	}

	async getUndernameLimit(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.record.undernameLimit;
	}

	async getRecordsCount(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.recordsCount;
	}
}
