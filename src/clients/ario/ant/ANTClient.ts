import { IANTClient } from "./abstract/IANTClient";
import { ProcessClientError } from "../../common/ProcessClientError";
import { DryRunCachingClient } from "../../../core/ao/client-variants";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { AntRecord, ANTState } from "../../../models";
import { ANT_QUERY_TAGS } from "../../../models/ario/ant/tags";

/**
 * Client for interacting with ANT (Arweave Name Token) records.
 * @category ARIO
 */
export class ANTClient extends DryRunCachingClient implements IANTClient {
	/**
	 * Retrieves all ANT records.
	 * @returns Promise resolving to a record of ANT records
	 */
	public async getRecords(): Promise<AntRecord> {
		try {
			const result = await this.dryrun('', [
				{ name: "Action", value: "Records" }
			]);
			return ResultUtils.getFirstMessageDataJson<AntRecord>(result);
		} catch (error: any) {
			throw new ProcessClientError(this, this.getRecords, null, error);
		}
	}

	/**
	 * Retrieves a specific ANT record by name.
	 * @param undername - The undername to get the ANT record for
	 * @returns Promise resolving to the ANT record if found, undefined otherwise
	 */
	public async getRecord(undername: string): Promise<AntRecord | undefined> {
		try {
			const result = await this.dryrun('', [
				{ name: "Sub-Domain", value: undername },
				{ name: "Action", value: "Record" }
			]);
			return ResultUtils.getFirstMessageDataJson<AntRecord>(result);
		} catch (error: any) {
			throw new ProcessClientError(this, this.getRecord, { undername }, error);
		}
	}

	/**
	 * Retrieves the current state of the ANT.
	 * @returns Promise resolving to the ANT state
	 */
	public async getState(): Promise<ANTState> {
		try {
			const result = await this.dryrun('', [
				ANT_QUERY_TAGS.ACTION.STATE
			]);
			return ResultUtils.getFirstMessageDataJson<ANTState>(result);
		} catch (error: any) {
			throw new ProcessClientError(this, this.getState, null, error);
		}
	}

}
