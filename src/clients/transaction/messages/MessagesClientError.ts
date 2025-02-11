export class MessagesClientError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'MessagesClientError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class GetLatestMessagesError extends MessagesClientError {
    constructor(originalError?: Error) {
        super('Error retrieving latest messages', originalError);
        this.name = 'GetLatestMessagesError';
    }
}
