import { Tag } from "src/core";

export const TAGS = {
    ACTION: {
        DELEGATION_RECORDS: { name: "Action", value: "Delegation-Records" } as Tag
    },
    FORMAT: {
        CSV: { name: "Format", value: "CSV" } as Tag
    }
} as const;
