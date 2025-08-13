import os
import datetime as dt
from typing import List, Dict

from google.oauth2 import service_account
from googleapiclient.discovery import build


SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def _get_credentials():
    creds_json = os.getenv("GOOGLE_SHEETS_CREDENTIALS_JSON")
    if not creds_json:
        raise RuntimeError("Missing GOOGLE_SHEETS_CREDENTIALS_JSON env var")
    # Expect full JSON string in env var
    import json as _json
    try:
        info = _json.loads(creds_json)
    except Exception as e:
        raise RuntimeError("Invalid GOOGLE_SHEETS_CREDENTIALS_JSON") from e
    return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)


async def create_sheet_and_populate(rows: List[Dict], region: str) -> str:
    creds = _get_credentials()
    sheets = build("sheets", "v4", credentials=creds)
    drive = build("drive", "v3", credentials=creds)

    timestamp = dt.datetime.utcnow().strftime("%Y%m%d_%H%M%SZ")
    title = f"GPs_{region}_{timestamp}"

    spreadsheet = sheets.spreadsheets().create(body={"properties": {"title": title}}).execute()
    spreadsheet_id = spreadsheet["spreadsheetId"]

    # Prepare values
    headers = [
        "clinic_name",
        "address",
        "phone",
        "email",
        "website",
        "affiliation_type",
        "gp_names",
        "clinic_url",
        "region",
        "crawl_timestamp_utc",
    ]

    values = [headers]
    for r in rows:
        values.append([
            r.get("clinic_name", ""),
            r.get("address", ""),
            r.get("phone", ""),
            r.get("email", ""),
            r.get("website", ""),
            r.get("affiliation_type", ""),
            ", ".join(r.get("gp_names", [])),
            r.get("clinic_url", ""),
            r.get("region", region),
            r.get("crawl_timestamp_utc", ""),
        ])

    sheets.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range="Sheet1!A1",
        valueInputOption="RAW",
        body={"values": values},
    ).execute()

    # Set link sharing: anyone with link can view
    drive.permissions().create(
        fileId=spreadsheet_id,
        body={"type": "anyone", "role": "reader"},
    ).execute()

    return f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit"