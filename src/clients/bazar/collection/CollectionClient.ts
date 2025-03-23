import { ICollectionClient, CollectionClientConfig, CollectionInfo, UpdateAssetsRequest } from "src/clients/bazar/collection/abstract";
import { AuthorizationError, InputValidationError, TransferAllAssetsError } from "src/clients/bazar/collection/CollectionClientError";
import { TAG_NAMES, ACTIONS, RESPONSE_ACTIONS, STATUS, TRANSFER_RATE_LIMIT, TRANSFER_BATCH_DELAY } from "src/clients/bazar/collection/constants";
import { NftClient } from "src/clients/bazar/nft";
import { ClientError } from "src/clients/common/ClientError";
import { BaseClientConfigBuilder, TagUtils } from "src/core";
import { BaseClient } from "src/core/ao/BaseClient";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { Logger } from "src/utils";


/**
 * @category Bazar
 */
export class CollectionClient extends BaseClient implements ICollectionClient {
    /* Constructors */
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
            return ResultUtils.getFirstMessageDataJson<CollectionInfo>(result);
        } catch (error: any) {
            throw new ClientError(this, this.getInfo, null, error);
        }
    }

    public async updateAssets(request: UpdateAssetsRequest): Promise<boolean> {
        try {
            const result = await this.messageResult(
                JSON.stringify(request),
                [{ name: TAG_NAMES.ACTION, value: ACTIONS.UPDATE_ASSETS }]
            );

            const firstMessage = result.Messages[0];
            const action = TagUtils.getTagValue(firstMessage.Tags, TAG_NAMES.ACTION);
            const status = TagUtils.getTagValue(firstMessage.Tags, TAG_NAMES.STATUS);
            const message = TagUtils.getTagValue(firstMessage.Tags, TAG_NAMES.MESSAGE);

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
            throw new ClientError(this, this.updateAssets, request, error);
        }
    }

    public async addToProfile(profileProcessId: string): Promise<void> {
        try {
            const result = await this.messageResult('', [
                { name: TAG_NAMES.ACTION, value: ACTIONS.ADD_TO_PROFILE },
                { name: TAG_NAMES.PROFILE_PROCESS, value: profileProcessId }
            ]);

            const firstMessage = result.Messages[0];
            const action = TagUtils.getTagValue(firstMessage.Tags, TAG_NAMES.ACTION);
            const message = TagUtils.getTagValue(firstMessage.Tags, TAG_NAMES.MESSAGE);

            if (action === RESPONSE_ACTIONS.INPUT_ERROR) {
                throw new InputValidationError(message || 'Invalid profile process ID');
            }
        } catch (error: any) {
            if (error instanceof InputValidationError) {
                throw error;
            }
            throw new ClientError(this, this.addToProfile, { profileProcessId }, error);
        }
    }

    private async transferBatch(processIds: string[], recipient: string): Promise<{ processId: string, error: Error }[]> {
        const failedTransfers: { processId: string, error: Error }[] = [];

        await Promise.all(processIds.map(async (processId) => {
            try {
                const nftConfig = new BaseClientConfigBuilder()
                    .withProcessId(processId)
                    .withWallet(this.baseConfig.wallet)
                    .build()
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
            throw new ClientError(this, this.transferAllAssets, { recipient }, error);
        }
    }
    /* Core Collection Functions */
}
