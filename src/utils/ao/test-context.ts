/**
 * Manages the test context for AO processes
 */
export class AoTestContext {
    private static instance: AoTestContext;
    private isTestMode: boolean = false;

    private constructor() { }

    public static getInstance(): AoTestContext {
        if (!AoTestContext.instance) {
            AoTestContext.instance = new AoTestContext();
        }
        return AoTestContext.instance;
    }

    /**
     * Enables test mode
     */
    public enableTestMode(): void {
        this.isTestMode = true;
    }

    /**
     * Disables test mode
     */
    public disableTestMode(): void {
        this.isTestMode = false;
    }

    /**
     * Checks if test mode is enabled
     */
    public isTestModeEnabled(): boolean {
        return this.isTestMode;
    }

    /**
     * Resets the test context
     * Useful for cleaning up between tests
     */
    public reset(): void {
        this.isTestMode = false;
    }
}

export const testContext = AoTestContext.getInstance();
