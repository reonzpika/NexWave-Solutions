export type Chunk = {
	chunkIndex: number;
	content: string;
	snippet?: string;
};

export function splitIntoWordChunks(text: string, targetWords: number): Chunk[] {
	const words = text.split(/\s+/).filter(Boolean);
	const chunks: Chunk[] = [];
	if (words.length === 0) return [];
	let index = 0;
	for (let i = 0; i < words.length; i += targetWords) {
		const slice = words.slice(i, i + targetWords);
		const content = slice.join(" ");
		const snippetWords = slice.slice(0, Math.min(50, slice.length));
		const snippet = snippetWords.length > 0 ? snippetWords.join(" ") : undefined;
		chunks.push({ chunkIndex: index++, content, snippet });
	}
	return chunks;
}

export function prependHeadingToFirstChunk(chunks: Chunk[], heading?: string): Chunk[] {
	if (!heading || chunks.length === 0) return chunks;
	const [first, ...rest] = chunks;
	return [{ ...first, content: `${heading}\n\n${first.content}` }, ...rest];
}