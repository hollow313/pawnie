from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class Vet(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    address: str | None = None
    phone: str | None = None

# TODO: remplace par ta vraie source (Firestore/BDD)
FAKE_VETS = [
    Vet(id="v1", name="Clinique Vétérinaire Wilson", lat=43.606, lng=1.447, address="12 Rue Wilson, Toulouse", phone="+33512345678"),
    Vet(id="v2", name="Cabinet Vet Patte Blanche", lat=43.598, lng=1.430, address="3 Rue des Arts, Toulouse", phone="+33587654321"),
    Vet(id="v3", name="Vet Purpan", lat=43.615, lng=1.398, address="Av. de Purpan, Toulouse", phone=None),
]

@router.get("/vets", response_model=list[Vet])
async def list_vets():
    # plus tard: query DB
    return FAKE_VETS
