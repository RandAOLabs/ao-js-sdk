import { IBaseClient } from "src/core/ao/abstract";
import { Logger } from "src/utils";

export class ClientError<T extends IBaseClient, P = any> extends Error {
    public client: T
    constructor(client: T, func: Function, params: P, originalError?: Error) {
        const functionName = func.name;
        const paramsString = JSON.stringify(params, null, 2);

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
