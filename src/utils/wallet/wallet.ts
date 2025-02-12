import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arweave/node/lib/wallet";

let lazyWallet: JWKInterface | null = null;
export function getWalletLazy(): JWKInterface {
    if (!lazyWallet) {
        const { getWallet } = require("src/utils/wallet/environmentWallet"); //Path doesnt update on file move since lazy loaded
        lazyWallet = getWallet();
    }
    return lazyWallet!;
};

export function getSigner(): ReturnType<typeof createDataItemSigner> {
    const wallet = getWalletLazy()
    return createDataItemSigner(wallet)
}