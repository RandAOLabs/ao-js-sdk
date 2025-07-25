export interface IFullARNSName {
	/**
	 * Checks if this ARNS name contains an undername.
	 * @returns true if the name contains an underscore, indicating an undername is present
	 */
	hasUndername(): boolean;
	/**
	 * Extracts the undername portion from the full ARNS name.
	 * @returns the undername if present, undefined if this is a top-level ARN
	 */
	getUndername(): string | undefined;

	/**
	 * Extracts the main ARN name from the full ARNS name.
	 * @returns the main ARN name (everything after the underscore if undername exists, or the full name if top-level)
	 */
	getARNSName(): string;
}
