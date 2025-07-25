import { IARNSEvent } from "../../abstract/IARNSEvent";

export interface IARNameEvent extends IARNSEvent {
	getARNSProcessId(): string;
	getARNSName(): string;
}
