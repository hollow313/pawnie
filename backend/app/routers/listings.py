from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from ..deps import get_current_user
from ..database import get_db
from .. import schemas, models

router = APIRouter(prefix="/listings", tags=["listings"])

@router.post("", response_model=schemas.ListingOut)
def create(
    data: schemas.ListingCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    l = models.Listing(
        owner_id=user.id,
        animal_id=data.animal_id,
        title=data.title,
        description=data.description,
        type=data.type,
        species=data.species,
        price=data.price,
        images=",".join(data.images or [])
    )
    db.add(l); db.commit(); db.refresh(l)
    return schemas.ListingOut.model_validate({**l.__dict__, "images": data.images or []})

@router.get("", response_model=List[schemas.ListingOut])
def search(
    type: Optional[str] = None,
    species: Optional[str] = None,
    price_min: Optional[str] = None,
    price_max: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = Query(24, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    qry = db.query(models.Listing).filter(models.Listing.is_active==True)  # noqa
    if type: qry = qry.filter(models.Listing.type==type)
    if species: qry = qry.filter(models.Listing.species==species)
    pm = float(price_min) if price_min not in (None,"") else None
    pM = float(price_max) if price_max not in (None,"") else None
    if pm is not None: qry = qry.filter(models.Listing.price >= pm)
    if pM is not None: qry = qry.filter(models.Listing.price <= pM)
    if q:
        like = f"%{q}%"
        from sqlalchemy import or_
        qry = qry.filter(or_(models.Listing.title.ilike(like), models.Listing.description.ilike(like)))
    rows = qry.order_by(models.Listing.created_at.desc()).all()
    out = []
    for r in rows[offset: offset+limit]:
        out.append(schemas.ListingOut.model_validate({**r.__dict__, "images": [p for p in (r.images or "").split(",") if p]}))
    return out

@router.patch("/{listing_id}", response_model=schemas.ListingOut)
def update_listing(
    listing_id: int,
    patch: schemas.ListingUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    l = db.query(models.Listing).filter_by(id=listing_id, owner_id=user.id).first()
    if not l: raise HTTPException(status_code=404, detail="Annonce introuvable")
    data = patch.model_dump(exclude_unset=True)
    if "images" in data and isinstance(data["images"], list):
        l.images = ",".join(data["images"])
        del data["images"]
    for k,v in data.items():
        setattr(l, k, v)
    db.commit(); db.refresh(l)
    return schemas.ListingOut.model_validate({**l.__dict__, "images": [p for p in (l.images or "").split(",") if p]})
