# NFT Sale Client

The NFT Sale Client provides functionality for managing NFT sales, including adding NFTs to a sale, purchasing NFTs, and querying available NFT counts.

## Usage

```typescript
import { NftSaleClient } from 'ao-process-clients'

// Initialize client with auto configuration
const nftSaleClient = await NftSaleClient.createAutoConfigured()

// Add an NFT to the sale
const addSuccess = await nftSaleClient.addNft("nft-process-id")
console.log(addSuccess) // true if successful

// Query available NFT count
const count = await nftSaleClient.queryNFTCount()
console.log(count) // Returns number of NFTs available for purchase

// Purchase an NFT
// Note: This will transfer tokens from your wallet to the sale process
const purchaseSuccess = await nftSaleClient.purchaseNft()
console.log(purchaseSuccess) // true if successful
```

## Auto Configuration

The client can be initialized with default configuration using `createAutoConfigured()`:

```typescript
const nftSaleClient = await NftSaleClient.createAutoConfigured()
```

This will configure:
- NFT Sale process ID from environment
- Token process ID for purchases
- Default purchase amount (1 token with 18 decimals)
- Wallet configuration from environment

## Error Handling

The client provides specific error types for different failure scenarios:

```typescript
import { 
    NftSaleClientError,
    PurchaseNftError,
    QueryNFTCountError,
    AddNftError 
} from 'ao-process-clients'

try {
    await nftSaleClient.purchaseNft()
} catch (error) {
    if (error instanceof PurchaseNftError) {
        console.error('Purchase failed:', error.message)
    }
}
