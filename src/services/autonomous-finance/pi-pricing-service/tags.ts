import { Tag } from "../../../core/common/types";

/**
 * Tags used for PI pricing service operations
 */
export const PI_PRICING_TAGS = {
	/**
	 * Action tag for price update operations
	 */
	ACTION_PRICE_UPDATE: { name: "Action", value: "Price-Update" } as Tag,

	/**
	 * Action tag for price query operations
	 */
	ACTION_PRICE_QUERY: { name: "Action", value: "Price-Query" } as Tag,

	/**
	 * From-Process tag with process ID
	 * @param processId The process ID to include in the tag
	 */
	FROM_PROCESS: (processId: string): Tag => ({ name: "From-Process", value: processId }),

	/**
	 * Data-Type tag for pricing data
	 */
	DATA_TYPE_PRICING: { name: "Data-Type", value: "Pricing" } as Tag
};
