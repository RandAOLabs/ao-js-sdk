import ResultUtils from "src/core/common/result-utils/ResultUtils";
import { ProcessError } from "src/core/common/result-utils/ProcessError";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

describe('ResultUtils', () => {
    describe('checkForProcessErrors', () => {
        it('should throw ProcessError when result contains an error', () => {
            // Arrange
            const mockResult: DryRunResult = {
                Error: 'Something went wrong',
                Messages: [],
                Output: '',
                Spawns: []
            };

            // Act & Assert
            expect(() => {
                ResultUtils.checkForProcessErrors(mockResult);
            }).toThrow(ProcessError);
        });

        it('should not throw when result has no error', () => {
            // Arrange
            const mockResult: DryRunResult = {
                Error: '',
                Messages: [],
                Output: '',
                Spawns: []
            };

            // Act & Assert
            expect(() => {
                ResultUtils.checkForProcessErrors(mockResult);
            }).not.toThrow();
        });
    });
});
