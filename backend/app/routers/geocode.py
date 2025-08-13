from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import httpx
from ...core.config import settings

router = APIRouter()

class GeocodeItem(BaseModel):
    lat: float
    lng: float
    displayName: str

@router.get("/geocode", response_model=list[GeocodeItem])
async def geocode(q: str = Query(..., min_length=2)):
    params = {
        "q": q,
        "format": "json",
        "addressdetails": 0,
        "limit": 8
    }
    headers = {
        "User-Agent": "Pawnie/1.0 (contact@example.com)"
    }
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.get(settings.nominatim_url, params=params, headers=headers)
            r.raise_for_status()
            data = r.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Géocodage indisponible: {e}")

    out: list[GeocodeItem] = []
    for it in data:
        try:
            lat = float(it.get("lat"))
            lon = float(it.get("lon"))
            out.append(GeocodeItem(lat=lat, lng=lon, displayName=it.get("display_name", q)))
        except Exception:
            continue
    return out
