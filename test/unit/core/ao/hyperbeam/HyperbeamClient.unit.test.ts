import { HyperbeamClient } from '../../../../../src/core/ao/hyperbeam/hyperbeam-client/HyperbeamClient';
import { ProcessEndpoint } from '../../../../../src/core/ao/hyperbeam/hyperbeam-client/abstract/types';
import { HyperbeamClientConfig } from '../../../../../src/core/ao/hyperbeam/hyperbeam-client/abstract/HyperbeamClientConfig';
import { HyperBeamNodes } from '../../../../../src/core/ao/hyperbeam/hyperbeam-client/HyperBeamNodes';
import { IHttpClient } from '../../../../../src/utils/http/abstract/IHttpClient';
import { AxiosHttpClient } from '../../../../../src/utils/http/implementations/AxiosHttpClient';
import { AOCorePathBuilder } from '../../../../../src/core/ao/hyperbeam/hyperbeam-client/constants';

// Mock dependencies
jest.mock('../../../../../src/utils/http/implementations/AxiosHttpClient');
jest.mock('../../../../../src/core/ao/hyperbeam/hyperbeam-client/constants');

describe('HyperbeamClient Unit Tests', () => {
	let mockHttpClient: jest.Mocked<IHttpClient>;
	let mockAxiosHttpClient: jest.MockedClass<typeof AxiosHttpClient>;
	let mockAOCorePathBuilder: jest.Mocked<typeof AOCorePathBuilder>;

	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();

		// Mock IHttpClient
		mockHttpClient = {
			get: jest.fn(),
			post: jest.fn(),
			put: jest.fn(),
			patch: jest.fn(),
			delete: jest.fn()
		};

		// Mock AxiosHttpClient constructor
		mockAxiosHttpClient = AxiosHttpClient as jest.MockedClass<typeof AxiosHttpClient>;
		mockAxiosHttpClient.mockImplementation(() => mockHttpClient as any);

		// Mock AOCorePathBuilder
		mockAOCorePathBuilder = AOCorePathBuilder as jest.Mocked<typeof AOCorePathBuilder>;
		mockAOCorePathBuilder.buildProcessStatePath = jest.fn();
	});

	describe('constructor', () => {
		it('should initialize with provided config and custom httpClient', () => {
			const customHttpClient = mockHttpClient;
			const config: HyperbeamClientConfig = {
				nodeUrl: 'https://test.example.com/',
				httpClient: customHttpClient
			};

			const client = new HyperbeamClient(config);

			expect(client).toBeInstanceOf(HyperbeamClient);
			expect(mockAxiosHttpClient).not.toHaveBeenCalled();
		});

		it('should initialize with provided config and default AxiosHttpClient', () => {
			const config: HyperbeamClientConfig = {
				nodeUrl: 'https://test.example.com/'
			};

			const client = new HyperbeamClient(config);

			expect(client).toBeInstanceOf(HyperbeamClient);
			expect(mockAxiosHttpClient).toHaveBeenCalledWith({
				baseURL: 'https://test.example.com',
				timeout: 30000,
				headers: {
					Accept: '*/*'
				}
			});
		});

		it('should remove trailing slash from nodeUrl', () => {
			const config: HyperbeamClientConfig = {
				nodeUrl: 'https://test.example.com/'
			};

			new HyperbeamClient(config);

			expect(mockAxiosHttpClient).toHaveBeenCalledWith({
				baseURL: 'https://test.example.com',
				timeout: 30000,
				headers: {
					Accept: '*/*'
				}
			});
		});

		it('should not modify nodeUrl if no trailing slash', () => {
			const config: HyperbeamClientConfig = {
				nodeUrl: 'https://test.example.com'
			};

			new HyperbeamClient(config);

			expect(mockAxiosHttpClient).toHaveBeenCalledWith({
				baseURL: 'https://test.example.com',
				timeout: 30000,
				headers: {
					Accept: '*/*'
				}
			});
		});
	});

	describe('autoConfiguration', () => {
		it('should create instance with FORWARD_RESEARCH node URL', () => {
			const client = HyperbeamClient.autoConfiguration();

			expect(client).toBeInstanceOf(HyperbeamClient);
			expect(mockAxiosHttpClient).toHaveBeenCalledWith({
				baseURL: HyperBeamNodes.FORWARD_RESEARCH,
				timeout: 30000,
				headers: {
					Accept: '*/*'
				}
			});
		});
	});

	describe('getProcessState', () => {
		let client: HyperbeamClient;
		const mockResponse = { data: 'test-response' };

		beforeEach(() => {
			const config: HyperbeamClientConfig = {
				nodeUrl: 'https://test.example.com',
				httpClient: mockHttpClient
			};
			client = new HyperbeamClient(config);
			mockHttpClient.get.mockResolvedValue(mockResponse);
		});

		it('should call AOCorePathBuilder.buildProcessStatePath with correct parameters', async () => {
			const processId = 'test-process-id';
			const endpoint = ProcessEndpoint.COMPUTE;
			const additionalPath = 'test/path';
			const expectedPath = '/expected/path';

			mockAOCorePathBuilder.buildProcessStatePath.mockReturnValue(expectedPath);

			await client.getProcessState(processId, endpoint, additionalPath);

			expect(mockAOCorePathBuilder.buildProcessStatePath).toHaveBeenCalledWith(
				processId,
				endpoint,
				additionalPath
			);
		});

		it('should call httpClient.get with built path', async () => {
			const processId = 'test-process-id';
			const endpoint = ProcessEndpoint.NOW;
			const expectedPath = '/expected/path';

			mockAOCorePathBuilder.buildProcessStatePath.mockReturnValue(expectedPath);

			await client.getProcessState(processId, endpoint);

			expect(mockHttpClient.get).toHaveBeenCalledWith(expectedPath);
		});

		it('should return response from httpClient.get', async () => {
			const processId = 'test-process-id';
			const endpoint = ProcessEndpoint.COMPUTE;
			const expectedPath = '/expected/path';

			mockAOCorePathBuilder.buildProcessStatePath.mockReturnValue(expectedPath);

			const result = await client.getProcessState(processId, endpoint);

			expect(result).toBe(mockResponse);
		});

		it('should work without additionalPath parameter', async () => {
			const processId = 'test-process-id';
			const endpoint = ProcessEndpoint.NOW;
			const expectedPath = '/expected/path';

			mockAOCorePathBuilder.buildProcessStatePath.mockReturnValue(expectedPath);

			await client.getProcessState(processId, endpoint);

			expect(mockAOCorePathBuilder.buildProcessStatePath).toHaveBeenCalledWith(
				processId,
				endpoint,
				undefined
			);
			expect(mockHttpClient.get).toHaveBeenCalledWith(expectedPath);
		});
	});

	describe('compute', () => {
		let client: HyperbeamClient;
		const mockResponse = { data: 'compute-response' };

		beforeEach(() => {
			const config: HyperbeamClientConfig = {
				nodeUrl: 'https://test.example.com',
				httpClient: mockHttpClient
			};
			client = new HyperbeamClient(config);
			mockHttpClient.get.mockResolvedValue(mockResponse);
		});

		it('should call getProcessState with COMPUTE endpoint', async () => {
			const processId = 'test-process-id';
			const additionalPath = 'test/path';
			const expectedPath = '/expected/path';

			mockAOCorePathBuilder.buildProcessStatePath.mockReturnValue(expectedPath);

			const result = await client.compute(processId, additionalPath);

			expect(mockAOCorePathBuilder.buildProcessStatePath).toHaveBeenCalledWith(
				processId,
				ProcessEndpoint.COMPUTE,
				additionalPath
			);
			expect(mockHttpClient.get).toHaveBeenCalledWith(expectedPath);
			expect(result).toBe(mockResponse);
		});

		it('should work without additionalPath parameter', async () => {
			const processId = 'test-process-id';
			const expectedPath = '/expected/path';

			mockAOCorePathBuilder.buildProcessStatePath.mockReturnValue(expectedPath);

			const result = await client.compute(processId);

			expect(mockAOCorePathBuilder.buildProcessStatePath).toHaveBeenCalledWith(
				processId,
				ProcessEndpoint.COMPUTE,
				undefined
			);
			expect(mockHttpClient.get).toHaveBeenCalledWith(expectedPath);
			expect(result).toBe(mockResponse);
		});

		it('should return result from getProcessState', async () => {
			const processId = 'test-process-id';
			const expectedPath = '/expected/path';

			mockAOCorePathBuilder.buildProcessStatePath.mockReturnValue(expectedPath);

			const result = await client.compute(processId);

			expect(result).toBe(mockResponse);
		});
	});
});
