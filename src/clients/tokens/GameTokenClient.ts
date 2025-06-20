import { AO_CONFIGURATION_DEFAULT } from "../../core/ao/ao-client/configurations";
import { ARCAO } from "../../process-ids/arcao";
import { TokenClient } from "../ao";

/**
 * Pre-configured GAME tokenClient
 */
export const GameToken  = TokenClient.builder()
			.withAOConfig(AO_CONFIGURATION_DEFAULT)
			.withProcessId(ARCAO.GAME_TOKEN)
			.build();
