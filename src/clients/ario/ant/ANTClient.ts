import { IANTClient } from "src/clients/ario/ant/abstract/IANTClient";
import { ANTRecord, ANTRecords } from "src/clients/ario/ant/abstract/types";
import { GetRecordsError, GetRecordError } from "src/clients/ario/ant/ANTClientError";
import { DryRunCachingClient } from "src/core/ao/client-variants";
import { DryRunCachingClientConfigBuilder } from "src/core/ao/configuration/builder";

/**
 * Client for interacting with ANT (Arweave Name Token) records.
 * @category ARIO
 */
export class ANTClient extends DryRunCachingClient implements IANTClient {
    constructor(processId: string) {
        const builder = new DryRunCachingClientConfigBuilder()
        const config = builder
            .withProcessId(processId)
            .build()
        super(config);
    }

    /**
     * Retrieves all ANT records.
     * @returns Promise resolving to a record of ANT records
     */
    public async getRecords(): Promise<ANTRecords> {
        try {
            const result = await this.dryrun('', [
                { name: "Action", value: "Records" }
            ]);
            return this.getFirstMessageDataJson<ANTRecords>(result);
        } catch (error: any) {
            throw new GetRecordsError(error);
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
            return this.getFirstMessageDataJson<ANTRecord>(result);
        } catch (error: any) {
            throw new GetRecordError(undername, error);
        }
    }

}
