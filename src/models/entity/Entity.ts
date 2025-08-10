import { IEntity } from "./abstract";
import { EntityId, EntityType } from "./abstract/EntityType";

export abstract class Entity implements IEntity {

	public constructor(
		private readonly id: string
	) { }


	getId(): EntityId {
		return this.id
	}

	abstract getType(): EntityType;
}
