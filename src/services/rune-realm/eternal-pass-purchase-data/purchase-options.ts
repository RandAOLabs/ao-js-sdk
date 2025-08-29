import {
	AO_TOKEN_CONFIG,
	WAR_TOKEN_CONFIG,
	TRUNK_TOKEN_CONFIG,
	GAME_TOKEN_CONFIG,
	NAB_TOKEN_CONFIG
} from "../../../constants/maps/tokenConfigs";
import { TokenConfig } from "../../../models/token-balance";

export enum PurchaseOption {
	AO,
	WAR,
	TRUNK,
	GAME,
	NAB
}

export const purchaseOptionConfigs: Record<PurchaseOption, TokenConfig> = {
	[PurchaseOption.AO]: AO_TOKEN_CONFIG,
	[PurchaseOption.WAR]: WAR_TOKEN_CONFIG,
	[PurchaseOption.TRUNK]: TRUNK_TOKEN_CONFIG,
	[PurchaseOption.GAME]: GAME_TOKEN_CONFIG,
	[PurchaseOption.NAB]: NAB_TOKEN_CONFIG
}

export function getTokenConfigForPurchaseOption(option: PurchaseOption): TokenConfig {
	return purchaseOptionConfigs[option];
}
