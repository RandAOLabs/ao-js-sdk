import { IEntity } from "../../../models";

export interface IEntityService {
	getEntity(id: string): Promise<IEntity>;
}
