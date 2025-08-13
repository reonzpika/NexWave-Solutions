# Healthpoint GP Crawler Monorepo

Minimal Next.js UI (Vercel) + Python FastAPI worker (Railway) to crawl Healthpoint GP regions at 1 req/sec and write a Google Sheet.

## Apps
- `apps/ui`: Next.js 14 UI with a single page to start a crawl, show progress, and link to results.
- `apps/worker`: FastAPI worker that runs the crawl, aggregates data, and writes to Google Sheets.

## Quick Start

### Worker (Railway)
1. Create a new Railway service from `apps/worker` with the included Dockerfile.
2. Set env vars:
   - `GOOGLE_SHEETS_CREDENTIALS_JSON`: Service account JSON (full JSON string).
   - `AFFILIATION_KEYWORDS_JSON` (optional): Mapping e.g. `{ "tend": "Tend", "medplus": "MedPlus" }`.
   - `RATE_LIMIT_RPS`: `1` (default polite rate).
   - `CORS_ALLOW_ORIGINS`: Comma-separated origins or `*`.
3. Deploy. Note the public URL (e.g., `https://hp-worker.up.railway.app`).

### UI (Vercel)
1. Create a new Vercel project from `apps/ui`.
2. Set env var `NEXT_PUBLIC_WORKER_BASE_URL` to the Railway worker URL.
3. Deploy and open the app.

## Usage
- Paste any Healthpoint GP region URL (e.g.,
  `https://www.healthpoint.co.nz/gps-accident-urgent-medical-care/north-auckland/`).
- Click "Run Crawl". Wait for completion; open the Google Sheet link.

## Notes
- The worker is polite (1 req/sec + jitter) and retries transient errors.
- Output columns: clinic_name, address, phone, email, website, affiliation_type, gp_names, clinic_url, region, crawl_timestamp_utc.
- Link sharing is set to "anyone with link can view" via Drive API.
