import { BaseClientConfig, HyperbeamClient, IHyperbeamClient, Tags } from "../../../../../core";
import { AOProcessClient, AOProcessClientConfig } from "../../../../common";
import { IAOTokenClient, TokenInfo } from "../../abstract";
import { TOKEN_BALANCE_ENDPOINT } from "./constants";

/**
 * @experimental
 */
export class HyperBeamTokenClient extends AOProcessClient implements IAOTokenClient {
	private config: BaseClientConfig;
	private hyperBeamClient: IHyperbeamClient

	public constructor(config: AOProcessClientConfig & Partial<BaseClientConfig>) {
		super(config);
		this.hyperBeamClient = HyperbeamClient.autoConfiguration()

		// Set default values for optional properties and merge with provided config
		this.config = {
			wallet: undefined,
			aoConfig: undefined,
			retriesEnabled: false,
			...config,
			processId: config.processId // Ensure processId is always set
		};
	}

	public async balance(entityId: string): Promise<string> {
		const balanceResponse: string = await this.hyperBeamClient.compute(this.getProcessId(), `${TOKEN_BALANC ityId}`);
		return balanceResponse
	}
	transfer(recipient: string, quantity: string, forwardedTags?: Tags): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	getInfo(token?: string): Promise<TokenInfo> {
		throw new Error("Method not implemented.");
	}
	mint(quantity: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

}
