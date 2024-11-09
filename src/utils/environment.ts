// environment.ts
export enum Environment {
    NODE = 'node',
    BROWSER = 'browser'
}

export function getEnvironment(): Environment {
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        return Environment.BROWSER;
    } else {
        return Environment.NODE;
    }
}
