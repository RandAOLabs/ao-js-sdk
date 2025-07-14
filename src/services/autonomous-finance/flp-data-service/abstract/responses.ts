/**
 * Represents a distribution entry
 */
export interface Distribution {
	/**
	 * The recipient address
	 */
	address: string;

	/**
	 * The amount distributed
	 */
	amount: string;
}

/**
 * Represents a user profile response
 */
export interface UserProfileResponse {
	/**
	 * The wallet address of the user
	 */
	walletAddress: string;

	/**
	 * User's display name or identifier
	 */
	displayName?: string;

	/**
	 * User's email address
	 */
	email?: string;

	/**
	 * Timestamp when profile was created
	 */
	createdAt: number;

	/**
	 * Timestamp when profile was last updated
	 */
	lastUpdated: number;

	/**
	 * User's preferences and settings
	 */
	preferences?: Record<string, any>;
}
