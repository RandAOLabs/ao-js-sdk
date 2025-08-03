import { AxiosHttpClient, IHttpClient } from "../../../utils/http";
import { ARWEAVE_DOT_NET_HTTP_CONFIG } from "./constants";

export function getArweaveDotNetHttpClient(): IHttpClient{
	return new AxiosHttpClient(ARWEAVE_DOT_NET_HTTP_CONFIG);
}