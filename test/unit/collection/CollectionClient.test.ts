import { CollectionClient } from '../../../src/clients/collection/CollectionClient';
import { CollectionInfoError, UpdateAssetsError, AddToProfileError, AuthorizationError, InputValidationError } from '../../../src/clients/collection/CollectionClientError';
import { ACTIONS, RESPONSE_ACTIONS, STATUS, TAG_NAMES } from '../../../src/clients/collection/constants';
import { MessageResult } from '@permaweb/aoconnect/dist/lib/result';
import { Logger } from '../../../src/utils';

jest.mock('../../../src/utils/logger/logger');

describe('CollectionClient', () => {
    let client: CollectionClient;
    let mockMessageResult: jest.SpyInstance;

    beforeEach(() => {
        client = CollectionClient.autoConfiguration();
        mockMessageResult = jest.spyOn(client as any, 'messageResult');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getInfo', () => {
        const mockCollectionInfo = {
            Name: 'Test Collection',
            Assets: ['asset1', 'asset2']
        };

        const mockSuccessResponse: MessageResult = {
            Messages: [{
                Data: JSON.stringify(mockCollectionInfo),
                Tags: [
                    { name: TAG_NAMES.ACTION, value: ACTIONS.INFO }
                ]
            }],
            Output: null,
            Spawns: []
        };

        it('should return collection info on success', async () => {
            mockMessageResult.mockResolvedValueOnce(mockSuccessResponse);

            const result = await client.getInfo();

            expect(result).toEqual(mockCollectionInfo);
            expect(mockMessageResult).toHaveBeenCalledWith('', [
                { name: TAG_NAMES.ACTION, value: ACTIONS.INFO }
            ]);
        });

        it('should throw CollectionInfoError when messageResult throws', async () => {
            const error = new Error('Network error');
            mockMessageResult.mockRejectedValueOnce(error);

            await expect(client.getInfo()).rejects.toThrow(CollectionInfoError);
            expect(Logger.error).toHaveBeenCalledWith(`Error fetching collection info: ${error.message}`);
        });
    });

    describe('updateAssets', () => {
        const updateRequest = {
            AssetIds: ['asset1', 'asset2'],
            UpdateType: 'Add' as const
        };

        const mockSuccessResponse: MessageResult = {
            Messages: [{
                Tags: [
                    { name: TAG_NAMES.ACTION, value: ACTIONS.UPDATE_ASSETS },
                    { name: TAG_NAMES.STATUS, value: STATUS.SUCCESS }
                ],
                Data: ''
            }],
            Output: null,
            Spawns: []
        };

        it('should return true on successful update', async () => {
            mockMessageResult.mockResolvedValueOnce(mockSuccessResponse);

            const result = await client.updateAssets(updateRequest);

            expect(result).toBe(true);
            expect(mockMessageResult).toHaveBeenCalledWith(
                JSON.stringify(updateRequest),
                [{ name: TAG_NAMES.ACTION, value: ACTIONS.UPDATE_ASSETS }]
            );
        });

        it('should throw AuthorizationError when unauthorized', async () => {
            const mockErrorResponse: MessageResult = {
                Messages: [{
                    Tags: [
                        { name: TAG_NAMES.ACTION, value: RESPONSE_ACTIONS.AUTHORIZATION_ERROR },
                        { name: TAG_NAMES.MESSAGE, value: 'Unauthorized' }
                    ],
                    Data: ''
                }],
                Output: null,
                Spawns: []
            };
            mockMessageResult.mockResolvedValueOnce(mockErrorResponse);

            await expect(client.updateAssets(updateRequest)).rejects.toThrow(AuthorizationError);
        });

        it('should throw InputValidationError on invalid input', async () => {
            const mockErrorResponse: MessageResult = {
                Messages: [{
                    Tags: [
                        { name: TAG_NAMES.ACTION, value: RESPONSE_ACTIONS.INPUT_ERROR },
                        { name: TAG_NAMES.MESSAGE, value: 'Invalid input' }
                    ],
                    Data: ''
                }],
                Output: null,
                Spawns: []
            };
            mockMessageResult.mockResolvedValueOnce(mockErrorResponse);

            await expect(client.updateAssets(updateRequest)).rejects.toThrow(InputValidationError);
        });

        it('should throw UpdateAssetsError when messageResult throws', async () => {
            const error = new Error('Network error');
            mockMessageResult.mockRejectedValueOnce(error);

            await expect(client.updateAssets(updateRequest)).rejects.toThrow(UpdateAssetsError);
            expect(Logger.error).toHaveBeenCalledWith(`Error updating collection assets: ${error.message}`);
        });
    });

    describe('addToProfile', () => {
        const profileProcessId = 'test-profile-id';

        const mockSuccessResponse: MessageResult = {
            Messages: [{
                Tags: [
                    { name: TAG_NAMES.ACTION, value: ACTIONS.ADD_TO_PROFILE }
                ],
                Data: ''
            }],
            Output: null,
            Spawns: []
        };

        it('should complete successfully', async () => {
            mockMessageResult.mockResolvedValueOnce(mockSuccessResponse);

            await expect(client.addToProfile(profileProcessId)).resolves.not.toThrow();
            expect(mockMessageResult).toHaveBeenCalledWith('', [
                { name: TAG_NAMES.ACTION, value: ACTIONS.ADD_TO_PROFILE },
                { name: TAG_NAMES.PROFILE_PROCESS, value: profileProcessId }
            ]);
        });

        it('should throw InputValidationError on invalid input', async () => {
            const mockErrorResponse: MessageResult = {
                Messages: [{
                    Tags: [
                        { name: TAG_NAMES.ACTION, value: RESPONSE_ACTIONS.INPUT_ERROR },
                        { name: TAG_NAMES.MESSAGE, value: 'Invalid profile ID' }
                    ],
                    Data: ''
                }],
                Output: null,
                Spawns: []
            };
            mockMessageResult.mockResolvedValueOnce(mockErrorResponse);

            await expect(client.addToProfile(profileProcessId)).rejects.toThrow(InputValidationError);
        });

        it('should throw AddToProfileError when messageResult throws', async () => {
            const error = new Error('Network error');
            mockMessageResult.mockRejectedValueOnce(error);

            await expect(client.addToProfile(profileProcessId)).rejects.toThrow(AddToProfileError);
            expect(Logger.error).toHaveBeenCalledWith(`Error adding collection to profile: ${error.message}`);
        });
    });

    describe('transferAllAssets', () => {
        const recipient = 'test-recipient';
        const mockCollectionInfo = {
            Name: 'Test Collection',
            Assets: ['asset1', 'asset2']
        };

        it('should call getInfo when starting transfer', async () => {
            // Mock getInfo to throw error to prevent full execution
            mockMessageResult.mockRejectedValueOnce(new Error('Stop test after getInfo'));

            try {
                await client.transferAllAssets(recipient);
            } catch (error) {
                // Expected to throw
            }

            // Verify getInfo was called
            expect(mockMessageResult).toHaveBeenCalledWith('', [
                { name: TAG_NAMES.ACTION, value: ACTIONS.INFO }
            ]);
        });
    });
});
