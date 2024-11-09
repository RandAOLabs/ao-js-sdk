import { getWallet } from "@utils/wallet/index";
import { BaseClientConfig } from "./abstract/BaseClientConfig";

export const BASE_CLIENT_AUTO_CONFIGURATION: BaseClientConfig = {
    processId: "BASE_CLIENT_AUTO_CONFIGURATION_FAKE_PROCESS_ID",
    wallet: getWallet()
}