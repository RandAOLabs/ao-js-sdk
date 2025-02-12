import { ARIOService } from 'src/services/ario/ARIOService';

describe('ARIOService', () => {
    describe('getInstance', () => {
        it('should return the same instance when called multiple times', () => {
            // Get first instance
            const instance1 = ARIOService.getInstance();

            // Get second instance
            const instance2 = ARIOService.getInstance();

            // Verify both instances are the same object
            expect(instance1).toBe(instance2);
        });

        it('should return the same instance even with different configs', () => {
            // Get instance with empty config
            const instance1 = ARIOService.getInstance();

            // Get instance with some config
            const instance2 = ARIOService.getInstance({ maxAge: 1000 });

            // Verify both instances are the same object
            expect(instance1).toBe(instance2);
        });
    });
});
