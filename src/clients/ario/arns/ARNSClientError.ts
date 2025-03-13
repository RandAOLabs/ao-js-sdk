/**
 * Base error class for ARNS client errors
 */
export class ARNSClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'ARNSClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

/**
 * Error thrown when fetching an ARNS record fails
 */
export class GetARNSRecordError extends ARNSClientError {
    constructor(name: string, originalError?: Error) {
        super(`Error fetching ARNS record for name: ${name}`, originalError);
        this.name = 'GetRecordError';
    }
}

/**
 * Error thrown when a domain format is invalid
 */
export class InvalidDomainError extends ARNSClientError {
    constructor(domain: string, reason: string) {
        super(`Invalid domain format: ${domain}. ${reason}`);
        this.name = 'InvalidDomainError';
    }
}

/**
 * Error thrown when an ARNS record is not found
 */
export class RecordNotFoundError extends ARNSClientError {
    constructor(domain: string) {
        super(`No ARNS record found for domain: ${domain}`);
        this.name = 'RecordNotFoundError';
    }
}
