export type ProviderVDFResult = {
    request_id: string;
    provider_id: string;
    input_value: string;
    modulus_value: string;
    output_value: string;
    proof: string;
    created_at: number;
};


export type RandomRequest = {
    request_id: string;
    requester: string;
    providers: string;
    entropy: string;
    created_at: number;
};

export type ProviderVDFResults = {
    requestResponses: ProviderVDFResult[];
};


export type GetProviderAvailableValuesResponse = {
    providerId: string;
    availibleRandomValues: number;
};

export type RequestList = {
    request_ids: string[];
};

export type GetOpenRandomRequestsResponse = {
    providerId: string;
    activeChallengeRequests: RequestList;
    activeOutputRequests: RequestList;
};



export type RandomRequestResponse = {
    randomRequest: RandomRequest;
    providerVDFResults: ProviderVDFResults;
};

export type GetRandomRequestsResponse = {
    randomRequestResponses: RandomRequestResponse[];
};
