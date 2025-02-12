import { RandomClient } from "src/clients";
import { Logger } from "src/utils";

// Integration test for all functions in RandomClient
jest.setTimeout(60000); // Set timeout to 60 seconds for all tests// Integration test for all functions in RandomClient
describe("RandomClient Integration Test", () => {
    let client: RandomClient;

    // Testing Values
    let availableValues = 100
    let openRandomRequestId: string | null = null;

    beforeAll(() => {
        // Initialize the RandomClient with actual configuration for integration testing
        client = RandomClient.autoConfiguration();
    });

    afterAll(() => {
        // Optionally clean up resources or reset configurations
        Logger.info("Integration tests complete.");
    });

    describe("updateProviderAvailableValues()", () => {
        it("should update provider available values without throwing an error", async () => {
            const response = await client.updateProviderAvailableValues(availableValues);
            expect(response).toBeTruthy();
        });
    });

    describe("getProviderAvailableValues()", () => {
        it("should fetch provider available values with correct parameters without throwing an error", async () => {
            const provider = await client.getCallingWalletAddress();
            const response = await client.getProviderAvailableValues(provider);
            expect(response.availibleRandomValues).toBe(availableValues);
        });
    });

    describe("createRequest()", () => {
        it("should create a request without throwing an error", async () => {
            const provider = await client.getCallingWalletAddress();
            const providerIds = [provider];
            const inputNumber = 5; // Specify the number of inputs

            const response = await client.createRequest(providerIds, inputNumber, provider);

            // Assert that the response (request ID) is a non-empty string
            expect(response).toBeTruthy();
            expect(typeof response).toBe("boolean");
        });
    });

    describe("getOpenRandomRequests()", () => {
        it("should fetch open random requests without throwing an error", async () => {
            const provider = await client.getCallingWalletAddress();
            const response = await client.getOpenRandomRequests(provider);

            // Assert that the response is not null or undefined
            expect(response).toBeTruthy();
            expect(response.providerId).toBe(provider);

            // Assert the structure of `activeChallengeRequests` and `activeOutputRequests`
            expect(response.activeChallengeRequests).toBeDefined();
            expect(Array.isArray(response.activeChallengeRequests.request_ids)).toBe(true);

            expect(response.activeOutputRequests).toBeDefined();
            expect(Array.isArray(response.activeOutputRequests.request_ids)).toBe(true);

            // Store the first ID from `activeChallengeRequests` for subsequent tests
            if (response.activeChallengeRequests.request_ids.length > 0) {
                openRandomRequestId = response.activeChallengeRequests.request_ids[0];
                expect(openRandomRequestId).toBeTruthy();
            }
        });
    });

    describe("getRandomRequests()", () => {
        it("should fetch specific random requests without throwing an error", async () => {
            if (!openRandomRequestId) {
                throw new Error("No open random request ID available for testing.");
            }
            const requestIds = [openRandomRequestId];
            const response = await client.getRandomRequests(requestIds);
            expect(response).toBeDefined();
        });
    });

    describe("postVDFChallenge()", () => {
        it("should post VDF challenge without throwing an error", async () => {
            if (!openRandomRequestId) {
                throw new Error("No open random request ID available for testing.");
            }
            const modulus = "7";
            const input = "3";
            const response = await client.postVDFChallenge(openRandomRequestId, modulus, input);
            expect(response).toBeTruthy();
        });
    });

    describe("postVDFOutputAndProof()", () => {
        it("should post VDF output and proof without throwing an error", async () => {
            if (!openRandomRequestId) {
                throw new Error("No open random request ID available for testing.");
            }
            const output = "4";
            const proof = "[1,2]";
            const response = await client.postVDFOutputAndProof(openRandomRequestId, output, proof);
            expect(response).toBeTruthy();
        });
    });
});
