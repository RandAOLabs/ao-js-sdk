import { Tags } from "../../../core";
import { CurrencyAmount } from "../../../models";
import { EntityId } from "../../../models/entity/abstract/EntityType";
import { TokenConfig } from "../../../models/token-balance";

export interface IToken {
	getBalance(entityId: EntityId): Promise<CurrencyAmount>;
	transfer(recipient: EntityId, quantity: CurrencyAmount, forwardedTags?: Tags): Promise<boolean>;
	getDecimals(): Promise<number>;
	getTokenConfig(): Promise<TokenConfig>
}
