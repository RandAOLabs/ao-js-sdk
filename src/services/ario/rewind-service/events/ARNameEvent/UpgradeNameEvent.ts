import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { CurrencyAmount } from "../../../../../models/currency/CurrencyAmount";
import { UpgradeNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/UpgradeNameNoticeTransactionData";
import { IUpgradeNameEvent } from "./abstract/IUpgradeNameEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARIO_TOKEN } from "../../../../../processes/maps/currencies";

export class UpgradeNameEvent extends ARNameEvent implements IUpgradeNameEvent {
	private readonly transactionDataPromise: Promise<UpgradeNameNoticeTransactionData>;
	private readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for UpgradeNameEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<UpgradeNameNoticeTransactionData>(
			this.arweaveTransaction.id
		);
	}

	async getNoticeData(): Promise<UpgradeNameNoticeTransactionData> {
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

	async getUndernameLimit(): Promise<number> {
		const notice = await this.getNoticeData();
		return notice.undernameLimit;
	}

	async getName(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.name;
	}
}
