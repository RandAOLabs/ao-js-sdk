import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { Logger } from "src/utils";

// BaseClientError.ts
export class ResultUtilsError extends Error {
    constructor(message: string, originalError?: Error) {
        super(message);
        this.name = 'ResultUtilsError';
        if (originalError) {
            this.stack += '\nCaused by: ' + originalError.stack;
        }
    }
}

export class JsonParsingError extends ResultUtilsError {
    constructor(message: string, originalError?: Error) {
        super(`Error parsing JSON data: ${message}`, originalError);
        this.name = 'JsonParsingError';
    }
}

export class MessageOutOfBoundsError extends ResultUtilsError {
    constructor(index: number, length: number) {
        super(`Index out of bounds: ${index}. Total messages available: ${length}`);
        this.name = 'MessageOutOfBoundsError';
    }
}

interface BoxFormatConfig {
    maxWidth: number;
    contentWidth: number;
    jsonIndentation: number;
}

interface FormattedBox {
    content: string[];
    separator: string;
}

/**
 * Error class for handling and formatting result reading errors with a clean box display
 */
export class ResultReadingError extends Error {
    private static readonly CONFIG: BoxFormatConfig = {
        maxWidth: 100,
        contentWidth: 96, // maxWidth - 4 (for "| " and " |")
        jsonIndentation: 12 // Standard JSON indentation plus buffer
    };

    constructor(
        public readonly result: MessageResult | DryRunResult,
        public readonly originalError: any,
    ) {
        const formattedBox = ResultReadingError.createFormattedErrorBox(result, originalError);
        const fullMessage = ResultReadingError.assembleBoxMessage(formattedBox);

        Logger.error(fullMessage);
        super(fullMessage);
        this.name = 'ResultReadingError';
    }

    /**
     * Creates a formatted error box with proper content and separator
     */
    private static createFormattedErrorBox(
        result: MessageResult | DryRunResult,
        originalError: any
    ): FormattedBox {
        const header = 'Error in reading Result:';
        const formattedResult = this.formatResultObject(result);
        const formattedOriginalError = this.formatOriginalError(originalError);

        return {
            content: [
                header,
                ...formattedResult,
                ...formattedOriginalError
            ],
            separator: this.createBoxSeparator()
        };
    }

    /**
     * Formats the result object with proper JSON structure and line wrapping
     */
    private static formatResultObject(result: MessageResult | DryRunResult): string[] {
        const cleanedError = this.cleanAndFormatError(result.Error);
        const resultWithFormattedError = {
            ...result,
            Error: cleanedError
        };

        return this.formatJsonWithWrapping(resultWithFormattedError);
    }

    /**
     * Cleans ANSI codes and formats error message
     */
    private static cleanAndFormatError(error?: string): string {
        if (!error) return '';

        const cleanedError = this.removeAnsiCodes(error);
        return this.wrapTextWithIndentation(
            cleanedError,
            this.CONFIG.contentWidth - this.CONFIG.jsonIndentation
        );
    }

    /**
     * Formats the original error message
     */
    private static formatOriginalError(error: any): string[] {
        const errorMessage = `Original Error: ${error.message}`;
        return this.wrapText(errorMessage, this.CONFIG.contentWidth);
    }

    /**
     * Removes ANSI color codes from text
     */
    private static removeAnsiCodes(text: string): string {
        return text.replace(/\u001b\[\d+m/g, '');
    }

    /**
     * Wraps text to fit within specified width, preserving words
     */
    private static wrapText(text: string, maxLength: number): string[] {
        const words = text.split(/[\s\n]+/);
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const potentialLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;

            if (potentialLine.length <= maxLength) {
                currentLine = potentialLine;
            } else {
                if (currentLine.length > 0) {
                    lines.push(currentLine);
                }
                currentLine = word.length > maxLength ?
                    this.breakLongWord(word, maxLength) : word;
            }
        }

        if (currentLine.length > 0) {
            lines.push(currentLine);
        }

        return lines;
    }

    /**
     * Breaks a long word into chunks that fit within maxLength
     */
    private static breakLongWord(word: string, maxLength: number): string {
        return word.substring(0, maxLength);
    }

    /**
     * Wraps text and adds proper indentation for JSON formatting
     */
    private static wrapTextWithIndentation(text: string, maxWidth: number): string {
        const lines = this.wrapText(text, maxWidth);
        return lines.join('\n          '); // Maintain JSON indentation
    }

    /**
     * Formats a JSON object with proper indentation and line wrapping
     */
    private static formatJsonWithWrapping(obj: any): string[] {
        const jsonString = JSON.stringify(obj, null, 2);
        return jsonString
            .split('\n')
            .map(line => line.trimEnd())
            .map(line => this.wrapLongJsonLine(line))
            .flat();
    }

    /**
     * Wraps long JSON lines while preserving structure
     */
    private static wrapLongJsonLine(line: string): string[] {
        return line.length > this.CONFIG.contentWidth ?
            this.wrapText(line, this.CONFIG.contentWidth) :
            [line];
    }

    /**
     * Creates the box separator line
     */
    private static createBoxSeparator(): string {
        return '|' + '='.repeat(this.CONFIG.contentWidth + 2) + '|';
    }

    /**
     * Formats a single line with proper padding and borders
     */
    private static formatBoxLine(text: string): string {
        return `| ${text.padEnd(this.CONFIG.contentWidth)} |`;
    }

    /**
     * Assembles the final box message with all components
     */
    private static assembleBoxMessage(box: FormattedBox): string {
        return `
${box.separator}
${box.content.map(line => this.formatBoxLine(line)).join('\n')}
${box.separator}`;
    }
}
