import { ConcurrencyManager } from "src/utils/concurrency";

describe("ConcurrencyManager", () => {
    it("should have required static and instance methods", () => {
        expect(typeof ConcurrencyManager.executeWithRetry).toBe('function');
        expect(typeof ConcurrencyManager.executeAllWithRetry).toBe('function');
    });
});
