import { IProcessClient } from "../../../../../core/ao/abstract";
import { IAmm } from "../../../../abstract";
import { ITokenClient } from "../../../../ao/token/abstract";
import { LPInfo } from "./types";

export interface IBotegaLiquidityPoolClient extends IProcessClient, IAmm {
	/**
	 * Get information about the liquidity pool including token details and pool data
	 * @returns Pool information including token details and pool data
	 */
	getLPInfo(): Promise<LPInfo>;


	/**
	 * Get token A client instance
	 * @returns Token A client
	 */
	getTokenA(): Promise<ITokenClient>;

	/**
	 * Get token B client instance
	 * @returns Token B client
	 */
	getTokenB(): Promise<ITokenClient>;
}
