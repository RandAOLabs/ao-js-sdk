import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { ReturnedNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/ReturnedNameNoticeTransactionData";
import { IReturnedNameEvent } from "./abstract/IReturnedNameEvent";
import { ARNameEvent } from "./ARNameEvent";

export class ReturnedNameEvent extends ARNameEvent implements IReturnedNameEvent {
	private readonly transactionDataPromise: Promise<ReturnedNameNoticeTransactionData>;
	private readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for ReturnedNameEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<ReturnedNameNoticeTransactionData>(
			this.arweaveTransaction.id
		);
	}

	async getNoticeData(): Promise<ReturnedNameNoticeTransactionData> {
		return await this.transactionDataPromise;
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
