// BaseClientError.ts
export class ResultUtilsError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'ResultUtilsError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class JsonParsingError extends ResultUtilsError {
    constructor(message: string, originalError?: Error) {
        super(`Error parsing JSON data: ${message}`, originalError);
        this.name = 'JsonParsingError';
    }
}

export class MessageOutOfBoundsError extends ResultUtilsError {
    constructor(index: number, length: number) {
        super(`Index out of bounds: ${index}. Total messages available: ${length}`);
        this.name = 'MessageOutOfBoundsError';
    }
}