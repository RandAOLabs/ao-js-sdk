import { AntRecord } from "./AntRecord";
import { ANTState } from "./AntState";

export class ANTUtils {
	public static getRecord(state: ANTState, undername: string): AntRecord | undefined {
		return state.Records[undername];
	}

}
