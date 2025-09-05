import { TagUtils } from "../../../../../core";
import { FROM_PROCESS_TAG_NAME } from "../../../../credit-notices/constants";
import { ARNS_NAME_TAG_NAME } from "../../../../../models/ario/arns/tags";
import { IARNameEvent } from "./abstract/IARNameEvent";
import { ARNSEvent } from "../ARNSEvent";

export class ARNameEvent extends ARNSEvent implements IARNameEvent {

	public getARNSProcessId(): string {
		return TagUtils.getTagValue(this.getTags(), FROM_PROCESS_TAG_NAME)!;
	}

	public getARNSName(): string {
		return TagUtils.getTagValue(this.getTags(), ARNS_NAME_TAG_NAME)!;
	}

	public toString(): string {
		const baseString = super.toString();
		// Remove the closing brace and add our additional properties
		const baseWithoutClosing = baseString.slice(0, -1);
		return `ARNameEvent:${baseWithoutClosing}, arnsName: ${this.getARNSName()}, processId: ${this.getARNSProcessId()}}`;
	}
}
