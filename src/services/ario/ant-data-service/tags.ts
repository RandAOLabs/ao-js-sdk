import { Tag } from "../../../core/common/types";

const ACTION_TAG_NAME = "Action"
const NAME_TAG_NAME = "Name"
const FROM_PROCESS_TAG_NAME = "From-Process"

// Type helper to ensure all values are Tags or Tag-generating functions while maintaining IntelliSense
type TagRecord<T extends Record<string, Tag | ((value: string) => Tag)>> = T;

export const ANT_TAGS = {
	ACTION: {
		STATE_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "State-Notice"
		},
		//
		NAME: (value: string) => {
			return { name: NAME_TAG_NAME, value: value }
		},
		FROM_PROCESS: (processId: string) => {
			return { name: FROM_PROCESS_TAG_NAME, value: processId }
		},
	} satisfies TagRecord<Record<string, Tag | ((value: string) => Tag)>>
} as const
