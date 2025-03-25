import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";
import { Logger } from "src/utils";

export class ProcessError extends Error {
    private static readonly MAX_LINE_LENGTH = 80;

    constructor(
        public readonly result: MessageResult | DryRunResult
    ) {
        const errorDetails = result.Error || 'Unknown error';
        const lines = ProcessError.formatMessage(errorDetails);
        const message = ProcessError.addBorders(lines);
        Logger.error(`\n${message}\n`);
        super(message);
    }

    private static formatMessage(error: string): string[] {
        const words = error.split(' ');
        const lines: string[] = ["Error Originating in Process"];
        let currentLine = '';

        for (const word of words) {
            if ((currentLine + ' ' + word).length <= this.MAX_LINE_LENGTH) {
                currentLine = currentLine ? currentLine + ' ' + word : word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
        return lines;
    }

    private static addBorders(lines: string[]): string {
        const maxLength = Math.max(...lines.map(line => line.length));
        const borderedLines = lines.map(line => {
            const padding = maxLength - line.length;
            return `| ${line}${' '.repeat(padding)} |`;
        });
        const border = '+' + '-'.repeat(maxLength + 2) + '+';
        return [border, ...borderedLines, border].join('\n');
    }
}
