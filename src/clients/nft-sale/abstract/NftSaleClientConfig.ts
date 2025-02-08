import { BaseClientConfig } from "../../../core/abstract/BaseClientConfig";

export interface NftSaleClientConfig extends BaseClientConfig {
    tokenProcessId: string;
    purchaseAmount: string;
    luckyDrawAmount: string;
}
