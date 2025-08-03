import { IANTEvent } from "./IANTEvent";

export interface IApprovePrimaryNameNoticeEvent extends IANTEvent {
	getApprovedId(): string;
}
