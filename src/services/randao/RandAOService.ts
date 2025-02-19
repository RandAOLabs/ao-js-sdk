import { RandomClient } from "src/clients";
import { IRandAOService } from "src/services/randao/abstract";

/**
 * Service for handling RandAO operations
 * Implements a singleton pattern to ensure only one instance exists
 * @category Services
 */
export class RandAOService implements IRandAOService {
    private static instance: RandAOService;


    public static getInstance(): RandAOService {
        if (!RandAOService.instance) {
            RandAOService.instance = new RandAOService();
        }
        return RandAOService.instance;
    }
}

// Export singleton instance
export default RandAOService.getInstance();
