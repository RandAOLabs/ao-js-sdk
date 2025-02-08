import { Tags } from "../../../core/abstract/types";

export interface WhitelistZone {
    [1]: string;  // Zone Purchase Price
    [2]: string;  // Zone Lucky Price
    [3]: {
        [key: string]: boolean;  // Whitelist addresses mapping
    };
}

export interface WhitelistMaster {
    [key: number]: WhitelistZone;  // Zone number mapping
}

export interface NftSaleInfo {
    Current_Zone: number;
    MasterWhitelist: WhitelistMaster;
}
