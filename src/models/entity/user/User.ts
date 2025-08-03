import { EntityType } from "../abstract/EntityType";
import { Entity } from "../Entity";
import { IUser } from "./abstract";

export class User extends Entity implements IUser {

	getType(): EntityType {
		return EntityType.USER
	}
}
