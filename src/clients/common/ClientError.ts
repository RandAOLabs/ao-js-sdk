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
        const paramsString = JSON.stringify(params, null);

        const fullMessage: string = `
            \n| Error in ${client.constructor.name} |
            \n| Occurred while executing function: ${functionName} |
            \n| With parameters: ${paramsString} |
            \n| Process Id: ${client.getProcessId()} |
            \n| ReadOnly: ${client.isReadOnly()} |
            \n| ${originalError ? `Error was caused by: ${originalError.message}` : `Cause not specified`} |
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
