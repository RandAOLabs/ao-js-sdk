import { SetRecordNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface ISetRecordEvent extends IANTEvent, ITransactionDataEvent<SetRecordNoticeTransactionData> {
	getTransactionId(): Promise<string>;
	getTtlSeconds(): Promise<number>;
	getSubDomain(): Promise<string>;
}
