import { Environment, getEnvironment } from './environment';

// Fallback version - this should be updated during build process or kept in sync with package.json
const FALLBACK_VERSION = 'version missing';

/**
 * Gets the package version at runtime
 * In Node.js: reads from package.json
 * In browser: returns fallback version (package.json is not accessible in browsers)
 * @returns The current package version
 */
export function getPackageVersion(): string {
	try {
		const env = getEnvironment();

		if (env === Environment.NODE) {
			return getPackageVersionNode();
		} else if (env === Environment.BROWSER) {
			return getPackageVersionBrowser();
		}
	} catch (error) {
		// If environment detection fails, return fallback
		console.warn('Failed to detect environment for version lookup:', error);
	}

	// Fallback for unknown environments or errors
	return FALLBACK_VERSION;
}

/**
 * Node.js implementation - reads package.json from filesystem
 */
function getPackageVersionNode(): string {
	try {
		// Dynamic imports to avoid bundling issues in browsers
		const fs = require('fs');
		const path = require('path');

		// Try multiple possible locations for package.json
		const possiblePaths = [
			// For built version in node_modules: dist/src/utils -> ../../../package.json
			path.join(__dirname, '../../../package.json'),
			// For source version: src/utils -> ../../package.json
			path.join(__dirname, '../../package.json'),
			// Fallback to process.cwd()
			path.join(process.cwd(), 'package.json'),
			// Try finding package.json by walking up the directory tree
			path.join(__dirname, '../../../../package.json'), // In case of nested node_modules
		];

		for (const packageJsonPath of possiblePaths) {
			try {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
				// Verify this is the correct package by checking the name
				if (packageJson.name === 'ao-js-sdk') {
					return packageJson.version;
				}
			} catch (error) {
				// Continue to next path
				continue;
			}
		}
	} catch (error) {
		console.warn('Failed to read package.json in Node.js environment:', error);
	}

	// If all else fails in Node.js, return fallback
	return FALLBACK_VERSION;
}

/**
 * Browser implementation - returns fallback version
 * In browsers, package.json is not accessible via filesystem
 */
function getPackageVersionBrowser(): string {
	// In browser environments, we can't read package.json from the filesystem
	// The version should be injected at build time or provided via other means

	// Check if version was injected via build process (e.g., webpack DefinePlugin)
	if (typeof process !== 'undefined' && process.env && process.env.PACKAGE_VERSION) {
		return process.env.PACKAGE_VERSION;
	}

	// Check if version was set on window object
	if (typeof window !== 'undefined' && (window as any).__AO_JS_SDK_VERSION__) {
		return (window as any).__AO_JS_SDK_VERSION__;
	}

	// Return fallback version
	return FALLBACK_VERSION;
}
