import { Tag } from "../../../core/common/types";

const ACTION_TAG_NAME = "Action"
const NAME_TAG_NAME = "Name"
const TRANSACTION_ID_TAG_NAME = "Transaction-Id"
const FROM_PROCESS_TAG_NAME = "From-Process"
export const ANT_SUB_DOMAIN_TAG_NAME = "Sub-Domain"

// Type helper to ensure all values are Tags or Tag-generating functions while maintaining IntelliSense
type TagRecord<T extends Record<string, Tag | ((value: string) => Tag)>> = T;

export const ANT_QUERY_TAGS = {
	ACTION: {
		STATE: {
			name: ACTION_TAG_NAME,
			value: "State"
		}
	} satisfies TagRecord<Record<string, Tag | ((value: string) => Tag)>>,
	TRANSACTION_ID: (value: string) => {
		return { name: TRANSACTION_ID_TAG_NAME, value: value }
	},

} as const



export const ANT_NOTICE_TAGS = {
	ACTION: {
		STATE_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "State-Notice"
		},
		REASSIGN_NAME: {
			name: ACTION_TAG_NAME,
			value: "Reassign-Name-Notice"
		},
		RELEASE_NAME: {
			name: ACTION_TAG_NAME,
			value: "Release-Name-Notice"
		},
		APPROIVE_PRIMARY_NAME: {
			name: ACTION_TAG_NAME,
			value: "Approve-Primary-Name-Request"
		},
		REMOVE_PRIMARY_NAMES: {
			name: ACTION_TAG_NAME,
			value: "Remove-Primary-Names"
		},
		CREDIT_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Credit-Notice"
		},
		DEBIT_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Debit-Notice"
		},
		SET_RECORD_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Set-Record-Notice"
		}
	} satisfies TagRecord<Record<string, Tag | ((value: string) => Tag)>>,
	NAME: (value: string) => {
		return { name: NAME_TAG_NAME, value: value }
	},
	FROM_PROCESS: (processId: string) => {
		return { name: FROM_PROCESS_TAG_NAME, value: processId }
	},
} as const
