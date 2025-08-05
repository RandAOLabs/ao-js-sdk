export interface IAmm {
	/**
	 * Get price for a given quantity and token
	 * @param quantity The quantity to get price for (number or string)
	 * @param tokenId The token ID
	 * @returns Price as a number
	 */
	getPrice(quantity: number | string, tokenId: string): Promise<number>;

	/**
	 * Get price of token A in terms of token B
	 * @param quantity The quantity of token A
	 * @returns Price in token B
	 */
	getPriceOfTokenAInTokenB(quantity: number | string): Promise<number>;

	/**
	 * Get price of token B in terms of token A
	 * @param quantity The quantity of token B
	 * @returns Price in token A
	 */
	getPriceOfTokenBInTokenA(quantity: number | string): Promise<number>;

}
