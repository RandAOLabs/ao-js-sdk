import { EntityId, EntityType } from "./EntityType";

export interface IEntity {
	getId(): EntityId;
	getType(): EntityType;
}
