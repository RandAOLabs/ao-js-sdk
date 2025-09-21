const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Cross-platform path resolution for MCP servers
 */
function getMCPServerPath() {
	const homeDir = os.homedir();

	// Default MCP server location (can be overridden via environment variable)
	const defaultPath = process.env.MCP_SERVER_DIR || path.join(homeDir, '.mcp', 'servers');

	return path.join(defaultPath, 'ao-js-sdk-server');
}

/**
 * Configuration for MCP server generation
 */
const CONFIG = {
	distDir: path.join(process.cwd(), 'dist'),
	outputDir: getMCPServerPath(),
	packageName: 'ao-js-sdk-mcp',
	serverName: 'ao-js-sdk',
	docsUrl: 'https://randaolabs.github.io/ao-js-sdk'
};

/**
 * Regular expressions for parsing TypeScript declarations
 */
const PATTERNS = {
	class: /^export declare class\s+(\w+)/m,
	method: /^\s*(\w+)\s*\([^)]*\)\s*:\s*([^;]+);/gm,
	staticMethod: /^\s*static\s+(\w+)\s*\([^)]*\)\s*:\s*([^;]+);/gm,
	interface: /^export interface\s+(\w+)/m,
	comment: /\/\*\*([\s\S]*?)\*\//g,
	category: /@category\s+(\w+)/,
	description: /\*\s*([^@*\n][^*\n]*)/g,
	param: /@param\s+(\w+)\s+([^@\n]*)/g,
	returns: /@returns?\s+([^@\n]*)/,
	docLink: /@see\s+\[📘.*?\]\((.*?)\)/
};

/**
 * Extracts client information from declaration files
 */
class ClientExtractor {
	constructor() {
		this.clients = new Map();
		this.interfaces = new Map();
	}

	/**
	 * Recursively finds all .d.ts files in a directory
	 */
	findDeclarationFiles(directory) {
		const files = fs.readdirSync(directory);
		const declarationFiles = [];

		for (const file of files) {
			const fullPath = path.join(directory, file);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				declarationFiles.push(...this.findDeclarationFiles(fullPath));
			} else if (file.endsWith('.d.ts') && !file.includes('.map')) {
				declarationFiles.push(fullPath);
			}
		}

		return declarationFiles;
	}

	/**
	 * Extracts TSDoc comments and metadata
	 */
	extractComment(content, position) {
		const beforeDecl = content.slice(Math.max(0, position - 1000), position);
		const commentMatch = beforeDecl.match(/\/\*\*([\s\S]*?)\*\/\s*$/);

		if (!commentMatch) return null;

		const comment = commentMatch[1];
		const category = comment.match(PATTERNS.category)?.[1] || 'General';
		const docLink = comment.match(PATTERNS.docLink)?.[1];

		// Extract description (first non-tag line)
		const lines = comment.split('\n').map(l => l.replace(/^\s*\*\s?/, ''));
		const description = lines.find(l => l.trim() && !l.startsWith('@')) || '';

		return {
			category,
			description,
			docLink,
			raw: comment
		};
	}

	/**
	 * Extracts methods from a class declaration
	 */
	extractMethods(content, className) {
		const methods = [];
		let match;

		// Extract instance methods
		PATTERNS.method.lastIndex = 0;
		while ((match = PATTERNS.method.exec(content)) !== null) {
			const [fullMatch, methodName, returnType] = match;
			if (methodName === 'constructor') continue;

			const position = content.indexOf(fullMatch);
			const comment = this.extractComment(content, position);

			methods.push({
				name: methodName,
				returnType: returnType.trim(),
				isStatic: false,
				comment,
				signature: fullMatch.trim()
			});
		}

		// Extract static methods
		PATTERNS.staticMethod.lastIndex = 0;
		while ((match = PATTERNS.staticMethod.exec(content)) !== null) {
			const [fullMatch, methodName, returnType] = match;

			const position = content.indexOf(fullMatch);
			const comment = this.extractComment(content, position);

			methods.push({
				name: methodName,
				returnType: returnType.trim(),
				isStatic: true,
				comment,
				signature: fullMatch.trim()
			});
		}

		return methods;
	}

	/**
	 * Processes a single declaration file
	 */
	processFile(filePath) {
		try {
			const content = fs.readFileSync(filePath, 'utf8');
			const relativePath = path.relative(CONFIG.distDir, filePath);

			// Extract class declarations
			const classMatch = content.match(PATTERNS.class);
			if (classMatch) {
				const className = classMatch[1];
				const position = content.indexOf(classMatch[0]);
				const comment = this.extractComment(content, position);
				const methods = this.extractMethods(content, className);

				// Filter out internal/private methods and focus on client classes
				const publicMethods = methods.filter(m =>
					!m.name.startsWith('_') &&
					!m.name.includes('private') &&
					!m.name.includes('Protected')
				);

				if (publicMethods.length > 0 && this.isClientClass(className, relativePath)) {
					this.clients.set(className, {
						name: className,
						filePath: relativePath,
						comment,
						methods: publicMethods,
						category: comment?.category || 'General'
					});
				}
			}

		} catch (error) {
			console.warn(`Warning: Could not process ${filePath}: ${error.message}`);
		}
	}

	/**
	 * Determines if a class is a client class worth exposing
	 */
	isClientClass(className, filePath) {
		// Include classes that are clearly clients
		if (className.includes('Client') || className.includes('Service')) {
			return true;
		}

		// Include specific token classes
		if (filePath.includes('tokens/') && className.includes('Token')) {
			return true;
		}

		// Include classes in client directories
		if (filePath.includes('clients/')) {
			return true;
		}

		return false;
	}

	/**
	 * Extracts all client information from the dist directory
	 */
	extractAll() {
		console.log('🔍 Finding declaration files...');
		const declarationFiles = this.findDeclarationFiles(CONFIG.distDir);
		console.log(`Found ${declarationFiles.length} declaration files`);

		console.log('📝 Processing files...');
		for (const file of declarationFiles) {
			this.processFile(file);
		}

		console.log(`✅ Extracted ${this.clients.size} clients with ${Array.from(this.clients.values()).reduce((sum, c) => sum + c.methods.length, 0)} methods`);

		return {
			clients: Array.from(this.clients.values()),
			interfaces: Array.from(this.interfaces.values())
		};
	}
}

/**
 * Generates MCP server code from extracted client information
 */
class MCPServerGenerator {
	constructor(clients, interfaces) {
		this.clients = clients;
		this.interfaces = interfaces;
	}

	/**
	 * Generates tool name from class and method name
	 */
	generateToolName(client, method) {
		const category = client.category.toLowerCase();
		const clientName = client.name.replace('Client', '').toLowerCase();
		const methodName = method.name.toLowerCase();

		return `${category}_${clientName}_${methodName}`.replace(/[^a-z0-9_]/g, '_');
	}

	/**
	 * Generates the main MCP server TypeScript file
	 */
	generateServerCode() {
		const header = `#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Auto-generated AO JS SDK MCP Server
// Generated from ao-js-sdk v${require('../package.json').version}
// Generation time: ${new Date().toISOString()}

const server = new McpServer({
  name: "${CONFIG.serverName}",
  version: "0.0.0",
  description: "Auto-generated MCP server providing code assistance for the AO JS SDK"
});

// Client reference data
const CLIENT_DATA = ${JSON.stringify(this.clients, null, 2)};
`;

		const tools = this.generateAllTools();
		const resources = this.generateAllResources();
		const utilityFunctions = this.generateUtilityFunctions();

		const footer = `
// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('AO JS SDK MCP server running on stdio');
`;

		return header + utilityFunctions + tools + resources + footer;
	}

	/**
	 * Generates all MCP tools
	 */
	generateAllTools() {
		let toolsCode = '\n// Generated MCP Tools\n';

		for (const client of this.clients) {
			for (const method of client.methods) {
				const toolName = this.generateToolName(client, method);
				toolsCode += this.generateSingleTool(toolName, client, method);
			}
		}

		return toolsCode;
	}

	/**
	 * Generates a single MCP tool
	 */
	generateSingleTool(toolName, client, method) {
		const description = method.comment?.description || `Execute ${client.name}.${method.name}`;
		const docLink = method.comment?.docLink || client.comment?.docLink || 'See AO JS SDK documentation';

		return `
server.tool(
  "${toolName}",
  {
    // Parameters would be extracted from method signature if needed
  },
  async (params: any) => {
    try {
      const codeExample = generateCodeExample("${client.name}", "${method.name}", params);
      
      return {
        content: [
          {
            type: "text",
            text: generateToolResponse("${client.name}", "${method.name}", "${method.returnType}", "${description}", "${client.category}", "${docLink}", codeExample, params)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: "Error: " + String(error?.message || error)
          }
        ],
        isError: true
      };
    }
  }
);
`;
	}

	/**
	 * Generates all MCP resources
	 */
	generateAllResources() {
		return `
// SDK Reference Resource
server.resource(
  "ao_sdk_reference",
  "ao-sdk://reference/all",
  async () => {
    return {
      contents: [
        {
          uri: "ao-sdk://reference/all",
          mimeType: "application/json",
          text: JSON.stringify(CLIENT_DATA, null, 2)
        }
      ]
    };
  }
);

// Code Examples Resource
server.resource(
  "ao_sdk_examples",
  "ao-sdk://examples/all",
  async () => {
    let examples = "# AO JS SDK Code Examples\\n\\n";
    
    CLIENT_DATA.forEach((client: any) => {
      examples += \`## \${client.name} (\${client.category})\\n\\n\`;
      client.methods.forEach((method: any) => {
        const example = generateCodeExample(client.name, method.name, {});
        examples += \`### \${method.name}\\n\\\`\\\`\\\`typescript\\n\${example}\\n\\\`\\\`\\\`\\n\\n\`;
      });
    });
    
    return {
      contents: [
        {
          uri: "ao-sdk://examples/all",
          mimeType: "text/plain",
          text: examples
        }
      ]
    };
  }
);
`;
	}

	/**
	 * Generates utility functions
	 */
	generateUtilityFunctions() {
		return `
// Utility Functions
function generateCodeExample(clientName: string, methodName: string, parameters: any = {}): string {
  const client = CLIENT_DATA.find(c => c.name === clientName);
  if (!client) return \`// Client \${clientName} not found\`;
  
  const method = client.methods.find(m => m.name === methodName);
  if (!method) return \`// Method \${methodName} not found on \${clientName}\`;
  
  let example = \`// Example usage of \${clientName}.\${methodName}\\n\`;
  example += \`import { \${clientName} } from 'ao-js-sdk';\\n\\n\`;
  
  if (method.isStatic) {
    if (methodName === 'autoConfiguration') {
      example += \`const client = await \${clientName}.autoConfiguration();\\n\`;
    } else if (methodName === 'defaultBuilder') {
      example += \`const builder = await \${clientName}.defaultBuilder();\\n\`;
      example += \`const client = builder.build();\\n\`;
    } else {
      example += \`const result = await \${clientName}.\${methodName}();\\n\`;
    }
  } else {
    example += \`const client = await \${clientName}.autoConfiguration();\\n\`;
    example += \`const result = await client.\${methodName}();\\n\`;
  }
  
  return example;
}

function generateToolResponse(
  clientName: string, 
  methodName: string, 
  returnType: string, 
  description: string, 
  category: string, 
  docLink: string, 
  codeExample: string, 
  params: any
): string {
  return \`📋 **\${clientName}.\${methodName}**

**Description:** \${description}

**Category:** \${category}

**Return Type:** \${returnType}

**Code Example:**
\\\`\\\`\\\`typescript
\${codeExample}
\\\`\\\`\\\`

**Documentation:** \${docLink}

**Parameters Used:**
\${Object.entries(params).map(([key, value]) => \`- \${key}: \${value}\`).join('\\n') || 'None'}
\`;
}
`;
	}

	/**
	 * Generates package.json for the MCP server
	 */
	generatePackageJson() {
		return {
			name: CONFIG.packageName,
			version: "0.0.0",
			description: "Auto-generated MCP server for AO JS SDK",
			type: "module",
			main: "build/index.js",
			scripts: {
				build: "tsc",
				start: "node build/index.js"
			},
			dependencies: {
				"@modelcontextprotocol/sdk": "^1.0.0",
				"zod": "^3.22.0"
			},
			devDependencies: {
				"typescript": "^5.6.0",
				"@types/node": "^22.0.0"
			},
			keywords: ["mcp", "ao", "sdk", "arweave", "code-assistance"],
			author: "Auto-generated from ao-js-sdk",
			license: "MIT"
		};
	}

	/**
	 * Generates TypeScript configuration
	 */
	generateTsConfig() {
		return {
			compilerOptions: {
				target: "ES2022",
				module: "ESNext",
				moduleResolution: "node",
				outDir: "./build",
				rootDir: "./src",
				strict: true,
				esModuleInterop: true,
				skipLibCheck: true,
				forceConsistentCasingInFileNames: true,
				declaration: true,
				declarationMap: true,
				sourceMap: true
			},
			include: ["src/**/*"],
			exclude: ["node_modules", "build"]
		};
	}
}

/**
 * Main execution function
 */
async function main() {
	try {
		console.log('🚀 Starting AO JS SDK MCP Server generation...');

		// Check if dist directory exists
		if (!fs.existsSync(CONFIG.distDir)) {
			console.error('❌ dist/ directory not found. Run npm run build first.');
			process.exit(1);
		}

		// Extract client information
		const extractor = new ClientExtractor();
		const { clients, interfaces } = extractor.extractAll();

		if (clients.length === 0) {
			console.error('❌ No clients found. Check the declaration files.');
			process.exit(1);
		}

		// Generate MCP server
		const generator = new MCPServerGenerator(clients, interfaces);

		console.log('📁 Creating output directory...');
		console.log(`📂 Output path: ${CONFIG.outputDir}`);
		fs.mkdirSync(CONFIG.outputDir, { recursive: true });
		fs.mkdirSync(path.join(CONFIG.outputDir, 'src'), { recursive: true });

		// Generate files
		console.log('📝 Generating MCP server code...');
		const serverCode = generator.generateServerCode();
		fs.writeFileSync(path.join(CONFIG.outputDir, 'src', 'index.ts'), serverCode);

		const packageJson = generator.generatePackageJson();
		fs.writeFileSync(path.join(CONFIG.outputDir, 'package.json'), JSON.stringify(packageJson, null, 2));

		const tsConfig = generator.generateTsConfig();
		fs.writeFileSync(path.join(CONFIG.outputDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

		// Create README
		const readmeContent = `# AO JS SDK MCP Server

Auto-generated MCP server providing code assistance for the AO JS SDK.

## Installation

\`\`\`bash
npm install -g ao-js-sdk-mcp
\`\`\`

## Usage

This server provides tools for generating code examples and exploring the AO JS SDK.

**Generated from:** ao-js-sdk v${require('../package.json').version}
**Generated on:** ${new Date().toISOString()}
**Total clients:** ${clients.length}
**Total methods:** ${clients.reduce((sum, c) => sum + c.methods.length, 0)}

## Environment Variables

- \`MCP_SERVER_DIR\`: Override the default MCP server directory (default: \`~/.mcp/servers\`)
`;

		fs.writeFileSync(path.join(CONFIG.outputDir, 'README.md'), readmeContent);

		console.log(`✨ MCP server generated successfully!`);
		console.log(`📂 Output directory: ${CONFIG.outputDir}`);
		console.log(`🔧 Clients processed: ${clients.length}`);
		console.log(`⚡ Tools generated: ${clients.reduce((sum, c) => sum + c.methods.length, 0)}`);
		console.log(`\n📋 Next steps:`);
		console.log(`1. cd "${CONFIG.outputDir}"`);
		console.log(`2. npm install`);
		console.log(`3. npm run build`);
		console.log(`4. Configure MCP settings to use the generated server`);

	} catch (error) {
		console.error(`❌ Error: ${error.message}`);
		console.error(error.stack);
		process.exit(1);
	}
}

// Run the generator
main();