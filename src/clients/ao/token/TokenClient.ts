import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { ITokenClient, IGrantToken } from "./abstract";
import { TRANSFER_SUCCESS_MESSAGE } from "./constants";
import { ClientError } from "../../common/ClientError";
import { Tags, TagUtils } from "../../../core";
import { BaseClient } from "../../../core/ao/BaseClient";
import ResultUtils from "../../../core/common/result-utils/ResultUtils";
import { Logger } from "../../../utils/index";
import { IAutoconfiguration, IDefaultBuilder, staticImplements } from "../../../utils";
import { ClientBuilder } from "../../common/ClientBuilder";
import { AO_CONFIGURATION_DEFAULT } from "../../../core/ao/ao-client/configurations";

/**
 * @category ao-standards
 * @see {@link https://cookbook_ao.g8way.io/references/token.html | specification}
 */
@staticImplements<IAutoconfiguration>()
@staticImplements<IDefaultBuilder>()
export class TokenClient extends BaseClient implements ITokenClient, IGrantToken {
    /* Constructors */

    /**
     * {@inheritdoc IAutoconfiguration.autoConfiguration}
     * @see {@link IAutoconfiguration.autoConfiguration} 
     */
    public static autoConfiguration(): TokenClient {
        const builder = TokenClient.defaultBuilder();
        return builder.build();
    }

    /**
     * Creates a builder for TokenClient instances
     * @returns A new builder for TokenClient
     */
    public static builder(): ClientBuilder<TokenClient> {
        return new ClientBuilder(TokenClient);
    }

    /** 
     * {@inheritdoc IDefaultBuilder.defaultBuilder}
     * @see {@link IDefaultBuilder.defaultBuilder} 
     */
    public static defaultBuilder(): ClientBuilder<TokenClient> {
        return TokenClient.builder()
            .withAOConfig(AO_CONFIGURATION_DEFAULT);
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
            return response.Messages[0].Data // Unsafe Typing
        } catch (error: any) {
            throw new ClientError(this, this.balance, identifier, error);
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
            throw new ClientError(this, this.balances, { limit, cursor }, error);
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
            throw new ClientError(this, this.transfer, { recipient, quantity, forwardedTags }, error);
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
            throw new ClientError(this, this.getInfo, { token }, error);
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
            throw new ClientError(this, this.mint, { quantity }, error);
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
            throw new ClientError(this, this.grant, { quantity, recipient }, error);
        }
    }
    /* Core Token Functions */
}