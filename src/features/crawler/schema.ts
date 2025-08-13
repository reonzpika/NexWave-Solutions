import { z } from "zod";

export const SelectorArraySchema = z.array(z.string()).nonempty();

export const ExtractionSchema = z.object({
	// Ordered CSS selectors, first match wins
	title: SelectorArraySchema.optional(),
	contentSelectors: SelectorArraySchema.default(["main", "article", "#content", ".content"]),
	headingSelectors: SelectorArraySchema.default(["h1", "h2", "h3"]),
	publishedTimeSelectors: SelectorArraySchema.optional(),
	updatedTimeSelectors: SelectorArraySchema.optional(),
});

export const RateLimitSchema = z.object({
	requestsPerMinute: z.number().int().positive().max(600).optional(),
	concurrency: z.number().int().positive().max(16).optional(),
});

export const ChunkConfigSchema = z.object({
	words: z.number().int().min(100).max(1000).default(400),
});

export const EmitSchema = z.object({
	format: z.enum(["ndjson", "json"]).default("ndjson"),
});

export const CrawlRequestSchema = z.object({
	startUrls: z.array(z.string().url()).min(1),
	includePatterns: z.array(z.string()).min(1),
	excludePatterns: z.array(z.string()).default([]),
	maxDepth: z.number().int().min(0).max(6).default(2),
	maxPages: z.number().int().min(1).max(5000).default(200),
	rateLimit: RateLimitSchema.default({}),
	userAgent: z.string().min(1).default(process.env.CRAWLER_USER_AGENT || "ClinicProCrawler/1.0 (+https://clinicpro.co.nz)"),
	extractionSchema: ExtractionSchema,
	chunk: ChunkConfigSchema.default({ words: Number(process.env.CRAWLER_DEFAULT_CHUNK_WORDS || 400) }),
	emit: EmitSchema.default({ format: "ndjson" }),
});

export type CrawlRequest = z.infer<typeof CrawlRequestSchema>;
export type Extraction = z.infer<typeof ExtractionSchema>;

export const OutputRecordSchema = z.object({
	objectID: z.string(),
	site: z.string(),
	url: z.string().url(),
	title: z.string().default("").optional(),
	content: z.string(),
	snippet: z.string().optional(),
	headings: z.array(z.string()).optional(),
	publishedAt: z.string().optional(),
	updatedAt: z.string().optional(),
	chunkIndex: z.number().int().min(0),
	tags: z.array(z.string()).optional(),
	contentHash: z.string(),
});

export type OutputRecord = z.infer<typeof OutputRecordSchema>;

export function getDefaultRateLimit() {
	const rpm = Number(process.env.CRAWLER_DEFAULT_RPM || 60);
	const conc = Number(process.env.CRAWLER_MAX_CONCURRENCY || 4);
	return { requestsPerMinute: rpm, concurrency: conc };
}

export function normalizeCrawlRequest(input: unknown): CrawlRequest {
	const parsed = CrawlRequestSchema.parse(input);
	return {
		...parsed,
		rateLimit: {
			...getDefaultRateLimit(),
			...parsed.rateLimit,
		},
	};
}