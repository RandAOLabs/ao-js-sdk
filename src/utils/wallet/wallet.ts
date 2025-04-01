import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arweave/node/lib/wallet";
import { Logger } from "..";

let lazyWallet: JWKInterface | null = null;
/**
 * @category Utility
 */
export function getWalletLazy(): JWKInterface {
    if (!lazyWallet) {
        const { getWallet } = require("src/utils/wallet/environmentWallet"); //Path doesnt update on file move since lazy loaded
        lazyWallet = getWallet();
    }
    return lazyWallet!;
};


/**
 * Builds and returns the final BaseClientConfig object.
 * @returns The constructed BaseClientConfig
 */
export function getWalletSafely(): JWKInterface | undefined {
    try {
        return getWalletLazy();
    } catch (error: any) {
        Logger.warn(`Could not find any wallets available: ${error.message}`);
        return undefined;
    }
}
/**
 * @category Utility
 */
export function getSigner(): ReturnType<typeof createDataItemSigner> {
    const wallet = getWalletLazy()
    return createDataItemSigner(wallet)
}