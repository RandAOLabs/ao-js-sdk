import { connect as aoConnect, createDataItemSigner } from "@permaweb/aoconnect";

export type ConnectMode = 'legacy' | 'mainnet';

export interface ConnectArgsShared {
    /** The url of the desired Gateway */
    GATEWAY_URL?: string;
    /** The url of the desired Arweave Gateway GraphQL Server */
    GRAPHQL_URL?: string;
    /** The number of times to retry querying the gateway, utilizing an exponential backoff */
    GRAPHQL_MAX_RETRIES?: number;
    /** The initial backoff, in milliseconds (moot if GRAPHQL_MAX_RETRIES is set to 0) */
    GRAPHQL_RETRY_BACKOFF?: number;
    /** The url of the desired ao Messenger Unit. Also used as the relay MU in 'relay' mode */
    MU_URL?: string;
    /** The url of the desired ao Compute Unit. Also used as the relay CU in 'relay' mode */
    CU_URL?: string;

    MODE: ConnectMode
}

export interface ConnectArgsMainnet extends ConnectArgsShared {
    /** The signer used to sign Data items and HTTP messages */
    signer?: ReturnType<typeof createDataItemSigner>;
    /** The url of the desired ao Unit. Only applicable in 'mainnet' mode */
    URL?: string;
    /** The default path either 'relay@1.0' or 'process@1.0' */
    device?: string;
}

export type ConnectArgsLegacy = { MODE: 'legacy' } & ConnectArgsShared;
export type ConnectArgsMainnetFull = { MODE: 'mainnet' } & ConnectArgsShared & ConnectArgsMainnet;
