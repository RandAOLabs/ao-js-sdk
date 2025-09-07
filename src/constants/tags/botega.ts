

export const BOTEGA_TOKEN_A_TAG_NAME = "Token-A"
export const BOTEGA_TOKEN_B_TAG_NAME = "Token-B"
export const BOTEGA_AMM_FACTORY_TAG_NAME = "AMM-Factory"

export const BOTEGA_TAGS = {
	AMM_FACTORY: (processId: string) => {
		return { name: BOTEGA_AMM_FACTORY_TAG_NAME, value: processId }
	},
	TOKEN_A: (processId: string) => {
		return { name: BOTEGA_TOKEN_A_TAG_NAME, value: processId }
	},
	TOKEN_B: (processId: string) => {
		return { name: BOTEGA_TOKEN_B_TAG_NAME, value: processId }
	},
} as const
