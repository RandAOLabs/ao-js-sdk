const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Cross-platform path resolution for MCP settings
 * Detects common MCP client installations
 */
function getMCPSettingsPath() {
	const homeDir = os.homedir();
	const platform = os.platform();

	// Allow override via environment variable
	if (process.env.MCP_SETTINGS_PATH) {
		return process.env.MCP_SETTINGS_PATH;
	}

	// Try to detect common MCP clients
	const possiblePaths = [];

	switch (platform) {
		case 'win32':
			// VS Code with various MCP extensions
			possiblePaths.push(
				path.join(homeDir, 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'kilocode.kilo-code', 'settings', 'mcp_settings.json'),
				path.join(homeDir, 'AppData', 'Roaming', 'Code', 'User', 'mcp_settings.json'),
				path.join(homeDir, 'AppData', 'Roaming', 'mcp', 'settings.json')
			);
			// Claude Desktop
			possiblePaths.push(path.join(homeDir, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json'));
			break;

		case 'darwin': // macOS
			// VS Code with various MCP extensions  
			possiblePaths.push(
				path.join(homeDir, 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'kilocode.kilo-code', 'settings', 'mcp_settings.json'),
				path.join(homeDir, 'Library', 'Application Support', 'Code', 'User', 'mcp_settings.json'),
				path.join(homeDir, 'Library', 'Application Support', 'mcp', 'settings.json')
			);
			// Claude Desktop
			possiblePaths.push(path.join(homeDir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'));
			break;

		case 'linux':
		default:
			// VS Code with various MCP extensions
			possiblePaths.push(
				path.join(homeDir, '.config', 'Code', 'User', 'globalStorage', 'kilocode.kilo-code', 'settings', 'mcp_settings.json'),
				path.join(homeDir, '.config', 'Code', 'User', 'mcp_settings.json'),
				path.join(homeDir, '.config', 'mcp', 'settings.json')
			);
			// Claude Desktop equivalent
			possiblePaths.push(path.join(homeDir, '.config', 'Claude', 'claude_desktop_config.json'));
			break;
	}

	// Return the first existing path, or default to the first option
	for (const possiblePath of possiblePaths) {
		if (fs.existsSync(possiblePath)) {
			return possiblePath;
		}
	}

	// Default to generic MCP settings path
	return possiblePaths[0] || path.join(homeDir, '.config', 'mcp', 'settings.json');
}

/**
 * Cross-platform path resolution for MCP server
 */
function getMCPServerPath() {
	const homeDir = os.homedir();

	// Default MCP server location (can be overridden via environment variable)
	const defaultPath = process.env.MCP_SERVER_DIR || path.join(homeDir, '.mcp', 'servers');

	return path.join(defaultPath, 'ao-js-sdk-server', 'build', 'index.js');
}

/**
 * Configuration for MCP settings
 */
const CONFIG = {
	mcpSettingsPath: getMCPSettingsPath(),
	serverPath: getMCPServerPath(),
	serverName: 'ao-js-sdk'
};

/**
 * MCP settings configuration generator
 */
class MCPConfigGenerator {
	/**
	 * Detects the MCP client type from the settings path
	 */
	detectMCPClient() {
		const settingsPath = CONFIG.mcpSettingsPath;

		if (settingsPath.includes('Claude')) {
			return 'claude-desktop';
		} else if (settingsPath.includes('Code')) {
			return 'vscode-mcp';
		} else {
			return 'generic-mcp';
		}
	}

	/**
	 * Reads existing MCP settings or creates default structure
	 */
	readExistingSettings() {
		try {
			if (fs.existsSync(CONFIG.mcpSettingsPath)) {
				const content = fs.readFileSync(CONFIG.mcpSettingsPath, 'utf8');
				return JSON.parse(content);
			}
		} catch (error) {
			console.warn('Warning: Could not read existing MCP settings:', error.message);
		}

		// Return default structure based on client type
		const clientType = this.detectMCPClient();

		if (clientType === 'claude-desktop') {
			return {
				mcpServers: {},
				globalShortcut: null
			};
		} else {
			return {
				mcpServers: {}
			};
		}
	}

	/**
	 * Generates the MCP server configuration
	 */
	generateServerConfig() {
		const clientType = this.detectMCPClient();

		// Base configuration
		const config = {
			command: "node",
			args: [CONFIG.serverPath],
			description: "Auto-generated MCP server for AO JS SDK code assistance"
		};

		// Add client-specific options
		if (clientType === 'claude-desktop') {
			// Claude Desktop format
			return config;
		} else {
			// Generic MCP client format (includes VS Code extensions)
			return {
				...config,
				disabled: false,
				alwaysAllow: [],
				disabledTools: []
			};
		}
	}

	/**
	 * Updates or creates the MCP settings file
	 */
	updateMCPSettings() {
		try {
			// Ensure directory exists
			const settingsDir = path.dirname(CONFIG.mcpSettingsPath);
			fs.mkdirSync(settingsDir, { recursive: true });

			// Read existing settings
			const settings = this.readExistingSettings();

			// Add or update the AO SDK server
			settings.mcpServers[CONFIG.serverName] = this.generateServerConfig();

			// Write updated settings
			fs.writeFileSync(CONFIG.mcpSettingsPath, JSON.stringify(settings, null, 2));

			return true;
		} catch (error) {
			console.error('Error updating MCP settings:', error.message);
			return false;
		}
	}

	/**
	 * Checks if the MCP server is properly built
	 */
	checkServerBuild() {
		return fs.existsSync(CONFIG.serverPath);
	}

	/**
	 * Displays configuration information
	 */
	displayInfo(settings) {
		const clientType = this.detectMCPClient();

		console.log('\n📋 MCP Configuration Summary:');
		console.log(`🔧 Server Name: ${CONFIG.serverName}`);
		console.log(`📂 Server Path: ${CONFIG.serverPath}`);
		console.log(`⚙️  Settings File: ${CONFIG.mcpSettingsPath}`);
		console.log(`🛠️  Built Server: ${this.checkServerBuild() ? '✅ Found' : '❌ Missing'}`);
		console.log(`🖥️  Platform: ${os.platform()} (${os.arch()})`);
		console.log(`🔌 MCP Client: ${clientType}`);

		const aoServer = settings.mcpServers[CONFIG.serverName];
		if (aoServer) {
			const status = aoServer.disabled === false ? '✅ Enabled' :
				aoServer.disabled === true ? '🚫 Disabled' :
					'✅ Enabled';
			console.log(`📊 Status: ${status}`);
			console.log(`🔧 Tools Count: Available after client restart`);
		}

		console.log('\n🚀 Next Steps:');
		if (clientType === 'claude-desktop') {
			console.log('1. Restart Claude Desktop to load the new MCP server');
		} else {
			console.log('1. Restart your IDE/editor to load the new MCP server');
		}
		console.log('2. The AO SDK tools will be available for code assistance');
		console.log('3. Use tools like "tokens_aotoken_getbalance" for code examples');

		console.log('\n🔧 Environment Variables (optional):');
		console.log('- MCP_SERVER_DIR: Override server directory');
		console.log('- MCP_SETTINGS_PATH: Override settings file path');
	}

	/**
	 * Provides client and platform-specific setup instructions
	 */
	displayPlatformInstructions() {
		const platform = os.platform();
		const clientType = this.detectMCPClient();

		console.log('\n📚 Setup Instructions:');

		switch (clientType) {
			case 'claude-desktop':
				console.log('Claude Desktop detected:');
				console.log('- Configuration written to Claude Desktop config file');
				console.log('- Restart Claude Desktop to activate the server');
				break;

			case 'vscode-mcp':
				console.log('VS Code MCP Extension detected:');
				console.log('- Configuration written to VS Code MCP settings');
				console.log('- Restart VS Code to activate the server');
				console.log('- Check the MCP extension settings if needed');
				break;

			default:
				console.log('Generic MCP Client:');
				console.log('- Configuration written to generic MCP settings');
				console.log('- Restart your MCP client to activate the server');
				console.log('- Ensure your client supports the MCP protocol');
		}

		console.log(`\n🖥️  Platform Notes (${platform}):`);
		switch (platform) {
			case 'win32':
				console.log('- Settings stored in AppData/Roaming');
				break;
			case 'darwin':
				console.log('- Settings stored in Library/Application Support');
				break;
			case 'linux':
				console.log('- Settings stored in ~/.config');
				break;
		}
	}
}

/**
 * Main execution function
 */
async function main() {
	try {
		console.log('🔧 Configuring AO JS SDK MCP Server...');
		console.log(`🖥️  Platform: ${os.platform()} (${os.arch()})`);

		const generator = new MCPConfigGenerator();
		const clientType = generator.detectMCPClient();

		console.log(`🔌 Detected MCP Client: ${clientType}`);

		// Check if server is built
		if (!generator.checkServerBuild()) {
			console.error('❌ MCP server not found. Run "npm run generate:mcp" first.');
			console.error(`Expected path: ${CONFIG.serverPath}`);
			process.exit(1);
		}

		// Update MCP settings
		console.log('📝 Updating MCP settings...');
		const success = generator.updateMCPSettings();

		if (!success) {
			console.error('❌ Failed to update MCP settings.');
			process.exit(1);
		}

		// Read final settings for display
		const finalSettings = generator.readExistingSettings();

		console.log('✅ MCP settings updated successfully!');
		generator.displayInfo(finalSettings);
		generator.displayPlatformInstructions();

	} catch (error) {
		console.error(`❌ Error: ${error.message}`);
		console.error(error.stack);
		process.exit(1);
	}
}

// Run the configuration
main();