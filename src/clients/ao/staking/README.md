# Staking Client

The Staking Client provides functionality for staking, unstaking, and checking stake status.

## Usage

```typescript
import { StakingClient } from 'ao-process-clients'

// Initialize client
const stakingClient = StakingClient.autoConfiguration()

// Update provider details
const details = {
    name: "My Provider",
    commission: 10,
    description: "A reliable staking provider",
    twitter: "@myprovider",      // Optional
    discord: "provider#1234",    // Optional
    telegram: "@provider"        // Optional
};
const updateResult = await stakingClient.updateDetails(details)
console.log(updateResult) // Returns message ID

// Stake tokens (basic)
const stakeResult = await stakingClient.stake("100000000000000000000")
console.log(stakeResult) // "Stake successful"

// Stake tokens with provider details
const stakeWithDetailsResult = await stakingClient.stake(
    "100000000000000000000",
    {
        name: "My Provider",
        commission: 10,
        description: "A reliable staking provider",
        twitter: "@myprovider"   // Optional social fields
    }
)
console.log(stakeWithDetailsResult) // "Stake successful"

// Get stake for a provider
const stake = await stakingClient.getStake("provider-id")
console.log(stake) // Returns stake information

// Unstake tokens
const unstakeResult = await stakingClient.unstake("provider-id")
console.log(unstakeResult) // Returns unstake status
```
