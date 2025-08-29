import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { CurrencyAmount } from "../../../../../models/financial/currency/CurrencyAmount";
import { UpgradeNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/UpgradeNameNoticeTransactionData";
import { IUpgradeNameEvent } from "./abstract/IUpgradeNameEvent";
import { ARIO_TOKEN } from "../../../../../constants/maps/currencies";
import { ARNameTransactionDataEvent } from "./ARNameTransactionDataEvent";

export class UpgradeNameEvent extends ARNameTransactionDataEvent<UpgradeNameNoticeTransactionData> implements IUpgradeNameEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
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

	async getUndernameLimit(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.undernameLimit;
	}

	async getName(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.name;
	}
}
