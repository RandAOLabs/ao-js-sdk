import Arweave from 'arweave';
import { getEnvironment, Environment, UnknownEnvironmentError } from '../../utils/environment';
import { ArweaveInitializationError } from './ArweaveBaseClientError';
import { Logger } from '../../utils/logger/logger';

/**
 * ArweaveInstance manages the singleton Arweave instance.
 * Ensures only one Arweave connection exists throughout the application lifecycle.
 */
class ArweaveInstance {
    /**
     * Singleton instance of Arweave.
     * Initialized on first getInstance() call with environment-specific configuration.
     */
    private static instance: Arweave | null = null;

    private constructor() { }

    public static getInstance(): Arweave {
        if (!ArweaveInstance.instance) {
            try {
                const environment = getEnvironment();
                switch (environment) {
                    case Environment.BROWSER:
                        // For browser, use current URL path by default
                        ArweaveInstance.instance = Arweave.init({});
                        break;
                    case Environment.NODE:
                        // For Node.js, connect to mainnet gateway
                        ArweaveInstance.instance = Arweave.init({
                            host: 'arweave-search.goldsky.com',
                            port: 443,
                            protocol: 'https'
                        });
                        break;
                    default:
                        throw new UnknownEnvironmentError();
                }
            } catch (error: any) {
                Logger.error(`Error initializing Arweave: ${error.message}`);
                throw new ArweaveInitializationError(error);
            }
        }
        return ArweaveInstance.instance!;
    }
}

export const getArweave = (): Arweave => {
    return ArweaveInstance.getInstance();
};
