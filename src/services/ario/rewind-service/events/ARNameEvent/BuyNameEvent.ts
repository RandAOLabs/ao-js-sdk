import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { CurrencyAmount } from "../../../../../models/currency/CurrencyAmount";
import { BuyNameNoticeTransactionData } from "../../../arns-data-service/abstract/transaction-data/BuyNameNoticeTransactionData";
import { IBuyNameEvent } from "./abstract/IBuyNameEvent";
import { ARNameEvent } from "./ARNameEvent";
import { ARIO_TOKEN } from "../../../../../constants/maps/currencies";
import { ARNameTransactionDataEvent } from "./ARNameTransactionDataEvent";

export class BuyNameEvent extends ARNameTransactionDataEvent<BuyNameNoticeTransactionData> implements IBuyNameEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
		super(arweaveTransaction);
	}

	async getPurchasedProcessId(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.processId
	}

	async getPurchasePrice(): Promise<CurrencyAmount> {
		const notice = await this.getNoticeData();
		// Assuming the purchase price is in the smallest unit (like wei for ETH)
		// and using 12 decimals as a reasonable default for AR tokens
		return new CurrencyAmount(BigInt(notice.purchasePrice), ARIO_TOKEN.decimals);
	}

	async getBuyer(): Promise<string> {
		const notice = await this.getNoticeData();
		return notice.fundingPlan.address;
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
}
