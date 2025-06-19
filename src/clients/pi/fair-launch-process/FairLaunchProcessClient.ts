import { BaseClient } from "../../../core/ao/BaseClient";
import { ClientBuilder } from "../../common";
import { IFairLaunchProcessClient } from "./abstract/IFairLaunchProcessClient";

import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { FairLaunchInfo } from "./types";
import { ClientError } from "../../common/ClientError";


/**
 * Client for interacting with a Fair Launch Process.
 * @category Autonomous Finance
 */
export class FairLaunchProcessClient extends BaseClient implements IFairLaunchProcessClient {
	/**@constructor */
	public static from(processId: string): FairLaunchProcessClient {
		return new ClientBuilder(FairLaunchProcessClient)
			.withProcessId(processId)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
			.build()
	}

    /**
     * Gets information about the Fair Launch Process.
     * @returns Promise resolving to a DryRunResult with process information
     */
    public async getInfo(): Promise<FairLaunchInfo> {
        try {
            const result = await this.dryrun('', [
                { name: "Action", value: "Info" }
            ]);
			return ResultUtils.getFirstMessageDataJson<FairLaunchInfo>(result);
			
        } catch (error: any) {
            throw new ClientError(this, this.getInfo, {}, error);
        }
    }
    
}
