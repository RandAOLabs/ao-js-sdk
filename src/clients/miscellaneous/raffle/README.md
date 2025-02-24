# Raffle Client

The Raffle Client provides functionality for interacting with the Raffle Process, including managing raffle entrants and viewing raffle pulls.

## Usage

```typescript
import { RaffleClient } from 'ao-process-clients'

// Initialize client
const raffleClient = RaffleClient.autoConfiguration()

// Set raffle entrants
const entrants = [
    "James Smith", "Mary Johnson", "Robert Williams",
    "Patricia Brown", "John Jones", // ... more entrants
]
const setSuccess = await raffleClient.setRaffleEntrants(entrants)
console.log(setSuccess) // true if successful

// Pull a raffle
const pullSuccess = await raffleClient.pullRaffle()
console.log(pullSuccess) // true if successful

// View all pulls
const pulls = await raffleClient.viewPulls()
console.log(pulls) // Returns list of all raffle pulls with their details

// View specific pull
const pull = await raffleClient.viewPull("4")
console.log(pull) // Returns details of pull #4

// View entrants for a specific user's raffle
const entrants = await raffleClient.viewEntrants("user123")
console.log(entrants) // Returns array of entrant names

// View specific pull for a user
const userPull = await raffleClient.viewUserPull("user123", "4")
console.log(userPull) // Returns details of user's pull #4

// View all pulls for a user
const userPulls = await raffleClient.viewUserPulls("user123")
console.log(userPulls) // Returns list of all raffle pulls for the user

// View all raffle owners
const owners = await raffleClient.viewRaffleOwners()
console.log(owners) // Returns array of user IDs who own raffles
