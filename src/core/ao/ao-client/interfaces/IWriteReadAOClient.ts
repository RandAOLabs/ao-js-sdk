import { Tags } from '../../../common';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { IReadOnlyAOClient } from './IReadOnlyAOClient';

/**
 * AO interface provides a wrapper for interacting with the Arweave Operating System (AO).
 * This interface encapsulates all core AO functionality from @permaweb/aoconnect, providing
 * a clean interface for sending messages, retrieving results, and performing dry runs.
 */
export interface IWriteReadAOClient extends IReadOnlyAOClient {
	/**
	 * Sends a message to an AO process.
	 * @param process - The target process ID
	 * @param data - The message data to send
	 * @param tags - Optional tags to attach to the message
	 * @param anchor - Optional anchor reference
	 * @returns Promise resolving to the message ID
	 */
	message(
		process: string,
		data?: string,
		tags?: Tags,
		anchor?: string
	): Promise<string>;

	/**
	 * Gets the wallet address associated with the client.
	 * @returns Promise resolving to the wallet address string
	 * @throws Error if client is in read-only mode
	 */
	getCallingWalletAddress(): Promise<string>;

	/**
	 * Gets the wallet this client uses to sign messages
	 * @returns the wallet used for message signing
	 */
	getWallet(): JWKInterface | any | undefined;
}
