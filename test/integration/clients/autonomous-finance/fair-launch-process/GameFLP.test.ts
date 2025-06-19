import { GameFLP } from "../../../../../src/clients/pi/fair-launch-process/flps";
import { Logger, LogLevel } from "../../../../../src/utils/logger";

// Set log level to INFO to ensure we see the output
Logger.setLogLevel(LogLevel.INFO);

describe("GameFLP Integration Tests", () => {
  jest.setTimeout(30000); // Increase timeout for network requests

  it("should retrieve Game Fair Launch Process info", async () => {
	Logger.setLogLevel(LogLevel.DEBUG)
	const info = await GameFLP.getInfo()
	Logger.info(info)
  });
});
