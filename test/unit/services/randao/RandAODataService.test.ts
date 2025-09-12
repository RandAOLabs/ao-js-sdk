import { IARIOService } from "../../../../src/services/ario";
import { IMessagesService } from "../../../../src/services/messages";
import { RandAODataService } from "../../../../src/services/randao/RandAODataService";
import RANDOM_PROCESS_TAGS from "../../../../src/clients/randao/random/tags";
import { SYSTEM_TAGS } from "../../../../src/core/common/tags";
import { DOMAIN } from "../../../../src/services/ario/ario-service/domains";

describe('RandAODataService', () => {
	let mockArioService: jest.Mocked<IARIOService>;
	let mockMessagesService: jest.Mocked<IMessagesService>;
	let service: RandAODataService;

	beforeEach(() => {
		mockArioService = {
			getProcessIdForDomain: jest.fn(),
			getANTStateForARName: jest.fn(),
			getAntProcessId: jest.fn(),
			getARNSRecordForARName: jest.fn(),
			getAllARNSRecords: jest.fn()
		} as jest.Mocked<IARIOService>;

		mockMessagesService = {
			countAllMessages: jest.fn()
		} as unknown as jest.Mocked<IMessagesService>;

		service = new RandAODataService(mockArioService, mockMessagesService);
	});

	describe('getTotalRandomResponses', () => {
		it('should return total random responses count', async () => {
			const mockProcessId = 'mock-process-id';
			const expectedCount = 42;

			mockArioService.getProcessIdForDomain.mockResolvedValue(mockProcessId);
			mockMessagesService.countAllMessages.mockResolvedValue(expectedCount);

			const result = await service.getTotalRandomResponses();

			expect(mockArioService.getProcessIdForDomain).toHaveBeenCalledWith(DOMAIN.RANDAO_API);
			expect(mockMessagesService.countAllMessages).toHaveBeenCalledWith({
				tags: [
					RANDOM_PROCESS_TAGS.ACTION.RESPONSE,
					SYSTEM_TAGS.FROM_PROCESS(mockProcessId)
				]
			});
			expect(result).toBe(expectedCount);
		});
	});

	describe('getProviderTotalFullfilledCount', () => {
		it('should return provider total fulfilled count', async () => {
			const mockProcessId = 'mock-process-id';
			const mockProviderId = 'mock-provider-id';
			const expectedCount = 24;

			mockArioService.getProcessIdForDomain.mockResolvedValue(mockProcessId);
			mockMessagesService.countAllMessages.mockResolvedValue(expectedCount);

			const result = await service.getProviderTotalFullfilledCount(mockProviderId);

			expect(mockArioService.getProcessIdForDomain).toHaveBeenCalledWith(DOMAIN.RANDAO_API);
			expect(mockMessagesService.countAllMessages).toHaveBeenCalledWith({
				owner: mockProviderId,
				recipient: mockProcessId,
				tags: [RANDOM_PROCESS_TAGS.ACTION.REVEAL]
			});
			expect(result).toBe(expectedCount);
		});
	});
});
