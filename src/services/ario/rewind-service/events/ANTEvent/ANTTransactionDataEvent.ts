import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { IANTEvent } from "./abstract";
import { ITransactionDataEvent } from "../abstract";
import { ANTEvent } from "./ANTEvent";

export class ANTTransactionDataEvent<T = any> extends ANTEvent implements IANTEvent, ITransactionDataEvent<T> {
	protected readonly transactionDataPromise: Promise<T>;
	protected readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction)
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for ANTEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<T>(
			this.arweaveTransaction.id
		);
	}

	async getNoticeData(): Promise<T> {
		return await this.transactionDataPromise;

	}

	toString(): string {
		const timestamp = new Date(this.getEventTimeStamp() * 1000).toISOString();
		return `${this.constructor.name}{messageId: ${this.getEventMessageId()}, timestamp: ${timestamp}, antProcessId: ${this.getANTProcessId()}, arnsName: ${this.getARNSName()}}`;
	}
}
