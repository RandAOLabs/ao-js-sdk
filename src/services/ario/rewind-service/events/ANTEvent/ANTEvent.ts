import { Tags, TagUtils } from "../../../../../core";
import { FROM_PROCESS_TAG_NAME } from "../../../../credit-notices/constants";
import { ARNS_NAME_TAG_NAME } from "../../../../../models/ario/arns/tags";
import { IANTEvent } from "./abstract";
import { ARNSEvent } from "../ARNSEvent";

export class ANTEvent extends ARNSEvent implements IANTEvent {

	public getANTName(): string {
		return TagUtils.getTagValue(this.getTags(), ARNS_NAME_TAG_NAME)!;
	}

	public getANTProcessId(): string {
		return TagUtils.getTagValue(this.getTags(), FROM_PROCESS_TAG_NAME)!;
	}

	public getARNSName(): string {
		return TagUtils.getTagValue(this.getTags(), ARNS_NAME_TAG_NAME)!;
	}

	public toString(): string {
		const baseString = super.toString();
		// Remove the closing brace and add our additional properties
		const baseWithoutClosing = baseString.slice(0, -1);
		return `ANTEvent:${baseWithoutClosing}, antProcessId: ${this.getANTProcessId()}, arnsName: ${this.getARNSName()}}`;
	}

}
