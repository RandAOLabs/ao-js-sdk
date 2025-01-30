import { message as aoMessage, result, results, createDataItemSigner, dryrun as aoDryrun } from '@permaweb/aoconnect';
import { AoProcessLoader, testContext } from '../utils/ao';
import { IBaseClient } from './abstract/IBaseClient';
import { SortOrder, Tags } from './abstract/types';
import { BaseClientConfig } from './abstract/BaseClientConfig';
import { DryRunError, JsonParsingError, MessageError, MessageOutOfBoundsError, ResultError, ResultsError } from './BaseClientError';
import { MessageResult } from '@permaweb/aoconnect/dist/lib/result';
import { ResultsResponse } from '@permaweb/aoconnect/dist/lib/results';
import { Logger } from '../utils/logger/logger';
import { getBaseClientAutoConfiguration } from './BaseClientAutoConfiguration';
import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';
import Arweave from 'arweave';
import { getEnvironment, Environment, UnknownEnvironmentError } from '../utils/environment';

export class BaseClient extends IBaseClient {
    /* Fields */
    readonly baseConfig: BaseClientConfig;
    readonly signer: ReturnType<typeof createDataItemSigner>;
    private testLoader?: AoProcessLoader;
    /* Fields */
    /* Constructors */
    protected constructor(baseConfig: BaseClientConfig) {
        super()
        this.baseConfig = baseConfig;
        this.signer = createDataItemSigner(baseConfig.wallet);
    }

    public static autoConfiguration(): BaseClient {
        return new BaseClient(getBaseClientAutoConfiguration())
    }
    /* Constructors */
    /* Core AO Functions */
    async message(data: string = '', tags: Tags = [], anchor?: string): Promise<string> {
        try {
            if (testContext.isTestModeEnabled() && this.testLoader) {
                const owner = await this.getCallingWalletAddress();
                const result = await this.testLoader.message(null, {
                    Owner: owner,
                    From: owner,
                    Tags: tags,
                    Data: data,
                    Target: this.baseConfig.processId,
                    "Block-Height": "0",
                    Timestamp: new Date().toISOString(),
                    Cron: false,
                }, {
                    Process: {
                        Id: this.baseConfig.processId,
                        Owner: await this.getCallingWalletAddress(),
                        Tags: []
                    }
                });
                return result.Output;
            }

            return await aoMessage({
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

    /**
     * Performs a dry run, executing the logic of a message without actually persisting the result.
     *
     * @param data Optional data to be passed to the message.
     * @param tags Optional tags to be passed to the message.
     * @param anchor Optional anchor to be passed to the message.
     * @param id Optional ID to be passed to the message.
     * @param owner Optional owner to be passed to the message.
     * @returns A DryRunResult object containing the output of the message, including
     * the result of any computations, and any spawned messages.
     * @throws DryRunError if there is an error performing the dry run.
     */
    async dryrun(data: any = '', tags: Tags = [], anchor?: string, id?: string, owner?: string): Promise<DryRunResult> {
        try {
            if (testContext.isTestModeEnabled() && this.testLoader) {
                const messageOwner = owner || await this.getCallingWalletAddress();
                return await this.testLoader.dryrun(null, {
                    Owner: messageOwner,
                    From: messageOwner,
                    Tags: tags,
                    Data: data,
                    Target: this.baseConfig.processId,
                    "Block-Height": "0",
                    Timestamp: new Date().toISOString(),
                    Cron: false,
                }, {
                    Process: {
                        Id: this.baseConfig.processId,
                        Owner: await this.getCallingWalletAddress(),
                        Tags: []
                    }
                });
            }

            const result = await aoDryrun({
                process: this.baseConfig.processId,
                data,
                tags,
                anchor,
                id,
                owner,
            });
            return result;
        } catch (error: any) {
            Logger.error(`Error performing dry run: ${JSON.stringify(error.message)}`);
            throw new DryRunError(error);
        }
    }
    /* Core AO Functions */
    /* Utility */
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
            return JSON.parse(data) as T;
        } catch (error) {
            throw new JsonParsingError(`Invalid JSON in message data at index ${n}: ${result.Messages[n]?.Data}`, error as Error);
        }
    }


    public getProcessId(): string {
        return this.baseConfig.processId
    }

    public async getCallingWalletAddress(): Promise<string> {
        const environment = getEnvironment();

        switch (environment) {
            case Environment.BROWSER:
                return await this.baseConfig.wallet.getActiveAddress();
            case Environment.NODE:
                const arweave = Arweave.init({});
                return await arweave.wallets.jwkToAddress(this.baseConfig.wallet);
            default:
                throw new UnknownEnvironmentError();
        }
    }

    /**
     * Sets the test loader instance and enables test mode
     * @param loader - The AoProcessLoader instance to use for testing
     */
    public setTestLoader(loader: AoProcessLoader): void {
        this.testLoader = loader;
        testContext.enableTestMode();
    }

    /**
     * Disables test mode and removes the test loader
     */
    public disableTestMode(): void {
        this.testLoader = undefined;
        testContext.disableTestMode();
    }
    /* Utility */
}
