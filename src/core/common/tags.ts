import { Tag } from "./types";


export const SYSTEM_TAGS = {
	FROM_PROCESS: (processId: string) => { return { name: "From-Process", value: processId } }
}

export default SYSTEM_TAGS;
