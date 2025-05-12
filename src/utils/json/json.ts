import { JsonParsingError } from "./error";

export class JsonUtils{

	public static parse<T>(data: string): T{
		try{
			const parsedObject = JSON.parse(data) as T;
        	return parsedObject; 
		} catch (error: any) {
			throw new JsonParsingError(data);
		}
	}
}