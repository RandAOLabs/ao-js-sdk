import { Tags, BaseClient } from "../../core/index";
import { Logger } from "../../utils/index"
import { ITokenClient } from "./abstract/ITokenClient";
import { getTokenClientAutoConfiguration } from "./TokenClientAutoConfiguration";
import { BalanceError, BalancesError, GetInfoError, MintError, TransferError } from "./TokenClientError";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { SUCCESS_MESSAGE } from "./constants";

/** @see {@link https://cookbook_ao.g8way.io/references/token.html | specification} */
export class TokenClient extends BaseClient implements ITokenClient {
    /* Constructors */
    public static autoConfiguration(): TokenClient {
        return new TokenClient(getTokenClientAutoConfiguration());
    }
    /* Constructors */

    /* Core Token Functions */
    public async balance(identifier?: string): Promise<string> {
        if (!identifier) {
            identifier = await this.getCallingWalletAddress()
        }
        try {
            const response = await this.dryrun('', [
                { name: "Action", value: "Balance" },
                { name: "Target", value: identifier }
            ]);
            Logger.debug(JSON.stringify(response))
            return response.Messages[0].Data // Unsafe Typing
        } catch (error: any) {
            Logger.error(`Error fetching balance for identifier ${identifier}: ${error.message}`);
            throw new BalanceError(identifier, error);
        }
    }

    public async balances(limit: number = 1000, cursor?: string): Promise<DryRunResult> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Balances" },
                { name: "Limit", value: limit.toString() },
            ];
            if (cursor) {
                tags.push({ name: "Cursor", value: cursor });
            }
            return await this.dryrun('', tags); // If ever used should refactor to return the balances in a list format 
        } catch (error: any) {
            Logger.error(`Error fetching balances: ${error.message}`);
            throw new BalancesError(error);
        }
    }

    public async transfer(recipient: string, quantity: string, forwardedTags?: Tags): Promise<boolean> {
        try {
            const tags: Tags = [
                { name: "Action", value: "Transfer" },
                { name: "Recipient", value: recipient },
                { name: "Quantity", value: quantity }
            ];
            if (forwardedTags) {
                forwardedTags.forEach(tag => tags.push({ name: `X-${tag.name}`, value: tag.value }));
            }
            const result = await this.messageResult('', tags)
            const messageData: string = this.getFirstMessageDataString(result)
            return messageData.includes(SUCCESS_MESSAGE);
        } catch (error: any) {
            Logger.error(`Error transferring ${quantity} to ${recipient}: ${error.message}`);
            throw new TransferError(recipient, quantity, error);
        }
    }

    public async getInfo(token: string): Promise<void> {
        try {
            const response = await this.dryrun('', [
                { name: "Action", value: "Info" },
                { name: "Target", value: token }
            ]);

        } catch (error: any) {
            Logger.error(`Error fetching info for token ${token}: ${error.message}`);
            throw new GetInfoError(token, error);
        }
    }

    public async mint(quantity: string): Promise<void> {
        try {
            await this.message('', [
                { name: "Action", value: "Mint" },
                { name: "Quantity", value: quantity }
            ]);
        } catch (error: any) {
            Logger.error(`Error minting quantity ${quantity}: ${error.message}`);
            throw new MintError(quantity, error);
        }
    }
    /* Core Token Functions */
}