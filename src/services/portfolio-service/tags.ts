import { Tag } from "../../core/common/types";

/**
 * Tags used for portfolio service operations
 */
export const PORTFOLIO_TAGS = {
	/**
	 * Action tag for balance query operations
	 */
	ACTION_BALANCE_QUERY: { name: "Action", value: "Balance-Query" } as Tag,

	/**
	 * Action tag for portfolio summary operations
	 */
	ACTION_PORTFOLIO_SUMMARY: { name: "Action", value: "Portfolio-Summary" } as Tag,

	/**
	 * Action tag for token list operations
	 */
	ACTION_TOKEN_LIST: { name: "Action", value: "Token-List" } as Tag,

	/**
	 * From-Process tag with process ID
	 * @param processId The process ID to include in the tag
	 */
	FROM_PROCESS: (processId: string): Tag => ({ name: "From-Process", value: processId }),

	/**
	 * Data-Type tag for portfolio data
	 */
	DATA_TYPE_PORTFOLIO: { name: "Data-Type", value: "Portfolio" } as Tag,

	/**
	 * Entity tag for user/wallet address
	 * @param entityId The entity ID to include in the tag
	 */
	ENTITY: (entityId: string): Tag => ({ name: "Entity", value: entityId })
};
