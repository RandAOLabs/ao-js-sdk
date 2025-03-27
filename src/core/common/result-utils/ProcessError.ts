import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { Logger, StringFormatting } from "src/utils";

export class ProcessError extends Error {
    constructor(
        public readonly result: MessageResult | DryRunResult
    ) {
        const errorDetails = result.Error || 'Unknown error';
        const baseMessage = `Error Originating in Process\n${errorDetails}`
        const message = StringFormatting.wrapMessageInBox(errorDetails, 80);
        Logger.error(`\n${message}\n`);
        super(message);
    }
}
