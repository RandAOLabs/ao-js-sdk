/**
 * Base error class for ARIO service errors
 */
export class ARIOError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ARIOError';
    }
}

/**
 * Error thrown when an ARNS record is not found
 */
export class ARNSRecordNotFoundError extends ARIOError {
    constructor(domain: string) {
        super(`No ARNS record found for domain: ${domain}`);
        this.name = 'ARNSRecordNotFoundError';
    }
}

/**
 * Error thrown when an ANT record is not found
 */
export class ANTRecordNotFoundError extends ARIOError {
    constructor(antName: string) {
        super(`No ANT record found for name: ${antName}`);
        this.name = 'ANTRecordNotFoundError';
    }
}
