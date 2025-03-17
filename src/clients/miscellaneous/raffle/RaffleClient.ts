import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

import { Tags } from "src/core";
import { IAutoconfiguration, IDefaultBuilder, Logger, staticImplements } from "src/utils";
import { IRaffleClient, RafflePull, ViewPullsResponse, ViewEntrantsResponse, ViewRaffleOwnersResponse } from "src/clients";
import { SetRaffleEntrantsError, PullRaffleError, ViewPullError, ViewEntrantsError, ViewUserPullError, ViewUserPullsError, ViewRaffleOwnersError } from "src/clients/miscellaneous/raffle/RaffleClientError";
import { RaffleProcessError } from "src/clients/miscellaneous/raffle/RaffleProcessError";
import { BaseClient } from "src/core/ao/BaseClient";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { ClientBuilder } from "src/clients/common";
import { RAFFLE_PROCESS_ID } from "src/processes_ids";

/**
 * @category Miscellaneous
 * @see {@link https://github.com/RandAOLabs/Raffle-Process | specification}
 */
@staticImplements<IAutoconfiguration>() 
@staticImplements<IDefaultBuilder>()
export class RaffleClient extends BaseClient implements IRaffleClient {
    public static autoConfiguration(): RaffleClient {
        return RaffleClient.defaultBuilder()
            .build()
    }

    public static defaultBuilder(): ClientBuilder<RaffleClient> {
        return new ClientBuilder(RaffleClient)
            .withProcessId(RAFFLE_PROCESS_ID)
    }

    /* Core Raffle Functions */
    async setRaffleEntrants(entrants: string[]): Promise<boolean> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Update-Raffle-Entry-List" },
            ];
            const data = JSON.stringify(entrants);
            const result = await this.messageResult(data, tags);
            this.checkResultForErrors(result)
            return true
        } catch (error: any) {
            Logger.error(`Error setting raffle entrants: ${error.message}`);
            throw new SetRaffleEntrantsError(error);
        }
    }

    async pullRaffle(): Promise<boolean> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Raffle" },
            ];
            const result = await this.messageResult(undefined, tags);
            return true
        } catch (error: any) {
            Logger.error(`Error pulling raffle: ${error.message}`);
            throw new PullRaffleError(error);
        }
    }

    async viewEntrants(userId: string): Promise<ViewEntrantsResponse> {
        try {
            const tags: Tags = [
                { name: "Action", value: "View-Entrants" },
                { name: "UserId", value: userId },
            ];
            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result);
            return ResultUtils.getFirstMessageDataJson(result);
        } catch (error: any) {
            Logger.error(`Error viewing entrants: ${error.message}`);
            throw new ViewEntrantsError(error);
        }
    }

    async viewUserPull(userId: string, pullId: string): Promise<RafflePull> {
        try {
            const tags: Tags = [
                { name: "Action", value: "View-Pull" },
                { name: "UserId", value: userId },
                { name: "PullId", value: pullId },
            ];
            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result);
            return ResultUtils.getFirstMessageDataJson(result);
        } catch (error: any) {
            Logger.error(`Error viewing user pull: ${error.message}`);
            throw new ViewUserPullError(error);
        }
    }

    async viewUserPulls(_userId?: string): Promise<ViewPullsResponse> {
        const userId: string = _userId ? _userId : await this.getCallingWalletAddress();
        try {
            const tags: Tags = [
                { name: "Action", value: "View-Pulls" },
                { name: "UserId", value: userId },
            ];

            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result);
            const pulls = ResultUtils.getFirstMessageDataJson(result) as RafflePull[];
            return { pulls };
        } catch (error: any) {
            Logger.error(`Error viewing user pulls: ${error.message}`);
            throw new ViewUserPullsError(error);
        }
    }

    async viewRaffleOwners(): Promise<ViewRaffleOwnersResponse> {
        try {
            const tags: Tags = [
                { name: "Action", value: "View-Raffle-Owners" },
            ];
            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result);
            return ResultUtils.getFirstMessageDataJson(result);
        } catch (error: any) {
            Logger.error(`Error viewing raffle owners: ${error.message}`);
            throw new ViewRaffleOwnersError(error);
        }
    }

    /* Core Raffle Functions */

    /* Utilities */
    async viewMostRecentPull(): Promise<RafflePull> {
        try {
            const { pulls } = await this.viewUserPulls();
            if (pulls.length === 0) {
                throw new ViewPullError(new Error("No pulls found"));
            }
            // Find pull with highest ID
            const mostRecent = pulls.reduce((max, current) =>
                current.Id > max.Id ? current : max
            );
            return mostRecent;
        } catch (error: any) {
            Logger.error(`Error viewing most recent pull: ${error.message}`);
            throw new ViewPullError(error);
        }
    }
    /* Utilities */
    /* Private */
    private checkResultForErrors(result: MessageResult | DryRunResult) {
        for (let msg of result.Messages) {
            const tags: Tags = msg.Tags;
            for (let tag of tags) {
                if (tag.name == "Error") {
                    throw new RaffleProcessError(`Error originating in process: ${this.getProcessId()}`)
                }
            }
        }
    }
    /* Private */

}
