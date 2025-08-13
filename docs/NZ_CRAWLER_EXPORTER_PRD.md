# NZ Medical Site Crawler → JSON Exporter PRD

## Overview
Build a backend-only crawler and JSON/NDJSON exporter for NZ medical sites. It accepts start URL(s) and a caller-provided extraction schema, crawls within a single-domain scope, extracts cleaned content and metadata, chunks it to ~300–500 words, deduplicates, and outputs JSON records. The solution ships as:
- API route: `POST /api/nz-crawl/export` (App Router)
- CLI: `scripts/crawl-export.ts` for CI/large jobs
- Library modules under `src/features/crawler/*`

Target codebase: Next.js 14 App Router at repository root. No UI changes.

## Goals and Non-Goals
- Goal: Reliable, polite site crawl/export for documentation/clinical guidelines pages within a single domain.
- Goal: Streaming NDJSON in API mode for small jobs; CLI writes JSONL for larger scopes.
- Non-goal: Indexing into a search/RAG DB. No coupling to existing RAG code.
- Non-goal: Headless browser rendering. We only use HTTP+HTML parsing.

## Inputs
Request body (`CrawlRequest` via Zod validation):
- `startUrls: string[]`: Entry points.
- `includePatterns: string[]`: Regex patterns that must match to enqueue/fetch.
- `excludePatterns: string[]`: Regex patterns that must NOT match.
- `maxDepth: number`: BFS depth, default 2.
- `maxPages: number`: Safety cap, default 200.
- `rateLimit: { requestsPerMinute?: number; concurrency?: number }`: Defaults from env.
- `userAgent: string`: e.g. `ClinicProCrawler/1.0 (+https://clinicpro.co.nz)`.
- `extractionSchema`: CSS selectors for title/content/headings/dates.
- `chunk: { words: number }`: Target chunk size, default 400.
- `emit: { format: "ndjson" | "json" }`: API favors NDJSON.

## Outputs
Each record JSON fields:
- `objectID: string` → `${url}#c${chunkIndex}`
- `site: string` → hostname without `www.`
- `url: string` → canonical page URL
- `title: string`
- `content: string` → chunk text
- `snippet?: string` → ~35–50 words
- `headings?: string[]`
- `publishedAt?: string` (ISO)
- `updatedAt?: string` (ISO)
- `chunkIndex: number`
- `tags?: string[]`
- `contentHash: string` (sha256)

Metrics summary:
- pagesVisited, pagesEmitted, pagesSkipped, duplicates, disallowedByRobots, errors.

## Constraints and Policies
- Robots.txt honored per site; only fetch paths allowed for the configured user-agent.
- Polite rate limiting and bounded concurrency using defaults from env:
  - `CRAWLER_DEFAULT_RPM`, `CRAWLER_MAX_CONCURRENCY`, `CRAWLER_USER_AGENT`.
- Same-site scope by default via includePatterns; explicit includePatterns are required.
- Canonical URL normalized (respect `<link rel="canonical">` and `og:url`), dedupe by canonical URL + content hash.
- Serverless time limits: stream NDJSON and keep per-request crawl small; use CLI for larger jobs.
- No storage; pure in-memory export.

## API Contract
`POST /api/nz-crawl/export`
- Content-Type: `application/json`
- Body: `CrawlRequest` (see above)
- Response:
  - NDJSON stream (`application/x-ndjson`) for small jobs. Each line: one record.
  - Final metrics line may be emitted with `{ "type": "metrics", ... }`.
  - On input validation error: 400 with JSON error.
  - On crawl error: partial NDJSON may be streamed followed by a metrics line including `errors`.

## CLI Contract
`scripts/crawl-export.ts` (Node/TS run via `npx tsx scripts/crawl-export.ts`)
- Args:
  - `--config path/to/request.json`
  - `--out nz-med.jsonl`
- Reads `CrawlRequest` JSON, performs crawl, writes NDJSON file and prints metrics, non-zero exit on fatal errors.

## Architecture and Modules
- `src/features/crawler/schema.ts` → Zod schemas and types for requests and output records; safe defaults and normalization helpers.
- `src/features/crawler/robots.ts` → Fetch and parse robots.txt, `isAllowed(path)` by user-agent.
- `src/features/crawler/fetch.ts` → Resilient fetch with retries, UA, timeouts, exponential backoff.
- `src/features/crawler/extract.ts` → Cheerio-based extraction, canonical URL resolution, text cleanup, headings/dates.
- `src/features/crawler/chunk.ts` → Word-based chunking (~300–500 words), snippet generation.
- `src/features/crawler/crawl.ts` → BFS crawler, rate limiting (`bottleneck`), include/exclude filtering, dedupe, metrics; async generator for streaming.
- `app/api/nz-crawl/export/route.ts` → POST handler, Zod validation, NDJSON streaming, error handling.
- `scripts/crawl-export.ts` → CLI wiring, file IO, metrics output.

## Acceptance Criteria
- Validates input; returns NDJSON stream under 60s for small crawls.
- Robots.txt is honored; disallowed URLs are not fetched.
- Dedupe works; no duplicate `objectID` emitted.
- Chunks ~300–500 words; snippets generated (or omitted when too short).
- Metrics returned; clear errors for invalid inputs.
- CLI runs larger jobs; writes `.jsonl` artifact.

## Success Metrics
- < 1% duplicate `objectID` across an export.
- < 1% robots.txt violations (should be 0%).
- 95th percentile API latency for single-page crawl < 10s at default limits.

## Risks and Mitigations
- Anti-bot defenses → Use polite defaults, allow tuning concurrency/RPM; respect robots and back off on 429/5xx.
- HTML variability → Multiple selectors per field, robust fallbacks.
- Serverless timeouts → Streaming NDJSON; recommend CLI for larger scopes.
- Licensing/compliance → Require explicit `includePatterns`; document obligations.

## Implementation Plan
- Add Zod schemas and types.
- Implement robots fetching/parsing with longest-match precedence, wildcard support.
- Implement resilient fetch with retries and backoff.
- Implement Cheerio extractor and canonical URL normalization.
- Implement chunking and snippet.
- Implement crawler with BFS, include/exclude, robots allow, rate limit, dedupe, metrics, async generator.
- Add API route with NDJSON streaming.
- Add CLI for CI.
- Add tests (schema, robots, extract, chunk, filtering); add a fixture HTML.
- Add docs and usage examples.

## Environment Variables
- `CRAWLER_DEFAULT_RPM` (default 60)
- `CRAWLER_USER_AGENT` (default `ClinicProCrawler/1.0 (+https://clinicpro.co.nz)`)
- `CRAWLER_MAX_CONCURRENCY` (default 4)