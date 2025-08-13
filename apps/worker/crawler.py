import asyncio
import json
import os
import random
import time
from dataclasses import dataclass, field
from typing import AsyncGenerator, Dict, List, Set

import httpx
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from utils import derive_region_from_url


USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
RATE_LIMIT_SECONDS = float(os.getenv("RATE_LIMIT_RPS", "1"))
if RATE_LIMIT_SECONDS <= 0:
    RATE_LIMIT_SECONDS = 1.0
REQUEST_DELAY = 1.0 / RATE_LIMIT_SECONDS


@dataclass
class CrawlState:
    pages_visited: int = 0
    clinic_urls: Set[str] = field(default_factory=set)
    gp_urls: Set[str] = field(default_factory=set)
    clinics: Dict[str, Dict] = field(default_factory=dict)  # slug -> clinic data


def _slug_from_url(url: str) -> str:
    return url.rstrip("/").split("/")[-1]


def _affiliation_for(clinic_name: str, website: str, mapping: Dict[str, str]) -> str:
    text = f"{clinic_name} {website}".lower()
    for keyword, label in mapping.items():
        if keyword.lower() in text:
            return label
    return "Private"


def _normalize_text(t: str) -> str:
    return " ".join((t or "").split())


def _title_case(name: str) -> str:
    return " ".join(p.capitalize() for p in (name or "").split())


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=8), reraise=True)
async def _get(client: httpx.AsyncClient, url: str) -> httpx.Response:
    resp = await client.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
    resp.raise_for_status()
    return resp


async def crawl_healthpoint(seed_url: str, affiliation_map: Dict[str, str]) -> AsyncGenerator[Dict, None]:
    state = CrawlState()
    seen: Set[str] = set()
    queue: asyncio.Queue[str] = asyncio.Queue()

    await queue.put(seed_url)
    seen.add(seed_url)

    async with httpx.AsyncClient(follow_redirects=True) as client:
        while not queue.empty():
            url = await queue.get()
            await asyncio.sleep(REQUEST_DELAY + random.uniform(0, 0.2))

            try:
                res = await _get(client, url)
            except Exception:
                continue

            state.pages_visited += 1
            html = res.text
            soup = BeautifulSoup(html, "html.parser")

            # Discover pagination
            for a in soup.select("a.pagination__next"):
                href = a.get("href")
                if href:
                    next_url = res.url.join(href)
                    su = str(next_url)
                    if su not in seen:
                        await queue.put(su)
                        seen.add(su)

            # Discover clinic links
            for a in soup.select("a[href*='/gps-accident-urgent-medical-care/gp/']"):
                href = a.get("href")
                if href:
                    link = res.url.join(href)
                    su = str(link)
                    if su not in seen:
                        state.clinic_urls.add(su)
                        await queue.put(su)
                        seen.add(su)

            # Discover GP links
            for a in soup.select("a[href*='/gps-accident-urgent-medical-care/general-practitioner/']"):
                href = a.get("href")
                if href:
                    link = res.url.join(href)
                    su = str(link)
                    if su not in seen:
                        state.gp_urls.add(su)
                        await queue.put(su)
                        seen.add(su)

            # Extract clinic detail if this looks like a clinic page
            if "/gps-accident-urgent-medical-care/gp/" in str(res.url):
                slug = _slug_from_url(str(res.url))
                clinic_name = _normalize_text((soup.select_one("h1.hp-title") or {}).get_text(strip=True) if soup.select_one("h1.hp-title") else "")
                address = _normalize_text((soup.select_one(".hp-text--address") or {}).get_text(strip=True) if soup.select_one(".hp-text--address") else "")
                phone = _normalize_text((soup.select_one(".hp-contact-link__phone") or {}).get_text(strip=True) if soup.select_one(".hp-contact-link__phone") else "")
                email = _normalize_text((soup.select_one(".hp-contact-link__email") or {}).get_text(strip=True) if soup.select_one(".hp-contact-link__email") else "")
                website_el = soup.select_one(".hp-contact-link__web")
                website = website_el.get("href").strip() if website_el and website_el.get("href") else ""

                if clinic_name:
                    state.clinics.setdefault(slug, {
                        "clinic_name": clinic_name,
                        "address": address,
                        "phone": phone,
                        "email": email.lower(),
                        "website": website,
                        "affiliation_type": _affiliation_for(clinic_name, website, affiliation_map),
                        "gp_names": [],
                        "clinic_url": str(res.url),
                    })

            # Extract GP detail if this looks like a GP page
            if "/gps-accident-urgent-medical-care/general-practitioner/" in str(res.url):
                gp_name = _title_case(_normalize_text((soup.select_one("h1.hp-title") or {}).get_text(strip=True) if soup.select_one("h1.hp-title") else ""))
                workplaces = []
                for a in soup.select(".hp-person__workplaces a"):
                    href = a.get("href")
                    if href:
                        link = res.url.join(href)
                        workplaces.append(str(link))

                for w in workplaces:
                    slug = _slug_from_url(w)
                    if slug in state.clinics and gp_name:
                        if gp_name.lower() not in {g.lower() for g in state.clinics[slug]["gp_names"]}:
                            state.clinics[slug]["gp_names"].append(gp_name)

            # Periodic metrics update
            if state.pages_visited % 10 == 0:
                yield {
                    "type": "metrics",
                    "pagesVisited": state.pages_visited,
                    "clinicsFound": len(state.clinics),
                    "gpsFound": sum(len(c.get("gp_names", [])) for c in state.clinics.values()),
                }

        # Finished traversal — finalize rows
        region = derive_region_from_url(seed_url)
        now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        rows: List[Dict] = []
        for clinic in state.clinics.values():
            if not clinic.get("clinic_name") or not clinic.get("address"):
                continue
            if not clinic.get("gp_names"):
                continue
            rows.append({
                **clinic,
                "region": region,
                "crawl_timestamp_utc": now_iso,
            })

        yield {
            "type": "result",
            "rows": rows,
        }