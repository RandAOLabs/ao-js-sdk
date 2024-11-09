// src/interfaces/IRandomClient.ts
export interface IRandomClient {
    getProviderAvailableValues(provider: string): Promise<any>;
    updateProviderAvailableValues(amount: number): Promise<void>;
    getOpenRandomRequests(provider: string): Promise<any[]>;
    getRandomRequests(randomnessRequestIds: string[]): Promise<any[]>;
    postVDFChallenge(randomnessRequestId: string, modulus: string, input: string): Promise<void>;
    postVDFOutputAndProof(randomnessRequestId: string, output: string, proof: string): Promise<void>;
}