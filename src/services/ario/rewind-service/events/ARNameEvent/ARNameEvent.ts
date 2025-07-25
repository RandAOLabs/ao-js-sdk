import { Tags, TagUtils } from "../../../../../core";
import { ArweaveTransaction } from "../../../../../core/arweave/abstract/types";
import { FROM_PROCESS_TAG_NAME } from "../../../../credit-notices/constants";
import { ARNS_NAME_TAG_NAME } from "../../../../../models/ario/arns/tags";
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

	toString(): string {
		const timestamp = new Date(this.getEventTimeStamp() * 1000).toISOString();
		return `${this.constructor.name}{messageId: ${this.getEventMessageId()}, timestamp: ${timestamp}, arnsName: ${this.getARNSName()}, processId: ${this.getARNSProcessId()}}`;
	}

	// Private //
	private getTags(): Tags {
		return this.arweaveTransaction.tags!
	}
}
