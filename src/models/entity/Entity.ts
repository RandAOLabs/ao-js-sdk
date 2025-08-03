import { IEntity } from "./abstract";
import { EntityType } from "./abstract/EntityType";

export abstract class Entity implements IEntity {

	public constructor(
		private readonly id: string
	) { }


	getId(): string {
		return this.id
	}

	abstract getType(): EntityType;
}
