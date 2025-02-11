import { JWKInterface } from "arweave/node/lib/wallet";
import { BaseClientConfig } from "src/core/ao/abstract/BaseClientConfig";

let lazyWallet: JWKInterface | null = null;
const getWalletLazy = (): JWKInterface => {
    if (!lazyWallet) {
        const { getWallet } = require("../../utils/wallet/index");
        lazyWallet = getWallet();
    }
    return lazyWallet!;
};

// Function-based configuration
export const getBaseClientAutoConfiguration = (): BaseClientConfig => ({
    processId: "BASE_CLIENT_AUTO_CONFIGURATION_FAKE_PROCESS_ID",
    wallet: getWalletLazy(),
    environment: "mainnet",
});