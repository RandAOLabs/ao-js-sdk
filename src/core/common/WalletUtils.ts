import { JWKInterface } from "arweave/node/lib/wallet";
import { Environment, getEnvironment } from "../../utils/environment";
import { ArweaveGraphQLNodeClientFactory, ArweaveNodeType } from "../arweave/graphql-nodes";

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
}
