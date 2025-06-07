import { IAutoconfiguration } from "../../utils";
import { staticImplements } from "../../utils/decorators";
import { ARWEAVE_BLOCK_TIMES } from "../../core/arweave/constants";
import { IRandAODataService } from "./abstract/IRandAODataService";
import { IRandAOStatsService } from "./abstract/IRandAOStatsService";
import { MonthlyRandomResponses } from "./abstract/statsTypes";
import { RandAODataService } from "./RandAODataService";

/**
 * Service for RandAO statistics operations
 * @category RandAO
 */
@staticImplements<IAutoconfiguration>()
export class RandAOStatsService implements IRandAOStatsService {
    constructor(
        private readonly dataService: IRandAODataService
    ) { }

    /**
     * {@inheritdoc IAutoconfiguration.autoConfiguration}
     * @see {@link IAutoconfiguration.autoConfiguration}
     */
    public static async autoConfiguration(): Promise<IRandAOStatsService> {
        return new RandAOStatsService(
            await RandAODataService.autoConfiguration()
        );
    }

    /**
     * Gets the count of random responses for May 2025
     * @returns Promise of an array of monthly response counts
     */
    async getMonthlyResponseCounts(): Promise<MonthlyRandomResponses[]> {
        const mayResponses = await this.dataService.countRandomResponses({
            minBlockHeight: ARWEAVE_BLOCK_TIMES[2025].MAY
        });

        return mayResponses > 0 ? [{
            month: '2025-05',
            numResponses: mayResponses
        }] : [];
    }
}
