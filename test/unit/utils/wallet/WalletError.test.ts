import fs from 'fs';
import { getEnvironment, Environment, getEnvironmentVariable, FileReadError, BrowserWalletError } from 'src';
import { getWallet } from 'src/utils/wallet/environmentWallet';

jest.mock('src/utils/environment/environment');

describe('getWallet', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when environment is NODE', () => {
        it('should throw FileReadError if reading the wallet file fails', () => {
            // Arrange
            const pathToWallet = '/path/to/wallet';
            (getEnvironment as jest.Mock).mockReturnValue(Environment.NODE);
            (getEnvironmentVariable as jest.Mock).mockReturnValue(pathToWallet);
            jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
                throw new Error('File not found');
            });

            // Act & Assert
            expect(() => getWallet()).toThrow(FileReadError);
        });
    });

    describe('when environment is BROWSER', () => {
        it('should throw BrowserWalletError if arweaveWallet is not in the global scope', () => {
            // Arrange
            (getEnvironment as jest.Mock).mockReturnValue(Environment.BROWSER);
            delete (global as any).arweaveWallet;

            // Act & Assert
            expect(() => getWallet()).toThrow(BrowserWalletError);
        });
    });
});
