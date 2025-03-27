import { IBaseClient } from "src/core/ao/abstract";
import { Logger, StringFormatting } from "src/utils";

export class ClientError<T extends IBaseClient, P = any> extends Error {
    private static readonly MAX_LINE_LENGTH = 100;

    constructor(
        public readonly client: T,
        public readonly func: Function,
        public readonly params: P,
        public readonly originalError?: Error
    ) {
        const functionName = func.name;
        const paramsString = JSON.stringify(params, null, 2);

        const errorMessage = `Error in ${client.constructor.name}\nOccurred while executing function: ${functionName}\nWith parameters: ${paramsString}\nProcess Id: ${client.getProcessId()}\nReadOnly: ${client.isReadOnly()}\n${originalError ? `Error was caused by: ${originalError.name}: ${originalError.message}` : `Cause not specified`}`;

        const fullMessage = StringFormatting.wrapMessageInBox(errorMessage, ClientError.MAX_LINE_LENGTH);
        super(fullMessage);
        this.client = client
        this.name = `${client.constructor.name} Error`;
        Logger.error(`\n${fullMessage}`)

        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}
