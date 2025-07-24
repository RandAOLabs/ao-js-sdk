import { CurrencyAmount } from "../../../../../../models/currency";
import { BuyNameNoticeTransactionData } from "../../../../arns-data-service";
import { IARNameEvent } from "./IARNameEvent";

export interface IBuyNameEvent extends IARNameEvent {
	getNotice(): Promise<BuyNameNoticeTransactionData>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getBuyer(): Promise<string>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
}
