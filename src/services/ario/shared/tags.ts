import { Tag } from "../../../core/common/types";
import { ARIO } from "../../../processes/ids/ario";

const ACTION_TAG_NAME = "Action"
const NAME_TAG_NAME = "Name"
const FROM_PROCESS_TAG_NAME = "From-Process"

// Type helper to ensure all values are Tags or Tag-generating functions while maintaining IntelliSense
type TagRecord<T extends Record<string, Tag | ((value: string) => Tag)>> = T;

export const ARNS_TAGS = {
	ACTION: {
		RECORD: {
			name: ACTION_TAG_NAME,
			value: "Record"
		},
		RECORDS: {
			name: ACTION_TAG_NAME,
			value: "Records"
		},
		BUYNAME: {
			name: ACTION_TAG_NAME,
			value: "Buy-Name"
		},
		UPGRADENAME: {
			name: ACTION_TAG_NAME,
			value: "Upgrade-Name"
		},
		EXTENDLEASE: {
			name: ACTION_TAG_NAME,
			value: "Extend-Lease"
		},
		INCREASEUNDERNAMELIMIT: {
			name: ACTION_TAG_NAME,
			value: "Increase-Undername-Limit"
		},
		REASSIGNNAME: {
			name: ACTION_TAG_NAME,
			value: "Reassign-Name"
		},
		RELEASENAME: {
			name: ACTION_TAG_NAME,
			value: "Release-Name"
		},
		RESERVEDNAMES: {
			name: ACTION_TAG_NAME,
			value: "Reserved-Names"
		},
		RESERVEDNAME: {
			name: ACTION_TAG_NAME,
			value: "Reserved-Name"
		},
		TOKENCOST: {
			name: ACTION_TAG_NAME,
			value: "Token-Cost"
		},
		COSTDETAILS: {
			name: ACTION_TAG_NAME,
			value: "Cost-Details"
		},
		REGISTRATIONFEES: {
			name: ACTION_TAG_NAME,
			value: "Registration-Fees"
		},
		RETURNEDNAMES: {
			name: ACTION_TAG_NAME,
			value: "Returned-Names"
		},
		RETURNEDNAME: {
			name: ACTION_TAG_NAME,
			value: "Returned-Name"
		},
		ALLOWDELEGATES: {
			name: ACTION_TAG_NAME,
			value: "Allow-Delegates"
		},
		DISALLOWDELEGATES: {
			name: ACTION_TAG_NAME,
			value: "Disallow-Delegates"
		},
		DELEGATIONS: {
			name: ACTION_TAG_NAME,
			value: "Delegations"
		},
		//
		RECORD_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Record-Notice"
		},
		BUYNAME_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Buy-Name-Notice"
		},
		UPGRADENAME_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Upgrade-Name-Notice"
		},
		EXTENDLEASE_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Extend-Lease-Notice"
		},
		INCREASEUNDERNAMELIMIT_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Increase-Undername-Limit-Notice"
		},
		REASSIGNNAME_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Reassign-Name-Notice"
		},
		RETURNEDNAME_NOTICE: {
			name: ACTION_TAG_NAME,
			value: "Returned-Name-Notice"
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
