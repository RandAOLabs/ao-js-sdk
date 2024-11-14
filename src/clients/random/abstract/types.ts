type ProviderVDFResult = {
    request_id: string;
    provider_id: string;
    input_value: string;
    modulus_value: string;
    output_value: string;
    proof: string;
    created_at: number;
};


type RandomRequest = {
    request_id: string;
    requester: string;
    providers: string;
    entropy: string;
    created_at: number;
};

type ProviderVDFResults = {
    requestResponses: ProviderVDFResult[];
};


type GetProviderAvailableValuesResponse = {
    providerId: string;
    availibleRandomValues: number;
};

type GetOpenRandomRequestsResponse = {
    providerId: string;
    activeRequests: string;
};

type RandomRequestResponse = {
    randomRequest: RandomRequest;
    providerVDFResults: ProviderVDFResults;
};

type GetRandomRequestsResponse = {
    randomRequestResponses: RandomRequestResponse[];
};
