export function splitTextByMaxLength(text: string, maxLineLength: number) {
    const matchIndices = Array.from(text.matchAll(/(\s|$)/g), (match) => match.index);

    const splitIndices = matchIndices.reduce((relevantIndices, currentIndex) => {
        if (currentIndex - (relevantIndices.at(-2)! || 0) > maxLineLength) {
            relevantIndices.push(currentIndex);
            return relevantIndices;
        }
        relevantIndices[relevantIndices.length - 1] = currentIndex;
        return relevantIndices;
    }, [0]);

    return splitIndices.reduce<string[]>((lines, indexToSplit, index) => {
        // +1 to skip the \s itself
        lines.push(text.slice((splitIndices[index - 1] ?? -1) + 1, indexToSplit))
        return lines;
    }, []);
}