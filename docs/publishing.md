# Publishing Instructions for `ao-process-clients`

This guide details the steps to publish the `ao-process-clients` package to npm. Ensure you have the necessary permissions and access to the npm registry before proceeding.

## Prerequisites

- **Node.js** version `>=22.0.0` (matches project requirements)
- **npm** (comes with Node.js)
- **npm account** with publish access to the `ao-process-clients` package
- **Git** installed for version control

## Step 1: Check or Update the Version

1. Open `package.json`.
2. Update the `"version"` field following [Semantic Versioning](https://semver.org/):
   - **PATCH**: For bug fixes and minor improvements (e.g., `1.0.1`).
   - **MINOR**: For adding new features in a backward-compatible manner (e.g., `1.1.0`).
   - **MAJOR**: For breaking changes (e.g., `2.0.0`).

3. Save `package.json`.

## Step 2: Build the Project

Before publishing, ensure that the TypeScript code is compiled to JavaScript in the `dist` directory.

```bash
npm run build
```
The build script will:

Compile the TypeScript files to JavaScript.
Generate source maps and .d.ts files for type definitions.
Verify that the dist directory contains the compiled output.

## Step 3: Log In to npm
If you’re not already logged in, authenticate with npm by running:
```bash
npm login
```
Follow the prompts to enter your username, password, and email associated with your npm account.
## Step 4: Publish to npm
Run the following command to publish the package to the npm registry:
```bash
npm publish --access public
```
 - '--access public': This is necessary if the package is scoped (e.g., @username/ao-process-clients) and you want it to be public.
 - **Note**: npm automatically runs the prepare script (i.e., npm run build) before publishing, ensuring that the latest code is compiled.

## Step 5: Verify the Package on npm
Once published, verify the package by visiting its npm page:
https://www.npmjs.com/package/ao-process-clients

