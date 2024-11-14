import { RandomClient } from "@randomClient/index";
import { Logger } from "@utils/index";
// Integration test for all functions in RandomClient
jest.setTimeout(60000); // Set timeout to 60 seconds for all tests// Integration test for all functions in RandomClient
describe("RandomClient Integration Test", () => {
    let client: RandomClient;

    beforeAll(() => {
        // Initialize the RandomClient with actual configuration for integration testing
        client = RandomClient.autoConfiguration();
    });

    afterAll(() => {
        // Optionally clean up resources or reset configurations
        Logger.info("Integration tests complete.");
    });

    describe("getProviderAvailableValues()", () => {
        it("should fetch provider available values with correct parameters without throwing an error", async () => {
            const provider = await client.getCallingWalletAddress()
            const response = await client.getProviderAvailableValues(provider);
            expect(response).toBeTruthy();
        });
    });

    // describe("updateProviderAvailableValues()", () => {
    //     it("should update provider available values without throwing an error", async () => {
    //         const amount = 100;
    //         const response = await client.updateProviderAvailableValues(amount);
    //         expect(response).toBeTruthy();
    //     });
    // });

    // describe("getOpenRandomRequests()", () => {
    //     it("should fetch open random requests without throwing an error", async () => {
    //         const provider = "Provider1";
    //         const response = await client.getOpenRandomRequests(provider);
    //         expect(response).toBeTruthy();
    //     });
    // });

    // describe("getRandomRequests()", () => {
    //     it("should fetch specific random requests without throwing an error", async () => {
    //         const requestIds = ["requestId1", "requestId2"];
    //         const response = await client.getRandomRequests(requestIds);
    //         expect(response).toBeDefined();
    //     });
    // });

    // describe("postVDFChallenge()", () => {
    //     it("should post VDF challenge without throwing an error", async () => {
    //         const randomnessRequestId = "requestId1";
    //         const modulus = "modulus1";
    //         const input = "input1";
    //         const response = await client.postVDFChallenge(randomnessRequestId, modulus, input);
    //         expect(response).toBeUndefined();
    //     });
    // });

    // describe("postVDFOutputAndProof()", () => {
    //     it("should post VDF output and proof without throwing an error", async () => {
    //         const randomnessRequestId = "requestId1";
    //         const output = "output1";
    //         const proof = "proof1";
    //         const response = await client.postVDFOutputAndProof(randomnessRequestId, output, proof);
    //         expect(response).toBeUndefined();
    //     });
    // });

    // describe("createRequest()", () => {
    //     it("should create a request without throwing an error", async () => {
    //         const providerIds = ["Provider1", "Provider2"];
    //         const response = await client.createRequest(providerIds);
    //         expect(response).toBeUndefined();
    //     });
    // });
});
