import os
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from ..deps import require_admin
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/admin", tags=["admin"])

# -------- Bannière / Stats / Settings identiques à la version précédente --------
# (garde ton code précédent si déjà en place)
# ... [pour concision, garde les mêmes fonctions banner/stats/settings déjà fournies] ...

# -------- Gestion utilisateurs (identique à avant) --------
# ... [idem liste + patch users] ...

# -------- Gestion Annonces --------
@router.get("/listings", response_model=List[schemas.ListingOut])
def admin_listings(
    q: Optional[str] = None,
    only_inactive: bool = False,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    admin = Depends(require_admin)
):
    qry = db.query(models.Listing)
    if only_inactive:
        qry = qry.filter(models.Listing.is_active == False)  # noqa: E712
    if q:
        like = f"%{q}%"
        qry = qry.filter((models.Listing.title.ilike(like)) | (models.Listing.description.ilike(like)))
    rows = qry.order_by(models.Listing.created_at.desc()).all()
    return rows[offset: offset + limit]

@router.patch("/listings/{listing_id}", response_model=schemas.ListingOut)
def admin_update_listing(
    listing_id: int,
    patch: schemas.ListingUpdate,
    db: Session = Depends(get_db),
    admin = Depends(require_admin)
):
    l = db.query(models.Listing).filter_by(id=listing_id).first()
    if not l: raise HTTPException(status_code=404, detail="Annonce introuvable")
    data = patch.model_dump(exclude_unset=True)
    if "images" in data and isinstance(data["images"], list):
        l.images = ",".join(data["images"])
        del data["images"]
    for k,v in data.items():
        setattr(l, k, v)
    db.commit(); db.refresh(l)
    # remap images CSV -> list
    out = schemas.ListingOut.model_validate({
        **l.__dict__,
        "images": [p for p in (l.images or "").split(",") if p]
    })
    return out

@router.delete("/listings/{listing_id}")
def admin_delete_listing(listing_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    l = db.query(models.Listing).filter_by(id=listing_id).first()
    if not l: return {"ok": True}
    db.delete(l); db.commit(); return {"ok": True}

# -------- Gestion Animaux --------
@router.get("/animals", response_model=List[schemas.AnimalOut])
def admin_animals(
    q: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    admin = Depends(require_admin)
):
    qry = db.query(models.Animal)
    if q:
        like = f"%{q}%"
        qry = qry.filter((models.Animal.name.ilike(like)) | (models.Animal.breed.ilike(like)))
    rows = qry.order_by(models.Animal.id.desc()).all()
    return rows[offset: offset + limit]

@router.patch("/animals/{animal_id}", response_model=schemas.AnimalOut)
def admin_update_animal(animal_id: int, patch: schemas.AnimalUpdate, db: Session = Depends(get_db), admin = Depends(require_admin)):
    a = db.query(models.Animal).filter_by(id=animal_id).first()
    if not a: raise HTTPException(status_code=404, detail="Animal introuvable")
    for k,v in patch.model_dump(exclude_unset=True).items():
        setattr(a, k, v)
    db.commit(); db.refresh(a); return a

@router.delete("/animals/{animal_id}")
def admin_delete_animal(animal_id: int, db: Session = Depends(get_db), admin = Depends(require_admin)):
    a = db.query(models.Animal).filter_by(id=animal_id).first()
    if not a: return {"ok": True}
    db.delete(a); db.commit(); return {"ok": True}
