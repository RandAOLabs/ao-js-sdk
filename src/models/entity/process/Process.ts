import { TagUtils } from "../../../core";
import { ArweaveTransaction } from "../../../core/arweave/abstract/types";
import { SYSTEM_SCHEDULER_TAG_NAME } from "../../../core/common/tags";
import { EntityType } from "../abstract/EntityType";
import { Entity } from "../Entity";
import { IProcess } from "./abstract";

export class Process extends Entity implements IProcess {
	constructor(
		entityId: string,
		private readonly schedulerId?: string
	) {
		super(entityId)
	}
	//Constructors
	public static from(transaction: ArweaveTransaction): IProcess {
		const schedulerId = TagUtils.getTagValue(transaction.tags!, SYSTEM_SCHEDULER_TAG_NAME)!
		return new Process(transaction.id!, schedulerId)
	}
	//Constructors


	getSchedulerId(): string {
		return this.schedulerId || ""
	}

	getType(): EntityType {
		return EntityType.PROCESS
	}
}
