import { Environment, getEnvironment, getEnvironmentVariable } from "@utils/index"
import { BrowserWalletError, FileReadError } from "./WalletError";

export function getWallet() {
    const environment = getEnvironment();

    switch (environment) {
        case Environment.NODE: {
            const fs = require('fs');
            const pathToWallet = getEnvironmentVariable('PATH_TO_WALLET');

            try {
                const walletData = fs.readFileSync(pathToWallet, 'utf-8');
                return JSON.parse(walletData);
            } catch (error) {
                if (error instanceof Error) {
                    throw new FileReadError(pathToWallet, error.message);
                } else {
                    throw new FileReadError(pathToWallet, 'Unknown error');
                }
            }
        }
        case Environment.BROWSER: {
            if ('arweaveWallet' in globalThis) {
                return (globalThis as any).arweaveWallet;
            } else {
                throw new BrowserWalletError();
            }
        }
    }
}
