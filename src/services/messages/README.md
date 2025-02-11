# Messages Client

The Messages Client provides functionality for retrieving AO messages (transactions) from Arweave with filtering and pagination support. All queries automatically include the "Data-Protocol:ao" tag to ensure only AO messages are returned.

## Usage

```typescript
import { MessagesClient } from 'ao-process-clients'

// Initialize client
const messagesClient = MessagesClient.getInstance()

// Get latest messages with default parameters (100 messages)
const messages = await messagesClient.getLatestMessages()
console.log(messages) // Returns latest messages with cursor and hasNextPage

// Get messages with filtering and pagination
const filteredMessages = await messagesClient.getLatestMessages({
    limit: 50, // Number of messages to retrieve
    cursor: "previous-cursor", // For pagination
    owner: "owner-address", // Filter by owner
    recipient: "recipient-address", // Filter by recipient
    tags: [ // Additional tags to filter by (Data-Protocol:ao is always included)
        { name: "App-Name", value: "MyApp" },
        { name: "Content-Type", value: "text/plain" }
    ]
})

// Get latest messages sent by an address
const sentMessages = await messagesClient.getLatestMessagesSentBy({
    id: "sender-address", // Required: address to get messages from
    limit: 50, // Optional: number of messages (default 100)
    cursor: "previous-cursor", // Optional: for pagination
    recipient: "recipient-address", // Optional: filter by recipient
    tags: [ // Optional: additional tags to filter by
        { name: "App-Name", value: "MyApp" }
    ]
})

// Get latest messages received by an address
const receivedMessages = await messagesClient.getLatestMessagesReceivedBy({
    id: "recipient-address", // Required: address to get messages for
    limit: 50, // Optional: number of messages (default 100)
    cursor: "previous-cursor", // Optional: for pagination
    owner: "sender-address", // Optional: filter by sender
    tags: [ // Optional: additional tags to filter by
        { name: "App-Name", value: "MyApp" }
    ]
})

// Get all messages (automatically handles pagination)
const allMessages = await messagesClient.getAllMessages({
    tags: [ // Optional: additional tags to filter by
        { name: "App-Name", value: "MyApp" }
    ]
})
console.log(allMessages) // Returns array of all matching messages

// Get all messages sent by an address
const allSentMessages = await messagesClient.getAllMessagesSentBy({
    id: "sender-address", // Required: address to get messages from
    tags: [ // Optional: additional tags to filter by
        { name: "App-Name", value: "MyApp" }
    ]
})
console.log(allSentMessages) // Returns array of all messages sent by the address

// Get all messages received by an address
const allReceivedMessages = await messagesClient.getAllMessagesReceivedBy({
    id: "recipient-address", // Required: address to get messages for
    tags: [ // Optional: additional tags to filter by
        { name: "App-Name", value: "MyApp" }
    ]
})
console.log(allReceivedMessages) // Returns array of all messages received by the address

// For paginated results, use getLatestMessages
if (filteredMessages.hasNextPage) {
    const nextPage = await messagesClient.getLatestMessages({
        cursor: filteredMessages.cursor,
        // ... keep the same filters if needed
    })
}
```

The client provides two types of methods:
1. Latest messages methods (getLatestMessages*) - Return paginated results with cursor and metadata
2. All messages methods (getAllMessages*) - Automatically handle pagination and return arrays of messages

All methods:
- Return messages sorted by block height in descending order (newest first)
- Include all transaction fields (owner, recipient, tags, data info, block info, etc.)
- Automatically include the "Data-Protocol:ao" tag
