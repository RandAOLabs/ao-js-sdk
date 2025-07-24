import { IARNSNameEvent } from "./IARNSNameEvent";

export interface IARNSUndernameNameEvent extends IARNSNameEvent {
	getARNSUnderName(): string;
}
