import { IARNSEvent } from "../../abstract/IARNSEvent";
import { AntState } from "../../../../ant-data-service/types";

export interface IANTEvent extends IARNSEvent {
	getANTProcessId(): string;
	getANTName(): Promise<string>;
	getNoticeData(): Promise<AntState>;
}
