# ARIO Clients

This directory contains clients for interacting with ar.io services without depending on their SDK.

## ANT Client

The ANT (Arweave Name Token) client provides functionality for interacting with ANT records.

```typescript
import { ANTClient } from './ant';

// Initialize client with process ID
const antClient = new ANTClient("your-ant-process-id");

// Get all ANT records
const records = await antClient.getRecords();
console.log(records);

// Get a specific ANT record
const record = await antClient.getRecord("example");
console.log(record);
```

## ARNS Client

The ARNS (Arweave Name Service) client provides functionality for interacting with ARNS records.

```typescript
import { ARNSClient } from './arns';

// Initialize client with auto-configuration
const arnsClient = ARNSClient.autoConfiguration();

// Get an ARNS record
const record = await arnsClient.getRecord("example_domain");
console.log(record);
```

## Error Handling

Both clients provide specific error types for better error handling:

```typescript
import { 
    ARNSGetRecordError, 
    InvalidDomainError,
    ANTGetRecordsError, 
    ANTGetRecordError 
} from './';

try {
    const record = await arnsClient.getRecord("invalid_domain");
} catch (error) {
    if (error instanceof InvalidDomainError) {
        console.error("Invalid domain format:", error.message);
    } else if (error instanceof ARNSGetRecordError) {
        console.error("Error fetching record:", error.message);
    }
}
