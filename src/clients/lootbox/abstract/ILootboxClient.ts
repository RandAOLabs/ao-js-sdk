import { Tags } from "../../../core";

export interface ILootboxClient {
    /**
     * Opens a lootbox by transferring the required amount of payment tokens to the lootbox process
     * @returns A boolean indicating if the lootbox was successfully opened
     */
    openLootbox(): Promise<boolean>;

    /**
     * Adds a prize to the lootbox by transferring a prize token to the lootbox process
     * @param prizeTokenProcessId The process ID of the token to add as a prize
     * @returns A boolean indicating if the prize was successfully added
     */
    addPrize(prizeTokenProcessId: string): Promise<boolean>;

    /**
     * Lists all available prizes in the lootbox
     * @returns A list of process IDs representing the available prizes
     */
    listPrizes(): Promise<string[]>;
}
