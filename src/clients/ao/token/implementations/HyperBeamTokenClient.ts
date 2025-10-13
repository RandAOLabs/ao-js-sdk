import { IHyperbeamClient, Tags } from "../../../../core";
import { builder, IAutoconfiguration, IBuilder, staticImplements } from "../../../../utils";
import { IBuilderClass } from "../../../../utils/class-interfaces/builder/IBuilderClass";
import { IAOTokenClient, TokenInfo } from "../abstract";

/**
 * @category ao-standards
 * @see {@link https://cookbook_ao.g8way.io/references/token.html | specification}
 */
@staticImplements<IBuilderClass>()
@staticImplements<IAutoconfiguration>()
export class HyperBeamTokenClient implements IAOTokenClient {

	/* Constructors */
	public constructor(hyperBeamClient: IHyperbeamClient) {
	}

	public static builder(): IBuilder<IAOTokenClient> {
		// return new ClientBuilder(HyperBeamTokenClient);
		return builder<HyperBeamTokenClient>();
	}
	public static autoConfiguration(): IAOTokenClient {
		return HyperBeamTokenClient.builder().build();
	}


	balance(identifier: string): Promise<string> {
		throw new Error("Method not implemented.");
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
