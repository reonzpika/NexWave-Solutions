import { describe, it, expect } from "vitest";
import { CrawlRequestSchema, normalizeCrawlRequest } from "../../src/features/crawler/schema";

describe("CrawlRequestSchema", () => {
	it("validates and applies defaults", () => {
		const input = {
			startUrls: ["https://example.com"],
			includePatterns: ["^https://example.com/.*"],
			excludePatterns: [],
			maxDepth: 1,
			maxPages: 10,
			rateLimit: { requestsPerMinute: 10, concurrency: 2 },
			userAgent: "TestUA",
			extractionSchema: {
				contentSelectors: ["main"],
				headingSelectors: ["h1"],
			},
			chunk: { words: 300 },
			emit: { format: "ndjson" },
		};
		const parsed = CrawlRequestSchema.parse(input);
		expect(parsed.maxDepth).toBe(1);
		const norm = normalizeCrawlRequest(parsed);
		expect(norm.rateLimit.requestsPerMinute).toBe(10);
		expect(norm.rateLimit.concurrency).toBe(2);
	});

	it("rejects when includePatterns missing", () => {
		expect(() => CrawlRequestSchema.parse({
			startUrls: ["https://example.com"],
			excludePatterns: [],
			maxDepth: 1,
			maxPages: 10,
			rateLimit: {},
			userAgent: "UA",
			extractionSchema: { contentSelectors: ["main"], headingSelectors: ["h1"] },
			chunk: { words: 300 },
			emit: { format: "ndjson" },
		})).toThrow();
	});
});