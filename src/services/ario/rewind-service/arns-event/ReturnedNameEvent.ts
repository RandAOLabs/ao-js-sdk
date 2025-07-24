import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../core/arweave/ArweaveDataService";
import { ReturnedNameNoticeTransactionData } from "../../arns-data-service/abstract/transaction-data/ReturnedNameNoticeTransactionData";
import { IReturnedNameEvent } from "./abstract/IReturnedNameEvent";
import { ARNSNameEvent } from "./ARNSNameEvent";

export class ReturnedNameEvent extends ARNSNameEvent implements IReturnedNameEvent {
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

	async getNotice(): Promise<ReturnedNameNoticeTransactionData> {
		return await this.transactionDataPromise;
	}

	async getInitiator(): Promise<string> {
		const notice = await this.getNotice();
		return notice.initiator;
	}

	async getStartTime(): Promise<number> {
		const notice = await this.getNotice();
		return notice.startTimestamp;
	}

	async getEndTime(): Promise<number> {
		const notice = await this.getNotice();
		return notice.endTimestamp;
	}

	async getName(): Promise<string> {
		const notice = await this.getNotice();
		return notice.name;
	}
}
