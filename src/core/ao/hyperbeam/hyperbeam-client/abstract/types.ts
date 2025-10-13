/**
 * Enum defining the available process endpoints in AO-Core
 */
export enum ProcessEndpoint {
	/**
	 * Serves the latest known state for the process (faster, cached)
	 */
	COMPUTE = 'compute',
	/**
	 * Calculate the real-time state of the process (slower, fresh from scheduler)
	 */
	NOW = 'now'
}

/**
 * Configuration options for HyperBEAM requests
 */
export interface HyperbeamRequestOptions {
	/**
	 * The endpoint to use (compute or now)
	 * @default ProcessEndpoint.COMPUTE
	 */
	endpoint?: ProcessEndpoint;

	/**
	 * Additional path components to access specific data within the process state
	 * Examples: "at-slot", "key2/inner", etc.
	 */
	additionalPath?: string;
}
