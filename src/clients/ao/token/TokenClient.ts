import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { ITokenClient, IGrantToken } from "src/clients/ao/token/abstract";
import { TRANSFER_SUCCESS_MESSAGE } from "src/clients/ao/token/constants";
import { BalanceError, BalancesError, TransferError, GetInfoError, MintError, GrantError } from "src/clients/ao/token/TokenClientError";
import { Tags, TagUtils } from "src/core";
import { ISyncAutoConfiguration } from "src/core/ao/abstract";
import { BaseClient } from "src/core/ao/BaseClient";
import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { Logger } from "src/utils/index"

/**
 * @category ao-standards
 * @see {@link https://cookbook_ao.g8way.io/references/token.html | specification}
 */
export class TokenClient extends BaseClient implements ITokenClient, IGrantToken {
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
            const messageData: string = ResultUtils.getFirstMessageDataString(result)
            return messageData.includes(TRANSFER_SUCCESS_MESSAGE);
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
            // TODO unimplemented
        } catch (error: any) {
            Logger.error(`Error fetching info for token ${token}: ${error.message}`);
            throw new GetInfoError(token, error);
        }
    }

    public async mint(quantity: string): Promise<boolean> {
        try {
            const result = await this.messageResult('', [
                { name: "Action", value: "Mint" },
                { name: "Quantity", value: quantity }
            ]);
            const actionValue = TagUtils.getTagValue(result.Messages[0].Tags, "Action");
            return actionValue !== "Mint-Error";
        } catch (error: any) {
            Logger.error(`Error minting quantity ${quantity}: ${error.message}`);
            throw new MintError(quantity, error);
        }
    }

    public async grant(quantity: string, recipient?: string): Promise<boolean> {
        try {
            const recipientAddress = recipient ?? await this.getCallingWalletAddress();
            const result = await this.messageResult('', [
                { name: "Action", value: "Grant" },
                { name: "Quantity", value: quantity },
                { name: "Recipient", value: recipientAddress }
            ]);
            const actionValue = TagUtils.getTagValue(result.Messages[0].Tags, "Action");
            return actionValue !== "Grant-Error";
        } catch (error: any) {
            Logger.error(`Error granting ${quantity} tokens to ${recipient}: ${error.message}`);
            throw new GrantError(quantity, recipient ?? 'self', error);
        }
    }
    /* Core Token Functions */
}