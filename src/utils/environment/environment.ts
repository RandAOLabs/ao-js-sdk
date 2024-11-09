import { EnvironmentVariableError, UnknownEnvironmentError } from "./EnvironmentError";
import * as dotenv from "dotenv";


// environment.ts
export enum Environment {
    NODE = 'node',
    BROWSER = 'browser'
}

export function getEnvironment(): Environment {
    switch (true) {
        case typeof window !== 'undefined' && typeof window.document !== 'undefined': {
            return Environment.BROWSER;
        }
        case typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.node !== 'undefined': {
            return Environment.NODE;
        }
        default: {
            throw new UnknownEnvironmentError();
        }
    }
}

// Load .env file only if running in the Node environment
if (getEnvironment() === Environment.NODE) {
    dotenv.config();
}
export function getEnvironmentVariable(variableName: string): string {
    const value = process.env[variableName];
    if (!value) {
        throw new EnvironmentVariableError(variableName);
    }
    return value;
}