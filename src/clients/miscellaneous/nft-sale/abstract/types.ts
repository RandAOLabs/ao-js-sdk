
// Each zone in MasterWhitelist is an array with:
// [0]: Purchase price
// [1]: Lucky draw price
// [2]: Whitelist addresses mapping
export type WhitelistZone = [
    string,  // Purchase price
    string,  // Lucky draw price
    { [key: string]: boolean }  // Whitelist addresses mapping
];

export interface NftSaleInfo {
    MasterWhitelist: WhitelistZone[];
    Current_Zone: number;
    WhitelistZones: number[];  // Zone thresholds
    PurchaseLimits: [number, any[]][];  // [limit, data][]
}
