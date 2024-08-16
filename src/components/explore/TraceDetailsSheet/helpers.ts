export const getMarkdownFromInputJSON = (input: object) => {
    return Object.entries(input)
        .map(
            ([key, value]) =>
                `## ${key}\n${Array.isArray(value)
                    ? value.map((v, index) => `### ${index}\n${v}`).join("\n")
                    : value
                }\n\n`
        )
        .join("\n");
};