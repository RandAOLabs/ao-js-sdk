import { IARNSEvent } from "./IARNSNameEvent";

export interface IARNSNameEvent extends IARNSEvent {
	getARNSUnderName(): string;
}
