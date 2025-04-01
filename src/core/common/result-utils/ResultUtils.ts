import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { ProcessError } from "./ProcessError";
import { MessageOutOfBoundsError, JsonParsingError, MessagesMissingError } from "./ResultUtilsError";
import { Tags } from "../types";

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
            if (!result.Messages) {
                throw new MessagesMissingError(result)
            }
            if (n < 0 || n >= result.Messages.length) {
                throw new MessageOutOfBoundsError(result, n);
            }
            const data = result.Messages[n].Data;
            const parsedObject = JSON.parse(data) as T;
            return parsedObject;
        } catch (error: any) {
            throw new JsonParsingError(result, n, error);
        }
    }

    public static getFirstMessageDataString(result: MessageResult | DryRunResult): string {
        return this.getNthMessageDataString(result, 0);
    }

    public static getNthMessageDataString(result: MessageResult | DryRunResult, n: number): string {
        if (n < 0 || n >= result.Messages.length) {
            throw new MessageOutOfBoundsError(result, n);
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
