# AO-Process-Clients: A Process Oriented AO Library
[![npm version](https://img.shields.io/npm/v/ao-process-clients)](https://www.npmjs.com/package/ao-process-clients)
[![npm downloads](https://img.shields.io/npm/dm/ao-process-clients)](https://www.npmjs.com/package/ao-process-clients)
[![license](https://img.shields.io/npm/l/ao-process-clients)](https://github.com/RandAOLabs/ao-process-clients/blob/main/LICENSE)
[![issues](https://img.shields.io/github/issues/RandAOLabs/ao-process-clients)](https://github.com/RandAOLabs/ao-process-clients/issues)
[![GitHub stars](https://img.shields.io/github/stars/RandAOLabs/ao-process-clients?style=social)](https://github.com/RandAOLabs/ao-process-clients)

A modular TypeScript Process client library for AO Process interactions. This library simplifies interactions with various AO processes.
---
## Install
```bash
npm i ao-process-clients
```
## Getting Started
```ts
import { IRandomClient, RandomClient } from "ao-process-clients"

const client: IRandomClient = RandomClient.autoConfiguration()
client.getOpenRandomRequests("providerId")
```

## Environment
### Node
Create a `.env` file:
```
PATH_TO_WALLET="wallet.json"
```
And a JWKInterface json file representing a wallet.
### Browser
Ensure `globalThis.arweaveWallet` is set to an arweave wallet.
