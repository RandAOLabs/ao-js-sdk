import { IBaseClient } from "src/core/ao/abstract";
import { Logger } from "src/utils";

export class ClientError<T extends IBaseClient, P = any> extends Error {
    constructor(
        public readonly client: T,
        public readonly func: Function,
        public readonly params: P,
        public readonly originalError?: Error
    ) {
        const functionName = func.name;
        const paramsString = JSON.stringify(params, null, 2);

        const fullMessage: string = `
            | Error in ${client.constructor.name} |
            | Occurred while executing function: ${functionName} |
            | With parameters: ${paramsString} |
            | Process Id: ${client.getProcessId()} |
            | ReadOnly: ${client.isReadOnly()} |
            | ${originalError ? `Error was caused by: ${originalError.name}: ${originalError.message}` : `Cause not specified`} |
        `
        super(fullMessage);
        this.client = client
        this.name = `${client.constructor.name} Error`;
        Logger.error(fullMessage)

        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}
