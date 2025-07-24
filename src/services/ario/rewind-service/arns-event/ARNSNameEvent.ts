import { Tags, TagUtils } from "../../../../core";
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { FROM_PROCESS_TAG_NAME } from "../../../credit-notices/constants";
import { ARNS_NAME_TAG_NAME, ARNS_TAGS } from "../../arns-data-service/tags";
import { FullARNSName } from "../../shared/arns";
import { IARNSNameEvent } from "./abstract/IARNSNameEvent";

export class ARNSNameEvent implements IARNSNameEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {
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
