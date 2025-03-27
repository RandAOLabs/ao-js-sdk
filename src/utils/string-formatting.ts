/**
 * @categoryDescription Utility
 * String formatting utilities for consistent text presentation.
 */
export class StringFormatting {
    public static wrapMessageInBox(message: string, maxLineLength: number = 100): string {
        const lines = StringFormatting.formatMessage(message, maxLineLength);
        return StringFormatting.addBorders(lines);
    }

    private static formatMessage(message: string, maxLineLength: number): string[] {
        // First split by newlines to preserve intended line breaks
        const messageLines = message.split('\n');
        const resultLines: string[] = [];

        for (const messageLine of messageLines) {
            // For each line, split into words and format to max length
            const words = messageLine.split(' ');
            let currentLine = '';

            for (const word of words) {
                if (!currentLine) {
                    // First word on the line
                    currentLine = word;
                } else if ((currentLine + ' ' + word).length <= maxLineLength) {
                    // Word fits on current line
                    currentLine += ' ' + word;
                } else {
                    // Word doesn't fit, start new line
                    resultLines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine) {
                resultLines.push(currentLine);
            }
        }
        return resultLines;
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
