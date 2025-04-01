import { Project } from 'ts-morph';
import * as path from 'path';

// Initialize project
const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

// Add all source files
project.addSourceFilesAtPaths("src/**/*.ts");

const sourceFiles = project.getSourceFiles();

// Process each source file
sourceFiles.forEach(sourceFile => {
    let hasChanges = false;
    const filePath = sourceFile.getFilePath();

    // Process imports
    sourceFile.getImportDeclarations().forEach(importDecl => {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();

        // Only process imports that start with 'src/'
        if (moduleSpecifier.startsWith('src/')) {
            // Remove the 'src/' prefix to get the actual path
            const actualPath = moduleSpecifier.substring(4);

            // Calculate relative path from current file to imported file
            const relativePath = path.relative(
                path.dirname(filePath),
                path.join(process.cwd(), 'src', actualPath)
            ).replace(/\\/g, '/'); // Convert Windows backslashes to forward slashes

            // Add './' prefix if the path doesn't start with '..' or '.'
            const finalPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;

            // Update the import declaration
            importDecl.setModuleSpecifier(finalPath);
            hasChanges = true;
        }
    });

    // Process exports
    sourceFile.getExportDeclarations().forEach(exportDecl => {
        const moduleSpecifier = exportDecl.getModuleSpecifierValue();

        // Only process exports that have a module specifier and start with 'src/'
        if (moduleSpecifier && moduleSpecifier.startsWith('src/')) {
            // Remove the 'src/' prefix to get the actual path
            const actualPath = moduleSpecifier.substring(4);

            // Calculate relative path from current file to exported file
            const relativePath = path.relative(
                path.dirname(filePath),
                path.join(process.cwd(), 'src', actualPath)
            ).replace(/\\/g, '/'); // Convert Windows backslashes to forward slashes

            // Add './' prefix if the path doesn't start with '..' or '.'
            const finalPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;

            // Update the export declaration
            exportDecl.setModuleSpecifier(finalPath);
            hasChanges = true;
        }
    });

    // Save changes if any were made
    if (hasChanges) {
        sourceFile.saveSync();
        console.log(`Updated imports in: ${path.relative(process.cwd(), filePath)}`);
    }
});

// Update tsconfig.json to remove paths
const fs = require('fs');
const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));

// Remove paths configuration
if (tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
    delete tsConfig.compilerOptions.paths;
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 4));
    console.log('Removed paths configuration from tsconfig.json');
}

console.log('Conversion complete!');
