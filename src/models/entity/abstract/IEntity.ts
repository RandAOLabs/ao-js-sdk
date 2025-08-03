import { EntityType } from "./EntityType";

export interface IEntity {
	getId(): string;
	getType(): EntityType;
}
