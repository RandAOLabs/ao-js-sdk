const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Cross-platform MCP server build script
 */

function getMCPServerPath() {
	const homeDir = os.homedir();
	const defaultPath = process.env.MCP_SERVER_DIR || path.join(homeDir, '.mcp', 'servers');
	return path.join(defaultPath, 'ao-js-sdk-server');
}

async function main() {
	try {
		const serverPath = getMCPServerPath();

		console.log('🔨 Building MCP server...');
		console.log(`📂 Server path: ${serverPath}`);

		// Check if server directory exists
		if (!fs.existsSync(serverPath)) {
			console.error('❌ MCP server directory not found. Run "npm run generate:mcp" first.');
			process.exit(1);
		}

		// Check if package.json exists
		const packageJsonPath = path.join(serverPath, 'package.json');
		if (!fs.existsSync(packageJsonPath)) {
			console.error('❌ package.json not found in MCP server directory.');
			process.exit(1);
		}

		// Install dependencies
		console.log('📦 Installing dependencies...');
		execSync('npm install', {
			cwd: serverPath,
			stdio: 'inherit',
			timeout: 60000 // 60 second timeout
		});

		// Build the server
		console.log('🏗️  Building server...');
		execSync('npm run build', {
			cwd: serverPath,
			stdio: 'inherit',
			timeout: 30000 // 30 second timeout
		});

		console.log('✅ MCP server built successfully!');

		// Verify build output
		const buildPath = path.join(serverPath, 'build', 'index.js');
		if (fs.existsSync(buildPath)) {
			console.log('🎯 Build output verified');
		} else {
			console.warn('⚠️  Build output not found at expected location');
		}

	} catch (error) {
		console.error(`❌ Build failed: ${error.message}`);
		process.exit(1);
	}
}

main();