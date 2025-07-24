import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { CurrencyAmount } from "../../../../../models/currency/CurrencyAmount";
import { ExtendLeaseNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/ExtendLeaseNoticeTransactionData";
import { IExtendLeaseEvent } from "./abstract/IExtendLeaseEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARIO_TOKEN } from "../../../../../processes/maps/currencies";

export class ExtendLeaseEvent extends ARNameEvent implements IExtendLeaseEvent {
	private readonly transactionDataPromise: Promise<ExtendLeaseNoticeTransactionData>;
	private readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for ExtendLeaseEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<ExtendLeaseNoticeTransactionData>(
			this.arweaveTransaction.id
		);
	}

	async getNotice(): Promise<ExtendLeaseNoticeTransactionData> {
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

	async getEndTime(): Promise<number> {
		const notice = await this.getNotice();
		return notice.record.endTimestamp;
	}

	async getUndernameLimit(): Promise<number> {
		const notice = await this.getNotice();
		return notice.record.undernameLimit;
	}
}
