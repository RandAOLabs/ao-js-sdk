import { JWKInterface } from "arweave/node/lib/wallet";
import { Environment, getEnvironment } from "../../utils/environment";
import { getArweave } from "../arweave/arweave";

export class WalletUtils {
	public static async getWalletAddress(wallet: JWKInterface | any): Promise<string> {
		const environment = getEnvironment();

		if (environment === Environment.BROWSER) {
			return await wallet.getActiveAddress();
		} else {
			const arweave = getArweave();
			return await arweave.wallets.jwkToAddress(wallet);
		}
	}
}