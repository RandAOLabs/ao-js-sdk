import { Tags } from "../../../../core";
import { IAOTokenClient, TokenInfo } from "../abstract";

export class HyperBeamTokenClient implements IAOTokenClient {
	public constructor() {
		// Initialization logic if needed
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
