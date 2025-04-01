import { IANTClient } from "./abstract/IANTClient";
import { ANTRecord, ANTRecords } from "./abstract/types";
import { ClientError } from "../../common/ClientError";
import { DryRunCachingClient } from "../../../core/ao/client-variants";
import { DryRunCachingClientConfigBuilder } from "../../../core/ao/configuration/builder";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";

/**
 * Client for interacting with ANT (Arweave Name Token) records.
 * @category ARIO
 */
export class ANTClient extends DryRunCachingClient implements IANTClient {
    /**
     * Retrieves all ANT records.
     * @returns Promise resolving to a record of ANT records
     */
    public async getRecords(): Promise<ANTRecords> {
        try {
            const result = await this.dryrun('', [
                { name: "Action", value: "Records" }
            ]);
            return ResultUtils.getFirstMessageDataJson<ANTRecords>(result);
        } catch (error: any) {
            throw new ClientError(this, this.getRecords, null, error);
        }
    }

    /**
     * Retrieves a specific ANT record by name.
     * @param undername - The undername to get the ANT record for
     * @returns Promise resolving to the ANT record if found, undefined otherwise
     */
    public async getRecord(undername: string): Promise<ANTRecord | undefined> {
        try {
            const result = await this.dryrun('', [
                { name: "Sub-Domain", value: undername },
                { name: "Action", value: "Record" }
            ]);
            return ResultUtils.getFirstMessageDataJson<ANTRecord>(result);
        } catch (error: any) {
            throw new ClientError(this, this.getRecord, { undername }, error);
        }
    }

}
