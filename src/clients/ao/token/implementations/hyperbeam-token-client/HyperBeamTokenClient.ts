import { BaseClientConfig, HyperbeamClient, IHyperbeamClient, Tags, TagUtils } from "../../../../../core";
import { AOProcessClient, AOProcessClientConfig } from "../../../../common";
import { IAOTokenClient, TokenInfo } from "../../abstract";
import { TOKEN_BALANCE_ENDPOINT } from "./constants";
import { TRANSFER_SUCCESS_MESSAGE } from "../../constants";
import { AOClientBuilder } from "../../../../../core/ao/ao-client/AOClientBuilder";
import { IAOClient } from "../../../../../core/ao/ao-client/interfaces/IAOClient";
import { DryRunResult, MessageResult } from "../../../../../core/ao/abstract";
import { DryRunParams } from "../../../../../core/ao/ao-client/interfaces";
import ResultUtils from "../../../../../core/common/result-utils/ResultUtils";
import { ClientErrorHandler } from "../../../../../utils/decorators/clientErrorHandler";
import { TOKEN_TAGS } from "../../../../../constants/tags/tokens";

/**
 * @experimental
 */
export class HyperBeamTokenClient extends AOProcessClient implements IAOTokenClient {
	private config: BaseClientConfig;
	private hyperBeamClient: IHyperbeamClient;
	private ao: IAOClient;

	public constructor(config: AOProcessClientConfig & Partial<BaseClientConfig>) {
		super(config);
		this.hyperBeamClient = HyperbeamClient.autoConfiguration();

		// Set default values for optional properties and merge with provided config
		this.config = {
			wallet: undefined,
			aoConfig: undefined,
			retriesEnabled: false,
			...config,
			processId: config.processId // Ensure processId is always set
		};

		// Build AO Client using the same pattern as BaseClient
		const builder = new AOClientBuilder()
			.withWalletAutoConfiguration()
			.withRetriesEnabled(this.config.retriesEnabled)
			.withAOConfig(this.config.aoConfig);
		this.ao = builder.build();
	}

	@ClientErrorHandler
	public async balance(entityId: string): Promise<string> {
		const balanceResponse: string = await this.hyperBeamClient.compute(this.getProcessId(), `${TOKEN_BALANCE_ENDPOINT}/${entityId}`);
		return `${balanceResponse}`
	}

	@ClientErrorHandler
	public async transfer(recipient: string, quantity: string, forwardedTags?: Tags): Promise<boolean> {
		const tags: Tags = [
			TOKEN_TAGS.ACTION.TRANSFER(),
			TOKEN_TAGS.RECIPIENT(recipient),
			TOKEN_TAGS.QUANTITY(quantity)
		];
		if (forwardedTags) {
			forwardedTags.forEach(tag => tags.push({ name: `X-${tag.name}`, value: tag.value }));
		}

		// Message and get result using AO client directly
		const messageId = await this.ao.message(this.getProcessId(), '', tags);
		const result = await this.ao.result({
			process: this.getProcessId(),
			message: messageId
		});
		ResultUtils.checkForProcessErrors(result);

		const messageData: string = ResultUtils.getFirstMessageDataString(result);
		const error = ResultUtils.getTagValue(result.Messages[0].Tags, "Error");
		if (error === "Insufficient Balance!") {
			throw new Error("Insufficient Balance for transfer");
		}
		return messageData.includes(TRANSFER_SUCCESS_MESSAGE);
	}

	@ClientErrorHandler
	public async getInfo(token?: string): Promise<TokenInfo> {
		// Dryrun using AO client directly
		const params: DryRunParams = {
			process: this.getProcessId(),
			data: '',
			tags: [TOKEN_TAGS.ACTION.INFO()]
		};
		const response = await this.ao.dryrun(params);
		ResultUtils.checkForProcessErrors(response);

		// Extract token info from tags
		if (!response.Messages || response.Messages.length === 0) {
			throw new Error("No messages found in result");
		}

		const tags = response.Messages[0].Tags;
		return {
			dataProtocol: TagUtils.getTagValue(tags, "Data-Protocol"),
			variant: TagUtils.getTagValue(tags, "Variant"),
			type: TagUtils.getTagValue(tags, "Type"),
			reference: TagUtils.getTagValue(tags, "Reference"),
			action: TagUtils.getTagValue(tags, "Action"),
			logo: TagUtils.getTagValue(tags, "Logo"),
			totalSupply: TagUtils.getTagValue(tags, "TotalSupply"),
			name: TagUtils.getTagValue(tags, "Name"),
			ticker: TagUtils.getTagValue(tags, "Ticker"),
			denomination: TagUtils.getTagValue(tags, "Denomination"),
			transferRestricted: TagUtils.getTagValue(tags, "TransferRestricted")
		};
	}

	@ClientErrorHandler
	public async mint(quantity: string): Promise<boolean> {
		const tags: Tags = [
			TOKEN_TAGS.ACTION.MINT(),
			TOKEN_TAGS.QUANTITY(quantity)
		];

		// Message and get result using AO client directly
		const messageId = await this.ao.message(this.getProcessId(), '', tags);
		const result = await this.ao.result({
			process: this.getProcessId(),
			message: messageId
		});
		ResultUtils.checkForProcessErrors(result);

		const actionValue = TagUtils.getTagValue(result.Messages[0].Tags, "Action");
		return actionValue !== "Mint-Error";
	}
}
