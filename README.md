# AO-Process-Clients: A Process Oriented AO Library
[![npm version](https://img.shields.io/npm/v/ao-process-clients)](https://www.npmjs.com/package/ao-process-clients)
[![npm downloads](https://img.shields.io/npm/dm/ao-process-clients)](https://www.npmjs.com/package/ao-process-clients)
[![license](https://img.shields.io/npm/l/ao-process-clients)](https://github.com/RandAOLabs/ao-process-clients/blob/main/LICENSE)
[![issues](https://img.shields.io/github/issues/RandAOLabs/ao-process-clients)](https://github.com/RandAOLabs/ao-process-clients/issues)
[![GitHub stars](https://img.shields.io/github/stars/RandAOLabs/ao-process-clients?style=social)](https://github.com/RandAOLabs/ao-process-clients)
[![Documentation](https://img.shields.io/badge/docs-online-blue)](https://randaolabs.github.io/ao-process-clients/)

<p align="center">
  📚 <a href="https://randaolabs.github.io/ao-process-clients/">Read the Documentation</a>
</p>

A modular TypeScript Process client library for AO Process interactions. This library simplifies interactions with various AO processes.
---
## Install
```bash
npm i ao-process-clients
```

## Quick Start
```typescript
import { TokenClient } from 'ao-process-clients'

// Initialize token client
const tokenClient = TokenClient.autoConfiguration()

// Transfer tokens
const success = await tokenClient.transfer(
    "recipient-address",
    "100000000000000000000"
)
console.log(success) // true if successful
```

## Clients

This library provides several specialized clients for interacting with different AO processes:

### [Token Client](src/clients/token/README.md)
Handles token operations like transfers, balance checks, minting, and granting.

### [Random Client](src/clients/random/README.md)
Manages random number generation through VDF challenges and requests.

### [NFT Client](src/clients/nft/README.md)
Provides NFT functionality including minting and transfers.

### [Staking Client](src/clients/staking/README.md)
Handles staking operations including staking, unstaking, and stake status checks.

### [NFT Sale Client](src/clients/nft-sale/README.md)
Manages NFT sales including adding NFTs to sale, purchasing NFTs, and querying available NFT counts.

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
