import { ViewRedeemedCodesResponse } from "./types";

/**
 * Interface for the Redemption Client that provides functionality for managing redemptions
 * and viewing redemption codes.
 */
export interface IRedemptionClient {
    /**
     * Redeems a code for the redemption.
     * @param code Code to redeem
     * @returns Promise resolving to true if successful
     */
    redeemCode(code: string): Promise<boolean>;

	/**
	 * Views the redeemed codes for the redemption.
	 * @returns Promise resolving to the redeemed codes
	 */
	viewRedeemedCodes(): Promise<ViewRedeemedCodesResponse>;
}
