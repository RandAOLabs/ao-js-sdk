const BASE_URL = 'https://randaolabs.github.io/ao-process-clients';

/**
 * Creates a documentation link for a class
 */
const createDocLink = (className: string): string => {
    return `${BASE_URL}/classes/${className}.html`;
};

/**
 * A class decorator that adds a link to the TypeDoc documentation.
 * This preserves existing JSDoc comments and appends the documentation link.
 */
export function documented() {
    return function (target: any) {
        // Get the actual class name from constructor
        const className = target.prototype?.constructor?.name || target.name;
        const docLink = createDocLink(className);

        // Get the TypeDoc JSDoc comment from the class
        const comments = target.toString().match(/\/\*\*([\s\S]*?)\*\//);
        if (!comments) {
            // If no JSDoc exists, create a basic one with the link
            target.prototype.__doc__ = `/**\n * For detailed documentation, see {@link ${docLink} ${className} documentation}\n */`;
            return target;
        }

        // Extract existing comment content
        let existingComment = comments[1];

        // Check if the link is already present
        if (!existingComment.includes(docLink)) {
            // Add our link before the closing */
            const docComment = existingComment.replace(/\s*\*\/$/, `\n * For detailed documentation, see {@link ${docLink} ${className} documentation}\n */`);

            // Store in prototype to allow inheritance
            target.prototype.__doc__ = `/**${docComment}`;
        }

        return target;
    };
}
