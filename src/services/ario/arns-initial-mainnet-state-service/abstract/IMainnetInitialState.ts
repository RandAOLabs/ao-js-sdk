import { CurrencyAmount } from "../../../../models/financial/currency/CurrencyAmount";
import { PreMainnetRecord } from "../data/pre-mainnet-data";

export interface IMainnetInitialState {
	getEventTimeStamp(): number;
	toString(): string;
	getProcessId(): Promise<string>;
	getPurchasePrice(): Promise<CurrencyAmount>;
	getType(): Promise<string>;
	getStartTime(): Promise<number>;
	getEndTime(): Promise<number | undefined>;
	getUndernameLimit(): Promise<number>;
	getName(): string;
	getPreMainnetRecord(): PreMainnetRecord;
}
