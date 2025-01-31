// src/IBaseClient.ts

import { ResultsResponse } from "@permaweb/aoconnect/dist/lib/results";
import { Tags } from "./types";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

export abstract class IBaseClient {
    /**
     * Send a message to an ao Message Unit (mu) targeting an ao process.
     * 
     * @param data Optional data to be passed to the message
     * @param tags Optional tags to be passed to the message
     * @param anchor Optional 32 byte anchor to be set on the DataItem
     * @returns Promise resolving to the message ID
     * @throws MessageError if there is an error sending the message
     */
    abstract message(data?: string, tags?: Tags, anchor?: string): Promise<string>;

    /**
     * Read a batch of results from a process. Can be used as a polling mechanism for new results.
     * 
     * @param from Optional cursor starting point
     * @param to Optional cursor ending point
     * @param limit Optional number of results to return (default: 25)
     * @param sort Optional sort order ('ASC' or 'DESC', default: 'ASC')
     * @returns Promise resolving to ResultsResponse containing the batch of results
     * @throws ResultsError if there is an error fetching results
     */
    abstract results(from?: string, to?: string, limit?: number, sort?: string): Promise<ResultsResponse>;

    /**
     * Read the result of a message evaluation from an ao Compute Unit (cu).
     * 
     * @param messageId ID of the message to get result for
     * @returns Promise resolving to MessageResult containing Messages, Spawns, Output, Error
     * @throws ResultError if there is an error fetching the result
     */
    abstract result(messageId: string): Promise<MessageResult>;
    /**
     * Performs a dry run, executing the logic of a message without actually persisting the result.
     * When useDryRunAsMessage is false (default), this performs a simulation.
     * When useDryRunAsMessage is true, this executes as a real message.
     *
     * @param data Optional data to be passed to the message.
     * @param tags Optional tags to be passed to the message.
     * @param anchor Optional anchor to be passed to the message.
     * @param id Optional ID to be passed to the message.
     * @param owner Optional owner to be passed to the message.
     * @returns A DryRunResult object containing the output of the message, including
     * the result of any computations, and any spawned messages. Or a MessageResult if useDryRunAsMessage is true.
     * @throws DryRunError if there is an error performing the dry run.
     */
    abstract dryrun(data: any, tags: Tags, anchor?: string, id?: string, owner?: string): Promise<DryRunResult | MessageResult>;
    /**
     * Controls whether dryrun executes as a message or simulation.
     * 
     * @param enabled When true, dryrun will execute as a real message. When false (default), executes as a simulation.
     */
    abstract setDryRunAsMessage(enabled: boolean): void;
    /**
     * Creates a pre-configured instance of the client using the most recent process IDs.
     * This is the recommended way to instantiate the client for most use cases.
     * 
     * @returns A configured instance of the client ready for use
     * @throws Error if the implementation does not provide auto-configuration
     */
    public static autoConfiguration(): IBaseClient {
        throw new Error("Method not implemented")
    }
}
