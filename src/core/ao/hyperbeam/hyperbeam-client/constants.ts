/**
 * AO-Core path constants
 */
export const AO_CORE_CONSTANTS = {
	/**
	 * Process device version
	 */
	PROCESS_DEVICE: 'process@1.0',

	/**
	 * Process device separator
	 */
	DEVICE_SEPARATOR: '~'
} as const;

/**
 * Builds AO-Core paths following the standard format using URL constructor for cross-platform compatibility
 */
export class AOCorePathBuilder {
	/**
	 * Builds a process state path using URL constructor for proper path handling
	 * @param processId The process ID
	 * @param endpoint The endpoint (compute or now)
	 * @param additionalPath Optional additional path components
	 * @returns The constructed path
	 */
	static buildProcessStatePath(
		processId: string,
		endpoint: string,
		additionalPath?: string
	): string {
		const processPath = `${processId}${AO_CORE_CONSTANTS.DEVICE_SEPARATOR}${AO_CORE_CONSTANTS.PROCESS_DEVICE}`;

		// Use URL constructor for proper path building
		const baseUrl = 'http://example.com'; // Temporary base for URL construction
		const pathSegments = [processPath, endpoint];

		if (additionalPath) {
			pathSegments.push(additionalPath);
		}

		const fullPath = pathSegments.join('/');
		const url = new URL(fullPath, baseUrl);

		// Return just the pathname (without the temporary domain)
		return url.pathname;
	}
}
