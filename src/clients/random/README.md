# Random Client

The Random Client provides functionality for interacting with the Random Process, including managing VDF challenges and random requests.

## Usage

```typescript
import { RandomClient } from 'ao-process-clients'

// Initialize client
const randomClient = RandomClient.autoConfiguration()

// Post VDF challenge
const challengeSuccess = await randomClient.postVDFChallenge(
    "request-id",
    "modulus",
    "input"
)
console.log(challengeSuccess) // true if successful

// Get provider's available values
const availableValues = await randomClient.getProviderAvailableValues("provider-id")
console.log(availableValues) // Returns provider's available values

// Update provider's available values
const updateSuccess = await randomClient.updateProviderAvailableValues(100)
console.log(updateSuccess) // true if successful

// Get open random requests
const openRequests = await randomClient.getOpenRandomRequests("provider-id")
console.log(openRequests) // Returns open random requests

// Get random requests by IDs
const requests = await randomClient.getRandomRequests(["request-id-1", "request-id-2"])
console.log(requests) // Returns random requests information

// Get random request via callback ID
const request = await randomClient.getRandomRequestViaCallbackId("callback-id")
console.log(request) // Returns random request information

// Create request
const createSuccess = await randomClient.createRequest(
    ["provider-id-1", "provider-id-2"],
    5, // requestedInputs (optional)
    "callback-id" // optional
)
console.log(createSuccess) // true if successful

// Post VDF output and proof
const proofSuccess = await randomClient.postVDFOutputAndProof(
    "request-id",
    "output",
    "proof"
)
console.log(proofSuccess) // true if successful
```