import { TokenBalance } from "../../../models/token-balance";
import { ITokenClient } from "../../../clients/ao";
import { IProcess } from "../../../models";

export interface IAmm {
	/**
	 * Get price for a given quantity and token
	 * @param quantity The quantity to get price for (number or string)
	 * @param tokenId The token ID
	 * @returns Price as a number
	 */
	getPrice(quantity: number | string, tokenId: string): Promise<TokenBalance>;

	getProcess(): IProcess;

}
