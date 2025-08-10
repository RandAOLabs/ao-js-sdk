import { IEntity } from "../..";

export interface IProcess extends IEntity {
	getSchedulerId(): string;
}
