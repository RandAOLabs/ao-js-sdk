import { EntityId } from "../../../models/entity/abstract/EntityType";
import { IToken } from "./IToken";

export interface ITokenFactory {
	from(processId: EntityId): IToken
}
