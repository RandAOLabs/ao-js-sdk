/**
 * Base error class for ANT client errors
 */
export class ANTClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'ANTClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

/**
 * Error thrown when fetching ANT records fails
 */
export class GetANTRecordsError extends ANTClientError {
    constructor(originalError?: Error) {
        super('Error fetching ANT records', originalError);
        this.name = 'GetRecordsError';
    }
}

/**
 * Error thrown when fetching a specific ANT record fails
 */
export class GetANTRecordError extends ANTClientError {
    constructor(name: string, originalError?: Error) {
        super(`Error fetching ANT record for name: ${name}`, originalError);
        this.name = 'GetRecordError';
    }
}

/**
 * Error thrown when fetching a process ID for an ANT record fails
 */
export class GetProcessIdError extends ANTClientError {
    constructor(name: string, originalError?: Error) {
        super(`Error fetching process ID for ANT name: ${name}`, originalError);
        this.name = 'GetProcessIdError';
    }
}
