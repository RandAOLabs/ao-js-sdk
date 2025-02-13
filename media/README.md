# Token Client

The Token Client provides functionality for token operations like transfers, balance checks, minting, and granting.

## Usage

```typescript
import { TokenClient } from 'ao-process-clients'

// Initialize client
const tokenClient = TokenClient.autoConfiguration()

// Check balance
const balance = await tokenClient.balance("wallet-address")
console.log(balance) // Returns balance as string

// Get balances with pagination
const balances = await tokenClient.balances(1000, "cursor-id")
console.log(balances) // Returns DryRunResult with balances

// Transfer tokens
const transferSuccess = await tokenClient.transfer("recipient-address", "100", [
    { name: "CustomTag", value: "CustomValue" }
])
console.log(transferSuccess) // true if successful

// Get token info
await tokenClient.getInfo("token-id")

// Mint tokens
const mintSuccess = await tokenClient.mint("1000")
console.log(mintSuccess) // true if successful

// Grant tokens
const grantSuccess = await tokenClient.grant("500", "recipient-address")
console.log(grantSuccess) // true if successful
```