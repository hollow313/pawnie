from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from ..deps import get_current_user
from ..database import get_db
from .. import schemas, models
from ..crud import create_listing, search_listings

router = APIRouter(prefix="/listings", tags=["listings"])

@router.post("", response_model=schemas.ListingOut)
def create(
    data: schemas.ListingCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    return create_listing(db, user.id, data)

@router.get("", response_model=List[schemas.ListingOut])
def search(
    type: Optional[str] = None,
    species: Optional[str] = None,
    price_min: Optional[str] = None,  # accepter "" sans 422
    price_max: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = Query(24, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    # Convertir proprement les valeurs numériques si fournies
    pm = float(price_min) if price_min not in (None, "",) else None
    pM = float(price_max) if price_max not in (None, "",) else None

    items = search_listings(db, type, species, pm, pM, q)

    # Pagination simple en mémoire (SQLite) ; pour PostgreSQL on ferait LIMIT/OFFSET en SQL
    return items[offset: offset + limit]

@router.patch("/{listing_id}/toggle", response_model=schemas.ListingOut)
def toggle_active(
    listing_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    listing = db.query(models.Listing).filter_by(id=listing_id, owner_id=user.id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Annonce introuvable")
    listing.is_active = not listing.is_active
    db.commit(); db.refresh(listing); return listing
