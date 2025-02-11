import { MessagesService } from "../../../../src/clients/transaction/messages";
import { Logger } from "../../../../src";

describe('MessagesService Integration Tests', () => {
    let client: MessagesService;

    beforeAll(() => {
        client = new MessagesService();
    });

    // it('should get latest AO messages with pagination', async () => {
    //     const result = await client.getLatestMessages({
    //         limit: 5 // Small limit for testing
    //     });

    //     // Log the result for inspection
    //     Logger.info(`Latest messages: ${JSON.stringify(result, null, 2)}`);

    //     // Just check if we got results
    //     expect(result).toBeDefined();
    //     expect(result.messages.length).toBeGreaterThan(0);
    // }, 30000);

    // it('should get all AO messages', async () => {
    //     const result = await client.getAllMessages({
    //         // No limit needed since getAllMessages handles pagination
    //         tags: [{ name: "App-Name", value: "TestApp" }] // Optional: filter by tag
    //     });

    //     // Log the result for inspection
    //     Logger.info(`All messages count: ${result.length}`);
    //     Logger.info(`First few messages: ${JSON.stringify(result.slice(0, 2), null, 2)}`);

    //     // Just check if we got results
    //     expect(result).toBeDefined();
    //     expect(result).toBeInstanceOf(Array);
    // }, 60000); // Longer timeout since it fetches all messages

    // it('should get all messages sent by an address', async () => {
    //     // First get any message to use its owner as a test address
    //     const initialResult = await client.getLatestMessages({ limit: 1 });
    //     const testAddress = initialResult.messages[0]?.owner?.address;

    //     if (testAddress) {
    //         const result = await client.getAllMessagesSentBy({
    //             id: testAddress
    //         });

    //         // Log the result for inspection
    //         Logger.info(`Messages sent by ${testAddress}: ${result.length}`);
    //         Logger.info(`First message: ${JSON.stringify(result[0], null, 2)}`);

    //         // Just check if we got results
    //         expect(result).toBeDefined();
    //         expect(result).toBeInstanceOf(Array);
    //     }
    // }, 60000);

    it('should get all messages received by an address', async () => {
        // First get any message to use its recipient as a test address
        const testAddress = "9U_MDLfzf-sdww7d7ydaApDiQz3nyHJ4kTS2-9K4AGA"

        if (testAddress) {
            const result = await client.getAllMessagesReceivedBy({
                id: testAddress
            });

            // Log the result for inspection
            Logger.info(`Messages received by ${testAddress}: ${result.length}`);
            Logger.info(`First message: ${JSON.stringify(result[0], null, 2)}`);

            // Just check if we got results
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Array);
        }
    }, 60000);
});
