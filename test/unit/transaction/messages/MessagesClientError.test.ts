import { MessagesClientError, GetLatestMessagesError } from "../../../../src/clients/transaction/messages";

describe("MessagesClientError", () => {
    it("should create error with original error stack", () => {
        const originalError = new Error("Original error");
        const error = new MessagesClientError("Test error", originalError);
        expect(error.name).toBe("MessagesClientError");
        expect(error.message).toBe("Test error");
        expect(error.stack).toContain("Original error");
    });

    it("should create error without original error", () => {
        const error = new MessagesClientError("Test error");
        expect(error.name).toBe("MessagesClientError");
        expect(error.message).toBe("Test error");
    });
});

describe("GetLatestMessagesError", () => {
    it("should create error with original error", () => {
        const originalError = new Error("Original error");
        const error = new GetLatestMessagesError(originalError);
        expect(error.name).toBe("GetLatestMessagesError");
        expect(error.message).toBe("Error retrieving latest messages");
        expect(error.stack).toContain("Original error");
    });

    it("should create error without original error", () => {
        const error = new GetLatestMessagesError();
        expect(error.name).toBe("GetLatestMessagesError");
        expect(error.message).toBe("Error retrieving latest messages");
    });
});
