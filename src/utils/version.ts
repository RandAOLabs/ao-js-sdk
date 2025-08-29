import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Gets the package version at runtime by reading package.json
 * @returns The current package version
 */
export function getPackageVersion(): string {
	// Try multiple possible locations for package.json
	const possiblePaths = [
		// For built version in node_modules: dist/src/utils -> ../../../package.json
		join(__dirname, '../../../package.json'),
		// For source version: src/utils -> ../../package.json
		join(__dirname, '../../package.json'),
		// For built version locally: dist/src/utils -> ../../../package.json (same as first)
		// Fallback to process.cwd()
		join(process.cwd(), 'package.json'),
		// Try finding package.json by walking up the directory tree
		join(__dirname, '../../../../package.json'), // In case of nested node_modules
	];

	for (const packageJsonPath of possiblePaths) {
		try {
			const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
			// Verify this is the correct package by checking the name
			if (packageJson.name === 'ao-js-sdk') {
				return packageJson.version;
			}
		} catch (error) {
			// Continue to next path
			continue;
		}
	}

	// If all else fails, return unknown
	return 'unknown';
}
