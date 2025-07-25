import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { CurrencyAmount } from "../../../../../models/currency/CurrencyAmount";
import { ReassignNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/ReassignNameNoticeTransactionData";
import { IReassignNameEvent } from "./abstract/IReassignNameEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARIO_TOKEN } from "../../../../../processes/maps/currencies";

export class ReassignNameEvent extends ARNameEvent implements IReassignNameEvent {
	private readonly transactionDataPromise: Promise<ReassignNameNoticeTransactionData>;
	private readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for ReassignNameEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<ReassignNameNoticeTransactionData>(
			this.arweaveTransaction.id
		);
	}
	async getReassignedProcessId(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.processId;
	}

	async getNoticeData(): Promise<ReassignNameNoticeTransactionData> {
		return await this.transactionDataPromise;
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
