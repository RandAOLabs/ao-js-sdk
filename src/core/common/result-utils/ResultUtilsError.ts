import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { Logger } from "src/utils";

export class ResultReadingError extends Error {

    constructor(result: MessageResult | DryRunResult, detailMessage?: string, originalError?: Error) {
        const message = `
            | Error Reading ${typeof result}: ${JSON.stringify(result)} |
            | ${detailMessage ? detailMessage : "Unknown Error"} |
            | Caused by: ${originalError ? JSON.stringify(originalError) : "No upstream error"}|
        `
        super(message);
        this.name = 'ResultReadingError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
        Logger.error(message)
    }
}

export class JsonParsingError extends ResultReadingError {
    constructor(result: MessageResult | DryRunResult, index: number, originalError?: Error) {
        super(result, `Error parsing JSON data at index ${index}: ${result.Messages[index]?.Data}`, originalError);
        this.name = 'JsonParsingError';
    }
}

export class MessageOutOfBoundsError extends ResultReadingError {
    constructor(result: MessageResult | DryRunResult, index: number) {
        super(result, `Index out of bounds: ${index}.Total messages available: ${result.Messages.length}`)
        this.name = 'MessageOutOfBoundsError';
    }
}

export class MessagesMissingError extends ResultReadingError {
    constructor(result: MessageResult | DryRunResult) {
        super(result, "Result contains no messages, however messages were expected.");
        this.name = 'MessagesMissingError';
    }
}