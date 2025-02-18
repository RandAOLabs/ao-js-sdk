import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

// RandomClientError.ts
export class RandomProcessError extends Error {
    constructor(message: string, result?: MessageResult | DryRunResult) {
        super(message);
        this.name = 'RandomProcessError';
        if (result) {
            this.stack += '\nResult: ' + JSON.stringify(result);
        }
    }
}