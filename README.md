# ao.js: A Process Oriented AO Library
[![npm version](https://img.shields.io/npm/v/ao-js-sdk)](https://www.npmjs.com/package/ao-js-sdk)
[![npm downloads](https://img.shields.io/npm/dm/ao-js-sdk)](https://www.npmjs.com/package/ao-js-sdk)
[![license](https://img.shields.io/npm/l/ao-js-sdk)](https://github.com/RandAOLabs/ao-js-sdk/blob/main/LICENSE)
[![issues](https://img.shields.io/github/issues/RandAOLabs/ao-js-sdk)](https://github.com/RandAOLabs/ao-js-sdk/issues)
[![GitHub stars](https://img.shields.io/github/stars/RandAOLabs/ao-js-sdk?style=social)](https://github.com/RandAOLabs/ao-js-sdk)
[![Documentation](https://img.shields.io/badge/docs-online-blue)](https://randaolabs.github.io/ao-js-sdk/)

<p align="center">
  📚 <a href="https://randaolabs.github.io/ao-js-sdk/">Read the Documentation</a>
</p>

A modular TypeScript Process client library for AO Process interactions. This library simplifies interactions with various AO processes.
---
## Install
```bash
npm i ao-js-sdk
```

## Environment
### Node
Create a `.env` file:
```
# Defaults to wallet.json if not specified
PATH_TO_WALLET="wallet.json"
```
And a JWKInterface json file representing a wallet.
### Browser
Ensure `globalThis.arweaveWallet` is set to an arweave wallet.
