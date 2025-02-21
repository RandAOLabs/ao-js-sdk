import { createDataItemSigner } from '@permaweb/aoconnect';
import { AO } from 'src/core/ao/ao';
import { getWalletLazy } from 'src/utils';

describe('AO', () => {
    it('should create an instance', () => {
        const mockSigner = createDataItemSigner(getWalletLazy());
        const ao = new AO(mockSigner);
        expect(ao).toBeInstanceOf(AO);
    });
});
