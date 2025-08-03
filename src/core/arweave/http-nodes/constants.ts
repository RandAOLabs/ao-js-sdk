import { HttpClientConfig } from "../../../utils/http";


export const ARWEAVE_DOT_NET_HTTP_CONFIG: HttpClientConfig = {
	baseURL: "https://arweave.net",
	timeout: 30000
} as const;
