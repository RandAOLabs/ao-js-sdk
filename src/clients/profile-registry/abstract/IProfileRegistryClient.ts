import { ProfileRegistryEntry } from "src/clients/profile-registry/abstract/types";

/** @see {@link https://cookbook_ao.g8way.io/references/registry.html | specification} */
export interface IProfileRegistryClient {
    /**
     * Get profiles associated with a wallet address
     * @param walletAddress The wallet address to get profiles for
     * @returns Promise resolving to registry profile response
     * @throws {GetProfilesError} If profile fetch fails
     */
    getProfileByWalletAddress(walletAddress?: string): Promise<ProfileRegistryEntry[]>;
}
