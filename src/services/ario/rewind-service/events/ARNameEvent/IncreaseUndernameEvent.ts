import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { CurrencyAmount } from "../../../../../models/currency/CurrencyAmount";
import { IncreaseUndernameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/IncreaseUndernameNoticeTransactionData";
import { IIncreaseUndernameEvent } from "./abstract/IIncreaseUndernameEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARIO_TOKEN } from "../../../../../processes/maps/currencies";

export class IncreaseUndernameEvent extends ARNameEvent implements IIncreaseUndernameEvent {
	private readonly transactionDataPromise: Promise<IncreaseUndernameNoticeTransactionData>;
	private readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for IncreaseUndernameEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<IncreaseUndernameNoticeTransactionData>(
			this.arweaveTransaction.id
		);
	}

	async getNotice(): Promise<IncreaseUndernameNoticeTransactionData> {
		return await this.transactionDataPromise;
	}

	async getTotalFee(): Promise<CurrencyAmount> {
		const notice = await this.getNotice();
		return new CurrencyAmount(BigInt(notice.totalFee), ARIO_TOKEN.decimals);
	}

	async getPayer(): Promise<string> {
		const notice = await this.getNotice();
		return notice.fundingPlan.address;
	}

	async getType(): Promise<string> {
		const notice = await this.getNotice();
		return notice.record.type;
	}

	async getStartTime(): Promise<number> {
		const notice = await this.getNotice();
		return notice.record.startTimestamp;
	}

	async getUndernameLimit(): Promise<number> {
		const notice = await this.getNotice();
		return notice.record.undernameLimit;
	}

	async getRecordsCount(): Promise<number> {
		const notice = await this.getNotice();
		return notice.recordsCount;
	}
}
