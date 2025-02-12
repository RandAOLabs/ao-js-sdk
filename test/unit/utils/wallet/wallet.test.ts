import fs from 'fs';
import { Environment, getEnvironment, getEnvironmentVariable } from 'src';
import { getWallet } from 'src/utils/wallet/environmentWallet';

jest.mock('src/utils/environment/environment');

describe('getWallet', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('when environment is NODE', () => {
        it('should return the parsed wallet data if file read is successful', () => {
            // Arrange
            (getEnvironment as jest.Mock).mockReturnValue(Environment.NODE);
            (getEnvironmentVariable as jest.Mock).mockReturnValue('/path/to/wallet');
            jest.spyOn(fs, 'readFileSync').mockReturnValue('{ "wallet": "data" }');

            // Act
            const wallet = getWallet();

            // Assert
            expect(wallet).toEqual({ wallet: 'data' });
        });
    });

    describe('when environment is BROWSER', () => {
        it('should return the arweaveWallet if it exists in the global scope', () => {
            // Arrange
            (getEnvironment as jest.Mock).mockReturnValue(Environment.BROWSER);
            (global as any).arweaveWallet = { wallet: 'data' };

            // Act
            const wallet = getWallet();

            // Assert
            expect(wallet).toEqual({ wallet: 'data' });

            // Cleanup
            delete (global as any).arweaveWallet;
        });
    });
});
