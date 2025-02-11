import { getEnvironment, Environment, getEnvironmentVariable } from "src";

describe('Environment Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getEnvironment', () => {
        it('should return Environment.BROWSER when running in a browser context', () => {
            // Arrange
            const originalWindow = global.window;
            (global as any).window = { document: {} };

            // Act
            const environment = getEnvironment();

            // Assert
            expect(environment).toBe(Environment.BROWSER);

            // Cleanup
            global.window = originalWindow;
        });

        it('should return Environment.NODE when running in a node context', () => {
            // Arrange
            const originalProcess = global.process;
            (global as any).process = { versions: { node: 'v22.0.0' } };

            // Act
            const environment = getEnvironment();

            // Assert
            expect(environment).toBe(Environment.NODE);

            // Cleanup
            global.process = originalProcess;
        });
    });

    describe('getEnvironmentVariable', () => {
        it('should return the environment variable if it is set', () => {
            // Arrange
            const variableName = 'TEST_VARIABLE';
            const variableValue = 'test_value';
            process.env[variableName] = variableValue;

            // Act
            const value = getEnvironmentVariable(variableName);

            // Assert
            expect(value).toBe(variableValue);
        });
    });
});
