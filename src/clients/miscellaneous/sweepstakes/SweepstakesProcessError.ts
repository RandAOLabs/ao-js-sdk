import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

export class SweepstakesProcessError extends Error {
    constructor(message: string, result?: MessageResult | DryRunResult) {
        super(message);
        this.name = 'SweepstakesProcessError';
        if (result) {
            this.stack += '\nResult: ' + JSON.stringify(result);
        }
    }
}
