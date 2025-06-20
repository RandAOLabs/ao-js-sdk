
/**
 * Interface for quantity theory service operations
 */
export interface IQuantityTheoryService {
	calculateM():Promise<bigint>;
	calculateQ():Promise<bigint>;
	calculateP():Promise<bigint>;
	calculateV():Promise<bigint>;
}
