import { IEntity, Process, User } from "../../models";
import { IAutoconfiguration, staticImplements } from "../../utils";
import { IMessagesService, MessagesService } from "../messages";
import { IEntityService } from "./abstract/IEntityService";

@staticImplements<IAutoconfiguration>()
export class EntityService implements IEntityService {
	constructor(
		private readonly messageService: IMessagesService
	) { }

	/**
	 * Creates a pre-configured instance of ANTEventHistoryService
	 * @returns A pre-configured ANTEventHistoryService instance
	 * @constructor
	 */
	public static autoConfiguration(): IEntityService {
		return new EntityService(
			MessagesService.autoConfiguration()
		);
	}

	async getEntity(id: string): Promise<IEntity> {
		const message = await this.messageService.getMessageById(id)
		if (message) { // Message exists with ID so this is a process
			return new Process(id)
		} else { // Message DNE with ID so this is a user
			return new User(id)
		}

	}

}
