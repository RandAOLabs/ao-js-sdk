
export interface IAutoconfiguration {

	/**
	 * Creates a pre-configured instance of the class.
	 * This is the recommended way to instantiate this class for most use cases.
	 * @returns A pre-configured instance of the class.
	 * @constructor
	 */
	autoConfiguration(): any | Promise<any>;
}
