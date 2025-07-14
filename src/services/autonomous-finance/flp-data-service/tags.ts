import { Tag } from "../../../core/common/types";

/**
 * Tags used for FLP data service operations
 */
export const FLP_TAGS = {
	/**
	 * Action tag for batch transfer operations
	 */
	ACTION_BATCH_TRANSFER: { name: "Action", value: "Batch-Transfer" } as Tag,

	/**
	 * From-Process tag with process ID
	 * @param processId The process ID to include in the tag
	 */
	FROM_PROCESS: (processId: string): Tag => ({ name: "From-Process", value: processId })
};
