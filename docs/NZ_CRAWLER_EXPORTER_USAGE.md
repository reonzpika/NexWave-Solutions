# NZ Crawler Exporter Usage

## API
POST `/api/nz-crawl/export`

Headers:
- `Content-Type: application/json`

Body example:
```json
{
  "startUrls": ["https://example.com/guidelines"],
  "includePatterns": ["^https://example.com/.*"],
  "excludePatterns": [],
  "maxDepth": 2,
  "maxPages": 200,
  "rateLimit": { "requestsPerMinute": 60, "concurrency": 4 },
  "userAgent": "ClinicProCrawler/1.0 (+https://clinicpro.co.nz)",
  "extractionSchema": {
    "title": ["meta[property='og:title']", "title"],
    "contentSelectors": ["main", "article", ".content"],
    "headingSelectors": ["h1", "h2", "h3"],
    "publishedTimeSelectors": ["meta[property='article:published_time']", "time[datetime]"],
    "updatedTimeSelectors": ["meta[property='article:modified_time']"]
  },
  "chunk": { "words": 400 },
  "emit": { "format": "ndjson" }
}
```

Response: NDJSON stream (`application/x-ndjson`). Each line is one JSON record. The final line may include metrics as `{ "type": "metrics", ... }`.

## CLI
Run with tsx:
```
npx tsx scripts/crawl-export.ts --config docs/examples/request.json --out nz-med.jsonl
```

- `--config`: Path to a `CrawlRequest` JSON file
- `--out`: Output JSONL file path

The CLI prints metrics on completion and exits non-zero on fatal errors.