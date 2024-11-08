import { message, result, results, createDataItemSigner } from '@permaweb/aoconnect';
import { readFileSync } from 'fs';
import { IBaseClient } from './IBaseClient';
import { Tags } from './types';

export class BaseClient implements IBaseClient {
    private processId: string;
    private signer: ReturnType<typeof createDataItemSigner>;

    constructor(processId: string, walletPath: string) {
        this.processId = processId;
        const wallet = JSON.parse(readFileSync(walletPath, 'utf-8'));
        this.signer = createDataItemSigner(wallet);
    }

    async message(data: string = '', tags: Tags = [], anchor?: string): Promise<void> {
        try {
            await message({
                process: this.processId,
                signer: this.signer,
                data,
                tags,
                anchor,
            });
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async results(from?: string, to?: string, limit: number = 25, sort: 'ASC' | 'DESC' = 'ASC'): Promise<any> {
        try {
            const response = await results({
                process: this.processId,
                from,
                to,
                limit,
                sort,
            });
            return Array.isArray(response) ? response : [response]; // Return as array, or wrap in array if it's a single object
        } catch (error) {
            console.error('Error fetching results:', error);
            throw error;
        }
    }

    async result(messageId: string): Promise<any> {
        try {
            const response = await result({
                message: messageId,
                process: this.processId,
            });
            return response;
        } catch (error) {
            console.error('Error fetching result:', error);
            throw error;
        }
    }
}
