import { ITokenBalance } from '../../../models/financial/token-balance/abstract/ITokenBalance';

/**
 * Interface for token conversion services that handle converting token balances.
 */
export interface ITokenConversionsService {
	/**
	 * Converts a token balance using the specified token process ID.
	 * @param tokenBalance - The token balance to convert
	 * @param tokenProcessId - The process ID of the target token
	 * @returns Promise that resolves to the converted token balance
	 */
	convert(tokenBalance: ITokenBalance, tokenProcessId: string): Promise<ITokenBalance>;
}
