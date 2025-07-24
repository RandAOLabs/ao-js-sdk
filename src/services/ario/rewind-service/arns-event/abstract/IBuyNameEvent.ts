import { CurrencyAmount } from "../../../../../models/currency";
import { BuyNameNoticeTransactionData } from "../../../arns-data-service";
import { IARNSNameEvent } from "./IARNSNameEvent";

export interface IBuyNameEvent extends IARNSNameEvent {
	getNotice(): Promise<BuyNameNoticeTransactionData>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getBuyer(): Promise<string>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
}
