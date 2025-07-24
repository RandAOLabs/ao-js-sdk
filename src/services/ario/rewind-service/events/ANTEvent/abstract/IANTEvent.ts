import { IARNSEvent } from "../../abstract/IARNSEvent";

export interface IANTEvent extends IARNSEvent {
	getANTProcessId(): string;
	getANTName(): string;
}
