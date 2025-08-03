import { StateNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface IStateNoticeEvent extends IANTEvent, ITransactionDataEvent<StateNoticeTransactionData> {
	getOwner(): Promise<string>;
	getTotalSupply(): Promise<number>;
	getBalances(): Promise<Record<string, number>>;
	getRecords(): Promise<Record<string, { transactionId: string; ttlSeconds: number }>>;
	getKeywords(): Promise<string[]>;
	getDenomination(): Promise<number>;
	getControllers(): Promise<string[]>;
	getLogo(): Promise<string>;
	getInitialized(): Promise<boolean>;
	getDescription(): Promise<string>;
	getName(): Promise<string>;
	getTicker(): Promise<string>;
}
