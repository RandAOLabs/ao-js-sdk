import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { BaseHttpClient } from '../abstract/IHttpClient';
import { HttpClientConfig, HttpRequestConfig } from '../abstract/types';

export class AxiosHttpClient extends BaseHttpClient {
	private instance: AxiosInstance;

	constructor(config: HttpClientConfig = {}) {
		super(config);
		this.instance = axios.create(this.transformClientConfig(config));
		this.setupInterceptors();
	}

	private transformClientConfig(config: HttpClientConfig): AxiosRequestConfig {
		return {
			baseURL: config.baseURL,
			timeout: config.timeout || 30000,
			headers: config.headers
		};
	}

	private transformRequestConfig<R>(config?: HttpRequestConfig<R>): AxiosRequestConfig {
		if (!config) {
			return {};
		}

		const transformed: AxiosRequestConfig = {
			headers: {
				...this.clientConfig.headers,
				...config.headers
			},
			timeout: config.timeout || this.clientConfig.timeout
		};

		if (config.params) {
			transformed.params = config.params;
		}

		if (config.responseType) {
			transformed.responseType = config.responseType;
		}

		if (config.transformResponse) {
			transformed.transformResponse = config.transformResponse;
		}

		return transformed;
	}

	private setupInterceptors(): void {
		this.instance.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (!error.config) {
					return Promise.reject(error);
				}
				return Promise.reject(error);
			}
		);
	}

	async get<R = any>(url: string, config?: HttpRequestConfig<R>): Promise<R> {
		const response = await this.instance.get(url, this.transformRequestConfig(config));
		return response.data;
	}

	async post<R = any>(url: string, data?: any, config?: HttpRequestConfig<R>): Promise<R> {
		const response = await this.instance.post(url, data, this.transformRequestConfig(config));
		return response.data;
	}

	async put<R = any>(url: string, data?: any, config?: HttpRequestConfig<R>): Promise<R> {
		const response = await this.instance.put(url, data, this.transformRequestConfig(config));
		return response.data;
	}

	async patch<R = any>(url: string, data?: any, config?: HttpRequestConfig<R>): Promise<R> {
		const response = await this.instance.patch(url, data, this.transformRequestConfig(config));
		return response.data;
	}

	async delete<R = any>(url: string, config?: HttpRequestConfig<R>): Promise<R> {
		const response = await this.instance.delete(url, this.transformRequestConfig(config));
		return response.data;
	}
}
