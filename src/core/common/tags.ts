import { Tag } from "./types";


export const SYSTEM_SCHEDULER_TAG_NAME = "Scheduler"
export const SYSTEM_TYPE_PROCESS_TAG_NAME = "Type"
export const SYSTEM_TYPE_PROCESS_TAG_VALUE = "Process"

export const SYSTEM_TAGS = {
	FROM_PROCESS: (processId: string) => { return { name: "From-Process", value: processId } },
	SCHEDULER: (processId: string) => { return { name: SYSTEM_SCHEDULER_TAG_NAME, value: processId } },
	TYPE_PROCESS: { name: SYSTEM_TYPE_PROCESS_TAG_NAME, value: SYSTEM_TYPE_PROCESS_TAG_VALUE }
}

export default SYSTEM_TAGS;
