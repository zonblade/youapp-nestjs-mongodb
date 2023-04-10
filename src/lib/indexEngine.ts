// i take inspiration from ApacheLucene indexing style.

export function createSearchIndex(str: string): string[] {
    const words: string[] = str.split(/\s+/); // Split the input string by spaces
    const result: string[] = [];
    const seen: Set<string> = new Set();
    for (const word of words) {
        for (let i = 0; i < word.length; i++) {
            for (let j = i + 1; j <= word.length; j++) {
                const substr: string = word.substring(i, j);
                if (seen.has(substr)) {
                    continue;
                }
                seen.add(substr);
                result.push(substr);
                if (substr.length > 1) {
                    for (let k = 1; k < substr.length; k++) {
                        const subsubstr: string = substr.substring(0, k);
                        if (!seen.has(subsubstr)) {
                            seen.add(subsubstr);
                            result.push(subsubstr);
                        }
                    }
                }
            }
        }
    }
    return result;
}
