import { BotegaLiquidityPoolClient } from "src/clients/autonomous-finance/botega/liquidity-pool/BotegaLiquidityPoolClient";
import { MockBaseClient } from "test/unit/clients/MockBaseClient";
import { ArweaveTransaction } from "src/core/arweave/abstract/types";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import {
    GetLPInfoError,
    GetPriceError
} from "src/clients/autonomous-finance/botega/liquidity-pool/BotegaLiquidityPoolClientError";
import { Logger, LogLevel } from "src/utils";

describe("BotegaLiquidityPoolClient Unit Tests", () => {
    let client: BotegaLiquidityPoolClient;
    let mockBaseClient: MockBaseClient;

    beforeEach(() => {
        Logger.setLogLevel(LogLevel.NONE)
        client = new BotegaLiquidityPoolClient("test-process-id");
        mockBaseClient = new MockBaseClient();
        mockBaseClient.bindToClient(client);
    });

    afterEach(() => {
        mockBaseClient.clearMockResponses();
    });

    describe("getLPInfo", () => {
        it("should return LP info from process info tags", async () => {
            const mockProcessInfo: ArweaveTransaction = {
                id: "test-id",
                tags: [
                    { name: "Token-A", value: "token-a-id" },
                    { name: "Token-A-Ticker", value: "TKA" },
                    { name: "Token-B", value: "token-b-id" },
                    { name: "Token-B-Ticker", value: "TKB" },
                    { name: "Name", value: "Test Pool" }
                ]
            };

            // Mock getProcessInfo response
            jest.spyOn(client, "getProcessInfo").mockResolvedValue(mockProcessInfo);

            const result = await client.getLPInfo();
            expect(result).toEqual({
                tokenA: "token-a-id",
                tokenATicker: "TKA",
                tokenB: "token-b-id",
                tokenBTicker: "TKB",
                name: "Test Pool"
            });
        });

        it("should throw GetLPInfoError on failure", async () => {
            jest.spyOn(client, "getProcessInfo").mockRejectedValue(new Error("Test error"));
            await expect(client.getLPInfo()).rejects.toThrow(GetLPInfoError);
        });
    });

    describe("getPrice", () => {
        it("should return price from dryrun response", async () => {
            const mockDryrun: DryRunResult = {
                Messages: [{
                    Tags: [
                        { name: "Price", value: "123.45" }
                    ]
                }],
                Output: "",
                Spawns: []
            };

            mockBaseClient.setMockDryrun(mockDryrun);

            const result = await client.getPrice(100, "test-token");
            expect(result).toBe(123.45);
        });

        it("should throw GetPriceError when price tag is missing", async () => {
            const mockDryrun: DryRunResult = {
                Messages: [{ Tags: [] }],
                Output: "",
                Spawns: []
            };

            mockBaseClient.setMockDryrun(mockDryrun);

            await expect(client.getPrice(100, "test-token"))
                .rejects.toThrow(GetPriceError);
        });
    });

    describe("price conversion methods", () => {
        const mockLPInfo = {
            tokenA: "token-a-id",
            tokenATicker: "TKA",
            tokenB: "token-b-id",
            tokenBTicker: "TKB",
            name: "Test Pool"
        };

        beforeEach(() => {
            jest.spyOn(client, "getLPInfo").mockResolvedValue(mockLPInfo);
        });

        it("should get price of token A in token B", async () => {
            const mockDryrun: DryRunResult = {
                Messages: [{
                    Tags: [
                        { name: "Price", value: "2.5" }
                    ]
                }],
                Output: "",
                Spawns: []
            };

            mockBaseClient.setMockDryrun(mockDryrun);

            const result = await client.getPriceOfTokenAInTokenB(100);
            expect(result).toBe(2.5);
        });

        it("should get price of token B in token A", async () => {
            const mockDryrun: DryRunResult = {
                Messages: [{
                    Tags: [
                        { name: "Price", value: "0.4" }
                    ]
                }],
                Output: "",
                Spawns: []
            };

            mockBaseClient.setMockDryrun(mockDryrun);

            const result = await client.getPriceOfTokenBInTokenA(100);
            expect(result).toBe(0.4);
        });
    });
});
