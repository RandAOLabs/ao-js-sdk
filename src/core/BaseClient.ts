import { message, result, results, createDataItemSigner, dryrun } from '@permaweb/aoconnect';
import { IBaseClient } from './abstract/IBaseClient';
import { SortOrder, Tags } from './abstract/types';
import { BaseClientConfig } from './abstract/BaseClientConfig';
import { DryRunError, MessageError, ResultError, ResultsError } from './BaseClientError';
import { MessageResult } from '@permaweb/aoconnect/dist/lib/result';
import { ResultsResponse } from '@permaweb/aoconnect/dist/lib/results';
import { Logger } from '../utils/logger/logger';
import { BASE_CLIENT_AUTO_CONFIGURATION } from './BaseClientAutoConfiguration';
import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';

export class BaseClient extends IBaseClient {
    /* Fields */
    readonly baseConfig: BaseClientConfig;
    readonly signer: ReturnType<typeof createDataItemSigner>;
    /* Fields */
    /* Constructors */
    protected constructor(baseConfig: BaseClientConfig) {
        super()
        this.baseConfig = baseConfig;
        this.signer = createDataItemSigner(baseConfig.wallet);
    }

    public static autoConfiguration(): BaseClient {
        return new BaseClient(BASE_CLIENT_AUTO_CONFIGURATION)
    }
    /* Constructors */
    /* Core AO Functions */
    async message(data: string = '', tags: Tags = [], anchor?: string): Promise<string> {
        try {
            return await message({
                process: this.baseConfig.processId,
                signer: this.signer,
                data,
                tags,
                anchor,
            });
        } catch (error: any) {
            Logger.error(`Error sending message: ${error.message}`);
            throw new MessageError(error);
        }
    }

    async results(
        from?: string,
        to?: string,
        limit: number = 25,
        sort: SortOrder = SortOrder.ASCENDING
    ): Promise<ResultsResponse> {
        try {
            return await results({
                process: this.baseConfig.processId,
                from,
                to,
                limit,
                sort,
            });
        } catch (error: any) {
            Logger.error(`Error fetching results: ${error.message}`);
            throw new ResultsError(error);
        }
    }

    async result(messageId: string): Promise<MessageResult> {
        try {
            return await result({
                process: this.baseConfig.processId,
                message: messageId,
            });
        } catch (error: any) {
            Logger.error(`Error fetching result: ${error.message}`);
            throw new ResultError(error);
        }
    }

    async dryrun(data: any = '', tags: Tags = [], anchor?: string, id?: string, owner?: string): Promise<DryRunResult> {
        try {
            return await dryrun({
                process: this.baseConfig.processId,
                data,
                tags,
                anchor,
                id,
                owner,
            });
        } catch (error: any) {
            Logger.error(`Error performing dry run: ${error.message}`);
            throw new DryRunError(error);
        }
    }
    /* Core AO Functions */

    public getWalletIdentifier(): string {
        return "unimplemented"
    }
}
