import { HttpClientConfig, HttpRequestConfig, ResponseType, ResponseTypeToData } from './types';

export interface IHttpClient {
	get<R = any>(
		url: string,
		config?: HttpRequestConfig<R>
	): Promise<R>;
	
	post<R = any>(
		url: string,
		data?: any,
		config?: HttpRequestConfig<R>
	): Promise<R>;
	
	put<R = any>(
		url: string,
		data?: any,
		config?: HttpRequestConfig<R>
	): Promise<R>;
	
	patch<R = any>(
		url: string,
		data?: any,
		config?: HttpRequestConfig<R>
	): Promise<R>;
	
	delete<R = any>(
		url: string,
		config?: HttpRequestConfig<R>
	): Promise<R>;
}

export abstract class BaseHttpClient implements IHttpClient {
	protected constructor(protected clientConfig: HttpClientConfig = {}) {}

	abstract get<R = any>(
		url: string,
		config?: HttpRequestConfig<R>
	): Promise<R>;

	abstract post<R = any>(
		url: string,
		data?: any,
		config?: HttpRequestConfig<R>
	): Promise<R>;

	abstract put<R = any>(
		url: string,
		data?: any,
		config?: HttpRequestConfig<R>
	): Promise<R>;

	abstract patch<R = any>(
		url: string,
		data?: any,
		config?: HttpRequestConfig<R>
	): Promise<R>;

	abstract delete<R = any>(
		url: string,
		config?: HttpRequestConfig<R>
	): Promise<R>;
}
