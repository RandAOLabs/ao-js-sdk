import { AO_CONFIGURATIONS } from "src/core/ao/ao-client/configurations";
import { Logger, LogLevel, PROVIDER_MINIMUM_STAKE, ProviderStakingClient, RandomClient, RequestList } from "src/index";
import { PROCESS_IDS } from "src/process-ids";
import { SAMPLE_PUZZLE, SAMPLE_RSA_KEY } from "test/integration/clients/randao/random/testData";

// Integration test for all functions in RandomClient
jest.setTimeout(60000); // Set timeout to 60 seconds for all tests// Integration test for all functions in RandomClient
describe("RandomClient Integration Test", () => {
    let requestingClient: RandomClient;
    let providingClient1: RandomClient;
    let providingClient2: RandomClient;
    let stakingClient1: ProviderStakingClient;
    let stakingClient2: ProviderStakingClient;


    // Testing Values
    let availableValues = 100
    let openRandomRequestId: string | null = null;
    let stakeAmount = PROVIDER_MINIMUM_STAKE
    let activeChallengeRequests: RequestList;
    let activeOutputRequests: RequestList;
    let callbackid = "8271206667112314"//`${Math.random() * 100000000000}`

    beforeAll(async () => {
        Logger.setLogLevel(LogLevel.INFO)
        // Initialize the RandomClient with actual configuration for integration testing

        let fs = eval('require("fs")');
        const wallet1Data = fs.readFileSync("./test-wallets/test-provider1.json", 'utf-8'); // May throw FS errors
        const wallet1 = JSON.parse(wallet1Data)
        const wallet2Data = fs.readFileSync("./test-wallets/test-provider2.json", 'utf-8'); // May throw FS errors
        const wallet2 = JSON.parse(wallet2Data)
        providingClient1 = (await RandomClient.defaultBuilder())
            .withProcessId(PROCESS_IDS.RANDAO.RANDOM)
            .withWallet(wallet1)
            .withAOConfig(AO_CONFIGURATIONS.FORWARD_RESEARCH)
            .build()

        providingClient2 = (await RandomClient.defaultBuilder())
            .withProcessId(PROCESS_IDS.RANDAO.RANDOM)
            .withWallet(wallet2)
            .withAOConfig(AO_CONFIGURATIONS.RANDAO)
            .build()

        requestingClient = providingClient1

        stakingClient1 = ProviderStakingClient.defaultBuilder()
            .withWallet(wallet1)
            .build()

        stakingClient2 = ProviderStakingClient.defaultBuilder()
            .withWallet(wallet2)
            .build()
    });

    afterAll(() => {
        // Optionally clean up resources or reset configurations
        Logger.info("Integration tests complete.");
    });

    // describe("ProviderStakingClient.stake()", () => {
    //     it("should successfully stake", async () => {
    //         // const response1 = await stakingClient1.stake(stakeAmount);
    //         // Logger.debug(response1)
    //         const response2 = await stakingClient2.stake(stakeAmount);
    //         Logger.debug(response2)
    //     });
    // });

    // describe("RandomClient.updateProviderAvailableValues()", () => {
    //     it("should successfully updateProviderAvailableValues", async () => {
    //         const response1 = await providingClient1.updateProviderAvailableValues(availableValues);
    //         Logger.debug(response1)
    //         const response2 = await providingClient2.updateProviderAvailableValues(availableValues);
    //         Logger.debug(response2)
    //     });
    // });

    describe("RandomClient.createRequest()", () => {
        it("should successfully createRequest", async () => {
            const provider_ids = [await providingClient1.getCallingWalletAddress()]
            Logger.debug(provider_ids)
            const response = await requestingClient.createRequest(provider_ids, 1, callbackid);
            Logger.debug(response)
        });
    });

    describe("RandomClient.getOpenRandomRequests()", () => {
        it("should successfully getOpenRandomRequests", async () => {
            const response1 = await providingClient1.getOpenRandomRequests(await providingClient1.getCallingWalletAddress());
            activeChallengeRequests = response1.activeChallengeRequests
            activeOutputRequests = response1.activeOutputRequests
            Logger.info(response1)
        });
    });

    // describe("RandomClient.commit()", () => {
    //     it("should successfully commit", async () => {
    //         const response = await providingClient1.commit({
    //             requestId: activeChallengeRequests.request_ids[0],
    //             puzzle: SAMPLE_PUZZLE
    //         });
    //         Logger.debug(response)
    //     });
    // });

    describe("RandomClient.getOpenRandomRequests()", () => {
        it("should successfully getOpenRandomRequests", async () => {
            const response = await providingClient1.getOpenRandomRequests(await providingClient1.getCallingWalletAddress());
            activeChallengeRequests = response.activeChallengeRequests
            activeOutputRequests = response.activeOutputRequests
            Logger.debug(response)
        });
    });

    describe("RandomClient.reveal()", () => {
        it("should successfully reveal", async () => {
            const response = await providingClient1.reveal({
                requestId: activeOutputRequests.request_ids[0],
                rsa_key: SAMPLE_RSA_KEY
            });
            Logger.debug(response)
        });
    });
});
