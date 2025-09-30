import { JWKInterface } from "arweave/node/lib/wallet";

/**
 * Interface for static wallet utility operations.
 * Defines methods for wallet address operations and conversions.
 */
export interface IWalletUtils {
	/**
	 * Get wallet address from a JWK wallet interface
	 */
	getWalletAddress(wallet: JWKInterface | any): Promise<string>;

	/**
	 * Convert Arweave address from Base64URL to Hex format (bytes32)
	 */
	convertArweaveAddressToBytes32(arweaveAddress: string): `0x${string}`;

	/**
	 * Convert bytes32 hex string back to Arweave address
	 */
	convertBytes32ToArweaveAddress(bytes32Hex: string): string;
}