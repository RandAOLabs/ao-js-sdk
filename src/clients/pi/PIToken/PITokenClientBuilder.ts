import { ClientBuilder } from "../../common/ClientBuilder";
import { PITokenClient } from "./PITokenClient";

/**
 * Builder for creating PITokenClient instances.
 */
export class PITokenClientBuilder extends ClientBuilder<PITokenClient> {
    /**
     * Creates a new PITokenClientBuilder instance.
     */
    constructor() {
        super(PITokenClient);
    }
}
