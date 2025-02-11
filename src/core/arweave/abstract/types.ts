/**
 * Response type for Arweave GraphQL queries
 */
export interface ArweaveGQLResponse {
    data: {
        transactions: {
            cursor?: string;
            edges: Array<{
                cursor: string;
                node: {
                    id: string;
                    anchor?: string;
                    signature?: string;
                    recipient?: string;
                    owner?: {
                        address?: string;
                        key?: string;
                    };
                    fee?: {
                        winston?: string;
                        ar?: string;
                    };
                    quantity?: {
                        winston?: string;
                        ar?: string;
                    };
                    data?: {
                        size?: string;
                        type?: string;
                    };
                    tags?: Array<{
                        name?: string;
                        value?: string;
                    }>;
                    block?: {
                        id?: string;
                        timestamp?: number;
                        height?: number;
                        previous?: string;
                    };
                    parent?: {
                        id?: string;
                    };
                };
            }>;
        };
    };
}
