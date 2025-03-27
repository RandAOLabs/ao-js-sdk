import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { Logger, LogLevel, RandomClient } from "src/index";
import { MockBaseClient } from "test/unit/clients/MockBaseClient";

describe("RandomClient Unit Tests", () => {
    let mockBaseClient: MockBaseClient;
    let client: RandomClient;

    beforeEach(async () => {
        // Logger.setLogLevel(LogLevel.NONE)
        // Logger.setLogLevel(LogLevel.DEBUG)
        mockBaseClient = new MockBaseClient();
        client = RandomClient.builder()
            .withProcessId("test-process-id")
            .withTokenProcessId("test-token-process-id")
            .build()
        mockBaseClient.bindToClient(client);
    });
    describe("commit", () => {
        it("happy path", async () => {
            mockBaseClient.setMockMessageResult({
                Output: undefined,
                Messages: [],
                Spawns: []
            });

            await expect(client.commit({
                requestId: "test-id",
                puzzle: {
                    input: "test-input",
                    modulus: "test-modulus"
                }
            })).resolves.not.toThrow();
        });

        it("has an error tag", async () => {
            mockBaseClient.setMockMessageResult({
                Output: undefined,
                Messages: [{
                    Tags: [{ name: "Error", value: "test error" }]
                }],
                Spawns: []
            });

            await expect(client.commit({
                requestId: "test-id",
                puzzle: {
                    input: "test-input",
                    modulus: "test-modulus"
                }
            })).rejects.toThrow();
        });
    });

    describe("reveal", () => {
        it("happy path", async () => {
            mockBaseClient.setMockMessageResult({
                Output: undefined,
                Messages: [],
                Spawns: []
            });

            await expect(client.reveal({
                requestId: "test-id",
                rsa_key: {
                    p: "test-p",
                    q: "test-q"
                }
            })).resolves.not.toThrow();
        });

        it("has an error tag", async () => {
            mockBaseClient.setMockMessageResult({
                Output: undefined,
                Messages: [{
                    Tags: [{ name: "Error", value: "test error" }]
                }],
                Spawns: []
            });

            await expect(client.reveal({
                requestId: "test-id",
                rsa_key: {
                    p: "test-p",
                    q: "test-q"
                }
            })).rejects.toThrow();
        });
    });

});
