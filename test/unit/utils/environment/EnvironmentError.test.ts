import { Environment, getEnvironment, getEnvironmentVariable } from '@utils/environment';
import { EnvironmentVariableError, UnknownEnvironmentError } from '@utils/environment';

describe('Environment Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getEnvironment', () => {
        it('should throw UnknownEnvironmentError for an unknown environment', () => {
            // Arrange
            const originalWindow = global.window;
            const originalProcess = global.process;
            delete (global as any).window;
            delete (global as any).process;

            // Act & Assert
            expect(() => getEnvironment()).toThrow(UnknownEnvironmentError);

            // Cleanup
            global.window = originalWindow;
            global.process = originalProcess;
        });
    });

    describe('getEnvironmentVariable', () => {
        it('should throw EnvironmentVariableError if the environment variable is not set', () => {
            // Arrange
            const variableName = 'MISSING_VARIABLE';
            delete process.env[variableName];

            // Act & Assert
            expect(() => getEnvironmentVariable(variableName)).toThrow(EnvironmentVariableError);
        });
    });
});
