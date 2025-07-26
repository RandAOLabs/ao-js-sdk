import { StateNoticeTransactionData } from "../../../../ant-data-service";
import { ITransactionDataEvent } from "../../abstract";
import { IANTEvent } from "./IANTEvent";

export interface IStateNoticeEvent extends IANTEvent, ITransactionDataEvent<StateNoticeTransactionData> {
	// TODO: Add specific methods for StateNotice event
}
