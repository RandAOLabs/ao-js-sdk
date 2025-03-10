#!/usr/bin/env ts-node

/**
 * Dynamic test runner that discovers and executes tests based on folder structure
 * Usage: ts-node run-tests.ts <type> <path>
 * Examples:
 * - ts-node run-tests.ts unit services/ario
 * - ts-node run-tests.ts integration clients/staking
 * - ts-node run-tests.ts unit core
 */

import { spawnSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { Logger, LogLevel } from '../../src/utils/logger';

// Types
type TestType = 'unit' | 'integration';

// Constants
const TEST_TYPES: TestType[] = ['unit', 'integration'];
const TEST_ROOT = join(process.cwd(), 'test');
Logger.setLogLevel(LogLevel.DEBUG)

// Helper to list available test paths
function listAvailableTests(type: TestType): void {
    Logger.info(`\nAvailable test paths for ${type}:`);

    function traverseDir(dir: string, indent = '') {
        const items = readdirSync(dir, { withFileTypes: true });

        items.forEach(item => {
            if (item.isDirectory()) {
                const fullPath = join(dir, item.name);
                const relativePath = relative(join(TEST_ROOT, type), fullPath);
                traverseDir(fullPath, `${indent}  `);
            }
        });
    }

    traverseDir(join(TEST_ROOT, type));
}

function getAllSubdirectories(dir: string): string[] {
    const subdirs: string[] = [];

    function traverse(currentDir: string, basePath: string = '') {
        const items = readdirSync(currentDir, { withFileTypes: true });

        items.forEach(item => {
            if (item.isDirectory()) {
                const relativePath = join(basePath, item.name);
                subdirs.push(relativePath);
                traverse(join(currentDir, item.name), relativePath);
            }
        });
    }

    traverse(dir);
    return subdirs;
}

function findTestPaths(type: TestType, searchPath: string): string[] {
    const paths: string[] = [];
    const typeRoot = join(TEST_ROOT, type);

    // Direct match first
    const directPath = join(typeRoot, searchPath);
    if (existsSync(directPath)) {
        paths.push(directPath);
        return paths;
    }

    // Get all possible subdirectories
    const allSubdirs = getAllSubdirectories(typeRoot);

    // Search in all subdirectories
    for (const subdir of allSubdirs) {
        const testPath = join(typeRoot, subdir, searchPath);
        if (existsSync(testPath)) {
            paths.push(testPath);
        }
    }

    return paths;
}

function runTests(testPath: string, isIntegration: boolean = false) {
    const baseCommand = isIntegration ? 'jest --runInBand' : 'jest';
    const relativePath = relative(process.cwd(), testPath).replace(/\\/g, '/');
    return spawnSync('npx', [baseCommand, relativePath], {
        stdio: 'inherit',
        shell: true
    });
}

// Get command line arguments
const args = process.argv.slice(2);
const dashIndex = args.indexOf('--');
const [testType, ...pathParts] = dashIndex >= 0 ? args.slice(dashIndex + 1) : args;
const searchPath = pathParts.join('/');

// Validate test type
if (!TEST_TYPES.includes(testType as TestType)) {
    Logger.error(`Test type must be one of: ${TEST_TYPES.join(', ')}`);
    process.exit(1);
}

const isIntegration = testType === 'integration';

// If no path is provided, run all tests for the type
if (!pathParts.length) {
    Logger.info(`Running all ${testType} tests...`);
    const result = runTests(join(TEST_ROOT, testType), isIntegration);
    process.exit(result.status ?? 1);
}

// Find all matching test paths
const testPaths = findTestPaths(testType as TestType, searchPath);
if (testPaths.length === 0) {
    Logger.error(`Could not find tests for '${searchPath}'`);
    Logger.error('Available test paths:');
    listAvailableTests(testType as TestType);
    process.exit(1);
}

// Run tests for all found paths
Logger.info(`Running ${testType} tests for ${searchPath}...`);
let hasFailures = false;

for (const testPath of testPaths) {
    Logger.info(`Running tests in: ${relative(process.cwd(), testPath)}`);
    const result = runTests(testPath, isIntegration);
    if (result.status !== 0) {
        hasFailures = true;
    }
}

process.exit(hasFailures ? 1 : 0);
