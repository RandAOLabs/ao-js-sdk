import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

import { SyncInitClient } from "src/core/ao/client-variants/SyncInitClient";
import { Tags } from "src/core";
import { Logger } from "src/utils";
import { getRaffleClientAutoConfiguration, IRaffleClient, RaffleClientConfig, RafflePull, ViewPullsResponse, ViewEntrantsResponse, ViewRaffleOwnersResponse } from "src/clients";
import { SetRaffleEntrantsError, PullRaffleError, ViewPullsError, ViewPullError, ViewEntrantsError, ViewUserPullError, ViewUserPullsError, ViewRaffleOwnersError } from "src/clients/miscellaneous/raffle/RaffleClientError";
import { RaffleProcessError } from "src/clients/miscellaneous/raffle/RaffleProcessError";

/**
 * @category Miscellaneous
 * @see {@link https://github.com/RandAOLabs/Raffle-Process | specification}
 */
export class RaffleClient extends SyncInitClient implements IRaffleClient {
    public constructor(raffleConfig: RaffleClientConfig) {
        super(raffleConfig)
    }

    public static autoConfiguration(): RaffleClient {
        return new RaffleClient(getRaffleClientAutoConfiguration());
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
            this.checkResultForErrors(result)
            return true
        } catch (error: any) {
            Logger.error(`Error pulling raffle: ${error.message}`);
            throw new PullRaffleError(error);
        }
    }

    async viewPulls(): Promise<ViewPullsResponse> {
        try {
            const tags: Tags = [
                { name: "Action", value: "View-Pulls" },
            ];
            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result)
            const pulls = this.getFirstMessageDataJson(result) as RafflePull[];
            return { pulls };
        } catch (error: any) {
            Logger.error(`Error viewing pulls: ${error.message}`);
            throw new ViewPullsError(error);
        }
    }

    async viewPull(pullId: string): Promise<RafflePull> {
        try {
            const tags: Tags = [
                { name: "Action", value: "View-Pull" },
                { name: "PullId", value: pullId },
            ];
            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result)
            return this.getFirstMessageDataJson(result)
        } catch (error: any) {
            Logger.error(`Error viewing pull: ${error.message}`);
            throw new ViewPullError(error);
        }
    }
    /* Core Raffle Functions */



    async viewMostRecentPull(): Promise<RafflePull> {
        try {
            const { pulls } = await this.viewPulls();
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

    async viewEntrants(userId: string): Promise<ViewEntrantsResponse> {
        try {
            const tags: Tags = [
                { name: "Action", value: "View-Entrants" },
                { name: "UserId", value: userId },
            ];
            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result);
            return this.getFirstMessageDataJson(result);
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
            return this.getFirstMessageDataJson(result);
        } catch (error: any) {
            Logger.error(`Error viewing user pull: ${error.message}`);
            throw new ViewUserPullError(error);
        }
    }

    async viewUserPulls(userId: string): Promise<ViewPullsResponse> {
        try {
            const tags: Tags = [
                { name: "Action", value: "View-Pulls" },
                { name: "UserId", value: userId },
            ];
            const result = await this.dryrun(undefined, tags);
            this.checkResultForErrors(result);
            const pulls = this.getFirstMessageDataJson(result) as RafflePull[];
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
            return this.getFirstMessageDataJson(result);
        } catch (error: any) {
            Logger.error(`Error viewing raffle owners: ${error.message}`);
            throw new ViewRaffleOwnersError(error);
        }
    }

    /* Utilities */
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
    /* Utilities */
}
