import os, requests
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/vets", tags=["vets"])

@router.get("/search")
def search(city: str = Query(..., min_length=2)):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="API Google non configurée")
    # Text Search pour "veterinarian in <city>"
    q = f"veterinarian in {city}"
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    r = requests.get(url, params={"query": q, "key": api_key, "language": "fr"})
    j = r.json()
    if j.get("status") not in ("OK", "ZERO_RESULTS"):
        raise HTTPException(status_code=502, detail=j.get("status"))
    out = []
    for p in j.get("results", []):
        out.append({
            "name": p.get("name"),
            "address": p.get("formatted_address"),
            "rating": p.get("rating"),
            "user_ratings_total": p.get("user_ratings_total"),
            "place_id": p.get("place_id")
        })
    return out
