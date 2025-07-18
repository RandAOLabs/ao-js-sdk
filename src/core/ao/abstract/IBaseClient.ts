// src/IBaseClient.ts

import { Tags } from "../../common";
import { ArweaveTransaction } from "../../arweave/abstract/types";
import { JWKInterface } from "arweave/node/lib/wallet";
import { DryRunResult, MessageResult, ResultsResponse } from "./ao-connect-types";

export interface IProcessClient {
	/* AO Interaction Methods */

	/**
	 * Send a message to an ao Message Unit (mu) targeting an ao process.
	 *
	 * @param data Optional data to be passed to the message
	 * @param tags Optional tags to be passed to the message
	 * @param anchor Optional 32 byte anchor to be set on the DataItem
	 * @returns Promise resolving to the message ID
	 * @throws MessageError if there is an error sending the message
	 */
	message(data?: string, tags?: Tags, anchor?: string): Promise<string>;

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
	results(from?: string, to?: string, limit?: number, sort?: string): Promise<ResultsResponse>;

	/**
	 * Read the result of a message evaluation from an ao Compute Unit (cu).
	 *
	 * @param messageId ID of the message to get result for
	 * @returns Promise resolving to MessageResult containing Messages, Spawns, Output, Error
	 * @throws ResultError if there is an error fetching the result
	 */
	result(messageId: string): Promise<MessageResult>;
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
	dryrun(data: any, tags: Tags, anchor?: string, id?: string, owner?: string): Promise<DryRunResult>;
	/* AO Interaction Methods */

	/* Utility */
	/**
	 * Gets the wallet address associated with the client.
	 * @returns Promise resolving to the wallet address string
	 * @throws Error if client is in read-only mode
	 */
	getCallingWalletAddress(): Promise<string>;

	/**
	 * Retrieves the transaction that created this process. This transaction contains
	 * the initial state and configuration of the process in its tags.
	 *
	 * @returns Promise resolving to the transaction data containing process creation details
	 * @throws ArweaveGraphQLError if there is an error retrieving the transaction
	 */
	getProcessInfo(): Promise<ArweaveTransaction>;
	/* Utility */

	/* ReadOnly Feature */
	/**
	 * A Readonly Client can only perform dry run and result operations, however does not require a wallet to be used.
	 * If a wallet is specified on instantiation the client will additionally be able to use write operations (messages).
	 * @returns Boolean indicating whether or not the client is for read operations only.
	 */
	isReadOnly(): boolean;

	/**
	 * Sets the wallet being used for this client. If the client is readonly it will now have write abilities.
	 * @param wallet the wallet to use with this client.
	 */
	setWallet(wallet: JWKInterface | any): void;

	/* ReadOnly Feature */
	/* Dry runs ass messages feature */

	/**
	 * Controls whether dryrun executes as a message or simulation.
	 *
	 * @param enabled When true, dryrun will execute as a real message. When false (default), executes as a simulation.
	 */
	setDryRunAsMessage(enabled: boolean): void;

	/**
	 * @returns Boolean indicating whether or not the client is set to run dryruns as messages. (non default behavior)
	 */
	isRunningDryRunsAsMessages(): boolean;

	/* Dry runs as messages feature */

	/**
	 * @returns Boolean indicating whether or not the client is set to run dryruns as messages. (non default behavior)
	 */
	getProcessId(): string;

	/**
	 * Gets the wallet this client uses to sign messages
	 * @returns the wallet used for message signing
	 */
	getWallet(): JWKInterface | any | undefined;
}
