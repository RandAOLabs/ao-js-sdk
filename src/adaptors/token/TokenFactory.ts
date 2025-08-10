import { getCurrencyMap } from "../../constants/maps/currencies";
import { Process } from "../../models";
import { ITokenFactory } from "./abstract/ITokenFactory";
import { EntityId } from "../../models/entity/abstract/EntityType";
import { staticImplements } from "../../utils";
import { IToken } from "./abstract/IToken";
import { KnownConfigToken } from "./KnownConfigToken";
import { Token } from "./Token";
import { getTokenConfig } from "../../constants/maps/tokenConfigs";

@staticImplements<ITokenFactory>()
export class TokenFactory {
	static from(processId: EntityId): IToken {
		const config = getTokenConfig(processId)
		if (config) {
			return new KnownConfigToken(config)
		}
		return Token.fromId(processId)
	}
}
