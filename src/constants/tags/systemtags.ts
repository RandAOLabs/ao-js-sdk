

export const FROM_PROCESS_TAG_NAME = "From-Process"

export const SYSTEM_TAGS = {
	FROM_PROCESS: (processId: string) => {
		return { name: FROM_PROCESS_TAG_NAME, value: processId }
	},
} as const
