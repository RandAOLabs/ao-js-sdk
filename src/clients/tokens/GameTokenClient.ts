import { AO_CONFIGURATION_DEFAULT } from "../../core/ao/ao-client/configurations";
import { ARCAO } from "../../constants/processIds/arcao";
import { TokenClient } from "../ao";
import { ClientBuilder } from "../common";

/**
 * Pre-configured GAME tokenClient
 */
export const GameToken = new ClientBuilder(TokenClient)
	.withAOConfig(AO_CONFIGURATION_DEFAULT)
	.withProcessId(ARCAO.GAME_TOKEN)
	.build();
