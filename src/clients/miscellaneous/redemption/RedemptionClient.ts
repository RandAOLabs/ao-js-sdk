

import { Tags } from "../../../core";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "../../../utils";
import { BaseClient } from "../../../core/ao/BaseClient";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { ClientBuilder } from "../../common";
import { PROCESS_IDS } from "../../../constants/processIds";
import { ProcessClientError } from "../../common/ProcessClientError";
import { DryRunResult, MessageResult } from "../../../core/ao/abstract";
import { IRedemptionClient, ViewRedeemedCodesResponse } from "./abstract";
import { RedemptionProcessError } from "./RedemptionProcessError";

/**
 * @category Miscellaneous
 * @see {@link https://github.com/RandAOLabs/Raffle-Process | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class RedemptionClient extends BaseClient implements IRedemptionClient {
	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static autoConfiguration(): RedemptionClient {
		return RedemptionClient.defaultBuilder()
			.build()
	}

	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
	public static defaultBuilder(): ClientBuilder<RedemptionClient> {
		return new ClientBuilder(RedemptionClient)
			.withProcessId(PROCESS_IDS.MISCELLANEOUS.REDEMPTION)
	}

	/* Core Redemption Functions */
	async redeemCode(code: string): Promise<boolean> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "Redeem-Code" },
			];
			const data = JSON.stringify(code);
			const result = await this.messageResult(data, tags);
			this.checkResultForErrors(result)
			return true
		} catch (error: any) {
			throw new ProcessClientError(this, this.redeemCode, { code }, error);
		}
	}

	async viewRedeemedCodes(): Promise<ViewRedeemedCodesResponse> {
		try {
			const tags: Tags = [
				{ name: "Action", value: "View-Redeemed-Codes" },
				];
				const result = await this.dryrun(undefined, tags);
				this.checkResultForErrors(result);
				return ResultUtils.getFirstMessageDataJson(result);
			} catch (error: any) {
				throw new ProcessClientError(this, this.viewRedeemedCodes, null, error);
			}
		}
	

	/* Utilities */
	/* Private */
	private checkResultForErrors(result: MessageResult | DryRunResult) {
		for (let msg of result.Messages) {
			const tags: Tags = msg.Tags;
			for (let tag of tags) {
				if (tag.name == "Error") {
					throw new RedemptionProcessError(`Error originating in process: ${this.getProcessId()}`)
				}
			}
		}
	}
	/* Private */

}
