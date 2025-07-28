
export interface IARNSEvent {
	getEventTimeStamp(): number;
	getEventMessageId(): string;
	getNotified(): string
	getInitiator(): string;
	toString(): string;
}
