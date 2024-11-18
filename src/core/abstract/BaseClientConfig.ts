import { JWKInterface } from 'arweave/node/lib/wallet.js';

export interface BaseClientConfig {
    processId: string
    wallet: JWKInterface //TODO
    environment: 'local' | 'mainnet'
}