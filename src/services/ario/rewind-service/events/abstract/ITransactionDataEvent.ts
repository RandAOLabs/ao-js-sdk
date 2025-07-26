import { IARNSEvent } from "./IARNSEvent";

export interface ITransactionDataEvent<T = any> extends IARNSEvent {
	getNoticeData(): Promise<T>;
}
