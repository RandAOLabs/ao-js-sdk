# NFT Client

The NFT Client provides functionality for interacting with NFTs on AO, including minting and transfers.

## Usage

```typescript
import { NftClient } from 'ao-process-clients'

// Initialize client
const nftClient = NftClient.autoConfiguration()

// Mint NFT
const mintSuccess = await nftClient.mint(
    "name",
    "description",
    "contentType",
    "data",
    "owner-address"
)
console.log(mintSuccess) // true if successful

// Transfer NFT
const transferSuccess = await nftClient.transfer(
    "recipient-address",
    "token-id"
)
console.log(transferSuccess) // true if successful
```