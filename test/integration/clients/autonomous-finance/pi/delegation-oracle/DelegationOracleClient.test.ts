import { DelegationOracleClient } from "src/clients/autonomous-finance/pi/delegation-oracle";
import { GetDelegationsParams } from "src/clients/autonomous-finance/pi/delegation-oracle/abstract";
import { Logger, LogLevel } from "src/utils";

describe("DelegationOracleClient Integration Tests", () => {
    let client: DelegationOracleClient;

    beforeAll(async () => {
        Logger.setLogLevel(LogLevel.DEBUG)
        client = await DelegationOracleClient.autoConfiguration();
    });

    describe("getDelegations", () => {
        it("should retrieve delegation records with required parameters", async () => {
            // Arrange
            const params: GetDelegationsParams = {
                index: 1
            };

            // Act
            const result = await client.getDelegations(params);

            Logger.debug()

            // Assert
            expect(result).toBeDefined();
            expect(result.delegations).toBeDefined();
            expect(typeof result.delegations).toBe("string");
        });

        // it("should retrieve delegation records with all parameters", async () => {
        //     // Arrange
        //     const params: GetDelegationsParams = {
        //         index: 1,
        //         format: "CSV",
        //         nonce: 112096,
        //         timestamp: Date.now(),
        //         total: 1
        //     };

        //     // Act
        //     const result = await client.getDelegations(params);

        //     // Assert
        //     expect(result).toBeDefined();
        //     expect(result.delegations).toBeDefined();
        //     expect(typeof result.delegations).toBe("string");
        // });

        // it("should handle errors gracefully", async () => {
        //     // Arrange
        //     const params: GetDelegationsParams = {
        //         index: -1 // Invalid index
        //     };

        //     // Act & Assert
        //     await expect(client.getDelegations(params)).rejects.toThrow();
        // });
    });
});
