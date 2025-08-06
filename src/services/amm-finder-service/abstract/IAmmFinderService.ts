import { IAmm } from "../../../adaptors";

export interface IAmmFinderService {
	findAmms(tokenProcessIdA: string, tokenProcessIdB: string): Promise<IAmm[]>;
}
