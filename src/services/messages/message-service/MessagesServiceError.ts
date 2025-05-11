export class MessagesServiceError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'MessagesServiceError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class GetLatestMessagesError extends MessagesServiceError {
    constructor(originalError?: Error) {
        super('Error retrieving latest messages', originalError);
        this.name = 'GetLatestMessagesError';
    }
}
