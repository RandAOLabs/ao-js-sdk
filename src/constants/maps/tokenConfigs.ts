import { EntityId } from "../../models/entity/abstract/EntityType";
import { TokenConfig } from "../../models/token-balance";

export const AO_TOKEN_CONFIG: TokenConfig = {

	logoTxId: "UkS-mdoiG8hcAClhKK8ch4ZhEzla0mCPDOix9hpdSFE",

	name: "AO",

	tokenProcessId: "0syT13r0s0tgPmIed95bJnuSqaD29HQNN8D3ElLSrsc",

	denomination: 12
}



const TOKEN_CONFIGS: TokenConfig[] = [
	AO_TOKEN_CONFIG
]


export function getTokenConfig(processId: EntityId): TokenConfig | undefined {
	return TOKEN_CONFIGS.filter((config: TokenConfig) => config.tokenProcessId == processId)[0]
}
