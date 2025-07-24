import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { IArweaveDataService } from "../../../../../core/arweave/abstract/IArweaveDataService";
import { ArweaveDataService } from "../../../../../core/arweave/ArweaveDataService";
import { CurrencyAmount } from "../../../../../models/currency/CurrencyAmount";
import { BuyNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/BuyNameNoticeTransactionData";
import { IBuyNameEvent } from "./abstract/IBuyNameEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARIO_TOKEN } from "../../../../../processes/maps/currencies";

export class BuyNameEvent extends ARNameEvent implements IBuyNameEvent {
	private readonly transactionDataPromise: Promise<BuyNameNoticeTransactionData>;
	private readonly arweaveDataService: IArweaveDataService;

	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
		this.arweaveDataService = ArweaveDataService.autoConfiguration();

		if (!this.arweaveTransaction.id) {
			throw new Error('Transaction ID is required for BuyNameEvent');
		}

		this.transactionDataPromise = this.arweaveDataService.getTransactionData<BuyNameNoticeTransactionData>(
			this.arweaveTransaction.id
		);
	}

	async getNotice(): Promise<BuyNameNoticeTransactionData> {
		return await this.transactionDataPromise;
	}

	async getPurchasePrice(): Promise<CurrencyAmount> {
		const notice = await this.getNotice();
		// Assuming the purchase price is in the smallest unit (like wei for ETH)
		// and using 12 decimals as a reasonable default for AR tokens
		return new CurrencyAmount(BigInt(notice.purchasePrice), ARIO_TOKEN.decimals);
	}

	async getBuyer(): Promise<string> {
		const notice = await this.getNotice();
		return notice.fundingPlan.address;
	}

	async getType(): Promise<string> {
		const notice = await this.getNotice();
		return notice.type;
	}

	async getStartTime(): Promise<number> {
		const notice = await this.getNotice();
		return notice.startTimestamp;
	}

	async getEndTime(): Promise<number> {
		const notice = await this.getNotice();
		return notice.endTimestamp;
	}
}
