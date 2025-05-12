export interface HttpResponse<T = any> {
	data: T;
	status: number;
	headers: Record<string, string>;
}

// Base configuration interface with common properties
interface BaseHttpConfig {
	headers?: Record<string, string>;
	timeout?: number;
}

// Configuration for initializing the HTTP client
export interface HttpClientConfig extends BaseHttpConfig {
	baseURL?: string;
}

// Response type enum for better type safety
export enum ResponseType {
	JSON = 'json',
	Text = 'text',
	Blob = 'blob',
	ArrayBuffer = 'arraybuffer'
}

// Type mapping for response types to their data types
export type ResponseTypeToData<T> = 
	T extends ResponseType.JSON ? any :
	T extends ResponseType.Text ? string :
	T extends ResponseType.Blob ? Blob :
	T extends ResponseType.ArrayBuffer ? ArrayBuffer :
	never;

// Configuration for individual requests
export interface HttpRequestConfig<R = any> extends BaseHttpConfig {
	params?: Record<string, string>;
	responseType?: ResponseType;
	transformResponse?: Array<(data: any) => R>;
	[key: string]: any;
}
