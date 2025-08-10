import { IAmm } from "../../../adaptors";
import { IService } from "../../common/abstract";

export interface IAmmFinderService extends IService {
	findAmms(tokenProcessIdA: string, tokenProcessIdB: string): Promise<IAmm[]>;
}
