import { EnvironmentVariableError, UnknownEnvironmentError } from "src/utils/environment/EnvironmentError";

export enum Environment {
    NODE = 'node',
    BROWSER = 'browser'
}
/**
 * @category Utility
 */
export function getEnvironment(): Environment {
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        return Environment.BROWSER;
    } else if (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.node !== 'undefined') {
        return Environment.NODE;
    } else {
        throw new UnknownEnvironmentError();
    }
}
/**
 * @category Utility
 */
export function getEnvironmentVariable(variableName: string): string {
    const currentEnv = getEnvironment();

    if (currentEnv === Environment.NODE) {
        try {
            // Use eval and require for dotenv to avoid webpack issues
            eval('require("dotenv")').config(); // Webpack friendly
        } catch (error) {
            console.warn('dotenv not available in Node environment');
        }

        const value = process.env[variableName];
        if (value) return value;
    } else if (currentEnv === Environment.BROWSER) {
        // Check process.env (webpack DefinePlugin/Create React App)
        if (typeof process !== 'undefined' && process.env && process.env[variableName]) {
            return process.env[variableName];
        }

        // Check window.__env__ (runtime configuration)
        if (typeof window !== 'undefined' && (window as any).__env__ && (window as any).__env__[variableName]) {
            return (window as any).__env__[variableName];
        }
    }

    throw new EnvironmentVariableError(variableName);
}