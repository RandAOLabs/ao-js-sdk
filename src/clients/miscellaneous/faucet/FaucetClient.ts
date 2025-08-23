

import { Tags } from "../../../core";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "../../../utils";
import { IFaucetClient, FaucetClientConfig } from "./abstract";
import { FaucetProcessError } from "./FaucetProcessError";
import { BaseClient } from "../../../core/ao/BaseClient";
import { ARIOService } from "../../../services";
import { DOMAIN } from "../../../services/ario/ario-service/domains";
import { AO_CONFIGURATIONS } from "../../../core/ao/ao-client/configurations";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { ClientBuilder } from "../../common";
import { PROCESS_IDS } from "../../../constants/processIds";
import { ProcessClientError } from "../../common/ProcessClientError";
import { TokenClient, TokenClientConfig } from "../../ao";
import { TokenInterfacingClientBuilder } from "../../common/TokenInterfacingClientBuilder";
import { IClassBuilder } from "../../../utils/class-interfaces/IClientBuilder";
import { DryRunResult, MessageResult } from "../../../core/ao/abstract";

/**
 * @category Miscellaneous
 * @see {@link https://github.com/RandAOLabs/Faucet-Process | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
@staticImplements<IClassBuilder>()

export class FaucetClient extends BaseClient implements IFaucetClient {

	readonly tokenClient: TokenClient;
	public constructor(faucetConfig: FaucetClientConfig) {
		super(faucetConfig);

		const tokenConfig: TokenClientConfig = {
			processId: faucetConfig.tokenProcessId,
			wallet: faucetConfig.wallet,
			aoConfig: AO_CONFIGURATIONS.FORWARD_RESEARCH,
			retriesEnabled: faucetConfig.retriesEnabled
		}
		this.tokenClient = new TokenClient(tokenConfig);
	}

	/**
	 * {@inheritdoc IAutoconfiguration.autoConfiguration}
	 * @see {@link IAutoconfiguration.autoConfiguration}
	 */
	public static async autoConfiguration(): Promise<FaucetClient> {
		const builder = await FaucetClient.defaultBuilder();

		return builder
			.build()
	}

	public static builder(): TokenInterfacingClientBuilder<FaucetClient> {
		return new TokenInterfacingClientBuilder(FaucetClient)
	}

	/**
	 * {@inheritdoc IDefaultBuilder.defaultBuilder}
	 * @see {@link IDefaultBuilder.defaultBuilder}
	 */
	public static async defaultBuilder(): Promise<TokenInterfacingClientBuilder<FaucetClient>> {
		return FaucetClient.builder()
			.withProcessId(PROCESS_IDS.MISCELLANEOUS.FAUCET)
			.withAOConfig(AO_CONFIGURATIONS.RANDAO)
			.withTokenProcessId(PROCESS_IDS.MISCELLANEOUS.SWEEPSTAKES_TOKEN)
			.withTokenAOConfig(AO_CONFIGURATIONS.FORWARD_RESEARCH)
	}

	async useFaucet(): Promise<boolean> {
		try {
			const paymentAmount = "100000000000"; // TODO: Determine payment amount dynamically if needed
			const tags: Tags = [
				{ name: "Note", value: "Faucet" },
			];

			return await this.tokenClient.transfer(this.getProcessId(), paymentAmount, tags);
		} catch (error: any) {
			throw new ProcessClientError(this, this.useFaucet, {}, error);
		}
	}

	/* Core Faucet Functions */

	/* Utilities */
	/* Private */
	private checkResultForErrors(result: MessageResult | DryRunResult) {
		for (let msg of result.Messages) {
			const tags: Tags = msg.Tags;
			for (let tag of tags) {
				if (tag.name == "Error") {
					throw new FaucetProcessError(`Error originating in process: ${this.getProcessId()}`)
				}
			}
		}
	}
	/* Private */

}
