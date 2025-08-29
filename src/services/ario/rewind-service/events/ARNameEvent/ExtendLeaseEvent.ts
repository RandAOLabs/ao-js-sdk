import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { CurrencyAmount } from "../../../../../models/financial/currency/CurrencyAmount";
import { ExtendLeaseNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/ExtendLeaseNoticeTransactionData";
import { IExtendLeaseEvent } from "./abstract/IExtendLeaseEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARIO_TOKEN } from "../../../../../constants/maps/currencies";
import { ARNameTransactionDataEvent } from "./ARNameTransactionDataEvent";

export class ExtendLeaseEvent extends ARNameTransactionDataEvent<ExtendLeaseNoticeTransactionData> implements IExtendLeaseEvent {
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

	async getEndTime(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.record.endTimestamp;
	}

	async getUndernameLimit(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.record.undernameLimit;
	}
}
