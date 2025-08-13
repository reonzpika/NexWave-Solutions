import asyncio
import json
import os
import time
import uuid
from typing import Any, Dict, Optional

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

from google_sheets import create_sheet_and_populate
from crawler import crawl_healthpoint
from utils import derive_region_from_url, is_allowed_healthpoint_url


class StartCrawlRequest(BaseModel):
    seedUrl: HttpUrl


class JobState(BaseModel):
    jobId: str
    status: str  # queued|running|success|error
    startedAt: float
    updatedAt: float
    pagesVisited: int = 0
    clinicsFound: int = 0
    gpsFound: int = 0
    sheetUrl: Optional[str] = None
    error: Optional[str] = None


app = FastAPI(title="Healthpoint GP Crawler Worker")

allow_origins_env = os.getenv("CORS_ALLOW_ORIGINS", "*")
allow_origins = (
    [o.strip() for o in allow_origins_env.split(",") if o.strip()] if allow_origins_env else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

JOBS: Dict[str, JobState] = {}


@app.get("/health")
async def health():
    return {"ok": True, "time": time.time()}


@app.post("/crawl/start")
async def start_crawl(payload: StartCrawlRequest, background_tasks: BackgroundTasks):
    seed_url = str(payload.seedUrl)

    if not is_allowed_healthpoint_url(seed_url):
        raise HTTPException(status_code=400, detail="Seed URL must be a Healthpoint GP region URL")

    job_id = uuid.uuid4().hex
    now = time.time()
    JOBS[job_id] = JobState(
        jobId=job_id,
        status="queued",
        startedAt=now,
        updatedAt=now,
    )

    background_tasks.add_task(run_crawl_job, job_id, seed_url)

    return {"jobId": job_id}


@app.get("/crawl/status")
async def crawl_status(jobId: str):
    job = JOBS.get(jobId)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


async def run_crawl_job(job_id: str, seed_url: str) -> None:
    job = JOBS[job_id]
    job.status = "running"
    job.updatedAt = time.time()
    JOBS[job_id] = job

    try:
        region = derive_region_from_url(seed_url)
        affiliation_json = os.getenv("AFFILIATION_KEYWORDS_JSON", "{}")
        try:
            affiliation_map = json.loads(affiliation_json)
        except json.JSONDecodeError:
            affiliation_map = {}
        if not affiliation_map:
            affiliation_map = {
                "medplus": "MedPlus",
                "tend": "Tend",
                "white cross": "White Cross",
                "local doctors": "Local Doctors",
                "procare": "ProCare",
                "green cross": "Green Cross Health",
                "unichem": "Unichem",
                "life pharmacy": "Life Pharmacy",
            }

        async for progress in crawl_healthpoint(seed_url, affiliation_map):
            # progress can be interim dicts with counters or final rows
            if progress.get("type") == "metrics":
                job.pagesVisited = progress.get("pagesVisited", job.pagesVisited)
                job.clinicsFound = progress.get("clinicsFound", job.clinicsFound)
                job.gpsFound = progress.get("gpsFound", job.gpsFound)
                job.updatedAt = time.time()
                JOBS[job_id] = job
            elif progress.get("type") == "result":
                rows = progress["rows"]
                sheet_url = await create_sheet_and_populate(rows, region)
                job.sheetUrl = sheet_url
                job.status = "success"
                job.updatedAt = time.time()
                JOBS[job_id] = job
                return

        # In case the generator completes without delivering result
        raise RuntimeError("Crawl completed without producing results")

    except Exception as exc:
        job.status = "error"
        job.error = str(exc)
        job.updatedAt = time.time()
        JOBS[job_id] = job