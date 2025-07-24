import { Tags, TagUtils } from "../../../../../core";
import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { FROM_PROCESS_TAG_NAME } from "../../../../credit-notices/constants";
import { ARNS_NAME_TAG_NAME } from "../../../arns-data-service/tags";
import { IARNameEvent } from "./abstract/IARNameEvent";

export class ARNameEvent implements IARNameEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
	}
	getEventMessageId(): string {
		return this.arweaveTransaction.id!
	}
	getEventTimeStamp(): number {
		return this.arweaveTransaction.block?.timestamp!
	}

	getARNSProcessId(): string {
		return TagUtils.getTagValue(this.getTags(), FROM_PROCESS_TAG_NAME)!;
	}

	getARNSName(): string {
		return TagUtils.getTagValue(this.getTags(), ARNS_NAME_TAG_NAME)!;
	}

	// Private //
	private getTags(): Tags {
		return this.arweaveTransaction.tags!
	}
}
