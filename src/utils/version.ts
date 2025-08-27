import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Gets the package version at runtime by reading package.json
 * @returns The current package version
 */
export function getPackageVersion(): string {
	try {
		// Try to read package.json from the project root
		// This works for both development and built scenarios
		const packageJsonPath = join(__dirname, '../../package.json');
		const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
		return packageJson.version;
	} catch (error) {
		// Fallback: try reading from different possible locations
		try {
			const fallbackPath = join(process.cwd(), 'package.json');
			const packageJson = JSON.parse(readFileSync(fallbackPath, 'utf8'));
			return packageJson.version;
		} catch (fallbackError) {
			// If all else fails, return unknown
			return 'unknown';
		}
	}
}
