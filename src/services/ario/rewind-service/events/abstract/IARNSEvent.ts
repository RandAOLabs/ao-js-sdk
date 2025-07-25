
export interface IARNSEvent {
	getEventTimeStamp(): number;
	getEventMessageId(): string;
	toString(): string;
}
