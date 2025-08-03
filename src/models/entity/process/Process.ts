import { EntityType } from "../abstract/EntityType";
import { Entity } from "../Entity";
import { IProcess } from "./abstract";

export class Process extends Entity implements IProcess {

	getType(): EntityType {
		return EntityType.PROCESS
	}
}
