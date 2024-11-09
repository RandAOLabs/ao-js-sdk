// src/RandomClient.ts
import { BaseClient } from '../../core/BaseClient';
import { IRandomClient } from './abstract/IRandomClient';

export class RandomClient extends BaseClient implements IRandomClient {

    /**
     * Retrieves the number of random values a provider has available.
     * @param provider - The provider's name.
     * @returns - A promise that resolves with the number of available values.
     */
    async getProviderAvailableValues(provider: string): Promise<any> {
        try {
            const response = await this.results(undefined, undefined, 1, 'DESC');
            const data = response.find((item) => JSON.parse(item.data).provider === provider);
            return data ? JSON.parse(data.data).availableValues : null;
        } catch (error) {
            console.error('Error fetching provider available values:', error);
            throw error;
        }
    }

    /**
     * Updates the number of random values a provider has available.
     * @param amount - The updated amount of random values available.
     * @returns - A promise that resolves when the update is complete.
     */
    async updateProviderAvailableValues(amount: number): Promise<void> {
        try {
            const data = JSON.stringify({ availableValues: amount });
            await this.message(data);
        } catch (error) {
            console.error('Error updating provider available values:', error);
            throw error;
        }
    }

    /**
     * Retrieves unresolved or pending randomness requests associated with a provider.
     * @param provider - The provider's name.
     * @returns - A promise that resolves with an array of open random requests.
     */
    async getOpenRandomRequests(provider: string): Promise<any[]> {
        try {
            const response = await this.results();
            const openRequests = response
                .filter((item) => {
                    const data = JSON.parse(item.data);
                    return data.provider === provider && data.status === 'open';
                })
                .map((item) => JSON.parse(item.data));
            return openRequests;
        } catch (error) {
            console.error('Error fetching open random requests:', error);
            throw error;
        }
    }

    /**
     * Fetches specific randomness requests based on provided request IDs.
     * @param randomnessRequestIds - Array of request IDs to retrieve.
     * @returns - A promise that resolves with an array of requested randomness data.
     */
    async getRandomRequests(randomnessRequestIds: string[]): Promise<any[]> {
        try {
            const requests = await Promise.all(
                randomnessRequestIds.map(async (id) => {
                    const response = await this.result(id);
                    return JSON.parse(response.data);
                })
            );
            return requests;
        } catch (error) {
            console.error('Error fetching random requests:', error);
            throw error;
        }
    }

    postVDFInput(randomnessRequestId: string, input: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    postVDFOutputAndProof(randomnessRequestId: string, output: string, proof: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}