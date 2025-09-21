# Using the AO JS SDK MCP Server

This guide explains how to download, install, and use the AO JS SDK MCP server with your AI/LLM tools for code assistance.

## What is the AO JS SDK MCP Server?

The AO JS SDK MCP server provides AI models with expert knowledge of the AO JavaScript SDK, enabling them to:
- Generate correct code examples for any AO operation
- Provide complete API documentation and method signatures
- Suggest best practices for AO development
- Help with token transfers, profile management, randomness generation, and more

## Quick Start

### Option 1: From NPM Package (Recommended)

```bash
# Install the MCP server globally
npm install -g ao-js-sdk-mcp-server

# The server will be automatically configured for most MCP clients
```

### Option 2: From Source

```bash
# Clone the AO JS SDK repository
git clone https://github.com/RandAOLabs/ao-js-sdk.git
cd ao-js-sdk

# Generate and setup the MCP server
npm install
npm run setup:mcp
```

## MCP Client Setup

### Claude Desktop

1. **Locate your Claude Desktop config file:**
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add the AO SDK server to your config:**
```json
{
  "mcpServers": {
    "ao-js-sdk": {
      "command": "node",
      "args": ["/path/to/.mcp/servers/ao-js-sdk-server/build/index.js"]
    }
  }
}
```

3. **Restart Claude Desktop**

### VS Code with MCP Extension

1. **Install an MCP extension** (like Kilo Code MCP extension)

2. **The server should auto-configure**, or manually add to MCP settings:
```json
{
  "mcpServers": {
    "ao-js-sdk": {
      "command": "node", 
      "args": ["/path/to/.mcp/servers/ao-js-sdk-server/build/index.js"],
      "disabled": false
    }
  }
}
```

3. **Restart VS Code**

### Other MCP Clients

For any MCP-compatible client, add the server configuration with:
- **Command**: `node`
- **Args**: `["/path/to/.mcp/servers/ao-js-sdk-server/build/index.js"]`
- **Transport**: stdio

## Available Tools & Resources

### Token Operations
- `tokens_aotoken_getbalance` - Get AO token balance
- `tokens_aotoken_transfer` - Transfer AO tokens
- `tokens_llamatoken_getbalance` - Get Llama token balance
- `tokens_rngtoken_transfer` - Transfer RNG tokens
- And more for all supported tokens...

### Profile Management
- `bazar_profile_getprofileinfo` - Get user profile information
- `bazar_profile_transferasset` - Transfer assets between profiles
- `bazar_profileregistry_getprofilebywalletaddress` - Find profiles by wallet

### RandAO Services
- `randao_random_createrequest` - Request random numbers
- `randao_providerstaking_stake` - Stake as randomness provider
- `randao_providerprofile_updatedetails` - Update provider information

### Autonomous Finance
- `autonomous_botegaamm_getprice` - Get AMM token prices
- `pi_delegate_setdelegation` - Delegate PI tokens
- `autonomous_fairlaunchprocess_withdrawao` - Withdraw from fair launch

### Miscellaneous Tools
- `miscellaneous_raffle_pullraffle` - Participate in raffles
- `miscellaneous_sweepstakes_registersweepstakes` - Register sweepstakes
- `miscellaneous_faucet_usefaucet` - Use token faucets

### Documentation Resources
- `ao_sdk_reference` - Complete SDK client reference
- `ao_sdk_examples` - All code examples and usage patterns

## Example Usage

### Ask Your AI Model

**"How do I get the balance of AO tokens?"**

The AI will use the `tokens_aotoken_getbalance` tool and provide:

```typescript
// Example usage of AOToken.getBalance
import { AOToken } from 'ao-js-sdk';

const client = await AOToken.autoConfiguration();
const result = await client.getBalance();
```

**"Show me how to transfer tokens to another wallet"**

The AI will use the `tokens_aotoken_transfer` tool and provide complete code with proper error handling.

**"Help me set up a raffle using AO"**

The AI will use multiple raffle tools to show the complete setup process.

## Common Use Cases

### 1. Token Development
Ask for help with:
- Creating token clients
- Handling transfers and balances
- Working with different token types (AO, RNG, Llama, etc.)

### 2. Profile Integration
Get assistance with:
- User profile creation and management
- Asset transfers between profiles
- Profile registry lookups

### 3. Randomness Integration
Learn how to:
- Request random numbers via RandAO
- Set up randomness providers
- Handle staking and rewards

### 4. DeFi Development
Understand:
- AMM integration and price queries
- Liquidity pool operations
- PI token delegation strategies

## Troubleshooting

### Server Not Detected

**Check server installation:**
```bash
# Verify server exists
ls ~/.mcp/servers/ao-js-sdk-server/build/index.js

# Test server manually
node ~/.mcp/servers/ao-js-sdk-server/build/index.js --help
```

**Regenerate if needed:**
```bash
# If you have the source
cd ao-js-sdk
npm run setup:mcp

# Or reinstall from npm
npm install -g ao-js-sdk-mcp-server
```

### Tools Not Available

1. **Restart your MCP client** (Claude Desktop, VS Code, etc.)
2. **Check MCP client logs** for connection errors
3. **Verify configuration** in your MCP settings file
4. **Test connection** manually if your client supports it

### Permission Issues

**Linux/macOS:**
```bash
# Ensure proper permissions
chmod +x ~/.mcp/servers/ao-js-sdk-server/build/index.js

# Check Node.js access
node --version
```

**Windows:**
- Run terminal as administrator if needed
- Ensure Node.js is in your PATH

## Platform-Specific Notes

### Windows
- Settings stored in `%APPDATA%` directories
- Use backslashes in manual file paths
- PowerShell and Command Prompt both supported

### macOS
- Settings in `~/Library/Application Support/`
- Executable permissions may need manual setting
- Both Terminal and iTerm2 supported

### Linux
- Settings in `~/.config/` directories
- Package managers may install to different locations
- Most distributions supported

## Advanced Configuration

### Custom Installation Directory

```bash
# Set custom server directory
export MCP_SERVER_DIR="/custom/mcp/servers"

# Generate with custom location
npm run setup:mcp
```

### Custom MCP Settings Path

```bash
# Use custom settings file
export MCP_SETTINGS_PATH="/custom/path/mcp_settings.json"

# Configure with custom path
npm run configure:mcp
```

### Multiple SDK Versions

You can install multiple versions by using different server names:

```json
{
  "mcpServers": {
    "ao-js-sdk-v0-2": {
      "command": "node",
      "args": ["/path/to/v0.2/ao-js-sdk-server/build/index.js"]
    },
    "ao-js-sdk-latest": {
      "command": "node", 
      "args": ["/path/to/latest/ao-js-sdk-server/build/index.js"]
    }
  }
}
```

## Getting Help

### Documentation
- [Technical Documentation](./mcp-server-generation.md) - For developers and customization
- [AO JS SDK Docs](https://randaolabs.github.io/ao-js-sdk/) - Complete API reference
- [Environment Setup](./environment.md) - SDK configuration

### Support
- **GitHub Issues**: [ao-js-sdk/issues](https://github.com/RandAOLabs/ao-js-sdk/issues)
- **Discord**: Join the AO development community
- **Documentation**: Check the generated tool descriptions

### Example Questions for Your AI

Try asking your AI assistant:
- "Show me how to create an AO token client"
- "Help me transfer tokens using the AO SDK"
- "How do I set up RandAO randomness generation?"
- "Generate code for profile management"
- "What are all the available AO token types?"

---

*The MCP server provides instant access to 390+ tools covering every aspect of AO development. Start building with AI assistance today!*