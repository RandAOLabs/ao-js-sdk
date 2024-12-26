import { EnvironmentVariableError, UnknownEnvironmentError } from "./EnvironmentError";

export enum Environment {
    NODE = 'node',
    BROWSER = 'browser'
}

export function getEnvironment(): Environment {
    console.log('Detecting environment:', {
        windowDefined: typeof window !== 'undefined',
        windowDocumentDefined: typeof window?.document !== 'undefined',
        processDefined: typeof process !== 'undefined',
        processVersionsDefined: typeof process?.versions !== 'undefined',
        processNodeVersionDefined: typeof process?.versions?.node !== 'undefined'
    });

    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        return Environment.BROWSER;
    } else if (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.node !== 'undefined') {
        return Environment.NODE;
    } else {
        throw new UnknownEnvironmentError();
    }
}

// Initialize dotenv in Node environment
if (getEnvironment() === Environment.NODE) {
    try {
        const dotenv = require('dotenv');
        dotenv.config();
    } catch (error) {
        console.warn('dotenv not available in Node environment');
    }
}

export function getEnvironmentVariable(variableName: string): string {
    const currentEnv = getEnvironment();
    
    if (currentEnv === Environment.BROWSER) {
        // Check process.env (webpack DefinePlugin/Create React App)
        if (typeof process !== 'undefined' && process.env && process.env[variableName]) {
            return process.env[variableName];
        }
        
        // Check window.__env__ (runtime configuration)
        if (typeof window !== 'undefined' && (window as any).__env__ && (window as any).__env__[variableName]) {
            return (window as any).__env__[variableName];
        }
    } else {
        // Node environment - use process.env
        const value = process.env[variableName];
        if (value) return value;
    }
    
    throw new EnvironmentVariableError(variableName);
}