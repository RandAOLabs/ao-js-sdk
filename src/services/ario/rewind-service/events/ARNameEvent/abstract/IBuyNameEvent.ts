import { CurrencyAmount } from "../../../../../../models/financial/currency";
import { BuyNameNoticeTransactionData } from "../../../../arns-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IARNameEvent } from "./IARNameEvent";

export interface IBuyNameEvent extends IARNameEvent, ITransactionDataEvent<BuyNameNoticeTransactionData> {
	getPurchasePrice(): Promise<CurrencyAmount>;
	getBuyer(): Promise<string>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number>;
	getPurchasedProcessId(): Promise<string>;
}
