import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { CurrencyAmount } from "../../../../../models/currency/CurrencyAmount";
import { RecordNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/RecordNoticeTransactionData";
import { IRecordEvent } from "./abstract/IRecordEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARIO_TOKEN } from "../../../../../processes/maps/currencies";

export class RecordEvent extends ARNameEvent implements IRecordEvent {
	private readonly transactionDataPromise: Promise<RecordNoticeTransactionData>;
	private readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for RecordEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<RecordNoticeTransactionData>(
			this.arweaveTransaction.id
		);
	}

	async getNotice(): Promise<RecordNoticeTransactionData> {
		return await this.transactionDataPromise;
	}

	async getPurchasePrice(): Promise<CurrencyAmount> {
		const notice = await this.getNotice();
		return new CurrencyAmount(BigInt(notice.purchasePrice), ARIO_TOKEN.decimals);
	}

	async getType(): Promise<string> {
		const notice = await this.getNotice();
		return notice.type;
	}

	async getStartTime(): Promise<number> {
		const notice = await this.getNotice();
		return notice.startTimestamp;
	}

	async getUndernameLimit(): Promise<number> {
		const notice = await this.getNotice();
		return notice.undernameLimit;
	}
}
