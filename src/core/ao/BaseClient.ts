import { IBaseClient } from './abstract/IBaseClient';
import { BaseClientConfig } from './configuration/BaseClientConfig';
import { mergeLists } from '../../utils/lists';
import { DEFAULT_TAGS } from './constants';
import { MessageResult } from '@permaweb/aoconnect/dist/lib/result';
import { ResultsResponse } from '@permaweb/aoconnect/dist/lib/results';
import { DryRunResult } from '@permaweb/aoconnect/dist/lib/dryrun';
import { Logger, LogLevel } from '../../utils';
import { Tags } from '../common';
import { DryRunParams } from './ao-client/abstract';
import { ArweaveDataCachingService } from '../arweave/ArweaveDataCachingService';
import { ArweaveTransaction } from '../arweave/abstract/types';
import { WriteReadRetryAOClient } from './ao-client/variants/WriteReadRetryAOClient';
import { IAOClient } from './ao-client/abstract/IAOClient';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { ReadOnlyAOClient, ReadOnlyRetryAOClient, WriteReadAOClient } from './ao-client';
import { SortOrder } from './abstract';
import ResultUtils from '../common/result-utils/ResultUtils';
import { IArweaveDataCachingService } from '../arweave/abstract/IArweaveDataCachingService';

/**
 * Base client implementation for AO Process interactions.
 * Provides core functionality for message handling, results retrieval, and dry runs.
 * All other clients extend this base implementation.
 * @category Core
 */
export class BaseClient extends IBaseClient {
	/* Fields */
	/** @protected */
	readonly baseConfig: BaseClientConfig;
	/** @protected */
	private ao: IAOClient;
	private useDryRunAsMessage: boolean = false;
	private readonly arweaveService: IArweaveDataCachingService;
	/* Fields */
	/* Constructors */
	public constructor(baseConfig: BaseClientConfig) {
		super()
		this.baseConfig = baseConfig;
		if (baseConfig.wallet) { // Wallet Provided -> Write Read Client
			this.ao = new WriteReadRetryAOClient(baseConfig.wallet, baseConfig.aoConfig)
		} else { // Wallet Not Provided -> Read Only Client
			this.ao = new ReadOnlyRetryAOClient(baseConfig.aoConfig)
		}
		this.arweaveService = ArweaveDataCachingService.autoConfiguration();
	}
	/* Constructors */
	/* Core AO Functions */
	/** @protected */
	async message(data: string = '', tags: Tags = [], anchor?: string): Promise<string> {
		const mergedTags = mergeLists(tags, DEFAULT_TAGS, tag => tag.name);
		return await this.ao.message(
			this.baseConfig.processId,
			data,
			mergedTags,
			anchor
		);
	}

	/** @protected */
	async results(
		from?: string,
		to?: string,
		limit: number = 25,
		sort: SortOrder = SortOrder.ASCENDING
	): Promise<ResultsResponse> {
		return await this.ao.results({
			process: this.baseConfig.processId,
			from,
			to,
			limit,
			sort
		});
	}

	/** @protected */
	async result(messageId: string): Promise<MessageResult> {
		const result = await this.ao.result({
			process: this.baseConfig.processId,
			message: messageId
		});
		ResultUtils.checkForProcessErrors(result)
		return result
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
		const mergedTags = mergeLists(tags, DEFAULT_TAGS, tag => tag.name);
		const params: DryRunParams = {
			process: this.baseConfig.processId,
			data,
			tags: mergedTags,
			anchor,
			id,
			owner
		};
		const result = await this.ao.dryrun(params);
		ResultUtils.checkForProcessErrors(result)
		return result
	}

	/* Core AO Functions */

	/* Public Settings*/
	public setDryRunAsMessage(enabled: boolean): void {
		this.useDryRunAsMessage = enabled;
		const status = enabled ? 'TRUE' : 'FALSE';
		const logLevel = enabled ? LogLevel.WARN : LogLevel.INFO;
		Logger.log(logLevel, `Action: Dry run mode set to ${status} | Process ID: ${this.baseConfig.processId} | Subclass: ${this.constructor.name}`);
	}

	public setWallet(wallet: JWKInterface | any): void {
		this.ao = new WriteReadRetryAOClient(wallet)
	}

	/* Public Utility */
	public getProcessId(): string {
		return this.baseConfig.processId
	}

	public async getCallingWalletAddress(): Promise<string> {
		return this.ao.getCallingWalletAddress()
	}

	public isRunningDryRunsAsMessages(): boolean {
		return this.useDryRunAsMessage
	}

	public isReadOnly(): boolean {
		return this.ao instanceof ReadOnlyAOClient
			&& !(this.ao instanceof WriteReadRetryAOClient)
			&& !(this.ao instanceof WriteReadAOClient);
	}

	public async getProcessInfo(): Promise<ArweaveTransaction> {
		return await this.arweaveService.getTransactionById(this.baseConfig.processId);
	}

	public getWallet(): JWKInterface | any | undefined {
		return this.ao.getWallet()
	}

	/* Public Utility */

	/* Protected Utility */
	async messageResult(data: string = '', tags: Tags = [], anchor?: string): Promise<MessageResult> {
		const result_id = await this.message(
			data,
			tags,
			anchor
		);
		const result = await this.result(result_id);
		return result;
	}
	/* Protected Utility */

	/* Private */

	/* Private */
}
