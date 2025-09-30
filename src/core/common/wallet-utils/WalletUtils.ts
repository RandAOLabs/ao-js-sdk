import { JWKInterface } from "arweave/node/lib/wallet";
import { Environment, getEnvironment } from "../../../utils/environment";
import { ArweaveGraphQLNodeClientFactory, ArweaveNodeType } from "../../arweave/graphql-nodes";
import { ByteUtils } from "../../../utils/crypto/bytes/ByteUtils";
import { staticImplements } from "../../../utils/decorators/staticImplements";
import { IWalletUtils } from "./abstract/IWalletUtils";

/**
 * Static utility class for wallet operations.
 * Provides methods for wallet address operations and conversions.
 */
@staticImplements<IWalletUtils>()
export class WalletUtils {
	public static async getWalletAddress(wallet: JWKInterface | any): Promise<string> {
		const environment = getEnvironment();

		if (environment === Environment.BROWSER) {
			return await wallet.getActiveAddress();
		} else {
			const arweaveNode = ArweaveGraphQLNodeClientFactory.getInstance().getNode(ArweaveNodeType.GOLDSKY);
			return await arweaveNode.jwkToAddress(wallet);
		}
	}

	/**
	 * Convert Arweave address from Base64URL to Hex format (bytes32)
	 * @param arweaveAddress - Arweave address string (Base64URL encoded)
	 * @returns bytes32 formatted address (0x prefixed hex string)
	 */
	public static convertArweaveAddressToBytes32(arweaveAddress: string): `0x${string}` {
		// Convert from base64url to bytes
		const bytes = ByteUtils.base64UrlToBytes(arweaveAddress);
		
		// Convert to hex string
		const hexString = ByteUtils.bytesToHex(bytes);
		
		// Ensure it's exactly 64 characters (32 bytes) by padding with zeros if needed
		const paddedHex = hexString.padEnd(64, '0').substring(0, 64);
		
		return `0x${paddedHex}` as `0x${string}`;
	}

	/**
	 * Convert bytes32 hex string back to Arweave address
	 * @param bytes32Hex - bytes32 formatted address (0x prefixed hex string)
	 * @returns Arweave address string (Base64URL encoded)
	 */
	public static convertBytes32ToArweaveAddress(bytes32Hex: string): string {
		// Remove 0x prefix and any trailing zeros
		const hexString = bytes32Hex.replace(/^0x/, '').replace(/0+$/, '');
		
		// Convert hex to bytes
		const bytes = ByteUtils.hexToBytes(hexString);
		
		// Convert to base64url
		return ByteUtils.bytesToBase64Url(bytes);
	}
}