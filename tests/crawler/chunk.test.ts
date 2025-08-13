import { describe, it, expect } from "vitest";
import { splitIntoWordChunks, prependHeadingToFirstChunk } from "../../src/features/crawler/chunk";

describe("chunking", () => {
	it("splits into target word chunks and creates snippet", () => {
		const text = Array.from({ length: 950 }, (_, i) => `word${i}`).join(" ");
		const chunks = splitIntoWordChunks(text, 400);
		expect(chunks.length).toBe(3);
		expect(chunks[0].content.split(/\s+/).length).toBe(400);
		expect(chunks[0].snippet?.split(/\s+/).length).toBe(50);
	});

	it("prepends heading to first chunk", () => {
		const chunks = splitIntoWordChunks("a b c d e f", 3);
		const withHeading = prependHeadingToFirstChunk(chunks, "Title");
		expect(withHeading[0].content.startsWith("Title\n\n")).toBe(true);
	});
});