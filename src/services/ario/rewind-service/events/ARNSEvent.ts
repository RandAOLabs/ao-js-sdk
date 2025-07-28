
import { Tags, TagUtils } from "../../../../core";
import { ArweaveTransaction } from "../../../../core/arweave/abstract/types";
import { IARNSEvent } from "./abstract";


export class ARNSEvent implements IARNSEvent {
	constructor(
		protected readonly arweaveTransaction: ArweaveTransaction
	) {

	}
	public getInitiator(): string {
		return this.getNotified()
	}

	public getNotified(): string {
		return this.arweaveTransaction.recipient!
	}

	public getEventMessageId(): string {
		return this.arweaveTransaction.id!
	}

	public getEventTimeStamp(): number {
		return this.arweaveTransaction.block?.timestamp!
	}

	public toString(): string {
		const timestamp = new Date(this.getEventTimeStamp() * 1000).toISOString();
		return `${this.constructor.name}{messageId: ${this.getEventMessageId()}, timestamp: ${timestamp}, initiator: ${this.getInitiator()}}`;
	}


	// Private //
	protected getTags(): Tags {
		return this.arweaveTransaction.tags!
	}

}
