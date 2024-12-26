import { JWKInterface } from 'arweave/node/lib/wallet.js';

export interface BaseClientConfig {
    processId: string
    wallet: JWKInterface | any 
    environment: 'local' | 'mainnet'
}