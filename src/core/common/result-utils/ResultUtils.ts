import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { ProcessError } from "src/core/common/result-utils/ProcessError";
import { MessageOutOfBoundsError, JsonParsingError } from "src/core/common/result-utils/ResultUtilsError";
import { Tags } from "src/core/common/types";

/**
 * Utility class for working with ao process message resykts and dry run results.
 */
export default class ResultUtils {

    public static getTagValue(tags: Tags, name: string): string | undefined {
        const tag = tags.find(tag => tag.name === name);
        return tag?.value;
    }

    public static getFirstMessageDataJson<T>(result: MessageResult | DryRunResult): T {
        return this.getNthMessageDataJson(result, 0);
    }

    public static getNthMessageDataJson<T>(result: MessageResult | DryRunResult, n: number): T {
        try {
            if (n < 0 || n >= result.Messages.length) {
                throw new MessageOutOfBoundsError(n, result.Messages.length);
            }
            const data = result.Messages[n].Data;
            const parsedObject = JSON.parse(data) as T;
            return parsedObject;
        } catch (error) {
            throw new JsonParsingError(`Invalid JSON in message data at index ${n}: ${result.Messages[n]?.Data}`, error as Error);
        }
    }

    public static getFirstMessageDataString(result: MessageResult | DryRunResult): string {
        return this.getNthMessageDataString(result, 0);
    }

    public static getNthMessageDataString(result: MessageResult | DryRunResult, n: number): string {
        if (n < 0 || n >= result.Messages.length) {
            throw new MessageOutOfBoundsError(n, result.Messages.length);
        }
        return result.Messages[n].Data;
    }

    /**
     * 
     * @throws ProcessError
     * @param result the result to check for errors.
     */
    public static checkForProcessErrors(result: MessageResult | DryRunResult): void {
        if (result.Error) {
            throw new ProcessError(result)
        }
    }
}
