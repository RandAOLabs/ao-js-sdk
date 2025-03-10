import { createDataItemSigner } from '@permaweb/aoconnect';
import { IBaseClient } from 'src/core/ao/abstract/IBaseClient';
import { BaseClientConfig } from 'src/core/ao/configuration/BaseClientConfig';
import { mergeLists } from 'src/utils/lists';
import { DEFAULT_TAGS } from 'src/core/ao/constants';
import { DryRunError, JsonParsingError, MessageError, MessageOutOfBoundsError, ResultError, ResultsError } from 'src/core/ao/BaseClientError';
import { MessageResult } from '@permaweb/aoconnect/dist/lib/result';
import { ResultsResponse } from '@permaweb/aoconnect/dist/lib/results';
import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';
import { getArweave } from 'src/core/arweave/arweave';
import { getEnvironment, Environment } from 'src/utils/environment';
import { Logger, LogLevel } from 'src/utils';
import { Tags } from 'src/core/common';
import { SortOrder } from 'src/core/ao/abstract';
import { ArweaveDataCachingService } from 'src/core/arweave/ArweaveDataCachingService';
import { ArweaveTransaction } from 'src/core/arweave/abstract/types';
import { WriteReadAOClient } from 'src/core/ao/ao-client/WriteReadAOClient';
import { IAOClient } from 'src/core/ao/ao-client/abstract/IAOClient';
import { ReadOnlyAOClient } from 'src/core/ao/ao-client/ReadOnlyAOClient';

export class BaseClient extends IBaseClient {
    /* Fields */
    /** @protected */
    readonly baseConfig: BaseClientConfig;
    /** @protected */
    private ao: IAOClient;
    private useDryRunAsMessage: boolean = false;
    private readonly arweaveService: ArweaveDataCachingService;
    /* Fields */
    /* Constructors */
    public constructor(baseConfig: BaseClientConfig) {
        super()
        this.baseConfig = baseConfig;
        if (baseConfig.wallet) { // Wallet Provided -> Write Read Client
            this.ao = new WriteReadAOClient(baseConfig.wallet)
        } else { // Wallet Not Provided -> Read Only Client
            this.ao = new ReadOnlyAOClient()
        }
        this.arweaveService = new ArweaveDataCachingService();
    }
    /* Constructors */
    /* Core AO Functions */
    /** @protected */
    async message(data: string = '', tags: Tags = [], anchor?: string): Promise<string> {
        try {
            const mergedTags = mergeLists(DEFAULT_TAGS, tags, tag => tag.name);
            return await this.ao.message(
                this.baseConfig.processId,
                data,
                mergedTags,
                anchor
            );
        } catch (error: any) {
            Logger.error(`Error sending message: ${error.message}`);
            throw new MessageError(error);
        }
    }

    /** @protected */
    async results(
        from?: string,
        to?: string,
        limit: number = 25,
        sort: SortOrder = SortOrder.ASCENDING
    ): Promise<ResultsResponse> {
        try {
            return await this.ao.results(
                this.baseConfig.processId,
                from,
                to,
                limit,
                sort
            );
        } catch (error: any) {
            Logger.error(`Error fetching results: ${error.message}`);
            throw new ResultsError(error);
        }
    }

    /** @protected */
    async result(messageId: string): Promise<MessageResult> {
        try {
            return await this.ao.result(
                this.baseConfig.processId,
                messageId
            );
        } catch (error: any) {
            Logger.error(`Error fetching result: ${error.message}`);
            throw new ResultError(error);
        }
    }

    /** @protected */
    async dryrun(data: any = '', tags: Tags = [], anchor?: string, id?: string, owner?: string): Promise<DryRunResult> {
        if (this.useDryRunAsMessage) {
            Logger.warn(`Action: Dry run triggered as message | Process ID: ${this.baseConfig.processId} | Subclass: ${this.constructor.name}`);
            return await this.messageResult(data, tags, anchor);
        } else {
            return await this._dryrun(data, tags, anchor, id, owner);
        }
    }

    protected async _dryrun(data: any = '', tags: Tags = [], anchor?: string, id?: string, owner?: string): Promise<DryRunResult> {
        try {
            const mergedTags = mergeLists(DEFAULT_TAGS, tags, tag => tag.name);
            return await this.ao.dryrun(
                this.baseConfig.processId,
                data,
                mergedTags,
                anchor,
                id,
                owner
            );
        } catch (error: any) {
            Logger.error(`Error performing dry run: ${JSON.stringify(error.message)}`);
            throw new DryRunError(error);
        }
    }

    /* Core AO Functions */

    /* Public Settings*/
    public setDryRunAsMessage(enabled: boolean): void {
        this.useDryRunAsMessage = enabled;
        const status = enabled ? 'TRUE' : 'FALSE';
        const logLevel = enabled ? LogLevel.WARN : LogLevel.INFO;
        Logger.log(logLevel, `Action: Dry run mode set to ${status} | Process ID: ${this.baseConfig.processId} | Subclass: ${this.constructor.name}`);
    }
    /* Public Utility */
    public getProcessId(): string {
        return this.baseConfig.processId
    }

    public async getCallingWalletAddress(): Promise<string> {
        const environment = getEnvironment();

        if (environment === Environment.BROWSER) {
            return await this.baseConfig.wallet.getActiveAddress();
        } else {
            const arweave = getArweave();
            return await arweave.wallets.jwkToAddress(this.baseConfig.wallet);
        }
    }

    public isRunningDryRunsAsMessages(): boolean {
        return this.useDryRunAsMessage
    }

    public isReadOnly(): boolean {
        return this.ao instanceof ReadOnlyAOClient && !(this.ao instanceof WriteReadAOClient);
    }

    public async getProcessInfo(): Promise<ArweaveTransaction> {
        return await this.arweaveService.getTransactionById(this.baseConfig.processId);
    }
    /* Public Utility */

    /* Protected Utility */
    protected findTagValue(tags: Tags, name: string): string | undefined {
        const tag = tags.find(tag => tag.name === name);
        return tag?.value;
    }

    async messageResult(data: string = '', tags: Tags = [], anchor?: string): Promise<MessageResult> {
        const result_id = await this.message(
            data,
            tags,
            anchor
        );
        const result = await this.result(result_id);
        return result;
    }

    protected getFirstMessageDataString(result: MessageResult | DryRunResult): string {
        return this.getNthMessageDataString(result, 0);
    }

    protected getNthMessageDataString(result: MessageResult | DryRunResult, n: number): string {
        if (n < 0 || n >= result.Messages.length) {
            throw new MessageOutOfBoundsError(n, result.Messages.length);
        }
        return result.Messages[n].Data;
    }

    protected getFirstMessageDataJson<T>(result: MessageResult | DryRunResult): T {
        return this.getNthMessageDataJson(result, 0);
    }

    protected getNthMessageDataJson<T>(result: MessageResult | DryRunResult, n: number): T {
        try {
            if (n < 0 || n >= result.Messages.length) {
                throw new MessageOutOfBoundsError(n, result.Messages.length);
            }
            const data = result.Messages[n].Data;
            const parsedObject = JSON.parse(data) as T;
            return parsedObject;
        } catch (error) {
            throw new JsonParsingError(`Invalid JSON in message data at index ${n}: ${result.Messages[n]?.Data}`, error as Error);
        }
    }
    /* Protected Utility */

    /* Private */

    /* Private */
}
