import { IHyperbeamClient, Tags } from "../../../../core";
import { IAOTokenClient, TokenInfo } from "../abstract";

/**
 * @category ao-standards
 * @see {@link https://cookbook_ao.g8way.io/references/token.html | specification}
 */
export class HyperBeamTokenClient implements IAOTokenClient {

	/* Constructors */
	public constructor(hyperBeamClient: IHyperbeamClient) {
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
