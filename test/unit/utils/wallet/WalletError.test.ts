import { BrowserWalletError, FileReadError, getWallet } from '@utils/wallet';
import { Environment, getEnvironment, getEnvironmentVariable } from '@utils/index';
import fs from 'fs';

jest.mock('@utils/index');

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
