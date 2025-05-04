import { BaseClientConfig } from "../../../core";
import { ClientBuilder } from "../../common/ClientBuilder";
import { PIDelegateClient } from "./PIDelegateClient";
import { PI_DELEGATE_PROCESS_ID } from "../constants";

/**
 * Builder for creating PIDelegateClient instances.
 */
export class PIDelegateClientBuilder extends ClientBuilder<PIDelegateClient> {
    constructor() {
        super(PIDelegateClient);
        // Default to the PI delegate process ID
        this.withProcessId(PI_DELEGATE_PROCESS_ID);
    }
}
