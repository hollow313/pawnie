from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from ..deps import get_current_user
from ..database import get_db
from .. import schemas, models
from ..crud import create_listing, search_listings

router = APIRouter(prefix="/listings", tags=["listings"])

@router.post("", response_model=schemas.ListingOut)
def create(data: schemas.ListingCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return create_listing(db, user.id, data)

@router.get("", response_model=List[schemas.ListingOut])
def search(
    type: Optional[str] = None,
    species: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return search_listings(db, type, species, price_min, price_max, q)

@router.patch("/{listing_id}/toggle", response_model=schemas.ListingOut)
def toggle_active(listing_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    listing = db.query(models.Listing).filter_by(id=listing_id, owner_id=user.id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Annonce introuvable")
    listing.is_active = not listing.is_active
    db.commit(); db.refresh(listing); return listing