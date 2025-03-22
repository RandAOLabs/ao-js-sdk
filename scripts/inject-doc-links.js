const fs = require('fs');
const path = require('path');

/**
 * Regular expressions for finding TypeScript declaration patterns
 */
const DECLARATION_PATTERNS = {
    class: /^export (?:declare )?class\s+(\w+)/m,
    function: /^export (?:declare )?function\s+(\w+)/m
};

/**
 * Creates a documentation link for a given symbol
 * @param {string} symbolName - Name of the class or function
 * @param {string} symbolType - Type of symbol ('class' or 'function')
 * @param {string} docsUrl - Base URL for documentation
 * @returns {string} Formatted documentation link
 */
function createDocLink(symbolName, symbolType, docsUrl) {
    const pluralType = symbolType === 'class' ? 'classes' : `${symbolType}s`;
    return `/**\n * [📘 Read the Docs](${docsUrl}/${pluralType}/${symbolName}.html)\n */\n`;
}

/**
 * Creates a documentation link for inserting into existing docs
 * @param {string} symbolName - Name of the class or function
 * @param {string} symbolType - Type of symbol ('class' or 'function')
 * @param {string} docsUrl - Base URL for documentation
 * @returns {string} Formatted documentation link line
 */
function createDocLinkLine(symbolName, symbolType, docsUrl) {
    const pluralType = symbolType === 'class' ? 'classes' : `${symbolType}s`;
    return ` * @see [📘 Full ${symbolName} Documentation](${docsUrl}/${pluralType}/${symbolName}.html)\n `;
}

/**
 * Recursively finds all .d.ts files in a directory
 * @param {string} directory - Directory to search in
 * @returns {string[]} Array of file paths
 */
function findDeclarationFiles(directory) {
    const files = fs.readdirSync(directory);
    const declarationFiles = [];

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            declarationFiles.push(...findDeclarationFiles(fullPath));
        } else if (file.endsWith('.d.ts')) {
            declarationFiles.push(fullPath);
        }
    }

    return declarationFiles;
}

/**
 * Extracts the symbol name from a declaration match
 * @param {string} declaration - The matched declaration text
 * @param {RegExp} pattern - Pattern to extract the name
 * @returns {string|null} Extracted name or null if no match
 */
function extractSymbolName(declaration, pattern) {
    const match = declaration.match(pattern);
    return match ? match[1] : null;
}

/**
 * Checks if a declaration already has documentation
 * @param {string} content - File content before the declaration
 * @returns {boolean} True if docs exist
 */
function hasExistingDocLink(content) {
    return content.includes('[📘 Read the Docs]');
}

/**
 * Finds the position to insert the doc link
 * @param {string} content - Content before declaration
 * @returns {number} Position of last doc end, or -1 if none
 */
function findDocEndPosition(content) {
    return content.lastIndexOf('*/');
}

/**
 * Processes a single declaration in a file
 * @param {string} content - File content
 * @param {string} declaration - The declaration match
 * @param {string} type - Declaration type ('class' or 'function')
 * @param {RegExp} pattern - Pattern for this declaration type
 * @param {string} docsUrl - Base URL for documentation
 * @returns {{content: string, modified: boolean}} Updated content and modification flag
 */
function processDeclaration(content, declaration, type, pattern, docsUrl) {
    const symbolName = extractSymbolName(declaration, pattern);
    if (!symbolName) return { content, modified: false };

    const position = content.indexOf(declaration);
    const beforeDecl = content.slice(Math.max(0, position - 500), position);

    if (hasExistingDocLink(beforeDecl)) return { content, modified: false };

    const docEndPos = findDocEndPosition(beforeDecl);

    if (docEndPos === -1) {
        // No existing docs, add new block
        const docLink = createDocLink(symbolName, type, docsUrl);
        content = content.slice(0, position) + docLink + content.slice(position);
    } else {
        // Add link to existing docs
        const docLink = createDocLinkLine(symbolName, type, docsUrl);
        const insertPos = position - (beforeDecl.length - docEndPos);
        content = content.slice(0, insertPos) + docLink + content.slice(insertPos);
    }

    return { content, modified: true };
}

/**
 * Processes a single file to add documentation links
 * @param {string} filePath - Path to the file
 * @param {string} docsUrl - Base URL for documentation
 */
function processFile(filePath, docsUrl) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Process each declaration type (class, function)
        for (const [type, pattern] of Object.entries(DECLARATION_PATTERNS)) {
            const declarations = content.match(new RegExp(pattern, 'gm')) || [];

            for (const declaration of declarations) {
                const result = processDeclaration(content, declaration, type, pattern, docsUrl);
                content = result.content;
                modified = modified || result.modified;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Added doc links to ${path.relative(process.cwd(), filePath)}`);
        }
    } catch (err) {
        console.error(`❌ Failed to process ${filePath}: ${err.message}`);
    }
}

// Main execution
try {
    const distDir = path.join(process.cwd(), 'dist');
    const docsUrl = 'https://randaolabs.github.io/ao-process-clients';

    if (!fs.existsSync(distDir)) {
        console.error('❌ dist/ directory not found. Run tsc first.');
        process.exit(1);
    }

    console.log('🔍 Finding .d.ts files...');
    const declarationFiles = findDeclarationFiles(distDir);
    console.log(`Found ${declarationFiles.length} declaration files`);

    console.log('📝 Processing files...');
    for (const file of declarationFiles) {
        processFile(file, docsUrl);
    }

    console.log('✨ Done! Doc links have been injected.');
} catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
}
