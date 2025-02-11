import { BaseClient, BaseClientConfig, Tags } from "src/core/ao";
import { ICollectionClient } from "src/clients/collection/abstract/ICollectionClient";
import { Logger } from "src/utils/index";
import { CollectionClientConfig, CollectionInfo, UpdateAssetsRequest } from "src/clients/collection/abstract";
import { getCollectionClientAutoConfiguration } from "src/clients/collection/CollectionClientAutoConfiguration";
import { CollectionInfoError, AuthorizationError, InputValidationError, UpdateAssetsError, AddToProfileError, TransferAllAssetsError } from "src/clients/collection/CollectionClientError";
import { TAG_NAMES, ACTIONS, RESPONSE_ACTIONS, STATUS, TRANSFER_RATE_LIMIT, TRANSFER_BATCH_DELAY } from "src/clients/collection/constants";
import { NftClient } from "src/clients/nft";

export class CollectionClient extends BaseClient implements ICollectionClient {
    /* Constructors */
    public static autoConfiguration(): CollectionClient {
        return new CollectionClient(getCollectionClientAutoConfiguration());
    }

    public constructor(config: CollectionClientConfig) {
        super(config);
    }
    /* Constructors */

    /* Core Collection Functions */
    public async getInfo(): Promise<CollectionInfo> {
        try {
            const result = await this.messageResult('', [
                { name: TAG_NAMES.ACTION, value: ACTIONS.INFO }
            ]);
            return this.getFirstMessageDataJson<CollectionInfo>(result);
        } catch (error: any) {
            Logger.error(`Error fetching collection info: ${error.message}`);
            throw new CollectionInfoError(error);
        }
    }

    public async updateAssets(request: UpdateAssetsRequest): Promise<boolean> {
        try {
            const result = await this.messageResult(
                JSON.stringify(request),
                [{ name: TAG_NAMES.ACTION, value: ACTIONS.UPDATE_ASSETS }]
            );

            const firstMessage = result.Messages[0];
            const action = this.findTagValue(firstMessage.Tags, TAG_NAMES.ACTION);
            const status = this.findTagValue(firstMessage.Tags, TAG_NAMES.STATUS);
            const message = this.findTagValue(firstMessage.Tags, TAG_NAMES.MESSAGE);

            if (action === RESPONSE_ACTIONS.AUTHORIZATION_ERROR) {
                throw new AuthorizationError(message || 'Unauthorized to update assets');
            }

            if (action === RESPONSE_ACTIONS.INPUT_ERROR) {
                throw new InputValidationError(message || 'Invalid input for updating assets');
            }

            return status === STATUS.SUCCESS;
        } catch (error: any) {
            if (error instanceof AuthorizationError || error instanceof InputValidationError) {
                throw error;
            }
            Logger.error(`Error updating collection assets: ${error.message}`);
            throw new UpdateAssetsError(error);
        }
    }

    public async addToProfile(profileProcessId: string): Promise<void> {
        try {
            const result = await this.messageResult('', [
                { name: TAG_NAMES.ACTION, value: ACTIONS.ADD_TO_PROFILE },
                { name: TAG_NAMES.PROFILE_PROCESS, value: profileProcessId }
            ]);

            const firstMessage = result.Messages[0];
            const action = this.findTagValue(firstMessage.Tags, TAG_NAMES.ACTION);
            const message = this.findTagValue(firstMessage.Tags, TAG_NAMES.MESSAGE);

            if (action === RESPONSE_ACTIONS.INPUT_ERROR) {
                throw new InputValidationError(message || 'Invalid profile process ID');
            }
        } catch (error: any) {
            if (error instanceof InputValidationError) {
                throw error;
            }
            Logger.error(`Error adding collection to profile: ${error.message}`);
            throw new AddToProfileError(profileProcessId, error);
        }
    }

    private async transferBatch(processIds: string[], recipient: string): Promise<{ processId: string, error: Error }[]> {
        const failedTransfers: { processId: string, error: Error }[] = [];

        await Promise.all(processIds.map(async (processId) => {
            try {
                const nftConfig: BaseClientConfig = {
                    ...this.baseConfig,
                    processId
                };
                const nftClient = new NftClient(nftConfig);
                await nftClient.transfer(recipient);
            } catch (error: any) {
                Logger.error(`Failed to transfer NFT ${processId}: ${error.message}`);
                failedTransfers.push({ processId, error });
            }
        }));

        return failedTransfers;
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public async transferAllAssets(recipient: string): Promise<void> {
        try {
            // Get collection info to get list of NFT process IDs
            const info = await this.getInfo();

            // Split assets into batches of TRANSFER_RATE_LIMIT
            const batches: string[][] = [];
            for (let i = 0; i < info.Assets.length; i += TRANSFER_RATE_LIMIT) {
                batches.push(info.Assets.slice(i, i + TRANSFER_RATE_LIMIT));
            }

            // Process each batch with delay between batches
            const failedTransfers: { processId: string, error: Error }[] = [];
            for (const batch of batches) {
                const batchFailures = await this.transferBatch(batch, recipient);
                failedTransfers.push(...batchFailures);

                // Don't delay after the last batch
                if (batch !== batches[batches.length - 1]) {
                    await this.delay(TRANSFER_BATCH_DELAY);
                }
            }

            // If any transfers failed, throw error with details
            if (failedTransfers.length > 0) {
                throw new TransferAllAssetsError(failedTransfers);
            }
        } catch (error: any) {
            if (error instanceof TransferAllAssetsError) {
                throw error;
            }
            Logger.error(`Error transferring all assets: ${error.message}`);
            throw new CollectionInfoError(error);
        }
    }
    /* Core Collection Functions */
}
