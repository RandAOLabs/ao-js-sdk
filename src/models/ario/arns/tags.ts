import { Tag } from "../../../core/common/types";

export const ARNS_ACTION_TAG_NAME = "Action"
export const ARNS_NAME_TAG_NAME = "Name"
export const ARNS_FROM_PROCESS_TAG_NAME = "From-Process"

// Type helper to ensure all values are Tags or Tag-generating functions while maintaining IntelliSense
type TagRecord<T extends Record<string, Tag | ((value: string) => Tag)>> = T;

export const ARNS_QUERY_TAGS = {
	ACTION: {
		RECORD: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Record"
		},
		RECORDS: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Records"
		},
		PAGINATED_RECORDS: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Paginated-Records"
		},
		BUYNAME: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Buy-Name"
		},
		UPGRADENAME: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Upgrade-Name"
		},
		EXTENDLEASE: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Extend-Lease"
		},
		INCREASEUNDERNAMELIMIT: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Increase-Undername-Limit"
		},
		REASSIGNNAME: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Reassign-Name"
		},
		RELEASENAME: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Release-Name"
		},
		RESERVEDNAMES: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Reserved-Names"
		},
		RESERVEDNAME: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Reserved-Name"
		},
		TOKENCOST: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Token-Cost"
		},
		COSTDETAILS: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Cost-Details"
		},
		REGISTRATIONFEES: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Registration-Fees"
		},
		RETURNEDNAMES: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Returned-Names"
		},
		RETURNEDNAME: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Returned-Name"
		},
		ALLOWDELEGATES: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Allow-Delegates"
		},
		DISALLOWDELEGATES: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Disallow-Delegates"
		},
		DELEGATIONS: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Delegations"
		},
	} satisfies TagRecord<Record<string, Tag | ((value: string) => Tag)>>,
	NAME: (value: string) => {
		return { name: ARNS_NAME_TAG_NAME, value: value }
	},
}

export const ARNS_RESPONSE_TAGS = {
	ACTION: {
		//
		RECORD_NOTICE: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Record-Notice"
		},
		BUYNAME_NOTICE: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Buy-Name-Notice"
		},
		UPGRADENAME_NOTICE: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Upgrade-Name-Notice"
		},
		EXTENDLEASE_NOTICE: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Extend-Lease-Notice"
		},
		INCREASEUNDERNAMELIMIT_NOTICE: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Increase-Undername-Limit-Notice"
		},
		REASSIGNNAME_NOTICE: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Reassign-Name-Notice"
		},
		RETURNEDNAME_NOTICE: {
			name: ARNS_ACTION_TAG_NAME,
			value: "Returned-Name-Notice"
		},
	} satisfies TagRecord<Record<string, Tag | ((value: string) => Tag)>>,
	//
	NAME: (value: string) => {
		return { name: ARNS_NAME_TAG_NAME, value: value }
	},
	FROM_PROCESS: (processId: string) => {
		return { name: ARNS_FROM_PROCESS_TAG_NAME, value: processId }
	},

} as const
