// src/RandomClient.ts
import { BaseClient } from '../../core/BaseClient';
import { IRandomClient } from './IRandomClient';

export class RandomClient extends BaseClient implements IRandomClient {
    getProviderAvailableValues(provider: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    updateProviderAvailableValues(amount: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getOpenRandomRequests(provider: string): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    getRandomRequests(randomnessRequestIds: string[]): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    postVDFInput(randomnessRequestId: string, input: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    postVDFOutputAndProof(randomnessRequestId: string, output: string, proof: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}