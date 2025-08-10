

export const BOTEGA_TOKEN_A_TAG_NAME = "Token-A"
export const BOTEGA_TOKEN_B_TAG_NAME = "Token-B"


export const BOTEGA_TAGS = {
	TOKEN_A: (processId: string) => {
		return { name: BOTEGA_TOKEN_A_TAG_NAME, value: processId }
	},
	TOKEN_B: (processId: string) => {
		return { name: BOTEGA_TOKEN_B_TAG_NAME, value: processId }
	},
} as const
