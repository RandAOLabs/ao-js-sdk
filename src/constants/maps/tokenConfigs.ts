import { EntityId } from "../../models/entity/abstract/EntityType";
import { TokenConfig } from "../../models/financial/token-balance";
import { COMMUNITY_TOKENS } from "../processIds/community_tokens";
import { ARCAO } from "../processIds/arcao";
import { DEFI } from "../processIds/defi";

export const AO_TOKEN_CONFIG: TokenConfig = {
	logoTxId: "UkS-mdoiG8hcAClhKK8ch4ZhEzla0mCPDOix9hpdSFE",
	name: "AO",
	tokenProcessId: "0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc",
	denomination: 12
}

export const WAR_TOKEN_CONFIG: TokenConfig = {
	logoTxId: "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10", // Using wrapped arweave logo as placeholder
	name: "WAR",
	tokenProcessId: DEFI.WRAPPED_ARWEAVE,
	denomination: 12
}

export const TRUNK_TOKEN_CONFIG: TokenConfig = {
	logoTxId: "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ", // Using process ID as placeholder
	name: "TRUNK",
	tokenProcessId: COMMUNITY_TOKENS.TRUNK,
	denomination: 3
}

export const GAME_TOKEN_CONFIG: TokenConfig = {
	logoTxId: "s6jcB3ctSbiDNwR-paJgy5iOAhahXahLul8exSLHbGE", // Using process ID as placeholder
	name: "GAME",
	tokenProcessId: ARCAO.GAME_TOKEN,
	denomination: 12
}

export const NAB_TOKEN_CONFIG: TokenConfig = {
	logoTxId: "OsK9Vgjxo0ypX_HLz2iJJuh4hp3I80yA9KArsJjIloU", // Using process ID as placeholder
	name: "NAB",
	tokenProcessId: COMMUNITY_TOKENS.NUMBER_ALWAYS_BIGGER,
	denomination: 12
}

const TOKEN_CONFIGS: TokenConfig[] = [
	AO_TOKEN_CONFIG,
	WAR_TOKEN_CONFIG,
	TRUNK_TOKEN_CONFIG,
	GAME_TOKEN_CONFIG,
	NAB_TOKEN_CONFIG
]

export function getTokenConfig(processId: EntityId): TokenConfig | undefined {
	return TOKEN_CONFIGS.filter((config: TokenConfig) => config.tokenProcessId == processId)[0]
}

export function getTokenConfigByName(name: string): TokenConfig | undefined {
	return TOKEN_CONFIGS.find((config: TokenConfig) => config.name === name)
}
