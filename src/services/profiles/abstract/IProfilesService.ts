import { ProfileInfo } from "../../../clients";


/**
 * Interface for the Profiles service
 * Provides methods for retrieving profile information using various identifiers
 */
export interface IProfilesService {
    /**
     * Retrieves profile information for multiple wallet addresses
     * First gets profile process IDs from registry, then fetches profile info for each
     * @param walletAddresses - Array of wallet addresses to get profile info for
     * @returns Promise resolving to array of profile info responses
     * @throws {ProfileInfoRetrievalError} If profile info cannot be retrieved
     * @throws {NoProfileFoundError} If no profile exists for a given wallet address
     * @throws {GetProfileError} If there's an error fetching profile info
     */
    getProfileInfosByWalletAddress(walletAddresses: string[]): Promise<ProfileInfo[]>;

    /**
     * Retrieves profile information for multiple profile process IDs directly
     * @param processIds - Array of profile process IDs to get info for
     * @returns Promise resolving to array of profile info responses
     * @throws {ProfileInfoRetrievalError} If profile info cannot be retrieved
     * @throws {GetProfileError} If there's an error fetching profile info
     */
    getProfileInfosByProfileProcessIds(processIds: string[]): Promise<ProfileInfo[]>;
}
