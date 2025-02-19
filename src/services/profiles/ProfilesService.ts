import { ProfileClient } from "src/clients/profile/ProfileClient";
import { ProfileInfo } from "src/clients/profile/abstract/types";
import { ProfileRegistryClient } from "src/clients/profile-registry/ProfileRegistryClient";
import { ProfileRegistryEntry } from "src/clients/profile-registry/abstract";
import { IProfilesService } from "./abstract/IProfilesService";
import { Logger } from "src/utils";
import { getBaseClientAutoConfiguration } from "src/core/ao/BaseClientAutoConfiguration";
import { ICache, newCache } from "src/utils/cache";
import { ConcurrencyManager } from "src/utils/concurrency";

const MAX_RETRIES = 3;

/**
 * Service for handling Profile operations
 * Implements a singleton pattern to ensure only one instance exists
 * @category Services
 */
export class ProfilesService implements IProfilesService {
    private static instance: ProfilesService;
    private static readonly retryOptions = {
        retries: MAX_RETRIES,
        onFailedAttempt: (error: { attemptNumber: number; retriesLeft: number; message: string }) => {
            Logger.warn(`Profile Retrieval failed. Attempt ${error.attemptNumber}/${MAX_RETRIES + 1}. ${error.message}`);
        }
    };

    private profileRegistryClient: ProfileRegistryClient;
    private profileInfoCache: ICache<string, ProfileInfo>;

    private constructor() {
        this.profileRegistryClient = ProfileRegistryClient.autoConfiguration();
        this.profileInfoCache = newCache<string, ProfileInfo>({
            maxSize: 1000, // Cache up to 1000 profile infos
            maxAge: 5 * 60 * 1000 // Cache for 5 minutes
        });
    }

    public static getInstance(): ProfilesService {
        if (!ProfilesService.instance) {
            ProfilesService.instance = new ProfilesService();
        }
        return ProfilesService.instance;
    }

    /**
     * @inheritdoc
     */
    public async getProfileInfosByWalletAddress(walletAddresses: string[]): Promise<ProfileInfo[]> {
        try {
            const registryResults = await ConcurrencyManager.executeAllWithRetry(
                walletAddresses.map(address => () => this._getRegistryEntriesForAddress(address)),
                ProfilesService.retryOptions
            );

            // Filter out null results and cast to correct type
            const validResults = registryResults.filter((result): result is ProfileRegistryEntry[] => result !== null);
            const processIds = this._extractProcessIdsFromRegistryEntries(validResults);
            return this.getProfileInfosByProfileProcessIds(processIds);
        } catch (error: any) {
            Logger.error(`Error in getProfileInfosByWalletAddress: ${error.message}`);
            return [];
        }
    }

    /**
     * @inheritdoc
     */
    public async getProfileInfosByProfileProcessIds(processIds: string[]): Promise<ProfileInfo[]> {
        try {
            const results = await Promise.all(
                processIds.map(async processId => {
                    // Check cache first
                    const cached = this.profileInfoCache.get(processId);
                    if (cached) {
                        return cached;
                    }

                    // If not in cache, fetch and cache the result
                    return ConcurrencyManager.executeWithRetry(
                        () => this._getAndCacheProfileInfo(processId),
                        ProfilesService.retryOptions
                    );
                })
            );

            return results.filter((info: ProfileInfo | null): info is ProfileInfo => info !== null);
        } catch (error: any) {
            Logger.error(`Error in getProfileInfosByProfileProcessIds: ${error.message}`);
            return [];
        }
    }

    /* Private Methods */

    /**
     * Gets registry entries for a wallet address
     */
    private async _getRegistryEntriesForAddress(address: string): Promise<ProfileRegistryEntry[]> {
        const entries = await this.profileRegistryClient.getProfileByWalletAddress(address);
        return entries || [];
    }

    /**
     * Gets profile info for a process ID
     */
    private async _getProfileInfoForProcessId(processId: string): Promise<ProfileInfo> {
        const config = {
            ...getBaseClientAutoConfiguration(),
            processId
        };
        const client = new ProfileClient(config);
        return await client.getProfileInfo();
    }

    /**
     * Gets profile info and caches it if successful
     */
    private async _getAndCacheProfileInfo(processId: string): Promise<ProfileInfo> {
        const info = await this._getProfileInfoForProcessId(processId);
        if (info) {
            this.profileInfoCache.set(processId, info);
        }
        return info;
    }

    /**
     * Extracts and validates process IDs from registry entries
     */
    private _extractProcessIdsFromRegistryEntries(registryResults: ProfileRegistryEntry[][]): string[] {
        return registryResults
            .flat()
            .filter((entry): entry is ProfileRegistryEntry =>
                entry !== null &&
                typeof entry === 'object' &&
                'ProfileId' in entry &&
                'CallerAddress' in entry &&
                'Role' in entry
            )
            .map(entry => entry.ProfileId)
            .filter((id): id is string => id !== null && id !== undefined);
    }
}

// Export singleton instance
export default ProfilesService.getInstance();
