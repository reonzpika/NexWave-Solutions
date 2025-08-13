from urllib.parse import urlparse

ALLOWED_DOMAIN = "healthpoint.co.nz"


def is_allowed_healthpoint_url(url: str) -> bool:
    try:
        p = urlparse(url)
        if p.scheme not in ("http", "https"):
            return False
        if not p.netloc.endswith(ALLOWED_DOMAIN):
            return False
        # Basic path validation for GP regions
        return "/gps-accident-urgent-medical-care/" in p.path
    except Exception:
        return False


def derive_region_from_url(url: str) -> str:
    p = urlparse(url)
    # Expect path like /gps-accident-urgent-medical-care/<region>/
    parts = [seg for seg in p.path.split("/") if seg]
    try:
        idx = parts.index("gps-accident-urgent-medical-care")
        region = parts[idx + 1] if len(parts) > idx + 1 else "unknown"
        return region.replace("-", "_")
    except ValueError:
        return "unknown"