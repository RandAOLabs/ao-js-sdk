import { ProfileInfo } from "src/clients";
import { Tags } from "src/core";

/** @see {@link https://cookbook_ao.g8way.io/references/profile.html | specification} */
export interface IProfileClient {
    /**
     * Get profile information for a given address
     * @returns Promise resolving to profile information
     * @throws {GetProfileError} If profile fetch fails
     */
    getProfileInfo(): Promise<ProfileInfo>;

    /**
     * Transfer tokens from a target contract
     * @param target Target contract to transfer from
     * @param recipient Recipient address
     * @param quantity Amount to transfer
     * @param tags Optional additional tags
     * @returns Promise resolving to boolean indicating success
     * @throws {TransferError} If transfer fails
     */
    transferAsset(target: string, recipient: string, quantity: string, tags?: Tags): Promise<boolean>;
}
