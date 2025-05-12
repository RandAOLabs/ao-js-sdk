import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

export class FaucetProcessError extends Error {
    constructor(message: string, result?: MessageResult | DryRunResult) {
        super(message);
        this.name = 'FaucetProcessError';
        if (result) {
            this.stack += '\nResult: ' + JSON.stringify(result);
        }
    }
}
