import { Tag } from "./types";


export const SYSTEM_SCHEDULER_TAG_NAME = "Scheduler"

export const SYSTEM_TAGS = {
	FROM_PROCESS: (processId: string) => { return { name: "From-Process", value: processId } },
	Scheduler: (processId: string) => { return { name: SYSTEM_SCHEDULER_TAG_NAME, value: processId } },
}

export default SYSTEM_TAGS;
