export class CreditNoticeServiceError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'CreditNoticeServiceError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class GetCreditNoticesError extends CreditNoticeServiceError {
    constructor(originalError?: Error) {
        super('Error retrieving credit notices', originalError);
        this.name = 'GetCreditNoticesError';
    }
}
