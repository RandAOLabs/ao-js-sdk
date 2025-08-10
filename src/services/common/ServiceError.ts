import { AOJsError } from "../../common/error";
import { Logger, StringFormatting } from "../../utils";
import { Service } from "./Service";

export class ServiceError<T extends Service> extends AOJsError {
	protected static readonly SERVICE_ERROR_MAX_LINE_LENGTH = 110;

	constructor(
		public readonly service: T,
		public readonly func: Function,
		public readonly serviceFunctionParams: any,
		public readonly originalError?: Error,
	) {
		const functionName = func.name;

		let paramsString;
		try {
			paramsString = JSON.stringify(serviceFunctionParams, null, 2);
		} catch (error: any) {
			Logger.error("Error Handling Error | Could not serialize Paramaters")
		}

		const errorMessage = `A(n) ${service.getServiceName()} Error\nOccurred while executing function: ${functionName}\nWith parameters: ${paramsString}`;

		const fullMessage = StringFormatting.wrapMessageInBox(errorMessage, ServiceError.SERVICE_ERROR_MAX_LINE_LENGTH);


		super({ message: fullMessage, originalError: originalError });
		this.name = `${service.getServiceName().constructor.name} Error`;
	}
}
