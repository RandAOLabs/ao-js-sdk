import { ANT, AoANTRead, AoARIORead, ARIO } from "@ar.io/sdk";
import { Environment, getEnvironment } from "src/utils/environment/environment";

/**
 * Interface for environment-specific SDK initialization strategies
 */
interface SdkInitializer {
    initialize(): Promise<ArIoSdk>;
}

/**
 * Interface representing the SDK's public API
 */
interface ArIoSdk {
    ARIO: {
        init(): AoARIORead;
    };
    ANT: {
        init(config: { processId: string }): AoANTRead;
    };
}

/**
 * Browser-specific SDK initialization
 */
class BrowserSdkInitializer implements SdkInitializer {
    private static readonly LOCAL_SDK_PATH = "node_modules/@ar.io/sdk/bundles/web.bundle.min.js";
    private static readonly CDN_SDK_PATH = "https://unpkg.com/@ar.io/sdk/bundles/web.bundle.min.js";

    async initialize(): Promise<ArIoSdk> {
        try {
            await this.loadScript(BrowserSdkInitializer.LOCAL_SDK_PATH);
        } catch (error) {
            await this.loadScript(BrowserSdkInitializer.CDN_SDK_PATH);
        }
        return this.validateSdk();
    }

    private async loadScript(url: string): Promise<void> {
        const script = document.createElement("script");
        script.src = url;

        return new Promise((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load SDK from ${url}`));
            document.head.appendChild(script);
        });
    }

    private validateSdk(): ArIoSdk {
        const sdk = (window as any).arIoSdk;
        if (!sdk?.ARIO?.init || !sdk?.ANT?.init) {
            throw new Error("SDK not properly loaded - missing required methods");
        }
        return sdk;
    }
}

/**
 * Node-specific SDK initialization
 */
class NodeSdkInitializer implements SdkInitializer {
    async initialize(): Promise<ArIoSdk> {
        return { ARIO, ANT };
    }
}

/**
 * Factory for creating environment-specific initializers
 */
class SdkInitializerFactory {
    static create(): SdkInitializer {
        const env = getEnvironment();
        switch (env) {
            case Environment.BROWSER:
                return new BrowserSdkInitializer();
            case Environment.NODE:
                return new NodeSdkInitializer();
            default:
                throw new Error(`Unsupported environment: ${env}`);
        }
    }
}

/**
 * Manages the initialization and access to the ArIO SDK
 * Implements the Singleton pattern to ensure only one instance exists
 */
export class ArIoSdkManager {
    private static instance: ArIoSdkManager;
    private sdk: ArIoSdk | null = null;
    private initializationPromise: Promise<void> | null = null;
    private initializer: SdkInitializer;

    private constructor() {
        this.initializer = SdkInitializerFactory.create();
    }

    public static getInstance(): ArIoSdkManager {
        if (!ArIoSdkManager.instance) {
            ArIoSdkManager.instance = new ArIoSdkManager();
        }
        return ArIoSdkManager.instance;
    }

    private async ensureInitialized(): Promise<ArIoSdk> {
        if (this.sdk) {
            return this.sdk;
        }

        if (!this.initializationPromise) {
            this.initializationPromise = (async () => {
                try {
                    this.sdk = await this.initializer.initialize();
                } catch (error) {
                    this.initializationPromise = null;
                    throw error;
                }
            })();
        }

        await this.initializationPromise;

        if (!this.sdk) {
            throw new Error("SDK initialization failed");
        }

        return this.sdk;
    }

    public reset(): void {
        this.sdk = null;
        this.initializationPromise = null;
    }

    public async getARIO(): Promise<AoARIORead> {
        try {
            const sdk = await this.ensureInitialized();
            return sdk.ARIO.init();
        } catch (error) {
            this.reset();
            throw error;
        }
    }

    public async getANT(processId: string): Promise<AoANTRead> {
        if (!processId) {
            throw new Error("Process ID is required");
        }

        try {
            const sdk = await this.ensureInitialized();
            return sdk.ANT.init({ processId });
        } catch (error) {
            this.reset();
            throw error;
        }
    }
}

// Export convenience functions that use the singleton instance
export async function getARIO(): Promise<AoARIORead> {
    return ArIoSdkManager.getInstance().getARIO();
}

export async function getANT(processId: string): Promise<AoANTRead> {
    return ArIoSdkManager.getInstance().getANT(processId);
}
