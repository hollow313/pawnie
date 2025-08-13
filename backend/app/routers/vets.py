import requests
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/vets", tags=["vets"])

USER_AGENT = "Pawnie/1.0 (contact: admin@example.com)"  # <- mets un mail/domaine à toi

def nominatim_search_city(city: str):
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": city, "format": "json", "addressdetails": 1, "limit": 1}
    r = requests.get(url, params=params, headers={"User-Agent": USER_AGENT}, timeout=15)
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail="Nominatim indisponible")
    res = r.json()
    if not res:
        raise HTTPException(status_code=404, detail="Ville introuvable")
    lat = float(res[0]["lat"]); lon = float(res[0]["lon"])
    return lat, lon

def overpass_vets(lat: float, lon: float, radius_m: int = 5000):
    # POI vet: amenity=veterinary
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="veterinary"](around:{radius_m},{lat},{lon});
      way["amenity"="veterinary"](around:{radius_m},{lat},{lon});
      relation["amenity"="veterinary"](around:{radius_m},{lat},{lon});
    );
    out center tags;
    """
    r = requests.post(
        "https://overpass-api.de/api/interpreter",
        data=query.encode("utf-8"),
        headers={"User-Agent": USER_AGENT, "Content-Type": "text/plain; charset=utf-8"},
        timeout=30,
    )
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail="Overpass indisponible")
    j = r.json()
    out = []
    for el in j.get("elements", []):
        tags = el.get("tags", {}) or {}
        center = el.get("center") or {}
        lat_el = el.get("lat") or center.get("lat")
        lon_el = el.get("lon") or center.get("lon")
        out.append({
            "id": el.get("id"),
            "name": tags.get("name") or "Vétérinaire",
            "address": ", ".join([v for v in [
                tags.get("addr:housenumber"),
                tags.get("addr:street"),
                tags.get("addr:postcode"),
                tags.get("addr:city"),
            ] if v]),
            "phone": tags.get("phone") or tags.get("contact:phone"),
            "website": tags.get("website") or tags.get("contact:website"),
            "lat": lat_el,
            "lon": lon_el,
        })
    # tri simple par nom
    out.sort(key=lambda x: (x["name"] or "").lower())
    return out

@router.get("/search")
def search_by_city(city: str = Query(..., min_length=2), radius_m: int = Query(5000, ge=500, le=20000)):
    lat, lon = nominatim_search_city(city)
    return {
        "center": {"lat": lat, "lon": lon},
        "radius_m": radius_m,
        "items": overpass_vets(lat, lon, radius_m),
    }

@router.get("/near")
def search_near(lat: float, lon: float, radius_m: int = Query(3000, ge=500, le=20000)):
    return {
        "center": {"lat": lat, "lon": lon},
        "radius_m": radius_m,
        "items": overpass_vets(lat, lon, radius_m),
    }
