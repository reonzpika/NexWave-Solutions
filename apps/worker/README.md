# Worker

FastAPI worker that crawls Healthpoint GP region pages and writes to Google Sheets.

## Env Vars
- `GOOGLE_SHEETS_CREDENTIALS_JSON` (required)
- `AFFILIATION_KEYWORDS_JSON` (optional)
- `RATE_LIMIT_RPS` (default 1)
- `CORS_ALLOW_ORIGINS` (default `*`)

## Run locally
```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Then POST to `http://localhost:8000/crawl/start` with `{ "seedUrl": "..." }` and poll status.