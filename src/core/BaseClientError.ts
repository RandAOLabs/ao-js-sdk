import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

// BaseClientError.ts
export class BaseClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'BaseClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class MessageError extends BaseClientError {
    constructor(originalError?: Error) {
        super('Error sending message', originalError);
        this.name = 'MessageError';
    }
}

export class ResultsError extends BaseClientError {
    constructor(originalError?: Error) {
        super('Error fetching results', originalError);
        this.name = 'ResultsError';
    }
}

export class ResultError extends BaseClientError {
    constructor(originalError?: Error) {
        super('Error fetching result', originalError);
        this.name = 'ResultError';
    }
}

export class DryRunError extends BaseClientError {
    constructor(originalError?: Error) {
        super('Error performing dry run', originalError);
        this.name = 'DryRunError';
    }
}

export class MessageResultDataError extends BaseClientError {
    constructor(originalError?: Error, message?: MessageResult) {
        super(`Error Retrieving Message Result Data. Does this message have result data? Message: ${JSON.stringify(message)}`, originalError);
        this.name = 'MessageResultDataError';
    }
}

export class DryRunResultDataError extends BaseClientError {
    constructor(originalError?: Error, message?: MessageResult) {
        super(`Error Retrieving Dry Run Result Data. Does this message have result data? Message: ${JSON.stringify(message)}`, originalError);
        this.name = 'DryRunResultDataError';
    }
}