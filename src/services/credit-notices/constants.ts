import { Tag } from "src/core";

/**
 * Tag used to identify credit notice messages
 */
export const CREDIT_NOTICE_ACTION_TAG: Tag = {
    name: "Action",
    value: "Credit-Notice"
} as const;

/**
 * Tag name for process identifier
 */
export const FROM_PROCESS_TAG_NAME = "From-Process" as const;

/**
 * Tag name for quantity value
 */
export const QUANTITY_TAG_NAME = "Quantity" as const;
